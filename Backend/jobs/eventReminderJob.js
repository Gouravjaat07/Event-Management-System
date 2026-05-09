import cron from "node-cron";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";

// ✅ Reuse everything from emailService — same template as other emails
// Pehle yahi approach thi jab inbox mein aati thi
import {
  sendEmail,
  fmtDate,
  bannerBlock,
  prizesBlock,
} from "../services/emailService.js";

const SITE_URL  = "https://svsuevents.in";
const SITE_NAME = "SVSU Events Hub";
const UNI_NAME  = "Shri Vishwakarma Skill University";

const isValidEmail = (email) => {
  return (
    email &&
    typeof email === "string" &&
    email.includes("@") &&
    email.includes(".")
  );
};

// ─── Base layout — copy of emailService base() ────────────────────────────────
// reminderJob me emailService ka base() export nahi hai, isliye yahan dobara likhte hain
// Bilkul same structure jaise welcome/registration emails hain
const base = (content, preview = "") => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>SVSU Events Hub</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;color:#f3f4f6;font-size:1px;">${preview}&zwnj;</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="background:#1e1b4b;border-radius:12px 12px 0 0;padding:24px 32px;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:14px;vertical-align:middle;">
      <img src="https://svsuevents.in/svsu_logo.png" alt="SVSU" width="48" height="48"
           style="border-radius:8px;display:block;"/>
    </td>
    <td style="vertical-align:middle;">
      <div style="font-size:20px;font-weight:800;color:#ffffff;font-family:Arial,sans-serif;">
        SVSU Events Hub
      </div>
      <div style="font-size:11px;color:#a5b4fc;font-family:Arial,sans-serif;margin-top:2px;">
        Shri Vishwakarma Skill University
      </div>
    </td>
  </tr></table>
</td></tr>

<!-- BODY -->
<tr><td style="background:#ffffff;padding:36px 40px 28px;
               border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
  ${content}
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#1e1b4b;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
  <p style="color:#6d28d9;font-size:12px;margin:0;line-height:1.8;font-family:Arial,sans-serif;">
    &copy; ${new Date().getFullYear()} SVSU Events Hub &mdash;
    <a href="https://svsuevents.in" style="color:#a78bfa;text-decoration:none;">svsuevents.in</a>
  </p>
</td></tr>

</table></td></tr></table>
</body></html>`;

// ─── Shared row helper (same as emailService) ─────────────────────────────────
const row = (em, label, val) => val ? `
<tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td width="26" style="font-size:16px;vertical-align:top;padding-top:2px;">${em}</td>
    <td style="padding-left:8px;">
      <span style="display:block;font-size:10px;font-weight:700;color:#9ca3af;
                   text-transform:uppercase;letter-spacing:.8px;font-family:Arial,sans-serif;">${label}</span>
      <span style="display:block;font-size:13px;font-weight:600;color:#111827;
                   margin-top:2px;font-family:Arial,sans-serif;">${val}</span>
    </td>
  </tr></table>
</td></tr>` : "";

// ─── Button (same as emailService) ───────────────────────────────────────────
const btn = (text, url) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td align="center">
  <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;font-size:15px;
     font-weight:700;padding:14px 40px;border-radius:50px;text-decoration:none;
     font-family:Arial,sans-serif;">
    ${text} &rarr;
  </a>
</td></tr></table>`;


// ══════════════════════════════════════════════════════════════════════════════
// DEADLINE REMINDER TEMPLATE
// Same look & feel as registrationConfirmedHtml / newEventHtml in emailService
// ══════════════════════════════════════════════════════════════════════════════
const deadlineReminderHtml = ({
  hoursLeft,                               // ✅ STEP 1 — hoursLeft added to params
  userName             = "Student",
  eventId,
  eventTitle           = "Event",
  eventType,
  eventDate,
  registrationDeadline,
  venue                = "",
  participationType,
  teamSize,
  prizes               = "",
  banner = null,
  daysLeft,
} = {}) => {

    let urgencyText = "";

    if (hoursLeft <= 6) {

    urgencyText =
        `Registration closes <strong>tonight</strong>. Don't miss your chance to participate.`;

    } else if (hoursLeft <= 24) {
    urgencyText =
        `Less than <strong>24 hours left</strong> to register for this event.`;
    } else {
    urgencyText =
        `Only <strong>${daysLeft} day(s)</strong> left before registrations close.`;

    }

  const participationVal =
    participationType === "Team"
      ? `Team &middot; ${teamSize ? "Max " + teamSize + " members" : ""}`
      : participationType === "Solo"
      ? "Solo / Individual"
      : "";

  const venueVal = venue || `${UNI_NAME}, Palwal, Haryana`;

  // Plain text — passed as `text` to sendEmail for strong inbox signal
  const plainText = [
    `Hi ${userName},`,
    ``,
    `This is a reminder that registration for "${eventTitle}"${eventType ? ` (${eventType})` : ""} closes on ${fmtDate(registrationDeadline)}.`,
    daysLeft === 1
      ? `Today is the last day to register.`
      : `Only ${daysLeft} days left.`,
    ``,
    `Event Date : ${fmtDate(eventDate)}`,
    `Venue      : ${venueVal}`,
    participationVal ? `Format     : ${participationVal.replace(/&middot;/g, "·")}` : "",
    prizes           ? `Prizes     : ${prizes}` : "",
    ``,
    `Register here: ${SITE_URL}/events/${eventId}`,
    ``,
    `If you have already registered, please ignore this email.`,
    ``,
    `Regards,`,
    `SVSU Events Team`,
    `${UNI_NAME}`,
    `${SITE_URL}`,
    ``,
    `---`,
    `You received this as a registered student on svsuevents.in`,
    `Unsubscribe: ${SITE_URL}/unsubscribe`,
  ].filter(Boolean).join("\n");

  // HTML — uses same base() + same styling pattern as emailService templates
  const html = base(`

${bannerBlock(banner)}

<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;
             letter-spacing:1px;margin:0 0 3px;font-family:Arial,sans-serif;">
    Registration Deadline Reminder
  </p>
  <p style="font-size:15px;font-weight:800;color:#78350f;margin:0;font-family:Arial,sans-serif;">
    ${
    hoursLeft <= 6
        ? "Registration Closing Tonight"
        : hoursLeft <= 24
        ? "Last 24 Hours Remaining"
        : `${daysLeft} Days Left`
    }
    &mdash; closes ${fmtDate(registrationDeadline)}
  </p>
</div>

<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;font-family:Arial,sans-serif;">
  ${eventTitle}${eventType ? ` <span style="font-size:14px;font-weight:600;color:#6b7280;">(${eventType})</span>` : ""}
</h2>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${userName}</strong>, you have not yet registered for
  <strong>${eventTitle}</strong>. ${urgencyText}
</p>

<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 22px;margin-bottom:14px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128197;", "Event Date",          fmtDate(eventDate))}
    ${row("&#9200;",   "Registration Closes", fmtDate(registrationDeadline))}
    ${row("&#128205;", "Venue",               venueVal)}
    ${participationVal ? row("&#128101;", "Participation", participationVal) : ""}
  </table>
</div>

${prizesBlock(prizes)}

<div style="background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;
            padding:12px 16px;margin:18px 0;">
  <p style="font-size:12px;color:#1e40af;margin:0;font-family:Arial,sans-serif;">
    If you have already registered, please ignore this email.
  </p>
</div>

${btn("Register Now", `${SITE_URL}/events/${eventId}`)}

<p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:14px;font-family:Arial,sans-serif;">
  View all events at <a href="${SITE_URL}" style="color:#2563eb;">svsuevents.in</a>
</p>

`, `${daysLeft === 1 ? "Last day" : `${daysLeft} days left`} to register for ${eventTitle}`);

  return { html, plainText };
};


// ══════════════════════════════════════════════════════════════════════════════
// Deadline Reminder Job
// ══════════════════════════════════════════════════════════════════════════════
export const sendDeadlineReminders = async () => {
  console.log("Running SVSU Event Deadline Reminder Job");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const events = await Event.find({
      registrationDeadline: { $gte: today },
    });

    for (const event of events) {
      const deadline = new Date(event.registrationDeadline);
      deadline.setHours(0, 0, 0, 0);

      const now = new Date();

      const diffMs = deadline - now;

      const hoursLeft = Math.ceil(diffMs / (1000 * 60 * 60));

      const daysLeft = Math.ceil(hoursLeft / 24);

      if ([1, 2, 3].includes(daysLeft)) {        // ✅ STEP 3 — only 1/2/3 days, no extra mails
        const registeredUserIds = await Registration.find({
          eventId: event._id,
        }).distinct("userId");

        const usersToNotify = await User.find({
          _id: { $nin: registeredUserIds },
          role: "student",
        });

        console.log(
          `Sending ${daysLeft}-day reminder for: ${event.title} to ${usersToNotify.length} students`
        );

        for (const user of usersToNotify) {

            // ✅ Skip invalid emails
            if (!isValidEmail(user.email)) {
                console.log(`Skipping invalid email for ${user.name}`);
                continue;
            }

          const { html, plainText } = deadlineReminderHtml({
            hoursLeft,                           // ✅ STEP 2 — hoursLeft passed to template
            userName:             user.name,
            eventId:              event._id,
            eventTitle:           event.title,
            eventType:            event.type,
            eventDate:            event.eventDate,
            registrationDeadline: event.registrationDeadline,
            venue:                event.venue,
            participationType:    event.participationType,
            teamSize:             event.teamSize,
            prizes:               event.prizes,
            banner:               event.banner,
            daysLeft,
          });

          const daysLabel = daysLeft === 1 ? "today" : `in ${daysLeft} days`;
          const subject = `${user.name}, your event registration deadline is approaching`;
          
          try {

            await sendEmail({
            to:      user.email,
            subject,
            text:    plainText,
            html,
            });

            console.log(
            `Email sent → ${user.email} | ${subject}`
            );

        } catch (err) {

            console.error(
            `Failed sending to ${user.email}:`,
            err.message
            );
        }

          const randomDelay = Math.floor(Math.random() * 4000) + 2000;
            // 2s–6s random delay

        await new Promise(resolve => setTimeout(resolve, randomDelay));
        }
      }
    }
  } catch (error) {
    console.error("Deadline Reminder Job Error:", error.message);
  }
};


// ══════════════════════════════════════════════════════════════════════════════
// DAILY CRON — 9:00 AM + 9:00 PM IST
// ══════════════════════════════════════════════════════════════════════════════
const isTesting =
  process.env.NODE_ENV !== "production";

// ✅ Only run cron in production
if (!isTesting) {

  // 🌅 Morning 9 AM
  cron.schedule("0 9 * * *", async () => {

    await sendDeadlineReminders();

  }, { timezone: "Asia/Kolkata" });


  // 🌙 Night 9 PM
  cron.schedule("0 21 * * *", async () => {

    await sendDeadlineReminders();

  }, { timezone: "Asia/Kolkata" });

}


/* ─── Remove before production ─────────────────────────────────────────────── */
// if (process.env.NODE_ENV === "development") {

//   global.reminderAlreadyRunning =
//     global.reminderAlreadyRunning || false;

//   if (!global.reminderAlreadyRunning) {

//     global.reminderAlreadyRunning = true;

//     sendDeadlineReminders();

//   }

// }