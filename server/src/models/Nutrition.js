import mongoose from 'mongoose'
import { options, owner, part } from '../utils/schema.js'

export const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

const itemSchema = new mongoose.Schema(
  { id: String, name: { type: String, required: true }, calories: Number, protein: Number, carbs: Number, fats: Number },
  part
)

const nutritionSchema = new mongoose.Schema(
  {
    user: owner,
    date: { type: String, required: true, index: true },
    mealType: { type: String, enum: mealTypes, required: true },
    notes: { type: String, default: '', maxlength: 500 },
    items: [itemSchema],
  },
  options
)

export default mongoose.model('Nutrition', nutritionSchema)
