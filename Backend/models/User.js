import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},

        email: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        collegeId: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "host", "admin"],
            default: "student",
        },
        department: String,
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);