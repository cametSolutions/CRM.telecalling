import nodemailer from "nodemailer"
import Branch from "../model/primaryUser/branchSchema.js"

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const getTransporter = async (branchId) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  // Prefer the same branch mailbox used by call-registration emails.
  const configuredBranchQuery = {
    notificationemail: { $type: "string", $ne: "" },
    mailpassword: { $type: "string", $ne: "" }
  }
  const branch = await Branch.findOne(
    branchId ? { ...configuredBranchQuery, _id: branchId } : configuredBranchQuery
  )
    .select("notificationemail mailpassword branchName")
    .lean()

  if (branch) {
    return {
      sender: process.env.MAIL_FROM || `${branch.branchName} CRM <${branch.notificationemail}>`,
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: { user: branch.notificationemail, pass: branch.mailpassword },
        // Matches the established call-registration mail configuration.
        tls: { rejectUnauthorized: false }
      })
    }
  }

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return {
      sender: process.env.MAIL_FROM || SMTP_USER,
      transporter: nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      })
    }
  }

  throw new Error("No password-reset SMTP mailbox is configured")
}

export const sendPasswordResetEmail = async ({ email, name, otp, branchId }) => {
  const { transporter, sender } = await getTransporter(branchId)
  const safeName = escapeHtml(name || "there")

  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Your CRM password reset code",
    text: `Hello ${name || "there"},\n\nYour CRM password reset code is: ${otp}\n\nThis code expires in 15 minutes and can only be used once. If you did not request this, you can safely ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;color:#1e293b;line-height:1.6"><h2>Reset your password</h2><p>Hello ${safeName},</p><p>Use this one-time code to reset your CRM password:</p><p style="font-size:28px;font-weight:700;letter-spacing:8px;color:#4f46e5">${otp}</p><p>This code expires in <strong>15 minutes</strong> and can only be used once.</p><p>If you did not request a reset, you can safely ignore this email.</p></div>`
  })
}
