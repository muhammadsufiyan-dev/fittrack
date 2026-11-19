import seedGoals from '../data/goals.json'
import { todayISO, shiftDate } from '../utils/format'
import { createStore } from './localStore'
import { getEntries } from './progressService'
import { getWorkouts } from './workoutService'

const store = createStore('ft_goals', seedGoals)

const getPercent = (goal, current) => {
  const total = goal.target - goal.start
  if (total === 0) return 100
  const value = Math.round(((current - goal.start) / total) * 100)
  return Math.min(100, Math.max(0, value))
}

export const getLatestWeight = async () => {
  const entries = await getEntries()
  return entries.length > 0 ? entries[0].weight : null
}

export const getGoals = async () => {
  const latestWeight = await getLatestWeight()
  const workouts = await getWorkouts()
  const weekStart = shiftDate(todayISO(), -6)
  const workoutsThisWeek = workouts.filter((item) => item.date >= weekStart).length

  return store.read().map((goal) => {
    let current = goal.current
    if (goal.type === 'weight' && latestWeight !== null) current = latestWeight
    if (goal.type === 'workouts') current = workoutsThisWeek
    return { ...goal, current, percent: getPercent(goal, current) }
  })
}

export const addGoal = async (data) => {
  const item = { ...data, id: Date.now().toString() }
  store.save([item, ...store.read()])
  return item
}

export const updateGoal = async (id, data) => {
  store.save(store.read().map((item) => (item.id === id ? { ...item, ...data } : item)))
}

export const deleteGoal = async (id) => {
  store.save(store.read().filter((item) => item.id !== id))
}
