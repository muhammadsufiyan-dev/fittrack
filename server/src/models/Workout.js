import mongoose from 'mongoose'
import { options, owner, part } from '../utils/schema.js'

export const workoutCategories = ['Strength', 'Cardio', 'HIIT', 'Flexibility']

const exerciseSchema = new mongoose.Schema(
  { id: String, name: { type: String, required: true }, sets: Number, reps: Number, weight: Number },
  part
)

const workoutSchema = new mongoose.Schema(
  {
    user: owner,
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, enum: workoutCategories, required: true },
    date: { type: String, required: true, index: true },
    duration: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    notes: { type: String, default: '', maxlength: 500 },
    tags: [String],
    exercises: [exerciseSchema],
  },
  options
)

export default mongoose.model('Workout', workoutSchema)
