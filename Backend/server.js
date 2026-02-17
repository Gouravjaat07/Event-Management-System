import express from "express";
import { configDotenv } from "dotenv";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import passport from "passport";
import path from "path";

import connectDB from "./config/db.js";
import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import { dot } from "node:test/reporters";
import "./jobs/eventReminderJob.js";

dotenv.config();
connectDB();

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmI5ODM2MTA2N2JjYzZmN2M3ZDIyNSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzY4NjU5MjAzLCJleHAiOjE3NjkyNjQwMDN9.ZNODkE2I6St_94oIwT_5X_dw7IsHR9bNUunFOs7ME_8
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmI5NjNlMTA2N2JjYzZmN2M3ZDIxYiIsInJvbGUiOiJob3N0IiwiaWF0IjoxNzY4NjU5ODk2LCJleHAiOjE3NjkyNjQ2OTZ9.QBwWChRbOqsiX9bwRNw4M_3hIlA9vb5ftzadX0x2NjQ
const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate Limit
app.use(
    rateLimit({
        windowMs: 15* 60* 1000,
        max: 300,
    })
);

// for certificate
app.use("/certificates", express.static(path.join(process.cwd(), "certificates")));

app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/register", registrationRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () =>
    console.log(`Server running on ${process.env.PORT}`)
);