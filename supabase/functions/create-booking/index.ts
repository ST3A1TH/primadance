import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@6";

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

function buildEmailHtml(lang: "ro" | "ru", clientName: string, className: string, date: string, time: string): string {
  const t = lang === "ru" ? {
    preview: "Подтверждение записи – Prima Dance",
    greeting: `Здравствуйте, ${clientName}`,
    confirmation: `Ваша запись на ${className} подтверждена.`,
    dateLabel: "Дата",
    timeLabel: "Время",
    locationLabel: "Адрес",
    phoneLabel: "Телефон",
    cancellation: "Отмена возможна минимум за 6 часов.",
    thanks: "Благодарим и ждём вас!",
    team: "Команда Prima Dance",
  } : {
    preview: "Confirmare programare – Prima Dance",
    greeting: `Bună, ${clientName}`,
    confirmation: `Îți confirmăm rezervarea la ${className}.`,
    dateLabel: "Data",
    timeLabel: "Ora",
    locationLabel: "Locație",
    phoneLabel: "Telefon",
    cancellation: "Anulările trebuie făcute cu minim 6 ore înainte.",
    thanks: "Mulțumim și te așteptăm cu drag!",
    team: "Echipa Prima Dance",
  };

  const address = "Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău";
  const phone = "061 100 499";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Montserrat','Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:40px 24px;">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

<!-- Studio name -->
<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:14px;letter-spacing:0.2em;text-transform:uppercase;color:#1a1a17;font-weight:500;margin:0;">Prima Dance</p>
</td></tr>

<!-- Divider -->
<tr><td style="padding:0 0 24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>

<!-- Greeting -->
<tr><td align="center" style="padding-bottom:8px;">
  <h1 style="font-family:'Cormorant Garamond','Georgia',serif;font-size:24px;font-weight:400;color:#1a1a17;margin:0;">${t.greeting}</h1>
</td></tr>
<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:14px;line-height:24px;color:#555555;margin:0;">${t.confirmation}</p>
</td></tr>

<!-- Details box -->
<tr><td style="padding-bottom:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;padding:24px;">
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.dateLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${date}</td></tr>
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.timeLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${time}</td></tr>
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.locationLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${address}</td></tr>
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.phoneLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${phone}</td></tr>
  </table>
</td></tr>

<!-- Cancellation -->
<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:12px;line-height:20px;color:#999;font-style:italic;margin:0;">${t.cancellation}</p>
</td></tr>

<!-- Divider -->
<tr><td style="padding:0 0 24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>

<!-- Sign-off -->
<tr><td align="center">
  <p style="font-size:14px;line-height:24px;color:#555;margin:0 0 4px;">${t.thanks}</p>
  <p style="font-size:14px;line-height:24px;color:#1a1a17;font-weight:500;margin:0;">${t.team}</p>
</td></tr>

<!-- Footer -->
<tr><td style="padding-top:24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>
<tr><td align="center" style="padding-top:16px;">
  <p style="font-size:12px;color:#aaa;margin:4px 0;">${address}</p>
  <p style="font-size:12px;color:#aaa;margin:4px 0;">${phone}</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { schedule_id, booking_date, client_name, client_phone, client_email, language } = await req.json();

    if (!schedule_id || !booking_date || !client_name || !client_phone || !client_email) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lang = language === "ru" ? "ru" : "ro";
    const trimmedName = String(client_name).trim();
    const trimmedPhone = String(client_phone).trim();
    const trimmedEmail = String(client_email).trim().toLowerCase();

    if (trimmedName.length === 0 || trimmedName.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (trimmedPhone.length < 3 || trimmedPhone.length > 30) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (isRateLimited(`email:${trimmedEmail}`)) {
      return new Response(JSON.stringify({ error: "Too many booking attempts. Please try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`ip:${ip}`, 10)) {
      return new Response(JSON.stringify({ error: "Too many booking attempts. Please try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch schedule entry
    const { data: scheduleEntry } = await supabase
      .from("schedule")
      .select("class_name, time")
      .eq("id", schedule_id)
      .single();

    if (!scheduleEntry) {
      return new Response(JSON.stringify({ error: "Schedule not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send confirmation email via Resend (non-blocking)
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        const resend = new Resend(resendKey);
        const [year, month, day] = booking_date.split("-");
        const formattedDate = `${day}.${month}.${year}`;

        const subject = lang === "ru"
          ? "Подтверждение записи – Prima Dance"
          : "Confirmare programare – Prima Dance";

        const html = buildEmailHtml(lang, trimmedName, scheduleEntry.class_name, formattedDate, scheduleEntry.time);

        const { data: emailData, error: emailError } = await resend.emails.send({
          from: "Prima Dance <noreply@primadance.md>",
          to: trimmedEmail,
          subject,
          html,
        });

        if (emailError) {
          console.error("Resend error:", emailError);
        } else {
          console.log("Booking confirmation sent:", emailData?.id);
        }
      } else {
        console.warn("RESEND_API_KEY not configured, skipping confirmation email");
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Create booking error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
