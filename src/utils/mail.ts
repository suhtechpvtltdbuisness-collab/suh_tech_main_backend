import nodemailer from "nodemailer";

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASS!.trim(),
    },
  });
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!smtpConfigured()) {
    console.warn("SMTP not configured; skipping contact notification email");
    return;
  }

  const to =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    process.env.SMTP_USER!.trim();

  await transporter().sendMail({
    from: `"SUH Tech Website" <${process.env.SMTP_USER!.trim()}>`,
    to,
    replyTo: input.email,
    subject: `New contact form message from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      "",
      "Message:",
      input.message,
    ].join("\n"),
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
    `,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
