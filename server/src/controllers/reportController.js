import Goal from '../models/Goal.js'
import Nutrition from '../models/Nutrition.js'
import Progress from '../models/Progress.js'
import Workout from '../models/Workout.js'
import asyncHandler from '../utils/asyncHandler.js'
import { rangeOf, shift, todayOf } from '../utils/dates.js'
import { present } from './goalController.js'

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0)

const build = async (req) => {
  const user = req.user.id
  const to = todayOf(req.query)
  const from = shift(to, -(rangeOf(req.query) - 1))
  const range = { $gte: from, $lte: to }

  const [workouts, entries, logs, goalDocs] = await Promise.all([
    Workout.find({ user, date: range }).sort({ date: -1, createdAt: -1 }),
    Progress.find({ user, date: range }).sort({ date: 1, createdAt: 1 }),
    Nutrition.find({ user, date: range }),
    Goal.find({ user }).sort({ createdAt: -1 }),
  ])

  const goals = await present(goalDocs, req)
  const loggedDays = new Set(logs.map((log) => log.date)).size
  const eaten = logs.reduce((total, log) => total + sum(log.items, 'calories'), 0)

  return {
    from,
    to,
    workouts,
    entries,
    goals,
    minutes: sum(workouts, 'duration'),
    burned: sum(workouts, 'calories'),
    avgEaten: loggedDays ? Math.round(eaten / loggedDays) : 0,
    weightChange: entries.length > 1 ? Math.round((entries[entries.length - 1].weight - entries[0].weight) * 10) / 10 : null,
    goalsDone: goals.filter((goal) => goal.percent >= 100).length,
  }
}

const cell = (value) => {
  const raw = String(value)
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${safe.replace(/"/g, '""')}"`
}

export const getReport = asyncHandler(async (req, res) => {
  res.json({ report: await build(req) })
})

export const getReportCsv = asyncHandler(async (req, res) => {
  const report = await build(req)
  const rows = [['Date', 'Workout', 'Category', 'Duration (min)', 'Calories', 'Exercises']]

  report.workouts.forEach((item) => {
    rows.push([item.date, item.name, item.category, item.duration, item.calories, item.exercises.map((exercise) => exercise.name).join('; ')])
  })

  res.set('Content-Type', 'text/csv; charset=utf-8')
  res.set('Content-Disposition', `attachment; filename="fittrack-report-${report.to}.csv"`)
  res.send(rows.map((row) => row.map(cell).join(',')).join('\n'))
})
