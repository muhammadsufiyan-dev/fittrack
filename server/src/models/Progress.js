import mongoose from 'mongoose'
import { options, owner } from '../utils/schema.js'

const progressSchema = new mongoose.Schema(
  {
    user: owner,
    date: { type: String, required: true, index: true },
    weight: { type: Number, required: true, min: 1 },
    bodyFat: { type: Number, default: null },
    waist: { type: Number, default: null },
    chest: { type: Number, default: null },
    hips: { type: Number, default: null },
  },
  options
)

export default mongoose.model('Progress', progressSchema)
