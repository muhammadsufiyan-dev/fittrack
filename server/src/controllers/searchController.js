import Goal from '../models/Goal.js'
import Nutrition from '../models/Nutrition.js'
import User from '../models/User.js'
import Workout from '../models/Workout.js'
import asyncHandler from '../utils/asyncHandler.js'
import { text } from '../utils/text.js'
import { present } from './goalController.js'

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const any = (fields, pattern) => ({ $or: fields.map((field) => ({ [field]: pattern })) })

export const searchAll = asyncHandler(async (req, res) => {
  const query = text(req.query.q).trim().slice(0, 60)
  if (!query) return res.json({ workouts: [], meals: [], goals: [], members: [] })

  const user = req.user.id
  const pattern = new RegExp(escapeRegex(query), 'i')

  const [workouts, meals, goals, members] = await Promise.all([
    Workout.find({ user, ...any(['name', 'category', 'notes', 'tags', 'exercises.name'], pattern) })
      .sort({ date: -1 })
      .limit(50),
    Nutrition.find({ user, ...any(['mealType', 'notes', 'items.name'], pattern) })
      .sort({ date: -1 })
      .limit(50),
    Goal.find({ user, ...any(['title', 'type'], pattern) }).limit(50),
    User.find({ _id: { $ne: user }, discoverable: true, ...any(['name', 'city'], pattern) }).limit(20),
  ])

  res.json({
    workouts,
    meals,
    goals: await present(goals, req),
    members: members.map(({ id, name, city, bio, photo, createdAt }) => ({ id, name, city, bio, photo, createdAt })),
  })
})

