import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { isImage } from '../utils/fields.js'
import { text } from '../utils/text.js'
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


