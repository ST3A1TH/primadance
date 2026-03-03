import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory rate limiting store (resets on cold start, but sufficient for basic protection)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, maxRequests = 5, windowMs = 3600000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > maxRequests;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { schedule_id, booking_date, client_name, client_phone, client_email } = await req.json();

    // Validate required fields
    if (!schedule_id || !booking_date || !client_name || !client_phone || !client_email) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate field lengths and format
    const trimmedName = String(client_name).trim();
    const trimmedPhone = String(client_phone).trim();
    const trimmedEmail = String(client_email).trim().toLowerCase();

    if (trimmedName.length === 0 || trimmedName.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (trimmedPhone.length < 3 || trimmedPhone.length > 30) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit by email (5 bookings per hour)
    if (isRateLimited(`email:${trimmedEmail}`)) {
      return new Response(JSON.stringify({ error: "Too many booking attempts. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`ip:${ip}`, 10)) {
      return new Response(JSON.stringify({ error: "Too many booking attempts. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check capacity
    const { data: settingsData } = await supabase
      .from("booking_settings")
      .select("max_participants")
      .eq("schedule_id", schedule_id)
      .maybeSingle();

    const maxParticipants = settingsData?.max_participants ?? 20;

    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("schedule_id", schedule_id)
      .eq("booking_date", booking_date)
      .neq("status", "cancelled");

    if ((count ?? 0) >= maxParticipants) {
      return new Response(JSON.stringify({ error: "CLASS_FULL" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert booking
    const { error } = await supabase.from("bookings").insert({
      schedule_id,
      booking_date,
      client_name: trimmedName,
      client_phone: trimmedPhone,
      client_email: trimmedEmail,
    });

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      const msg = error.code === "23505" ? "ALREADY_BOOKED" : error.message;
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
