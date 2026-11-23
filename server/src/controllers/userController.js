import Follow from '../models/Follow.js'
import Goal from '../models/Goal.js'
import NotificationState from '../models/NotificationState.js'
import Nutrition from '../models/Nutrition.js'
import Post from '../models/Post.js'
import Progress from '../models/Progress.js'
import Reminder from '../models/Reminder.js'
import Settings from '../models/Settings.js'
import Support from '../models/Support.js'
import User from '../models/User.js'
import Workout from '../models/Workout.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { isImage } from '../utils/fields.js'
import { text } from '../utils/text.js'

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, city, bio, photo, discoverable } = req.body
  const user = req.user

  if (name !== undefined) {
    if (text(name).trim().length < 2) throw new AppError('Enter your full name')
    user.name = text(name).trim()
  }

  if (phone !== undefined) user.phone = text(phone).trim()
  if (city !== undefined) user.city = text(city).trim()
  if (bio !== undefined) user.bio = text(bio).trim()

  if (photo !== undefined) {
    if (!isImage(text(photo))) throw new AppError('The photo must be a PNG, JPG or WebP image')
    user.photo = text(photo)
  }

  if (typeof discoverable === 'boolean') user.discoverable = discoverable

  await user.save()
  res.json({ user })
})

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  const isMe = user && user.id === req.user.id

  if (!user || (!user.discoverable && !isMe)) throw new AppError('Member not found', 404)

  if (isMe) return res.json({ user })

  const { id, name, city, bio, photo, createdAt, discoverable } = user
  res.json({ user: { id, name, city, bio, photo, createdAt, discoverable } })
})

export const deleteMe = asyncHandler(async (req, res) => {
  const owner = { user: req.user.id }
  await Promise.all([Settings, Workout, Nutrition, Progress, Goal, Reminder, NotificationState, Support].map((Model) => Model.deleteMany(owner)))
  await Post.deleteMany({ author: req.user._id })
  await Post.updateMany({}, { $pull: { likes: req.user._id, replies: { author: req.user._id } } })
  await Follow.deleteMany({ $or: [{ follower: req.user._id }, { following: req.user._id }] })
  await User.deleteOne({ _id: req.user.id })
  res.status(204).end()
})




