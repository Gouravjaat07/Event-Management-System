import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { notifyUserRegisteredOnPortal } from "../services/notificationService.js";


export const registerUser = asyncHandler(async (req, res) => {
        const {name, email, collegeId, password, role} = req.body;

        const exists = await User.findOne({
            $or: [{email}, { collegeId }],
        });

        if(exists) {
            res.status(400);
            throw new Error("User already exists in DB");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name, 
            email,
            collegeId,
            password: hashedPassword,
            role,
        });


        res.status(201).json({ message: "Registration Successful" });
        await notifyUserRegisteredOnPortal(newUser);
    }
);

export const loginUser = asyncHandler(async (req, res) => {
    const user = req.user;

    const token = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
        },
    });
});

