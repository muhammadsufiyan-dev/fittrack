import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'node:crypto'
import { env } from '../config/env.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { isImage } from '../utils/fields.js'
import { text } from '../utils/text.js'
import { sendResetEmail } from '../utils/mail.js'
import { signToken } from '../utils/token.js'

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value)

const isStrong = (value) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)

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

  const exists = await User.findOne({ email })
  if (exists) throw new AppError('An account with this email already exists', 409)

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    photo,
    consentAcceptedAt: new Date(),
  })

  res.status(201).json({ token: signToken(user.id), user })
})

export const login = asyncHandler(async (req, res) => {
  const email = text(req.body.email).trim().toLowerCase()
  const password = text(req.body.password)

  const user = await User.findOne({ email }).select('+password')
  const valid = user && (await bcrypt.compare(password, user.password))
  if (!valid) throw new AppError('Incorrect email or password', 401)

  res.json({ token: signToken(user.id), user })
})

export const me = (req, res) => {
  res.json({ user: req.user })
}

const hashToken = (value) => createHash('sha256').update(value).digest('hex')

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
    { password: await bcrypt.hash(password, 10), passwordChangedAt: new Date(), $unset: { resetTokenHash: '', resetExpires: '' } }
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

  user.password = await bcrypt.hash(next, 10)
  user.passwordChangedAt = new Date()
  await user.save()

  res.json({ token: signToken(user.id), user })
})