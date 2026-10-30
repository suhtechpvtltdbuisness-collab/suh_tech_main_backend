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

function receiverEmail(): string {
  return (
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    // Tolerate the Vercel typo CONTACT_RECEIVER_EMAI (missing final L).
    process.env.CONTACT_RECEIVER_EMAI?.trim() ||
    process.env.SMTP_USER!.trim()
  );
}

function acknowledgmentContent(name: string, message: string) {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const text = [
    `Dear ${firstName},`,
    "",
    "Thank you for contacting SUH Tech. We have received your message and our team will review it shortly.",
    "",
    "A member of our team will get back to you with the next steps or a resolution as soon as possible, typically within 1–2 business days.",
    "",
    "For your reference, here is a copy of what you submitted:",
    "",
    message,
    "",
    "If your request is urgent, please reply to this email or reach us at info@suhtech.top / +91 81789 39033.",
    "",
    "Warm regards,",
    "SUH Tech Private Limited",
    "https://www.suhtech.top",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#1f2937;max-width:600px;margin:0 auto;">
      <p>Dear ${escapeHtml(firstName)},</p>
      <p>Thank you for contacting <strong>SUH Tech</strong>. We have received your message and our team will review it shortly.</p>
      <p>A member of our team will get back to you with the next steps or a resolution as soon as possible, typically within <strong>1–2 business days</strong>.</p>
      <p style="margin-top:24px;"><strong>Your message:</strong></p>
      <blockquote style="margin:0;padding:12px 16px;background:#f8f7ff;border-left:4px solid #7c3aed;border-radius:8px;color:#374151;">
        ${escapeHtml(message).replace(/\n/g, "<br/>")}
      </blockquote>
      <p style="margin-top:24px;">If your request is urgent, please reply to this email or reach us at
        <a href="mailto:info@suhtech.top">info@suhtech.top</a> / +91 81789 39033.</p>
      <p style="margin-top:28px;">
        Warm regards,<br/>
        <strong>SUH Tech Private Limited</strong><br/>
        <a href="https://www.suhtech.top">www.suhtech.top</a>
      </p>
    </div>
  `;

  return { text, html };
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

  const fromUser = process.env.SMTP_USER!.trim();
  const to = receiverEmail();
  const mailer = transporter();

  await mailer.sendMail({
    from: `"SUH Tech" <${fromUser}>`,
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

  const ack = acknowledgmentContent(input.name, input.message);
  await mailer.sendMail({
    from: `"SUH Tech" <${fromUser}>`,
    to: input.email,
    replyTo: to,
    subject: "We've received your message — SUH Tech",
    text: ack.text,
    html: ack.html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
