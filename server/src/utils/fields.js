import { randomUUID } from 'node:crypto'
import AppError from './AppError.js'
import { text } from './text.js'

export const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(text(value)) && !Number.isNaN(Date.parse(value))

export const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(text(value))

export const num = (value, label = 'number') => {
  if (value === '' || value === null || value === undefined) return 0
  const result = Number(value)
  if (!Number.isFinite(result) || result < 0) throw new AppError(`Enter a valid ${label}`)
  return result
}

export const optNum = (value, label) => (value === '' || value === null || value === undefined ? null : num(value, label))

export const pick = (value, options, message) => {
  if (!options.includes(value)) throw new AppError(message)
  return value
}

export const date = (value) => {
  if (!isDate(value)) throw new AppError('Enter a valid date')
  return value
}

export const list = (value, limit = 50) => (Array.isArray(value) ? value.slice(0, limit) : [])

export const tags = (value) => [...new Set(list(value, 10).map((item) => text(item).trim().slice(0, 30)).filter(Boolean))]

export const itemId = (value) => text(value).trim() || randomUUID()

export const isImage = (value) => value === '' || /^data:image\/(png|jpe?g|webp);base64,/.test(value)
