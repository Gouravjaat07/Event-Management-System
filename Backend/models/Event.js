    import mongoose from "mongoose";

    const eventSchema = new mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
            },
            description: String,
            // banner: String,
            // logo: String,

            banner: {
                url: String,
                public_id: String,
            },
            logo: {
                url: String,
                public_id: String,
            },
            eventType: {
                type: String,
                enum: ["Hackathon", "Competition", "Fest", "Workshop"],
            },
            participationType: {
                type: String,
                enum: ["Solo", "Team"],
            },
            teamSize: Number,
            rules: [String],
            perks: [String],
            prizes: String,

            registrationDeadline: Date,
            eventDate: Date,

            status: {
                type: String,
                enum: ["upcoming", "ongoing", "expired"],
                default: "upcoming",
                index: true,
            },

            // previousMedia: [String],
            legalNotice: String,

            hostId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            coordinators: [
                {
                    name: String,
                    contact: String,
                },
            ],
        },
        {timestamps: true}
    );

    export default mongoose.model("Event", eventSchema);