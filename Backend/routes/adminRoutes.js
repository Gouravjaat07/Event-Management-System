import express from "express";
import { deleteEventAdmin } from "../controllers/adminController.js";
import jwtAuth from "../middleware/jwtAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Admin-only delete
router.delete(
    "/events/:id",
    jwtAuth,
    roleMiddleware("admin"),
    deleteEventAdmin
);

export default router;