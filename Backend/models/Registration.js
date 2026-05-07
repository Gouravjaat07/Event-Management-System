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
        teamMembers: [
            {
                name: {
                type: String,
                required: true,
                },

                rollNo: {
                type: String,
                required: true,
                },

                course: {
                type: String,
                required: true,
                },
            },
        ],


        // 🔹 Solo fields
        name: String,
        collegeId: String,
        email: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        rollNo: {
            type: String,
        },
        department: {
            type: String,
        },

        // 🔹 Common college fields
        projectName: {
            type: String,
            required: true,
        },

        projectDescription: {
            type: String,
            required: true,
        },

        prototypeLink: {
            type: String,
            required: true,
        },
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