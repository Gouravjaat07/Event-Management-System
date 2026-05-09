import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 20,
});

const SITE_URL = "https://svsuevents.in";
const UNI_NAME = "Shri Vishwakarma Skill University";

// ─── Base Layout ───────────────────────────────────────────────────────────────
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

// ─── Shared Components ─────────────────────────────────────────────────────────
const btn = (text, url) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td align="center">
  <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;font-size:15px;
     font-weight:700;padding:14px 40px;border-radius:50px;text-decoration:none;
     font-family:Arial,sans-serif;">
    ${text} &rarr;
  </a>
</td></tr></table>`;

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

export const fmtDate = (d) => {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

export const bannerBlock = (banner) => banner?.url ? `
<div style="margin-bottom:20px;">
  <img src="${banner.url}" alt="Event Banner" width="100%"
       style="display:block;border-radius:10px;max-height:200px;object-fit:cover;"/>
</div>` : "";

export const prizesBlock = (prizes) => prizes ? `
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;
            padding:12px 16px;margin:14px 0;">
  <p style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;
             letter-spacing:1px;margin:0 0 4px;font-family:Arial,sans-serif;">&#127942; Prizes</p>
  <p style="font-size:13px;color:#78350f;font-weight:600;margin:0;
             font-family:Arial,sans-serif;">${prizes}</p>
</div>` : "";


// ══════════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATE BUILDERS
// ══════════════════════════════════════════════════════════════════════════════

// 1. WELCOME — notifyUserRegisteredOnPortal
// ✅ loginId  : college ID or email used to login
// ✅ password : plain-text password — pass this BEFORE hashing in your auth controller
export const welcomeHtml = ({
  name     = "Student",
  loginId  = "",
  password = "",
} = {}) => base(`

<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;font-family:Arial,sans-serif;">
  Welcome to SVSU Events Hub, ${name}!
</h2>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${name}</strong>, your account has been created successfully.
  This is your university's platform for hackathons, competitions, workshops and fests.
  Use the credentials below to log in and start exploring events.
</p>

<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 22px;margin-bottom:14px;">
  <p style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;
             letter-spacing:1px;margin:0 0 10px;font-family:Arial,sans-serif;">Your Login Credentials</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128100;", "Login ID", loginId)}
    ${row("&#128274;", "Password", password)}
  </table>
</div>

<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;
            padding:12px 16px;margin-bottom:22px;">
  <p style="font-size:12px;color:#92400e;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
    Keep this email safe. Do not share your password with anyone.
    You can change it anytime from your profile settings.
  </p>
</div>

<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 22px;margin-bottom:24px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#127942;", "Competitions", "Hackathons &amp; technical competitions")}
    ${row("&#127891;", "Workshops", "Seminars &amp; learning sessions")}
    ${row("&#127881;", "Fests", "College fests &amp; cultural events")}
  </table>
</div>

${btn("Login to SVSU Events Hub", `${SITE_URL}/`)}
`, `Welcome ${name} — your SVSU Events Hub account is ready`);


// 2. NEW EVENT ALERT — notifyNewEvent (sent to all users)
export const newEventHtml = ({
  userName             = "Student",
  eventId,
  eventTitle           = "Event",
  eventType,
  eventDate,
  registrationDeadline,
  eventDescription     = "",
  prizes               = "",
  banner               = null,
  participationType,
  teamSize,
  venue                = "",
} = {}) => {

  const participationVal =
    participationType === "Team"
      ? `Team &middot; ${teamSize ? "Max " + teamSize + " members" : ""}`
      : participationType === "Solo"
      ? "Solo / Individual"
      : "";

  const venueVal = venue || `${UNI_NAME}, Palwal, Haryana`;

  return base(`

${bannerBlock(banner)}

<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;font-family:Arial,sans-serif;">
  ${eventTitle}${eventType ? ` <span style="font-size:14px;font-weight:600;color:#6b7280;">(${eventType})</span>` : ""}
</h2>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${userName}</strong>, a new event has been posted on SVSU Events Hub.
</p>

${eventDescription ? `<p style="font-size:13px;color:#6b7280;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">${eventDescription}</p>` : ""}

<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 22px;margin-bottom:14px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128197;", "Event Date",       fmtDate(eventDate))}
    ${row("&#9200;",   "Register Before",  fmtDate(registrationDeadline))}
    ${row("&#128205;", "Venue",            venueVal)}
    ${participationVal ? row("&#128101;", "Participation", participationVal) : ""}
  </table>
</div>

${prizesBlock(prizes)}

<div style="background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;
            padding:12px 16px;margin:18px 0;">
  <p style="font-size:12px;color:#1e40af;margin:0;font-family:Arial,sans-serif;">
    Registration closes on <strong>${fmtDate(registrationDeadline)}</strong>. Secure your spot now.
  </p>
</div>

${btn("View and Register", `${SITE_URL}/events/${eventId}`)}
`, `New Event: ${eventTitle} on SVSU Events Hub`);
};


// 3. HOST EVENT CREATED — notifyHostEventCreated
export const hostEventCreatedHtml = ({
  hostName             = "Host",
  eventTitle           = "Event",
  eventType,
  eventDate,
  registrationDeadline,
  prizes               = "",
  banner               = null,
  participationType,
  teamSize,
  venue                = "",
} = {}) => {

  const participationVal =
    participationType === "Team"
      ? `Team &middot; ${teamSize ? "Max " + teamSize + " members" : ""}`
      : participationType === "Solo"
      ? "Solo / Individual"
      : "";

  const venueVal = venue || `${UNI_NAME}, Palwal, Haryana`;

  return base(`

${bannerBlock(banner)}

<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:11px;font-weight:700;color:#065f46;text-transform:uppercase;
             letter-spacing:1px;margin:0 0 3px;font-family:Arial,sans-serif;">
    Event Published
  </p>
  <p style="font-size:15px;font-weight:800;color:#065f46;margin:0;font-family:Arial,sans-serif;">
    Your event is now live on SVSU Events Hub
  </p>
</div>

<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;font-family:Arial,sans-serif;">
  ${eventTitle}${eventType ? ` <span style="font-size:14px;font-weight:600;color:#6b7280;">(${eventType})</span>` : ""}
</h2>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${hostName}</strong>, your event is live and students have been notified.
  Here is a summary of what was published:
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
    You can view all student registrations from your host dashboard.
  </p>
</div>

${btn("Go to Host Dashboard", `${SITE_URL}/host`)}
`, `Your event "${eventTitle}" is now live on SVSU Events Hub`);
};


// 4. HOST EVENT DELETED (by Host) — notifyHostEventDeleted
export const hostEventDeletedHtml = ({
  hostName   = "Host",
  eventTitle = "Event",
} = {}) => base(`
<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;font-family:Arial,sans-serif;">
  Event Deleted
</h2>

<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:15px;font-weight:700;color:#991b1b;margin:0 0 4px;font-family:Arial,sans-serif;">
    ${eventTitle}
  </p>
  <p style="font-size:13px;color:#dc2626;margin:0;font-family:Arial,sans-serif;">
    This event and all its registrations have been permanently removed.
  </p>
</div>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:22px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${hostName}</strong>, the deletion was successful.
  All registered students have been notified automatically.
</p>

${btn("Create a New Event", `${SITE_URL}/host/create`)}
`, `Event "${eventTitle}" deleted from SVSU Events Hub`);


// 5. REGISTRATION CONFIRMATION — notifyRegistration
export const registrationConfirmedHtml = ({
  userName             = "Student",
  userDepartment       = "",
  eventTitle           = "Event",
  eventType,
  eventDate,
  registrationDeadline,
  eventDescription     = "",
  prizes               = "",
  banner               = null,
  participationType,
  teamSize,
  registrationId       = "",
  teamName             = "",
  teamMembers          = [],
  collegeName          = "",
  course               = "",
  year                 = "",
  venue                = "",
} = {}) => {

  const participationVal =
    participationType === "Team"
      ? `Team &middot; ${teamSize ? "Max " + teamSize + " members" : ""}`
      : participationType === "Solo"
      ? "Solo / Individual"
      : "";

  const venueVal = venue || `${UNI_NAME}, Palwal, Haryana`;

  return base(`

${bannerBlock(banner)}

<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:11px;font-weight:700;color:#065f46;text-transform:uppercase;
             letter-spacing:1px;margin:0 0 3px;font-family:Arial,sans-serif;">
    Registration Confirmed
  </p>
  ${registrationId
    ? `<p style="font-size:15px;font-weight:800;color:#065f46;margin:0;font-family:Arial,sans-serif;">
         Booking ID: ${registrationId}
       </p>`
    : `<p style="font-size:15px;font-weight:800;color:#065f46;margin:0;font-family:Arial,sans-serif;">
         Your spot is confirmed
       </p>`}
</div>

<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 16px;font-family:Arial,sans-serif;">
  ${eventTitle}${eventType ? ` <span style="font-size:14px;font-weight:600;color:#6b7280;">(${eventType})</span>` : ""}
</h2>

${eventDescription ? `<p style="font-size:13px;color:#6b7280;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">${eventDescription}</p>` : ""}

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${userName}</strong>, your spot is confirmed. Here are your details:
</p>

<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 22px;margin-bottom:12px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128197;", "Event Date",          fmtDate(eventDate))}
    ${row("&#9200;",   "Registration Closes", fmtDate(registrationDeadline))}
    ${row("&#128205;", "Venue",               venueVal)}
    ${participationVal ? row("&#128101;", "Participation", participationVal) : ""}
  </table>
</div>

${(teamName || teamMembers?.length || collegeName || course || userDepartment) ? `
<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 22px;margin-bottom:12px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${teamName                  ? row("&#127939;", "Team Name",   teamName) : ""}
    ${teamMembers?.length       ? row("&#128101;", "Members",     teamMembers.join(", ")) : ""}
    ${collegeName               ? row("&#127979;", "College",     collegeName) : ""}
    ${course                    ? row("&#127891;", "Course",      course + (year ? ` &middot; Year ${year}` : "")) : ""}
    ${userDepartment            ? row("&#127970;", "Department",  userDepartment) : ""}
  </table>
</div>` : ""}

${prizesBlock(prizes)}

<div style="background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;
            padding:12px 16px;margin:18px 0;">
  <p style="font-size:12px;color:#1e40af;margin:0;font-family:Arial,sans-serif;">
    The event is on <strong>${fmtDate(eventDate)}</strong>. Keep this email as your proof of registration.
  </p>
</div>

${btn("View My Registration", `${SITE_URL}/student`)}
`, `Registration confirmed for ${eventTitle}`);
};


// 6. REGISTRATION DELETED (by Student) — notifyRegistrationDeleted
export const registrationDeletedHtml = ({
  userName   = "Student",
  eventTitle = "Event",
  eventType,
  eventDate,
  banner     = null,
} = {}) => base(`

${bannerBlock(banner)}

<h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 14px;font-family:Arial,sans-serif;">
  Registration Cancelled
</h2>

<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:15px;font-weight:700;color:#991b1b;margin:0 0 4px;font-family:Arial,sans-serif;">
    ${eventTitle}${eventType ? ` <span style="font-size:13px;font-weight:600;color:#dc2626;">(${eventType})</span>` : ""}
  </p>
  ${eventDate ? `<p style="font-size:13px;color:#dc2626;margin:0;font-family:Arial,sans-serif;">
    Was scheduled for: <strong>${fmtDate(eventDate)}</strong></p>` : ""}
</div>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:22px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${userName}</strong>, your registration for
  <strong>${eventTitle}</strong> has been successfully cancelled.
  You can re-register as long as the deadline has not passed.
</p>

${btn("Browse All Events", `${SITE_URL}/`)}
`, `Registration cancelled for ${eventTitle}`);


// 7. ADMIN DELETED HOST'S EVENT — notifyAdminDeletedHostEvent
export const adminDeletedEventHtml = ({
  hostName   = "Host",
  eventTitle = "Event",
  eventType,
  eventDate,
  banner     = null,
} = {}) => base(`

${bannerBlock(banner)}

<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;
             letter-spacing:1px;margin:0 0 3px;font-family:Arial,sans-serif;">
    Administrative Action
  </p>
  <p style="font-size:15px;font-weight:800;color:#78350f;margin:0;font-family:Arial,sans-serif;">
    Your event was removed
  </p>
</div>

<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;
            padding:12px 18px;margin-bottom:22px;">
  <p style="font-size:15px;font-weight:700;color:#991b1b;margin:0 0 4px;font-family:Arial,sans-serif;">
    ${eventTitle}${eventType ? ` <span style="font-size:13px;font-weight:600;color:#dc2626;">(${eventType})</span>` : ""}
  </p>
  ${eventDate ? `<p style="font-size:13px;color:#dc2626;margin:0;font-family:Arial,sans-serif;">
    Was scheduled for: <strong>${fmtDate(eventDate)}</strong></p>` : ""}
</div>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;font-family:Arial,sans-serif;">
  Hi <strong style="color:#111827;">${hostName}</strong>, your event
  <strong>${eventTitle}</strong> has been removed by a platform administrator.
  All registered students have been notified.
</p>

<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;
            padding:13px 16px;margin-bottom:24px;">
  <p style="font-size:13px;color:#374151;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
    If you believe this was done in error, please contact the EventHub admin team.
    Otherwise, you are welcome to create a new event that follows our platform guidelines.
  </p>
</div>

${btn("Contact Admin Team", `${SITE_URL}/contact`)}
`, `Admin notice: "${eventTitle}" has been removed from SVSU Events Hub`);


// ══════════════════════════════════════════════════════════════════════════════
// CORE SEND
// ══════════════════════════════════════════════════════════════════════════════
export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return;
  await transporter.sendMail({
    from: `"SVSU Events Hub" <${process.env.MAIL_FROM}>`,
    to,
    subject,
    text: text || subject,
    html,
  });
  console.log(`Email sent → ${to} | ${subject}`);
};