import Goal, { goalTypes } from '../models/Goal.js'
import Progress from '../models/Progress.js'
import Workout from '../models/Workout.js'
import AppError from '../utils/AppError.js'
import { shift, todayOf } from '../utils/dates.js'
import { isDate, num, pick } from '../utils/fields.js'
import { text } from '../utils/text.js'
import { makeCrud } from './crud.js'

const clean = (body) => {
  const title = text(body.title).trim()
  if (!title) throw new AppError('Enter a goal title')

  const deadline = text(body.deadline)
  if (deadline && !isDate(deadline)) throw new AppError('Enter a valid deadline')

  return {
    title,
    type: pick(body.type, goalTypes, 'Choose a valid goal type'),
    start: num(body.start, 'start value'),
    target: num(body.target, 'target'),
    current: num(body.current, 'current value'),
    unit: text(body.unit).trim(),
    deadline,
  }
}

export const present = async (docs, req) => {
  const userId = req.user.id
  const latest = await Progress.findOne({ user: userId }).sort({ date: -1, createdAt: -1 })
  const weekly = await Workout.countDocuments({ user: userId, date: { $gte: shift(todayOf(req.query), -6) } })

  return docs.map((doc) => {
    const goal = doc.toJSON()
    if (goal.type === 'weight' && latest) goal.current = latest.weight
    if (goal.type === 'workouts') goal.current = weekly

    const span = goal.target - goal.start
    const done = span === 0 ? 100 : Math.round(((goal.current - goal.start) / span) * 100)
    goal.percent = Math.min(100, Math.max(0, done))
    return goal
  })
}

export default makeCrud({ Model: Goal, one: 'goal', many: 'goals', sort: { createdAt: -1 }, clean, present })


