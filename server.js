require("dotenv").config();
const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25kb" }));
app.use(express.static(__dirname));

function sanitize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactPayload(payload) {
  const data = {
    name: sanitize(payload.name),
    email: sanitize(payload.email),
    subject: sanitize(payload.subject),
    message: sanitize(payload.message),
  };

  const errors = {};

  if (!data.name) {
    errors.name = "Full name is required.";
  } else if (data.name.length < 2 || data.name.length > 80) {
    errors.name = "Full name must be between 2 and 80 characters.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) {
    errors.email = "Email address is required.";
  } else if (!emailPattern.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.subject) {
    errors.subject = "Subject is required.";
  } else if (data.subject.length < 3 || data.subject.length > 120) {
    errors.subject = "Subject must be between 3 and 120 characters.";
  }

  if (!data.message) {
    errors.message = "Message is required.";
  } else if (data.message.length < 10 || data.message.length > 1000) {
    errors.message = "Message must be between 10 and 1000 characters.";
  }

  return { data, errors };
}

function createTransporter() {
  if (process.env.MOCK_EMAIL === "true") {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.",
    );
  }

  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function buildEmailBody(contact) {
  return [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Subject: ${contact.subject}`,
    "",
    "Message:",
    contact.message,
  ].join("\n");
}

app.post("/api/contact", async (req, res) => {
  const { data, errors } = validateContactPayload(req.body ?? {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      ok: false,
      message: "Please correct the highlighted fields.",
      errors,
    });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    return res.status(500).json({
      ok: false,
      message: "Contact email destination is not configured.",
    });
  }

  const from =
    process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || "no-reply@example.com";

  try {
    const transporter = createTransporter();

    const emailResult = await transporter.sendMail({
      from,
      to,
      replyTo: data.email,
      subject: `New contact form message: ${data.subject}`,
      text: buildEmailBody(data),
    });

    if (process.env.MOCK_EMAIL === "true") {
      console.log("Mock contact email generated:", emailResult.message);
    }

    return res.status(200).json({
      ok: true,
      message: "Thanks! Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form delivery failed:", error);
    return res.status(500).json({
      ok: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Contact form server listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, validateContactPayload };
