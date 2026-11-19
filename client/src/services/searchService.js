import { getGoals } from './goalService'
import { getAllLogs } from './nutritionService'
import { getWorkouts } from './workoutService'

const matches = (values, query) => values.some((value) => String(value).toLowerCase().includes(query))

export const searchAll = async (term) => {
  const query = term.trim().toLowerCase()
  if (!query) return { workouts: [], meals: [], goals: [] }

  const workouts = (await getWorkouts()).filter((item) =>
    matches([item.name, item.category, item.notes, ...item.tags, ...item.exercises.map((exercise) => exercise.name)], query)
  )

  const meals = (await getAllLogs())
    .filter((item) => matches([item.mealType, item.notes, ...item.items.map((food) => food.name)], query))
    .sort((a, b) => b.date.localeCompare(a.date))

  const goals = (await getGoals()).filter((item) => matches([item.title, item.type], query))

  return { workouts, meals, goals }
}
