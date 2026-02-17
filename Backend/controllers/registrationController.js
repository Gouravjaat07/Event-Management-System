import asyncHandler from "express-async-handler";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import toast from "react-hot-toast";
import {
    notifyNewEvent,
    notifyRegistration,
    notifyRegistrationDeleted,
} from "../services/notificationService.js";

export const registerForEvent = asyncHandler(async (req, res) => {
    const alreadyRegistered = await Registration.findOne({
        eventId: req.params.eventId,
        userId: req.user.id,
    });

    if(alreadyRegistered) {
        res.status(400);
        // throw new Error("Already registered");
        toast.error("Already registered");
    }

    // 🔥 Get latest user info
    const user = await User.findById(req.user.id);

    const registration = await Registration.create({
        eventId: req.params.eventId,
        userId: req.user.id,
        // Team
        teamName: req.body.teamName,
        teamMembers: req.body.teamMembers,

        // Solo
        name: user.name,
        collegeId: user.collegeId,
        email: user.email,
        contact: user.contact,

        // Common
        collegeName: req.body.collegeName,
        course: req.body.course,
        year: req.body.year,
    });

    res.status(201).json(registration);
    // Confirmation Mail
    const event = await Event.findById(req.params.eventId);
    await notifyRegistration(user, event, registration);

});

export const getRegistrationsByEvent = asyncHandler(async (req, res) => {
    const registrations = await Registration.find({
        eventId: req.params.eventId,
    }) // Change
    .populate("userId", "name email collegeId")
    .populate("eventId", "title registrationDeadline");

    res.json(registrations);
});

export const getRegistrationsByUser = asyncHandler(async (req, res) => {
    const registrations = await Registration.find({
        userId: req.params.userId,
    }).populate(
        "eventId",
        "title eventDate registrationDeadline"
    );

    res.json(registrations);
});

export const updateRegistration = asyncHandler(async (req, res) => {
    const registration = await Registration.findById(req.params.registrationId)
        .populate("eventId");

    if (!registration) {
        res.status(404);
        throw new Error("Registration not found");
        // toast.error("Registration not found")
    }

    if (new Date() > new Date(registration.eventId.registrationDeadline)) {
        res.status(403);
        throw new Error("Registration deadline passed");
        // toast.error("Registration deadline passed");
    }

    // Update fields
    registration.teamName = req.body.teamName;
    registration.teamMembers = req.body.teamMembers;

    registration.name = req.body.name;
    registration.collegeId = req.body.collegeId;
    registration.email = req.body.email;
    registration.contact = req.body.contact;

    registration.collegeName = req.body.collegeName;
    registration.course = req.body.course;
    registration.year = req.body.year;

    const updated = await registration.save();
    res.json(updated);
});

export const deleteRegistration = asyncHandler(async (req, res) => {
    const registration = await Registration.findById(req.params.registrationId)
        .populate("eventId");

    if (!registration) {
        res.status(404);
        throw new Error("Registration not found");
        // toast.error("Registration not found");
    }

    if (new Date() > new Date(registration.eventId.registrationDeadline)) {
        res.status(403);
        throw new Error("Registration deadline passed");
        // toast.error("Registration deadline passed");
    }

    const user = await User.findById(req.user.id);
    await registration.deleteOne();
    res.json({ message: "Registration deleted" });
    await notifyRegistrationDeleted(user, registration.eventId);
    // toast.success("Registration deleted");
});