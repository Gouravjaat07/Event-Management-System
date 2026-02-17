import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", jwtAuth,
roleMiddleware("host", "admin"),
upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]),
createEvent);

router.get("/all", getAllEvents);
router.get("/:id", getEventById);

router.put("/:id", jwtAuth,
roleMiddleware("host", "admin"),
upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]),
updateEvent);

router.delete("/:id", jwtAuth,
roleMiddleware("host", "admin"), deleteEvent);

export default router;