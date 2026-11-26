import mongoose from 'mongoose'
import { options, owner } from '../utils/schema.js'

export const reminderTypes = ['workout', 'meal', 'water', 'weigh', 'custom']

const reminderSchema = new mongoose.Schema(
  {
    user: owner,
    title: { type: String, required: true, trim: true, maxlength: 80 },
    type: { type: String, enum: reminderTypes, default: 'custom' },
    time: { type: String, required: true },
    days: [Number],
    enabled: { type: Boolean, default: true },
    note: { type: String, default: '', maxlength: 200 },
  },
  options
)

reminderSchema.index({ user: 1 })

export default mongoose.model('Reminder', reminderSchema)
