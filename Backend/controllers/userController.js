import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// 🔹 GET MY PROFILE
export const getMyProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json(user);
});

// 🔹 UPDATE MY PROFILE
export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // ✅ Editable fields only
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  // Password change
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    collegeId: user.collegeId,
  });
});

// GET TOTAL USERS COUNT
export const getUsersCount = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
});