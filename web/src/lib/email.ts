import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string; }) {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = Number(process.env.EMAIL_SERVER_PORT || 587);
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  const from = process.env.EMAIL_FROM || "noreply@example.com";

  if (!host || !user || !pass) return; // silently skip in dev if not configured

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({ from, to, subject, text, html });
}
