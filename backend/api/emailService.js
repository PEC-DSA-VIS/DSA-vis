import nodemailer from 'nodemailer';

let transporter = null;

/**
 * Returns configured nodemailer transporter if SMTP credentials are provided in .env,
 * otherwise returns null for safe development terminal fallback.
 */
function getTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 2000,
      greetingTimeout: 2000,
      socketTimeout: 2000,
    });
  }
  return transporter;
}

/**
 * Dispatches a professional verification OTP email.
 * If SMTP is configured, sends via Gmail/SMTP to user's real inbox.
 * If not configured, gracefully logs to console and returns status.
 */
export async function sendOtpEmail(toEmail, otpCode, role = 'student') {
  const mailer = getTransporter();
  const senderEmail =
    process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@algoviz.edu';

  if (!mailer) {
    console.log(`[AUTH SERVICE] ⚠️ SMTP not configured in .env. Falling back to terminal display:`);
    console.log(`[AUTH SERVICE] 🔒 OTP for ${toEmail} (${role}): ${otpCode} (Valid for 5 mins)`);
    console.log(`[AUTH SERVICE] 💡 To receive OTPs directly in real email, add SMTP_USER and SMTP_PASS (Gmail App Password) to your backend/.env file.`);
    return {
      sent: false,
      fallback: true,
      message: 'OTP logged to server terminal (SMTP not configured in .env).',
    };
  }

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background-color: #0b1020; color: #e8edf8; border-radius: 16px; overflow: hidden; border: 1px solid #1e2c47;">
      <div style="background: linear-gradient(135deg, #630ed4 0%, #7c3aed 100%); padding: 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">AlgoViz Observatory</h1>
        <p style="margin: 6px 0 0 0; color: #ede0ff; font-size: 13px;">Campus Authentication Portal</p>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; margin-top: 0; color: #ffffff;">Your One-Time Password (OTP)</h2>
        <p style="color: #9caec9; font-size: 14px; line-height: 1.5;">Use the verification code below to complete your ${role === 'admin' ? 'Admin' : 'Student'} sign-in. This code is valid for <strong>5 minutes</strong>.</p>
        <div style="background-color: #121a2f; border: 1px solid #24355d; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${otpCode}</span>
        </div>
        <p style="color: #9caec9; font-size: 12px; margin-bottom: 0;">If you did not request this OTP, please ignore this email.</p>
      </div>
      <div style="background-color: #070b16; padding: 14px 24px; text-align: center; font-size: 11px; color: #54688d; border-top: 1px solid #1e2c47;">
        AlgoViz Kinetic Observatory &bull; Secure Authentication System
      </div>
    </div>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"AlgoViz Observatory" <${senderEmail}>`,
      to: toEmail,
      subject: `Your AlgoViz Verification OTP: ${otpCode}`,
      text: `Your AlgoViz verification OTP code is: ${otpCode}. It is valid for 5 minutes.`,
      html,
    });
    console.log(`[AUTH SERVICE] ✉️ Real OTP Email dispatched successfully to ${toEmail} (MessageId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[AUTH SERVICE] ❌ Failed to dispatch OTP email to ${toEmail}:`, err.message);
    console.log(`[AUTH SERVICE] 🔒 Terminal fallback OTP for ${toEmail}: ${otpCode}`);
    return { sent: false, error: err.message, fallback: true };
  }
}
