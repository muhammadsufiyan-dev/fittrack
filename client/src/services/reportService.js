import { shiftDate, todayISO } from '../utils/format'
import { getGoals } from './goalService'
import { getAllLogs } from './nutritionService'
import { getEntries } from './progressService'
import { getWorkouts } from './workoutService'

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0)

export const getReport = async (days) => {
  const to = todayISO()
  const from = shiftDate(to, -(days - 1))
  const inRange = (item) => item.date >= from && item.date <= to

  const workouts = (await getWorkouts()).filter(inRange)
  const entries = (await getEntries()).filter(inRange).reverse()
  const logs = (await getAllLogs()).filter(inRange)
  const goals = await getGoals()

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
