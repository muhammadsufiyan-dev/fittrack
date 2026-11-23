import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transporter =
  env.mail.user && env.mail.pass
    ? nodemailer.createTransport({ service: 'gmail', auth: { user: env.mail.user, pass: env.mail.pass } })
    : null

const safe = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const sendResetEmail = async (to, name, link) => {
  if (!transporter) {
    if (!env.isProd) console.log('Password reset link for ' + to + ': ' + link)
    return
  }

  await transporter.sendMail({
    from: '"FitTrack" <' + env.mail.user + '>',
    to,
    subject: 'Reset your FitTrack password',
    text: 'Hi ' + name + ',\n\nUse this link to set a new password. It works for 30 minutes.\n\n' + link + '\n\nIf you did not ask for this, you can ignore this email.',
    html:
      '<p>Hi ' + safe(name) + ',</p>' +
      '<p>Use the button below to set a new password. The link works for 30 minutes.</p>' +
      '<p><a href="' + link + '" style="display:inline-block;padding:10px 18px;background:#14b8a6;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600">Reset password</a></p>' +
      '<p>If you did not ask for this, you can ignore this email.</p>',
  })
}