import dashboardData from '../data/dashboard.json'
import { formatDate, shiftDate, todayISO } from '../utils/format'
import { getGoals } from './goalService'
import { getEntries } from './progressService'
import { getWorkouts } from './workoutService'

const formatChange = (value) => `${value > 0 ? '+' : ''}${Math.round(value * 10) / 10} kg`

const getDayLabel = (date) => {
  const today = todayISO()
  if (date === today) return 'Today'
  if (date === shiftDate(today, -1)) return 'Yesterday'
  return formatDate(date)
}

export const getDashboard = async () => {
  const entries = await getEntries()
  const goals = await getGoals()
  const workouts = await getWorkouts()
  const stats = { ...dashboardData.stats }

  const weekStart = shiftDate(todayISO(), -6)
  stats.workoutsThisWeek = workouts.filter((item) => item.date >= weekStart).length

  const weeklyGoal = goals.find((item) => item.type === 'workouts')
  if (weeklyGoal) stats.workoutsGoal = weeklyGoal.target

  if (entries.length > 0) {
    stats.weight = entries[0].weight
    stats.weightChange = entries.length > 1 ? formatChange(entries[0].weight - entries[1].weight) : ''
  }

  return {
    ...dashboardData,
    stats,
    goals: goals.slice(0, 3).map((item) => ({ id: item.id, title: item.title, progress: item.percent })),
    recent: workouts.slice(0, 3).map((item) => ({
      id: item.id,
      name: item.name,
      date: getDayLabel(item.date),
      duration: item.duration,
      calories: item.calories,
    })),
  }
}
