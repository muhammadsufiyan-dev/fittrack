import Progress from '../models/Progress.js'
import AppError from '../utils/AppError.js'
import { date, num, optNum } from '../utils/fields.js'
import { makeCrud } from './crud.js'

const clean = (body) => {
  const weight = num(body.weight, 'weight')
  if (weight <= 0) throw new AppError('Enter your weight')

  return {
    date: date(body.date),
    weight,
    bodyFat: optNum(body.bodyFat, 'body fat'),
    waist: optNum(body.waist, 'waist'),
    chest: optNum(body.chest, 'chest'),
    hips: optNum(body.hips, 'hips'),
  }
}

export default makeCrud({ Model: Progress, one: 'entry', many: 'entries', sort: { date: -1, createdAt: -1 }, clean })
