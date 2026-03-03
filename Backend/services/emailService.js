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
});

// ─── Base Layout ──────────────────────────────────────────────────────────────
const base = (content, preview = "") => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EventHub</title></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;color:#f0f2f5;font-size:1px;">${preview}&zwnj;</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="background:linear-gradient(135deg,#1a0533 0%,#3b0764 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
  <div style="background:linear-gradient(135deg,#a855f7,#ec4899);display:inline-block;border-radius:12px;padding:10px 14px;font-size:22px;margin-bottom:12px;">&#127919;</div>
  <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Event<span style="color:#c084fc;">Hub</span></div>
  <div style="font-size:11px;color:#a78bfa;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">University Events Platform</div>
</td></tr>

<!-- BODY -->
<tr><td style="background:#ffffff;padding:40px 40px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
  ${content}
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#1a0533;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
  <div style="margin-bottom:14px;">
    <a href="https://svsuevents.vercel.app/events" style="color:#a78bfa;font-size:13px;margin:0 8px;text-decoration:none;">Browse Events</a>
    <span style="color:#4c1d95;">|</span>
    <a href="https://svsuevents.vercel.app/register" style="color:#a78bfa;font-size:13px;margin:0 8px;text-decoration:none;">Register</a>
    <span style="color:#4c1d95;">|</span>
    <a href="https://svsuevents.vercel.app/contact" style="color:#a78bfa;font-size:13px;margin:0 8px;text-decoration:none;">Contact</a>
  </div>
  <p style="color:#6d28d9;font-size:12px;margin:0;line-height:1.8;">
    &copy; ${new Date().getFullYear()} EventHub &mdash;
    <a href="https://svsuevents.vercel.app" style="color:#a78bfa;text-decoration:none;">svsuevents.vercel.app</a>
    &nbsp;&middot;&nbsp;
    <a href="https://svsuevents.vercel.app/unsubscribe" style="color:#6d28d9;text-decoration:none;">Unsubscribe</a>
  </p>
</td></tr>

</table></td></tr></table>
</body></html>`;

// ─── Shared Components ────────────────────────────────────────────────────────
const btn = (text, url) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;"><tr><td align="center">
  <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;font-size:15px;font-weight:700;padding:14px 40px;border-radius:50px;text-decoration:none;">
    ${text} &rarr;
  </a>
</td></tr></table>`;

const row = (em, label, val) => val ? `
<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td width="28" style="font-size:18px;vertical-align:top;padding-top:2px;">${em}</td>
    <td style="padding-left:8px;">
      <span style="display:block;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.8px;">${label}</span>
      <span style="display:block;font-size:14px;font-weight:600;color:#111827;margin-top:2px;">${val}</span>
    </td>
  </tr></table>
</td></tr>` : "";

const chip = (t, c = "#7c3aed", bg = "#f3e8ff") =>
    `<span style="background:${bg};color:${c};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px;margin-right:6px;">${t}</span>`;

const typeColors = {
    Hackathon:   { c: "#7c3aed", bg: "#f3e8ff" },
    Competition: { c: "#0369a1", bg: "#e0f2fe" },
    Fest:        { c: "#be185d", bg: "#fce7f3" },
    Workshop:    { c: "#d97706", bg: "#fef3c7" },
};
const eventChip = (type) => {
    const s = typeColors[type] || { c: "#7c3aed", bg: "#f3e8ff" };
    return chip(type || "Event", s.c, s.bg);
};
const partChip = (type, size) => type === "Team"
    ? chip(`Team &middot; ${size ? "up to " + size + " members" : ""}`, "#0369a1", "#e0f2fe")
    : chip("Solo", "#059669", "#d1fae5");

const fmtDate = (d) => {
    if (!d) return "TBD";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const bannerBlock = (banner) => banner?.url ? `
<div style="margin-bottom:24px;">
  <img src="${banner.url}" alt="Event Banner" width="100%" style="display:block;border-radius:12px;max-height:200px;object-fit:cover;"/>
</div>` : "";

const logoBlock = (logo) => logo?.url ? `
<img src="${logo.url}" alt="Logo" width="52" height="52" style="border-radius:10px;object-fit:cover;margin-bottom:10px;display:block;"/>` : "";

const prizesBlock = (prizes) => prizes ? `
<div style="background:linear-gradient(135deg,#fef9c3,#fde68a);border-radius:10px;padding:14px 18px;margin:16px 0;">
  <p style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">&#127942; Prizes</p>
  <p style="font-size:14px;color:#78350f;font-weight:600;margin:0;">${prizes}</p>
</div>` : "";

const perksBlock = (perks = []) => perks.length ? `
<div style="margin:16px 0;">
  <p style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">&#127873; What You Get</p>
  ${perks.map(p => `
  <table cellpadding="0" cellspacing="0" style="margin-bottom:6px;"><tr>
    <td width="20" style="vertical-align:top;padding-top:1px;">
      <div style="width:16px;height:16px;background:#7c3aed;border-radius:4px;text-align:center;line-height:16px;font-size:10px;color:#fff;font-weight:700;">&#10003;</div>
    </td>
    <td style="padding-left:8px;font-size:13px;color:#374151;">${p}</td>
  </tr></table>`).join("")}
</div>` : "";

const coordinatorsBlock = (coordinators = []) => coordinators.length ? `
<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;margin:16px 0;">
  <p style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">&#128222; Coordinators</p>
  ${coordinators.map(c => `
  <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tr>
    <td width="28" style="font-size:16px;vertical-align:top;padding-top:2px;">&#128100;</td>
    <td style="padding-left:6px;">
      <span style="display:block;font-size:13px;font-weight:700;color:#111827;">${c.name || ""}</span>
      <span style="display:block;font-size:12px;color:#6b7280;">${c.contact || ""}</span>
    </td>
  </tr></table>`).join("")}
</div>` : "";


// ══════════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATE BUILDERS
// ══════════════════════════════════════════════════════════════════════════════

// 1. WELCOME — notifyUserRegisteredOnPortal
export const welcomeHtml = ({ name = "Student" } = {}) => base(`
<div style="text-align:center;margin-bottom:32px;">
  <div style="font-size:48px;margin-bottom:12px;">&#127881;</div>
  <h1 style="font-size:26px;font-weight:800;color:#111827;line-height:1.2;margin-bottom:8px;">
    Welcome to EventHub,<br/><span style="color:#7c3aed;">${name}!</span>
  </h1>
  <p style="font-size:15px;color:#6b7280;line-height:1.6;max-width:420px;margin:0 auto;">
    Your university's go-to platform for hackathons, competitions, workshops &amp; fests.
  </p>
</div>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr>
  <td width="33%" style="padding:0 5px 0 0;vertical-align:top;">
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:24px;margin-bottom:8px;">&#127942;</div>
      <p style="font-size:13px;font-weight:700;color:#6d28d9;margin:0 0 4px;">Competitions</p>
      <p style="font-size:12px;color:#9ca3af;margin:0;">Win &amp; get recognized</p>
    </div>
  </td>
  <td width="33%" style="padding:0 5px;vertical-align:top;">
    <div style="background:#fdf4ff;border:1px solid #f0abfc;border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:24px;margin-bottom:8px;">&#128187;</div>
      <p style="font-size:13px;font-weight:700;color:#7e22ce;margin:0 0 4px;">Hackathons</p>
      <p style="font-size:12px;color:#9ca3af;margin:0;">Build. Innovate. Win.</p>
    </div>
  </td>
  <td width="33%" style="padding:0 0 0 5px;vertical-align:top;">
    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:24px;margin-bottom:8px;">&#127891;</div>
      <p style="font-size:13px;font-weight:700;color:#d97706;margin:0 0 4px;">Workshops</p>
      <p style="font-size:12px;color:#9ca3af;margin:0;">Level up your skills</p>
    </div>
  </td>
</tr></table>

<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:4px;">
  Your account is ready. Browse upcoming events, register in seconds, and make your university experience unforgettable!
</p>
${btn("Explore Events Now", "https://svsuevents.vercel.app/events")}
<p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px;">
  Need help? <a href="https://svsuevents.vercel.app/contact" style="color:#7c3aed;">Contact us</a>
</p>`, `Welcome ${name}! Your EventHub journey starts now.`);


// 2. NEW EVENT ALERT — notifyNewEvent (sent to all users)
export const newEventHtml = ({
    userName = "Student",
    eventId,
    eventTitle = "Event",       eventType,
    eventDate,                  registrationDeadline,
    eventDescription = "",      prizes = "",
    perks = [],                 coordinators = [],
    banner = null,              logo = null,
    participationType,          teamSize,
} = {}) => base(`

${bannerBlock(banner)}

<div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:12px;padding:16px 24px;margin-bottom:24px;text-align:center;">
  <p style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">&#127881; Just Announced</p>
  <p style="font-size:20px;font-weight:800;color:#fff;margin:0;">A New Event is Live!</p>
</div>

${logoBlock(logo)}
<h2 style="font-size:24px;font-weight:800;color:#111827;margin-bottom:8px;">${eventTitle}</h2>
<div style="margin-bottom:16px;">
  ${eventType ? eventChip(eventType) : ""}
  ${participationType ? partChip(participationType, teamSize) : ""}
</div>

${eventDescription ? `<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:20px;">${eventDescription}</p>` : ""}

<p style="font-size:14px;color:#4b5563;line-height:1.6;margin-bottom:20px;">
  Hey <strong style="color:#111827;">${userName}</strong>, a brand-new event just dropped on EventHub! 
  Don't miss your chance to register before spots fill up.
</p>

<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px 24px;margin-bottom:16px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128197;", "Event Date", fmtDate(eventDate))}
    ${row("&#9200;", "Register Before", fmtDate(registrationDeadline))}
    ${participationType ? row(participationType === "Team" ? "&#128101;" : "&#128100;", "Participation",
      participationType === "Team" ? `Team &middot; ${teamSize ? "Max " + teamSize + " members" : ""}` : "Solo") : ""}
  </table>
</div>

${prizesBlock(prizes)}
${perksBlock(perks)}
${coordinatorsBlock(coordinators)}

<div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
  <p style="font-size:13px;color:#1e40af;font-weight:600;margin-bottom:2px;">&#9889; Seats are limited!</p>
  <p style="font-size:12px;color:#3b82f6;margin:0;">Registration closes on <strong>${fmtDate(registrationDeadline)}</strong>. Secure your spot now.</p>
</div>

${btn("Register Now", `https://svsueventshub.vercel.app/events/${eventId}`)}
<p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px;">
  View all events at <a href="https://svsuevents.vercel.app/events" style="color:#7c3aed;">svsuevents.vercel.app</a>
</p>`, `New Event: ${eventTitle} — Register before ${fmtDate(registrationDeadline)}!`);


// 3. HOST EVENT CREATED — notifyHostEventCreated
export const hostEventCreatedHtml = ({
    hostName = "Host",
    eventTitle = "Event",       eventType,
    eventDate,                  registrationDeadline,
    prizes = "",                perks = [],
    coordinators = [],          banner = null,
    logo = null,                participationType,
    teamSize,
} = {}) => base(`

${bannerBlock(banner)}

<div style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:12px;padding:18px 24px;margin-bottom:24px;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td width="44">
      <div style="background:#059669;border-radius:50%;width:38px;height:38px;text-align:center;line-height:38px;font-size:18px;color:#fff;font-weight:800;">&#10003;</div>
    </td>
    <td style="padding-left:12px;">
      <p style="font-size:16px;font-weight:700;color:#065f46;margin:0 0 2px;">Event Created Successfully!</p>
      <p style="font-size:13px;color:#047857;margin:0;">Your event is now live on EventHub.</p>
    </td>
  </tr></table>
</div>

${logoBlock(logo)}
<h2 style="font-size:22px;font-weight:800;color:#111827;margin-bottom:8px;">${eventTitle}</h2>
<div style="margin-bottom:16px;">
  ${eventType ? eventChip(eventType) : ""}
  ${participationType ? partChip(participationType, teamSize) : ""}
</div>

<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:20px;">
  Hey <strong style="color:#111827;">${hostName}</strong>, your event is live and students have been notified.
  Here's a summary of what was published:
</p>

<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px 24px;margin-bottom:16px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128197;", "Event Date", fmtDate(eventDate))}
    ${row("&#9200;", "Registration Closes", fmtDate(registrationDeadline))}
    ${participationType ? row("&#128101;", "Participation Type",
      participationType === "Team" ? `Team &middot; ${teamSize ? "Max " + teamSize + " members" : ""}` : "Solo") : ""}
  </table>
</div>

${prizesBlock(prizes)}
${perksBlock(perks)}
${coordinatorsBlock(coordinators)}

<div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0 24px;">
  <p style="font-size:13px;color:#1e40af;font-weight:600;margin-bottom:2px;">&#128200; Track your registrations</p>
  <p style="font-size:12px;color:#3b82f6;margin:0;">You can view all student registrations from your host dashboard.</p>
</div>

${btn("View My Event", "https://svsueventshub.vercel.app/host")}`, `Your event "${eventTitle}" is now live!`);


// 4. HOST EVENT DELETED (by Host) — notifyHostEventDeleted
export const hostEventDeletedHtml = ({
    hostName = "Host",
    eventTitle = "Event",
} = {}) => base(`
<div style="text-align:center;margin-bottom:28px;">
  <div style="font-size:48px;margin-bottom:12px;">&#128197;</div>
  <h2 style="font-size:24px;font-weight:800;color:#111827;margin-bottom:8px;">Event Deleted</h2>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;">Your event has been removed from EventHub.</p>
</div>

<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
  <p style="font-size:15px;font-weight:700;color:#991b1b;margin-bottom:4px;">&#10060; ${eventTitle}</p>
  <p style="font-size:13px;color:#dc2626;margin:0;">This event and all its registrations have been permanently deleted.</p>
</div>

<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:24px;">
  Hey <strong style="color:#111827;">${hostName}</strong>, the deletion was successful.
  All registered students have been notified automatically.
</p>

<div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;">
  <p style="font-size:13px;color:#15803d;font-weight:600;margin-bottom:2px;">&#127775; Ready to host again?</p>
  <p style="font-size:12px;color:#16a34a;margin:0;">Create a new event on EventHub and reach hundreds of students instantly.</p>
</div>

${btn("Create a New Event", "https://svsueventshub.vercel.app/host/create")}`, `Event "${eventTitle}" has been deleted.`);


// 5. REGISTRATION CONFIRMATION — notifyRegistration
export const registrationConfirmedHtml = ({
    userName = "Student",       userDepartment = "",
    eventTitle = "Event",       eventType,
    eventDate,                  registrationDeadline,
    eventDescription = "",      prizes = "",
    perks = [],                 coordinators = [],
    banner = null,              logo = null,
    participationType,          teamSize,
    registrationId = "",
    teamName = "",              teamMembers = [],
    collegeName = "",           course = "",        year = "",
} = {}) => base(`

${bannerBlock(banner)}

<div style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:12px;padding:18px 24px;margin-bottom:24px;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td width="44">
      <div style="background:#059669;border-radius:50%;width:38px;height:38px;text-align:center;line-height:38px;font-size:18px;color:#fff;font-weight:800;">&#10003;</div>
    </td>
    <td style="padding-left:12px;">
      <p style="font-size:16px;font-weight:700;color:#065f46;margin:0 0 2px;">You're Registered!</p>
      ${registrationId ? `<p style="font-size:13px;color:#047857;margin:0;">Booking ID: <strong>${registrationId}</strong></p>` : ""}
    </td>
  </tr></table>
</div>

${logoBlock(logo)}
<h2 style="font-size:22px;font-weight:800;color:#111827;margin-bottom:8px;">${eventTitle}</h2>
<div style="margin-bottom:16px;">
  ${eventType ? eventChip(eventType) : ""}
  ${participationType ? partChip(participationType, teamSize) : ""}
</div>

${eventDescription ? `<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:20px;">${eventDescription}</p>` : ""}

<p style="font-size:14px;color:#6b7280;margin-bottom:20px;line-height:1.6;">
  Hey <strong style="color:#111827;">${userName}</strong>, your spot is confirmed. Here are your full details:
</p>

<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px 24px;margin-bottom:12px;">
  <p style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Event Info</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("&#128197;", "Event Date", fmtDate(eventDate))}
    ${row("&#9200;", "Registration Closes", fmtDate(registrationDeadline))}
  </table>
</div>

<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:20px 24px;margin-bottom:12px;">
  <p style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">
    ${participationType === "Team" ? "Team Details" : "Your Details"}
  </p>
  <table width="100%" cellpadding="0" cellspacing="0">
    ${participationType === "Team" && teamName ? row("&#127939;", "Team Name", teamName) : ""}
    ${participationType === "Team" && teamMembers?.length ? row("&#128101;", "Members", teamMembers.join(", ")) : ""}
    ${collegeName  ? row("&#127979;", "College", collegeName)                                    : ""}
    ${course       ? row("&#127891;", "Course",  course + (year ? ` &middot; Year ${year}` : "")) : ""}
    ${userDepartment ? row("&#127970;", "Department", userDepartment)                            : ""}
  </table>
</div>

${prizesBlock(prizes)}
${perksBlock(perks)}
${coordinatorsBlock(coordinators)}

<div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0 24px;">
  <p style="font-size:13px;color:#1e40af;font-weight:600;margin-bottom:2px;">&#128198; Mark your calendar!</p>
  <p style="font-size:12px;color:#3b82f6;margin:0;">The event is on <strong>${fmtDate(eventDate)}</strong>. Bring this email as your proof of registration.</p>
</div>

${btn("View My Registration", "https://svsueventshub.vercel.app/student")}
<p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px;">
  Want to cancel? <a href="https://svsueventshub.vercel.app/student" style="color:#7c3aed;">Manage registrations</a>
</p>`, `Registered for ${eventTitle}!`);


// 6. REGISTRATION DELETED (by Student) — notifyRegistrationDeleted
export const registrationDeletedHtml = ({
    userName = "Student",
    eventTitle = "Event",       eventType,
    eventDate,
    banner = null,
} = {}) => base(`

${bannerBlock(banner)}

<div style="text-align:center;margin-bottom:28px;">
  <div style="font-size:48px;margin-bottom:12px;">&#128203;</div>
  <h2 style="font-size:24px;font-weight:800;color:#111827;margin-bottom:8px;">Registration Cancelled</h2>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;">Your registration has been removed.</p>
</div>

<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
  <p style="font-size:15px;font-weight:700;color:#991b1b;margin:0 0 4px;">&#10060; ${eventTitle}</p>
  ${eventType ? `<div style="margin-bottom:6px;">${eventChip(eventType)}</div>` : ""}
  ${eventDate  ? `<p style="font-size:13px;color:#dc2626;margin:0;">Was scheduled for: <strong>${fmtDate(eventDate)}</strong></p>` : ""}
</div>

<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:24px;">
  Hey <strong style="color:#111827;">${userName}</strong>, your registration for <strong>${eventTitle}</strong> has been 
  successfully cancelled. We're sorry to see you go!
</p>

<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px 20px;margin-bottom:28px;text-align:center;">
  <p style="font-size:14px;font-weight:700;color:#7c3aed;margin-bottom:6px;">&#128161; Changed your mind?</p>
  <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">
    You can re-register as long as the deadline hasn't passed. There are also plenty of other exciting events waiting for you!
  </p>
  ${btn("Browse All Events", "https://svsueventshub.vercel.app")}
</div>`, `Registration cancelled for ${eventTitle}`);


// 7. ADMIN DELETED HOST'S EVENT — notifyAdminDeletedHostEvent
export const adminDeletedEventHtml = ({
    hostName = "Host",
    eventTitle = "Event",
    eventType,
    eventDate,
    banner = null,
} = {}) => base(`

${bannerBlock(banner)}

<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:16px 24px;margin-bottom:24px;text-align:center;">
  <p style="font-size:12px;font-weight:700;color:#92400e;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">&#9888;&#65039; Administrative Action</p>
  <p style="font-size:20px;font-weight:800;color:#78350f;margin:0;">Your Event Was Removed</p>
</div>

<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
  <p style="font-size:15px;font-weight:700;color:#991b1b;margin:0 0 4px;">&#10060; ${eventTitle}</p>
  ${eventType ? `<div style="margin-bottom:8px;">${eventChip(eventType)}</div>` : ""}
  ${eventDate ? `<p style="font-size:13px;color:#dc2626;margin:0;">&#128197; Was scheduled for: <strong>${fmtDate(eventDate)}</strong></p>` : ""}
</div>

<p style="font-size:14px;color:#6b7280;line-height:1.7;margin-bottom:24px;">
  Hey <strong style="color:#111827;">${hostName}</strong>, we're writing to inform you that your event 
  <strong>${eventTitle}</strong> has been removed by a platform administrator.
  All student registrations associated with this event have also been deleted, and registered students have been notified.
</p>

<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
  <p style="font-size:13px;color:#92400e;font-weight:600;margin-bottom:4px;">&#128161; What happens next?</p>
  <p style="font-size:13px;color:#78350f;margin:0;line-height:1.6;">
    If you believe this was done in error, please contact the EventHub admin team immediately.
    Otherwise, you're welcome to create a new event that aligns with our platform guidelines.
  </p>
</div>

<div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;">
  <p style="font-size:13px;color:#15803d;font-weight:600;margin-bottom:2px;">&#127775; Keep hosting!</p>
  <p style="font-size:12px;color:#16a34a;margin:0;">Create a new event and engage your university community.</p>
</div>

${btn("Contact Admin", "https://svsuevents.vercel.app/contact")}
${btn("Create New Event", "https://svsueventshub.vercel.app/host/create")}`, `Admin Action: "${eventTitle}" has been removed`);


// ══════════════════════════════════════════════════════════════════════════════
// CORE SEND
// ══════════════════════════════════════════════════════════════════════════════
export const sendEmail = async ({ to, subject, html }) => {
    if (!to) return;
    await transporter.sendMail({
        from: `"EventHub" <${process.env.EMAIL_USER}>`,
        to, subject, html,
    });
    console.log(`Email sent → ${to} | ${subject}`);
};



// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// export const sendEmail = async ({ to, subject, html }) => {
//     await transporter.sendMail({
//         from: `"Event Portal"<${process.env.EMAIL_USER}>`,
//         to,
//         subject,
//         html,
//     });
//     console.log("📧 Sending mail to:", to);
// };