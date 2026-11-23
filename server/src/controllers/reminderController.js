import Reminder, { reminderTypes } from '../models/Reminder.js'
import AppError from '../utils/AppError.js'
import { isTime, list, pick } from '../utils/fields.js'
import { text } from '../utils/text.js'
import { makeCrud } from './crud.js'

const clean = (body) => {
  const title = text(body.title).trim()
  if (!title) throw new AppError('Enter a reminder title')
  if (!isTime(body.time)) throw new AppError('Choose a valid time')

  const days = [...new Set(list(body.days, 7).map(Number))].filter((day) => Number.isInteger(day) && day >= 0 && day <= 6).sort()

  return {
    title,
    type: pick(body.type, reminderTypes, 'Choose a valid reminder type'),
    time: body.time,
    days,
    enabled: typeof body.enabled === 'boolean' ? body.enabled : true,
    note: text(body.note).trim(),
  }
}

export default makeCrud({ Model: Reminder, one: 'reminder', many: 'reminders', sort: { time: 1 }, clean })
