import Goal from '../models/Goal.js'
import Nutrition from '../models/Nutrition.js'
import Progress from '../models/Progress.js'
import Workout from '../models/Workout.js'
import asyncHandler from '../utils/asyncHandler.js'
import { shift, todayOf } from '../utils/dates.js'
import { present } from './goalController.js'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const caloriesTarget = 2200

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0)

const grams = (logs, key) => logs.reduce((total, log) => total + sum(log.items, key), 0)

export const getDashboard = asyncHandler(async (req, res) => {
  const user = req.user.id
  const today = todayOf(req.query)
  const weekStart = shift(today, -6)
  const lastWeekStart = shift(today, -13)

  const [workouts, recent, entries, logs, goalDocs] = await Promise.all([
    Workout.find({ user, date: { $gte: lastWeekStart, $lte: today } }),
    Workout.find({ user }).sort({ date: -1, createdAt: -1 }).limit(3),
    Progress.find({ user }).sort({ date: -1, createdAt: -1 }).limit(2),
    Nutrition.find({ user, date: today }),
    Goal.find({ user }).sort({ createdAt: -1 }),
  ])

  const thisWeek = workouts.filter((item) => item.date >= weekStart)
  const lastWeek = workouts.filter((item) => item.date < weekStart)
  const burned = sum(thisWeek, 'calories')
  const burnedBefore = sum(lastWeek, 'calories')

  const goals = await present(goalDocs, req)
  const weeklyGoal = goals.find((item) => item.type === 'workouts')

  const weekly = Array.from({ length: 7 }, (_, index) => {
    const date = shift(weekStart, index)
    return {
      day: dayNames[new Date(date).getUTCDay()],
      date,
      burned: sum(
        thisWeek.filter((item) => item.date === date),
        'calories'
      ),
    }
  })

  const protein = grams(logs, 'protein')
  const carbs = grams(logs, 'carbs')
  const fats = grams(logs, 'fats')
  const total = protein + carbs + fats
  const share = (value) => (total ? Math.round((value / total) * 100) : 0)

  res.json({
    stats: {
      caloriesBurned: burned,
      caloriesBurnedChange: burnedBefore ? Math.round(((burned - burnedBefore) / burnedBefore) * 100) : null,
      workoutsThisWeek: thisWeek.length,
      workoutsGoal: weeklyGoal ? weeklyGoal.target : 5,
      caloriesEaten: grams(logs, 'calories'),
      caloriesTarget,
      weight: entries.length ? entries[0].weight : null,
      weightChange: entries.length > 1 ? Math.round((entries[0].weight - entries[1].weight) * 10) / 10 : null,
    },
    weekly,
    macros: [
      { name: 'Protein', value: share(protein) },
      { name: 'Carbs', value: share(carbs) },
      { name: 'Fats', value: share(fats) },
    ],
    goals: goals.slice(0, 3).map((item) => ({ id: item.id, title: item.title, progress: item.percent })),
    recent: recent.map((item) => ({ id: item.id, name: item.name, date: item.date, duration: item.duration, calories: item.calories })),
  })
})
