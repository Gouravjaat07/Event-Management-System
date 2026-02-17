import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";

import {
    registerForEvent,
    getRegistrationsByEvent,
    getRegistrationsByUser,
    updateRegistration,
    deleteRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/:eventId", jwtAuth,
registerForEvent);

router.get("/event/:eventId", jwtAuth,
getRegistrationsByEvent);

router.get("/user/:userId", jwtAuth,
getRegistrationsByUser);

// ✅ Update registration (BY REGISTRATION ID)
router.put("/:registrationId", jwtAuth,
updateRegistration);

// ✅ Delete registration (BY REGISTRATION ID)
router.delete("/:registrationId", jwtAuth,
deleteRegistration);

// router.put("/register/:registrationId", jwtAuth,
// updateRegistration
// )
// router.delete("/register/:registrationId", jwtAuth,
// deleteRegistration
// )
export default router;
