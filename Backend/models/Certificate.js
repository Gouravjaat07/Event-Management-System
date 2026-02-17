import mongoose, { mongo } from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        certificateUrl: {
            type: String,
            // required: true,
        },

        issuedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

// Unique certificate per user per event
certificateSchema.index(
    {userId: 1, eventId: 1},
    {unique: true},
);

export default mongoose.model("Certificate", certificateSchema);