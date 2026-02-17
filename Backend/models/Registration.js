import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        // 🔹 Team fields
        teamName: String,
        teamMembers: [String],

        // 🔹 Solo fields
        name: String,
        collegeId: String,
        email: String,
        contact: String,

        // 🔹 Common college fields
        collegeName: {
            type: String,
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

export default mongoose.model("Registration", registrationSchema);