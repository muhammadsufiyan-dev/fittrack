import Goal from '../models/Goal.js'
import NotificationState from '../models/NotificationState.js'
import Nutrition from '../models/Nutrition.js'
import Progress from '../models/Progress.js'
import Reminder from '../models/Reminder.js'
import Settings from '../models/Settings.js'
import Support from '../models/Support.js'
import Workout from '../models/Workout.js'
import asyncHandler from '../utils/asyncHandler.js'

const mine = (req) => ({ user: req.user.id })

export const exportData = asyncHandler(async (req, res) => {
  const filter = mine(req)

  const [workouts, nutrition, progress, goals, reminders, support, settings] = await Promise.all([
    Workout.find(filter).sort({ date: -1 }),
    Nutrition.find(filter).sort({ date: -1 }),
    Progress.find(filter).sort({ date: -1 }),
    Goal.find(filter).sort({ createdAt: -1 }),
    Reminder.find(filter).sort({ time: 1 }),
    Support.find(filter).sort({ createdAt: -1 }),
    Settings.findOne(filter),
  ])

  res.set('Content-Disposition', 'attachment; filename="fittrack-my-data.json"')
  res.json({ exportedAt: new Date().toISOString(), profile: req.user, settings, workouts, nutrition, progress, goals, reminders, support })
})

export const clearData = asyncHandler(async (req, res) => {
  const filter = mine(req)
  await Promise.all([Workout, Nutrition, Progress, Goal, Reminder, Support, Settings, NotificationState].map((Model) => Model.deleteMany(filter)))
  res.status(204).end()
})
