import User from "../models/User.js";
import {
    sendEmail,
    welcomeHtml,
    newEventHtml,
    hostEventCreatedHtml,
    hostEventDeletedHtml,
    registrationConfirmedHtml,
    registrationDeletedHtml,
    adminDeletedEventHtml,
} from "./emailService.js";

// ─── Helper: map event doc → template-ready object ───────────────────────────
const eventData = (event) => ({
    eventTitle:           event.title,
    eventType:            event.eventType,
    eventDate:            event.eventDate,
    registrationDeadline: event.registrationDeadline,
    eventDescription:     event.description,
    prizes:               event.prizes,
    perks:                event.perks        || [],
    rules:                event.rules        || [],
    coordinators:         event.coordinators || [],
    banner:               event.banner,
    logo:                 event.logo,
    participationType:    event.participationType,
    teamSize:             event.teamSize,
});

// ─── Helper: map registration doc → template-ready object ────────────────────
const regData = (reg) => ({
    registrationId: reg._id?.toString(),
    teamName:       reg.teamName,
    teamMembers:    reg.teamMembers || [],
    collegeName:    reg.collegeName,
    course:         reg.course,
    year:           reg.year,
});


/* ============================================================
   1️⃣  Notify ALL users — new event just created
   Called from: eventController.createEvent
   ============================================================ */
export const notifyNewEvent = async (event) => {
    const users = await User.find({ email: { $exists: true, $ne: null } });

    for (const user of users) {
        await sendEmail({
            to: user.email,
            subject: `🎉 New Event: ${event.title} — Register Now!`,
            html: newEventHtml({
                userName: user.name,
                ...eventData(event),
            }),
        }).catch((err) => console.error(`Failed to notify ${user.email}:`, err));
    }
};


/* ============================================================
   2️⃣  Notify HOST — their event was published
   Called from: eventController.createEvent
   ============================================================ */
export const notifyHostEventCreated = async (host, event) => {
    await sendEmail({
        to: host.email,
        subject: `✅ Your Event "${event.title}" is Now Live!`,
        html: hostEventCreatedHtml({
            hostName: host.name,
            ...eventData(event),
        }),
    });
};


/* ============================================================
   3️⃣  Notify HOST — they deleted their own event
   Called from: eventController.deleteEvent
   ============================================================ */
export const notifyHostEventDeleted = async (host, eventTitle) => {
    await sendEmail({
        to: host.email,
        subject: `🗑️ Event "${eventTitle}" Deleted`,
        html: hostEventDeletedHtml({
            hostName:   host.name,
            eventTitle,
        }),
    });
};


/* ============================================================
   4️⃣  Notify STUDENT — registration confirmed
   Called from: registrationController.registerForEvent
   ============================================================ */
export const notifyRegistration = async (user, event, registration = {}) => {
    await sendEmail({
        to: user.email,
        subject: `✅ You're Registered for "${event.title}"!`,
        html: registrationConfirmedHtml({
            userName:       user.name,
            userDepartment: user.department,
            ...eventData(event),
            ...regData(registration),
        }),
    });
};


/* ============================================================
   5️⃣  Notify STUDENT — they cancelled their registration
   Called from: registrationController.deleteRegistration
   ============================================================ */
export const notifyRegistrationDeleted = async (user, event) => {
    await sendEmail({
        to: user.email,
        subject: `❌ Registration Cancelled: "${event.title}"`,
        html: registrationDeletedHtml({
            userName:   user.name,
            eventTitle: event.title,
            eventType:  event.eventType,
            eventDate:  event.eventDate,
            banner:     event.banner,
        }),
    });
};


/* ============================================================
   6️⃣  Notify HOST — admin deleted their event
   Called from: adminController.deleteEventAdmin
   ============================================================ */
export const notifyAdminDeletedHostEvent = async (host, eventTitle, event = {}) => {
    await sendEmail({
        to: host.email,
        subject: `⚠️ Admin Removed Your Event: "${eventTitle}"`,
        html: adminDeletedEventHtml({
            hostName:   host.name,
            eventTitle,
            eventType:  event.eventType,
            eventDate:  event.eventDate,
            banner:     event.banner,
        }),
    });
};


/* ============================================================
   7️⃣  Notify USER — welcome on portal signup
   Called from: authController (wherever you create user accounts)
   ============================================================ */
export const notifyUserRegisteredOnPortal = async (user) => {
    await sendEmail({
        to: user.email,
        subject: `🎉 Welcome to EventHub, ${user.name}!`,
        html: welcomeHtml({ name: user.name }),
    });
};