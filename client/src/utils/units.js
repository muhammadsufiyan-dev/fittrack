import { getSettings } from '../services/settingsService'

const POUNDS = 2.20462
const INCHES = 2.54

const round = (value, places = 1) => {
  const base = 10 ** places
  return Math.round(value * base) / base
}

const empty = (value) => value === null || value === undefined || value === ''

export const weightUnit = () => getSettings().units.weight
export const lengthUnit = () => getSettings().units.length

export const toWeight = (kg) => (empty(kg) || weightUnit() === 'kg' ? kg : round(kg * POUNDS))
export const fromWeight = (value) => (empty(value) || weightUnit() === 'kg' ? value : round(value / POUNDS, 2))

export const toLength = (cm) => (empty(cm) || lengthUnit() === 'cm' ? cm : round(cm / INCHES))
export const fromLength = (value) => (empty(value) || lengthUnit() === 'cm' ? value : round(value * INCHES, 2))

export const showWeight = (kg) => (empty(kg) ? '-' : `${toWeight(kg)} ${weightUnit()}`)
export const showLength = (cm) => (empty(cm) ? '-' : `${toLength(cm)} ${lengthUnit()}`)

export const toUnit = (value, unit) => (unit === 'kg' ? toWeight(value) : unit === 'cm' ? toLength(value) : value)
export const unitLabel = (unit) => (unit === 'kg' ? weightUnit() : unit === 'cm' ? lengthUnit() : unit)
