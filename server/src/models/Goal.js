import mongoose from 'mongoose'
import { options, owner } from '../utils/schema.js'

export const goalTypes = ['weight', 'workouts', 'custom']

const goalSchema = new mongoose.Schema(
  {
    user: owner,
    title: { type: String, required: true, trim: true, maxlength: 80 },
    type: { type: String, enum: goalTypes, required: true },
    start: { type: Number, default: 0 },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    unit: { type: String, default: '', maxlength: 20 },
    deadline: { type: String, default: '' },
  },
  options
)

goalSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Goal', goalSchema)
