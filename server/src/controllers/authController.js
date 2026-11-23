import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { createHash, randomBytes } from 'node:crypto'
import { env } from '../config/env.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { isImage } from '../utils/fields.js'
import { sendResetEmail, sendVerifyEmail } from '../utils/mail.js'
import { text } from '../utils/text.js'
import { signToken } from '../utils/token.js'

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value)

const isStrong = (value) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)

const hashToken = (value) => createHash('sha256').update(value).digest('hex')

const hashPassword = (value) => bcrypt.hash(value, 10)

const startVerification = async (user) => {
  const token = randomBytes(32).toString('hex')
  await User.updateOne({ _id: user._id }, { verifyTokenHash: hashToken(token), verifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
  const link = env.appUrl + '/#/verify-email?token=' + token + '&email=' + encodeURIComponent(user.email)
  await sendVerifyEmail(user.email, user.name, link)
}

export const register = asyncHandler(async (req, res) => {
  const name = text(req.body.name).trim()
  const email = text(req.body.email).trim().toLowerCase()
  const password = text(req.body.password)
  const photo = text(req.body.photo)

  if (name.length < 2) throw new AppError('Enter your full name')
  if (!isEmail(email)) throw new AppError('Enter a valid email address')
  if (!isStrong(password)) throw new AppError('Use at least 8 characters with a letter and a number')
  if (!isImage(photo)) throw new AppError('The photo must be a PNG, JPG or WebP image')
  if (req.body.consent !== true) throw new AppError('You need to accept the privacy policy')

  const existing = await User.findOne({ email })
  if (existing && existing.emailVerified !== false) throw new AppError('An account with this email already exists', 409)

  const details = { name, password: await hashPassword(password), photo, consentAcceptedAt: new Date() }
  const user = existing
    ? await User.findByIdAndUpdate(existing._id, details, { returnDocument: 'after' })
    : await User.create({ ...details, email, emailVerified: false })

  try {
    await startVerification(user)
  } catch (error) {
    console.error('Could not send the verification email:', error.message)
    throw new AppError('We could not send the verification email. Please try again in a moment', 502)
  }

  res.status(201).json({ message: 'Check your email to verify your account', email })
})

export const login = asyncHandler(async (req, res) => {
  const email = text(req.body.email).trim().toLowerCase()
  const password = text(req.body.password)

  const user = await User.findOne({ email }).select('+password')
  const valid = user && (await bcrypt.compare(password, user.password))
  if (!valid) throw new AppError('Incorrect email or password', 401)
  if (user.emailVerified === false) throw new AppError('Please verify your email first. Check your inbox for the link', 403)

  res.json({ token: signToken(user.id), user })
})

export const verifyEmail = asyncHandler(async (req, res) => {
  const email = text(req.body.email).trim().toLowerCase()
  const token = text(req.body.token)

  const user = await User.findOneAndUpdate(
    { email, verifyTokenHash: hashToken(token), verifyExpires: { $gt: new Date() } },
    { emailVerified: true, $unset: { verifyTokenHash: '', verifyExpires: '' } },
    { returnDocument: 'after' }
  )
  if (!user) throw new AppError('This verification link is invalid or has expired')

  res.json({ token: signToken(user.id), user })
})

export const resendVerification = asyncHandler(async (req, res) => {
  const email = text(req.body.email).trim().toLowerCase()
  const user = isEmail(email) ? await User.findOne({ email }) : null

  if (user && user.emailVerified === false) {
    try {
      await startVerification(user)
    } catch (error) {
      console.error('Could not send the verification email:', error.message)
    }
  }

  res.json({ message: 'If this account needs verification, a new link has been sent' })
})

export const googleLogin = asyncHandler(async (req, res) => {
  if (!googleClient) throw new AppError('Google sign-in is not set up', 503)

  let payload
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: text(req.body.credential), audience: env.googleClientId })
    payload = ticket.getPayload()
  } catch {
    throw new AppError('Google sign-in failed. Please try again')
  }

  if (!payload.email || !payload.email_verified) throw new AppError('Your Google email is not verified')

  const email = payload.email.toLowerCase()
  let user = await User.findOne({ email })

  if (!user) {
    user = await User.create({
      name: text(payload.name || email.split('@')[0]).trim().slice(0, 60),
      email,
      password: await hashPassword(randomBytes(24).toString('hex')),
      emailVerified: true,
      consentAcceptedAt: new Date(),
    })
  } else if (user.emailVerified === false) {
    user.password = await hashPassword(randomBytes(24).toString('hex'))
    user.passwordChangedAt = new Date()
    user.emailVerified = true
    await user.save()
  }

  res.json({ token: signToken(user.id), user })
})

export const me = (req, res) => {
  res.json({ user: req.user })
}

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = text(req.body.email).trim().toLowerCase()
  if (!isEmail(email)) throw new AppError('Enter a valid email address')

  const user = await User.findOne({ email })

  if (user) {
    const token = randomBytes(32).toString('hex')
    await User.updateOne({ _id: user._id }, { resetTokenHash: hashToken(token), resetExpires: new Date(Date.now() + 30 * 60 * 1000) })
    const link = env.appUrl + '/#/reset-password?token=' + token + '&email=' + encodeURIComponent(email)

    try {
      await sendResetEmail(user.email, user.name, link)
    } catch (error) {
      console.error('Could not send the reset email:', error.message)
    }
  }

  res.json({ message: 'If an account exists for this email, a reset link has been sent' })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const email = text(req.body.email).trim().toLowerCase()
  const token = text(req.body.token)
  const password = text(req.body.password)

  if (!isStrong(password)) throw new AppError('Use at least 8 characters with a letter and a number')

  const user = await User.findOneAndUpdate(
    { email, resetTokenHash: hashToken(token), resetExpires: { $gt: new Date() } },
    { password: await hashPassword(password), passwordChangedAt: new Date(), emailVerified: true, $unset: { resetTokenHash: '', resetExpires: '' } }
  )
  if (!user) throw new AppError('This reset link is invalid or has expired')

  res.json({ message: 'Your password has been changed. You can log in now' })
})

export const changePassword = asyncHandler(async (req, res) => {
  const current = text(req.body.currentPassword)
  const next = text(req.body.newPassword)

  const user = await User.findById(req.user.id).select('+password')
  if (!(await bcrypt.compare(current, user.password))) throw new AppError('Your current password is incorrect')
  if (!isStrong(next)) throw new AppError('Use at least 8 characters with a letter and a number')
  if (next === current) throw new AppError('Choose a password different from your current one')

  user.password = await hashPassword(next)
  user.passwordChangedAt = new Date()
  await user.save()

  res.json({ token: signToken(user.id), user })
})