import Nutrition, { mealTypes } from '../models/Nutrition.js'
import AppError from '../utils/AppError.js'
import { date, isDate, itemId, list, num, pick } from '../utils/fields.js'
import { text } from '../utils/text.js'
import { makeCrud } from './crud.js'

const clean = (body) => {
  const items = list(body.items)
    .filter((item) => text(item && item.name).trim())
    .map((item) => ({
      id: itemId(item.id),
      name: text(item.name).trim(),
      calories: num(item.calories, 'calories'),
      protein: num(item.protein, 'protein'),
      carbs: num(item.carbs, 'carbs'),
      fats: num(item.fats, 'fats'),
    }))

  if (items.length === 0) throw new AppError('Add at least one food item')

  return {
    date: date(body.date),
    mealType: pick(body.mealType, mealTypes, 'Choose a valid meal type'),
    notes: text(body.notes).trim(),
    items,
  }
}

const filter = (query) => (isDate(query.date) ? { date: query.date } : {})

export default makeCrud({ Model: Nutrition, one: 'log', many: 'logs', sort: { date: -1, createdAt: -1 }, clean, filter })
