import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transporter =
  env.mail.user && env.mail.pass
    ? nodemailer.createTransport({ service: 'gmail', auth: { user: env.mail.user, pass: env.mail.pass } })
    : null

const safe = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const button = (link, label) =>
  '<p><a href="' + link + '" style="display:inline-block;padding:10px 18px;background:#14b8a6;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600">' + label + '</a></p>'

const send = async (to, subject, body, html) => {
  if (!transporter) {
    if (env.isProd) throw new Error('Email is not set up')
    if (process.env.NODE_ENV !== 'test') console.log(subject + ' for ' + to + ':\n' + body)
    return
  }

  await transporter.sendMail({ from: '"FitTrack" <' + env.mail.user + '>', to, subject, text: body, html })
}

export const sendResetEmail = (to, name, link) =>
  send(
    to,
    'Reset your FitTrack password',
    'Hi ' + name + ',\n\nUse this link to set a new password. It works for 30 minutes.\n\n' + link + '\n\nIf you did not ask for this, you can ignore this email.',
    '<p>Hi ' + safe(name) + ',</p><p>Use the button below to set a new password. The link works for 30 minutes.</p>' + button(link, 'Reset password') + '<p>If you did not ask for this, you can ignore this email.</p>'
  )

export const sendVerifyEmail = (to, name, link) =>
  send(
    to,
    'Verify your FitTrack email',
    'Hi ' + name + ',\n\nWelcome to FitTrack. Use this link to verify your email. It works for 24 hours.\n\n' + link + '\n\nIf you did not create an account, you can ignore this email.',
    '<p>Hi ' + safe(name) + ',</p><p>Welcome to FitTrack. Use the button below to verify your email. The link works for 24 hours.</p>' + button(link, 'Verify email') + '<p>If you did not create an account, you can ignore this email.</p>'
  )