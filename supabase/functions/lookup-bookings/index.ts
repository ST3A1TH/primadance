import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmed = email.trim().toLowerCase();
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch bookings for this email with schedule info
    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select("id, booking_date, status, created_at, schedule_id")
      .eq("client_email", trimmed)
      .order("booking_date", { ascending: false });

    if (error) throw error;

    // Fetch schedule details for class names and times
    const scheduleIds = [...new Set((bookings || []).map((b) => b.schedule_id))];
    let scheduleMap: Record<string, { class_name: string; time: string }> = {};

    if (scheduleIds.length > 0) {
      const { data: schedules } = await supabaseAdmin
        .from("schedule")
        .select("id, class_name, time")
        .in("id", scheduleIds);

      if (schedules) {
        schedules.forEach((s) => {
          scheduleMap[s.id] = { class_name: s.class_name, time: s.time };
        });
      }
    }

    const result = (bookings || []).map((b) => ({
      id: b.id,
      booking_date: b.booking_date,
      status: b.status,
      class_name: scheduleMap[b.schedule_id]?.class_name || "Unknown",
      time: scheduleMap[b.schedule_id]?.time || "",
    }));

    return new Response(JSON.stringify({ bookings: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
