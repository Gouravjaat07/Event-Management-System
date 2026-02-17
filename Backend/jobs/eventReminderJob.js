import cron from "node-cron";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";
import { sendEmail } from "../services/emailService.js";

/* =====================================================
   📅 Deadline Reminder Job
   Runs Daily at 9 AM
===================================================== */

cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running Event Deadline Reminder Job");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time

    try {
        const events = await Event.find({
            registrationDeadline: { $gte: today },
        });

        for (const event of events) {
            const deadline = new Date(event.registrationDeadline);
            deadline.setHours(0, 0, 0, 0);

            const diffTime = deadline - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Only send when exactly 3 or 1 day left
            if (daysLeft === 3 || daysLeft === 1) {

                const registeredUsers = await Registration.find({
                    eventId: event._id,
                }).distinct("userId");

                const usersToNotify = await User.find({
                    _id: { $nin: registeredUsers },
                    role: "student",
                });

                console.log(
                    `📨 Sending ${daysLeft}-day reminder for: ${event.title}`
                );

                await Promise.all(
                    usersToNotify.map((user) =>
                        sendEmail({
                            to: user.email,
                            subject: `⏰ ${daysLeft} Day(s) Left – ${event.title}`,
                            html: `
                                <h3>${event.title}</h3>
                                <p>Only <b>${daysLeft} day(s)</b> left to register.</p>
                                <p>Registration Deadline: ${deadline.toDateString()}</p>
                                <p>Register now before it's too late!</p>
                            `,
                        })
                    )
                );
            }
        }
    } catch (error) {
        console.error("❌ Deadline Reminder Job Error:", error.message);
    }
});
