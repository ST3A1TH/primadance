import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { sendLovableEmail } from 'npm:@lovable.dev/email-js'
import { BookingConfirmationEmail } from '../_shared/email-templates/booking-confirmation.tsx'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

const SITE_NAME = "Prima Dance";
const SENDER_DOMAIN = "info.primadance.md";
const FROM_DOMAIN = "info.primadance.md";

// Logo URL from storage bucket
const LOGO_URL = "https://scevrsybmtguihndslhk.supabase.co/storage/v1/object/public/email-assets/logo.png";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { schedule_id, booking_date, client_name, client_phone, client_email, language } = await req.json();

    // Validate required fields
    if (!schedule_id || !booking_date || !client_name || !client_phone || !client_email) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lang = language === "ru" ? "ru" : "ro";

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

    // Rate limit by email
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

    // Fetch schedule entry for class name and time
    const { data: scheduleEntry } = await supabase
      .from("schedule")
      .select("class_name, time")
      .eq("id", schedule_id)
      .single();

    if (!scheduleEntry) {
      return new Response(JSON.stringify({ error: "Schedule not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      language: lang,
    });

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      const msg = error.code === "23505" ? "ALREADY_BOOKED" : error.message;
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send confirmation email (non-blocking - don't fail the booking if email fails)
    try {
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (apiKey) {
        // Format the date for display
        const [year, month, day] = booking_date.split("-");
        const formattedDate = `${day}.${month}.${year}`;

        const emailSubject = lang === "ru"
          ? "Подтверждение записи – Prima Dance"
          : "Confirmare programare – Prima Dance";

        const html = await renderAsync(
          React.createElement(BookingConfirmationEmail, {
            clientName: trimmedName,
            className: scheduleEntry.class_name,
            date: formattedDate,
            time: scheduleEntry.time,
            language: lang,
            logoUrl: LOGO_URL,
          })
        );

        const text = await renderAsync(
          React.createElement(BookingConfirmationEmail, {
            clientName: trimmedName,
            className: scheduleEntry.class_name,
            date: formattedDate,
            time: scheduleEntry.time,
            language: lang,
          }),
          { plainText: true }
        );

        const result = await sendLovableEmail(
          {
            run_id: crypto.randomUUID(),
            to: trimmedEmail,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: emailSubject,
            html,
            text,
            purpose: 'transactional',
          },
          { apiKey }
        );

        console.log("Booking confirmation email sent", { message_id: result.message_id, to: trimmedEmail });
      } else {
        console.warn("LOVABLE_API_KEY not configured, skipping confirmation email");
      }
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
      // Don't fail the booking - email is best-effort
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Create booking error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
