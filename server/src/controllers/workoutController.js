import Workout, { workoutCategories } from '../models/Workout.js'
import AppError from '../utils/AppError.js'
import { date, itemId, list, num, pick, tags } from '../utils/fields.js'
import { text } from '../utils/text.js'
import { makeCrud } from './crud.js'

const clean = (body) => {
  const name = text(body.name).trim()
  if (!name) throw new AppError('Enter a workout name')

  return {
    name,
    category: pick(body.category, workoutCategories, 'Choose a valid category'),
    date: date(body.date),
    duration: num(body.duration, 'duration'),
    calories: num(body.calories, 'calories'),
    notes: text(body.notes).trim(),
    tags: tags(body.tags),
    exercises: list(body.exercises)
      .filter((item) => text(item && item.name).trim())
      .map((item) => ({
        id: itemId(item.id),
        name: text(item.name).trim(),
        sets: num(item.sets, 'sets'),
        reps: num(item.reps, 'reps'),
        weight: num(item.weight, 'weight'),
      })),
  }
}

export default makeCrud({ Model: Workout, one: 'workout', many: 'workouts', sort: { date: -1, createdAt: -1 }, clean })
