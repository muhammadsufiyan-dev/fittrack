import { isDate } from './fields.js'

export const shift = (value, days) => new Date(Date.parse(value) + days * 86400000).toISOString().slice(0, 10)

export const todayOf = (query) => (isDate(query.today) ? query.today : new Date().toISOString().slice(0, 10))

export const rangeOf = (query) => {
  const days = Number(query.days)
  return Number.isInteger(days) && days >= 1 && days <= 365 ? days : 30
}
