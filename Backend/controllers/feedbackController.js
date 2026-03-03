import asyncHandler from "express-async-handler";
import { sendEmail } from "../services/emailService.js";

export const sendFeedback = asyncHandler(async (req, res) => {
  const { name, email, category, message } = req.body;

  if (!name || !email || !category || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // 📧 Send mail to Admin (your email)
  await sendEmail({
    to: process.env.ADMIN_EMAIL,  // 👈 add in .env
    subject: `📩 New Feedback - ${category}`,
    html: `
      <h2>New Feedback Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  // 📧 Confirmation mail to user
  await sendEmail({
    to: email,
    subject: "✅ Feedback Received - SVSU Events",
    html: `
      <h3>Thank you, ${name}!</h3>
      <p>We have received your feedback.</p>
      <p>Our team will review it shortly.</p>
    `,
  });

  res.status(200).json({ message: "Feedback sent successfully" });
});