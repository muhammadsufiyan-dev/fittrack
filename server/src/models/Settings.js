import mongoose from 'mongoose'

export const notifyKeys = ['workout', 'meal', 'progress', 'goal', 'reminder', 'community']

const flag = { type: Boolean, default: true }

const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    units: {
      weight: { type: String, enum: ['kg', 'lb'], default: 'kg' },
      length: { type: String, enum: ['cm', 'in'], default: 'cm' },
    },
    notify: Object.fromEntries(notifyKeys.map((key) => [key, flag])),
  },
  {
    toJSON: {
      transform: (doc, ret) => ({ theme: ret.theme, units: ret.units, notify: ret.notify }),
    },
  }
)

export default mongoose.model('Settings', settingsSchema)
