import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import { notifyAdminDeletedHostEvent } from "../services/notificationService.js";

export const deleteEventAdmin = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }

    const host = await User.findById(event.hostId);

    // ✅ STEP 2: delete the event itself
    await event.deleteOne();

    res.json({
        message: "Event and all registrations deleted by admin",
        eventId: event._id,
    });
    // ✅ STEP 1: delete all registrations of this event
    await Registration.deleteMany({ eventId: event._id });
    await notifyAdminDeletedHostEvent(host, event.title, event);
});