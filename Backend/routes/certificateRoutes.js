import exprss from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    generateCertificate,
    getCertificate,
    uploadCertificateTemplate,
    issueCertificatesForEvent
} from "../controllers/certificateController.js";
// import { get } from "mongoose";

const router = exprss.Router();

router.post("/generate", jwtAuth,
generateCertificate);
router.get("/:userId/:eventId", jwtAuth,
getCertificate);
router.post("/uploads-template/:eventId", jwtAuth,
roleMiddleware("host"),
upload.single("template"),
uploadCertificateTemplate
);
router.post("/issue/all/:eventId", jwtAuth,
roleMiddleware("host"),
issueCertificatesForEvent
);
// router.post("/issue-all/:eventId", jwtAuth,
// roleMiddleware("host"), issueAllCertificates);

export default router;