import { workoutCategories } from '../utils/constants'
import { shiftDate, todayISO } from '../utils/format'
import { getAllLogs } from './nutritionService'
import { getWorkouts } from './workoutService'

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0)

const mealTotal = (log, key) => log.items.reduce((total, item) => total + item[key], 0)

const logsTotal = (logs, key) => logs.reduce((total, log) => total + mealTotal(log, key), 0)

export const getAnalytics = async (days) => {
  const today = todayISO()
  const start = shiftDate(today, -(days - 1))
  const inRange = (item) => item.date >= start && item.date <= today

  const workouts = (await getWorkouts()).filter(inRange)
  const logs = (await getAllLogs()).filter(inRange)
  const step = days > 30 ? 7 : 1

  const trend = []
  for (let i = 0; i < days; i += step) {
    const from = shiftDate(start, i)
    const to = shiftDate(start, Math.min(i + step, days) - 1)
    const inBucket = (item) => item.date >= from && item.date <= to

    const bucketWorkouts = workouts.filter(inBucket)
    const bucketLogs = logs.filter(inBucket)
    const eatenDays = new Set(bucketLogs.map((log) => log.date)).size

    trend.push({
      date: from,
      minutes: sum(bucketWorkouts, 'duration'),
      burned: sum(bucketWorkouts, 'calories'),
      eaten: eatenDays ? Math.round(logsTotal(bucketLogs, 'calories') / eatenDays) : 0,
    })
  }

  const loggedDays = new Set(logs.map((log) => log.date)).size
  const average = (key) => (loggedDays ? Math.round(logsTotal(logs, key) / loggedDays) : 0)

  return {
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
  }
}
