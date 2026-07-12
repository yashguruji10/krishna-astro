import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

/**
 * Sends an email. Returns true on success, false on failure (never throws),
 * so a failed email never breaks the order-submission flow for the user.
 */
export async function sendMail({ to, subject, html, text }) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn('SMTP not configured - skipping email send');
      return false;
    }
    const t = getTransporter();
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text
    });
    return true;
  } catch (err) {
    console.error('sendMail error:', err.message);
    return false;
  }
}
