import express from "express";
import passport from "passport";
import { registerUser, loginUser } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post(
    "/login",
    passport.authenticate("local", {session: false}),
    loginUser
);

export default router;
