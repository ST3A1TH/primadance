import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Moldova timezone
const TZ = "Europe/Chisinau";

function toChisinauTime(date: Date): Date {
  const str = date.toLocaleString("en-US", { timeZone: TZ });
  return new Date(str);
}

function getNowInChisinau(): Date {
  return toChisinauTime(new Date());
}

// Map day_of_week (1=Mon..7=Sun) to JS getDay() (0=Sun..6=Sat)
function jsDay(dbDay: number): number {
  return dbDay === 7 ? 0 : dbDay;
}

function buildReminderHtml(lang: "ro" | "ru", clientName: string, className: string, date: string, time: string): string {
  const t = lang === "ru" ? {
    greeting: `Здравствуйте, ${clientName}`,
    reminder: `Напоминаем, что сегодня у вас занятие <strong>${className}</strong>.`,
    timeLabel: "Время",
    locationLabel: "Адрес",
    phoneLabel: "Телефон",
    seeYou: "До встречи!",
    team: "Команда Prima Dance",
    cancellation: "Если вы не сможете прийти, сообщите нам, пожалуйста.",
  } : {
    greeting: `Bună, ${clientName}`,
    reminder: `Îți reamintim că astăzi ai lecția de <strong>${className}</strong>.`,
    timeLabel: "Ora",
    locationLabel: "Locație",
    phoneLabel: "Telefon",
    seeYou: "Ne vedem curând!",
    team: "Echipa Prima Dance",
    cancellation: "Dacă nu poți ajunge, te rugăm să ne anunți.",
  };

  const address = "Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău";
  const phone = "061 100 499";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Montserrat','Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:40px 24px;">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:14px;letter-spacing:0.2em;text-transform:uppercase;color:#1a1a17;font-weight:500;margin:0;">Prima Dance</p>
</td></tr>

<tr><td style="padding:0 0 24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>

<tr><td align="center" style="padding-bottom:8px;">
  <h1 style="font-family:'Cormorant Garamond','Georgia',serif;font-size:24px;font-weight:400;color:#1a1a17;margin:0;">⏰ ${t.greeting}</h1>
</td></tr>
<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:14px;line-height:24px;color:#555555;margin:0;">${t.reminder}</p>
</td></tr>

<tr><td style="padding-bottom:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;padding:24px;">
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.timeLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${time}</td></tr>
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.locationLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${address}</td></tr>
    <tr><td style="color:#888;font-size:13px;padding:4px 0;">${t.phoneLabel}</td><td style="text-align:right;font-weight:500;font-size:13px;color:#1a1a17;padding:4px 0;">${phone}</td></tr>
  </table>
</td></tr>

<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:12px;line-height:20px;color:#999;font-style:italic;margin:0;">${t.cancellation}</p>
</td></tr>

<tr><td style="padding:0 0 24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>

<tr><td align="center">
  <p style="font-size:14px;line-height:24px;color:#555;margin:0 0 4px;">${t.seeYou}</p>
  <p style="font-size:14px;line-height:24px;color:#1a1a17;font-weight:500;margin:0;">${t.team}</p>
</td></tr>

<tr><td style="padding-top:24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>
<tr><td align="center" style="padding-top:16px;">
  <p style="font-size:12px;color:#aaa;margin:4px 0;">${address}</p>
  <p style="font-size:12px;color:#aaa;margin:4px 0;">${phone}</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

function buildThankYouHtml(lang: "ro" | "ru", clientName: string, className: string): string {
  const t = lang === "ru" ? {
    greeting: `Здравствуйте, ${clientName}`,
    thanks: `Спасибо, что были сегодня на занятии <strong>${className}</strong>!`,
    body: "Надеемся, вам понравилось. Ждём вас снова!",
    team: "Команда Prima Dance",
    cta: "Если у вас есть вопросы или вы хотите записаться на следующее занятие, свяжитесь с нами.",
  } : {
    greeting: `Bună, ${clientName}`,
    thanks: `Mulțumim că ai participat astăzi la lecția de <strong>${className}</strong>!`,
    body: "Sperăm că ți-a plăcut. Te așteptăm și data viitoare!",
    team: "Echipa Prima Dance",
    cta: "Dacă ai întrebări sau vrei să te programezi din nou, contactează-ne.",
  };

  const address = "Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău";
  const phone = "061 100 499";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Montserrat','Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:40px 24px;">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:14px;letter-spacing:0.2em;text-transform:uppercase;color:#1a1a17;font-weight:500;margin:0;">Prima Dance</p>
</td></tr>

<tr><td style="padding:0 0 24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>

<tr><td align="center" style="padding-bottom:8px;">
  <h1 style="font-family:'Cormorant Garamond','Georgia',serif;font-size:24px;font-weight:400;color:#1a1a17;margin:0;">💃 ${t.greeting}</h1>
</td></tr>
<tr><td align="center" style="padding-bottom:12px;">
  <p style="font-size:14px;line-height:24px;color:#555555;margin:0;">${t.thanks}</p>
</td></tr>
<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:14px;line-height:24px;color:#555555;margin:0;">${t.body}</p>
</td></tr>

<tr><td align="center" style="padding-bottom:24px;">
  <p style="font-size:12px;line-height:20px;color:#999;font-style:italic;margin:0;">${t.cta}</p>
</td></tr>

<tr><td style="padding:0 0 24px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"></td></tr>

<tr><td align="center">
  <p style="font-size:14px;line-height:24px;color:#1a1a17;font-weight:500;margin:0;">${t.team}</p>
</td></tr>

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
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Test mode: send sample emails to a specific address
    const body = await req.json().catch(() => ({}));
    if (body.test_email) {
      const resend = new Resend(resendKey);
      const lang = (body.language === "ru" ? "ru" : "ro") as "ro" | "ru";
      const testName = body.test_name || "Test User";
      const testClass = "Latin Technique";
      const testDate = "03.03.2026";
      const testTime = "18:00";

      const { error: err1 } = await resend.emails.send({
        from: "Prima Dance <noreply@primadance.md>",
        to: body.test_email,
        subject: lang === "ru" ? "Напоминание о занятии – Prima Dance" : "Reamintire lecție – Prima Dance",
        html: buildReminderHtml(lang, testName, testClass, testDate, testTime),
      });

      const { error: err2 } = await resend.emails.send({
        from: "Prima Dance <noreply@primadance.md>",
        to: body.test_email,
        subject: lang === "ru" ? "Спасибо за визит – Prima Dance" : "Mulțumim pentru vizită – Prima Dance",
        html: buildThankYouHtml(lang, testName, testClass),
      });

      return new Response(JSON.stringify({
        success: true,
        test: true,
        reminderError: err1 || null,
        thankYouError: err2 || null,
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendKey);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = getNowInChisinau();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let remindersSent = 0;
    let thankYousSent = 0;

    // --- REMINDERS: 6 hours before session ---
    // Get today's confirmed bookings that haven't received a reminder
    const { data: reminderBookings } = await supabase
      .from("bookings")
      .select("id, client_name, client_email, language, schedule_id, booking_date")
      .eq("booking_date", todayStr)
      .eq("status", "confirmed")
      .is("reminder_sent_at", null);

    if (reminderBookings && reminderBookings.length > 0) {
      // Get schedule info for these bookings
      const scheduleIds = [...new Set(reminderBookings.map(b => b.schedule_id))];
      const { data: schedules } = await supabase
        .from("schedule")
        .select("id, class_name, time")
        .in("id", scheduleIds);

      const scheduleMap = new Map(schedules?.map(s => [s.id, s]) || []);

      for (const booking of reminderBookings) {
        const schedule = scheduleMap.get(booking.schedule_id);
        if (!schedule) continue;

        // Parse class time (e.g., "18:00" or "18:00-19:00")
        const classTimeStr = schedule.time.split("-")[0].trim();
        const [classHour, classMin] = classTimeStr.split(":").map(Number);

        // Calculate minutes until class
        const minutesUntilClass = (classHour * 60 + classMin) - (currentHour * 60 + currentMinute);

        // Send reminder if class is 5.5-6.5 hours away (30-min window to account for cron interval)
        if (minutesUntilClass > 0 && minutesUntilClass >= 330 && minutesUntilClass <= 390) {
          const lang = booking.language === "ru" ? "ru" as const : "ro" as const;
          const subject = lang === "ru"
            ? "Напоминание о занятии – Prima Dance"
            : "Reamintire lecție – Prima Dance";

          try {
            await resend.emails.send({
              from: "Prima Dance <noreply@primadance.md>",
              to: booking.client_email,
              subject,
              html: buildReminderHtml(lang, booking.client_name, schedule.class_name, todayStr, schedule.time),
            });

            await supabase
              .from("bookings")
              .update({ reminder_sent_at: new Date().toISOString() })
              .eq("id", booking.id);

            remindersSent++;
            console.log(`Reminder sent to ${booking.client_email} for ${schedule.class_name}`);
          } catch (err) {
            console.error(`Failed to send reminder to ${booking.client_email}:`, err);
          }
        }
      }
    }

    // --- THANK YOU: after session ends ---
    // Get today's confirmed bookings that haven't received a thank-you
    const { data: thankYouBookings } = await supabase
      .from("bookings")
      .select("id, client_name, client_email, language, schedule_id, booking_date")
      .eq("booking_date", todayStr)
      .eq("status", "confirmed")
      .is("thankyou_sent_at", null);

    if (thankYouBookings && thankYouBookings.length > 0) {
      const scheduleIds = [...new Set(thankYouBookings.map(b => b.schedule_id))];
      const { data: schedules } = await supabase
        .from("schedule")
        .select("id, class_name, time")
        .in("id", scheduleIds);

      const scheduleMap = new Map(schedules?.map(s => [s.id, s]) || []);

      for (const booking of thankYouBookings) {
        const schedule = scheduleMap.get(booking.schedule_id);
        if (!schedule) continue;

        // Parse end time - if format is "18:00-19:00" use end, otherwise add 1 hour
        const timeParts = schedule.time.split("-");
        let endHour: number, endMin: number;
        if (timeParts.length >= 2) {
          const endTimeStr = timeParts[1].trim();
          [endHour, endMin] = endTimeStr.split(":").map(Number);
        } else {
          const startTimeStr = timeParts[0].trim();
          const [startH, startM] = startTimeStr.split(":").map(Number);
          endHour = startH + 1;
          endMin = startM;
        }

        // Send thank-you 1-2 hours after class ends
        const minutesSinceEnd = (currentHour * 60 + currentMinute) - (endHour * 60 + endMin);

        if (minutesSinceEnd >= 60 && minutesSinceEnd <= 150) {
          const lang = booking.language === "ru" ? "ru" as const : "ro" as const;
          const subject = lang === "ru"
            ? "Спасибо за визит – Prima Dance"
            : "Mulțumim pentru vizită – Prima Dance";

          try {
            await resend.emails.send({
              from: "Prima Dance <noreply@primadance.md>",
              to: booking.client_email,
              subject,
              html: buildThankYouHtml(lang, booking.client_name, schedule.class_name),
            });

            await supabase
              .from("bookings")
              .update({ thankyou_sent_at: new Date().toISOString() })
              .eq("id", booking.id);

            thankYousSent++;
            console.log(`Thank-you sent to ${booking.client_email} for ${schedule.class_name}`);
          } catch (err) {
            console.error(`Failed to send thank-you to ${booking.client_email}:`, err);
          }
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      date: todayStr,
      time: `${currentHour}:${String(currentMinute).padStart(2, "0")}`,
      remindersSent,
      thankYousSent,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Scheduled emails error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
