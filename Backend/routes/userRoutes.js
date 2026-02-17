import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import { getMyProfile, updateMyProfile, getUsersCount } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", jwtAuth, getMyProfile);
router.put("/profile", jwtAuth, updateMyProfile);
router.get("/count", getUsersCount);

export default router;