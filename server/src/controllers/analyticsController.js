import Nutrition from '../models/Nutrition.js'
import Workout, { workoutCategories } from '../models/Workout.js'
import asyncHandler from '../utils/asyncHandler.js'
import { rangeOf, shift, todayOf } from '../utils/dates.js'

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0)

const mealTotal = (logs, key) => logs.reduce((total, log) => total + sum(log.items, key), 0)

export const getAnalytics = asyncHandler(async (req, res) => {
  const user = req.user.id
  const days = rangeOf(req.query)
  const today = todayOf(req.query)
  const start = shift(today, -(days - 1))
  const range = { $gte: start, $lte: today }

  const [workouts, logs] = await Promise.all([Workout.find({ user, date: range }), Nutrition.find({ user, date: range })])
  const step = days > 30 ? 7 : 1

  const trend = []
  for (let i = 0; i < days; i += step) {
    const from = shift(start, i)
    const to = shift(start, Math.min(i + step, days) - 1)
    const bucketWorkouts = workouts.filter((item) => item.date >= from && item.date <= to)
    const bucketLogs = logs.filter((item) => item.date >= from && item.date <= to)
    const eatenDays = new Set(bucketLogs.map((log) => log.date)).size

    trend.push({
      date: from,
      minutes: sum(bucketWorkouts, 'duration'),
      burned: sum(bucketWorkouts, 'calories'),
      eaten: eatenDays ? Math.round(mealTotal(bucketLogs, 'calories') / eatenDays) : 0,
    })
  }

  const loggedDays = new Set(logs.map((log) => log.date)).size
  const average = (key) => (loggedDays ? Math.round(mealTotal(logs, key) / loggedDays) : 0)

  res.json({
    totalWorkouts: workouts.length,
    minutes: sum(workouts, 'duration'),
    burned: sum(workouts, 'calories'),
    activeDays: new Set(workouts.map((item) => item.date)).size,
    avgEaten: average('calories'),
    trend,
    categories: workoutCategories
      .map((name) => ({ name, value: workouts.filter((item) => item.category === name).length }))
      .filter((item) => item.value > 0),
    macros: { calories: average('calories'), protein: average('protein'), carbs: average('carbs'), fats: average('fats') },
  })
})
