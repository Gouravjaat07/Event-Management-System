import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import {
    notifyNewEvent,
    notifyHostEventCreated,
    notifyHostEventDeleted,
} from "../services/notificationService.js";


export const createEvent = asyncHandler(async (req, res) => {
    console.log("FILES:", req.files);

    const logoFile = req.files?.logo?.[0];
    const bannerFile = req.files?.banner?.[0];

    const today = new Date();
    const deadline = new Date(req.body.registrationDeadline);

    let status = "upcoming";
    if (today > deadline) status = "expired";

    const event = await Event.create({
        title: req.body.title,
        description: req.body.description,
        eventType: req.body.eventType,
        participationType: req.body.participationType,
        teamSize: Number(req.body.teamSize),

        rules: JSON.parse(req.body.rules || "[]"),
        perks: JSON.parse(req.body.perks || "[]"),
        coordinators: JSON.parse(req.body.coordinators || "[]"),

        prizes: req.body.prizes,
        registrationDeadline: req.body.registrationDeadline,
        eventDate: req.body.eventDate,
        legalNotice: req.body.legalNotice,

        logo: logoFile
            ? {
                  url: logoFile.path,
                  public_id: logoFile.filename,
              }
            : undefined,

        banner: bannerFile
            ? {
                  url: bannerFile.path,
                  public_id: bannerFile.filename,
              }
            : undefined,

        status,
        hostId: req.user.id,
    });

    const host = await User.findById(req.user.id);

    res.status(201).json(event);

    // Notify all students
    await notifyHostEventCreated(host, event);
    await notifyNewEvent(event).catch(console.error);
});

    
export const getAllEvents = asyncHandler(async (req, res) =>
    {
        const events = await Event.find()
        .populate("hostId", "name email")
        .sort({ createdAt: -1 });

        res.json(events);
});

export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if(!event) {
        res.status(404);
        throw new Error("Event not found");
        // return res.json({ message: "Event not found" });
    }

    res.json(event);
});

export const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }

    const logoFile = req.files?.logo?.[0];
    const bannerFile = req.files?.banner?.[0];

    if (logoFile) {
        event.logo = {
            url: logoFile.path,
            public_id: logoFile.filename,
        };
    }

    if (bannerFile) {
        event.banner = {
            url: bannerFile.path,
            public_id: bannerFile.filename,
        };
    }

    Object.assign(event, {
        ...req.body,
        teamSize: Number(req.body.teamSize),
        rules: JSON.parse(req.body.rules || "[]"),
        perks: JSON.parse(req.body.perks || "[]"),
        coordinators: JSON.parse(req.body.coordinators || "[]"),
    });

    const today = new Date();
    const deadline = new Date(event.registrationDeadline);

    event.status = today > deadline ? "expired" : "upcoming";

    await event.save();

    res.json(event);
});


export const deleteEvent = asyncHandler(async (req, res) => {
    const deletedEvent = await Event.findById(req.params.id);

    if (!deletedEvent) {
        res.status(404);
        throw new Error("Event not found");
    }

    if (deletedEvent.hostId.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Not authorized");
    }

    // 🔥 Delete Cloudinary Images
    if (deletedEvent.logo?.public_id) {
        await cloudinary.uploader.destroy(deletedEvent.logo.public_id);
    }

    if (deletedEvent.banner?.public_id) {
        await cloudinary.uploader.destroy(deletedEvent.banner.public_id);
    }

    await Registration.deleteMany({ eventId: deletedEvent._id });

    const host = await User.findById(deletedEvent.hostId);

    await notifyHostEventDeleted(host, deletedEvent.title);
    await deletedEvent.deleteOne();

    res.json({ message: "Event deleted successfully" });
});