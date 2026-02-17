// import Registration from "../models/Registration.js";
// import asyncHandler from "express-async-handler";
// import Certificate from "../models/Certificate.js";
// import User from "../models/User.js";
// import Event from "../models/Event.js";
// import generateCertificatePDF from "../utils/generateCertificate.js";

// export const issueAllCertificates = asyncHandler(async (req, res) => {
//   const { eventId } = req.params;

//   const event = await Event.findById(eventId);
//   if (!event) {
//     res.status(404);
//     throw new Error("Event not found");
//   }

//   const registrations = await Registration.find({ eventId });

//   if (registrations.length === 0) {
//     res.status(400);
//     throw new Error("No registrations found");
//   }

//   let issuedCount = 0;

//   for (const reg of registrations) {
//     const existing = await Certificate.findOne({
//       userId: reg.userId,
//       eventId,
//     });

//     if (existing) continue; // skip already issued

//     // ✅ Name from registration
//     const participantName =
//       reg.teamMembers?.[0] || "Participant";

//     const certificatePath = generateCertificatePDF({
//       userName: participantName,
//       eventTitle: event.title,
//     });

//     await Certificate.create({
//       userId: reg.userId,
//       eventId,
//       certificateUrl: certificatePath,
//     });

//     issuedCount++;
//   }

//   res.json({
//     message: "Bulk certificate issue completed",
//     issuedCount,
//   });
// });




import asyncHandler from "express-async-handler";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import generateCertificatePDF from "../utils/generateCertificate.js";
import Registration from "../models/Registration.js";


export const generateCertificate = asyncHandler(async (req, res) => {
    const {userId, eventId} = req.body;

    // Check if certificate already exists for same user + event
    const existingCertificate = await Certificate.findOne({
        userId,
        eventId,
    });

    if(existingCertificate) {
        return res.status(400).json({ message: "Certificate already issued for this event" });
    }

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if(!user || !event) {
        res.status(404);
        throw new Error("User or Event not found");
    }

    // Generate Certificate
    const certificatePath = generateCertificatePDF({
        userName: user.name,
        eventTitle: event.title,
    });

    const certificate = await Certificate.create({
        userId,
        eventId,
        certificateUrl: certificatePath,
    });

    res.status(201).json(certificate);
});

export const getCertificate = asyncHandler(async ( req, res) => {
    const certificate = await Certificate.findOne({
        userId: req.params.userId,
        eventId: req.params.eventId,
    });

    if(!certificate) {
        res.status(404);
        throw new Error("Certificate not found");
    }

    res.json(certificate);
});

export const uploadCertificateTemplate = asyncHandler( async (req, res) => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if(!event) {
        throw new Error("Event not found");
    }

    event.certificateTemplate = req.file.path;
    await event.save();

    return res.json({ message: "Template uploaded successfully" });
});

export const issueCertificatesForEvent = asyncHandler( async (req, res) => {
    const { eventId } = req.params;

    const registrations = await Registration
    .find({ eventId })
    .populate("userId");

    const event = await Event.findById(eventId);

    for(let reg of registrations) {
        const pdfPath = await generateCertificatePDF({
            templatePath: event.certificateTemplate,
            userName: reg.userId.name,
            eventTitle: event.title,
        });

        await Certificate.create({
            userId: reg.userId._id,
            eventId,
            certificateUrl: pdfPath,
        });

        await sendEmail(
            reg.userId.email,
            "Certificate Issued",
            `Your certificate is ready. Download here:
            https://localhost:8080/certificate`
        );
    }

    return res.json({ message: "Certificates Issued successfully" });
});

