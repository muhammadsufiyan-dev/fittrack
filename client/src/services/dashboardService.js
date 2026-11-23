import { formatDate, shiftDate, todayISO } from '../utils/format'
import { formatTime, getNext } from '../utils/reminders'
import { toWeight, weightUnit } from '../utils/units'
import { api } from './api'
import { getReminders } from './reminderService'

const formatChange = (value) => (value === null ? '' : `${value > 0 ? '+' : ''}${Math.round(toWeight(value) * 10) / 10} ${weightUnit()}`)

const formatPercent = (value) => (value === null ? '' : `${value > 0 ? '+' : ''}${value}%`)

const getDayLabel = (date) => {
  const today = todayISO()
  if (date === today) return 'Today'
  if (date === shiftDate(today, -1)) return 'Yesterday'
  return formatDate(date)
}

const upcoming = (list) =>
  list
    .map((item) => ({ item, next: getNext([item]) }))
    .filter((entry) => entry.next)
    .sort((a, b) => a.next.distance - b.next.distance)
    .slice(0, 3)
    .map(({ item, next }) => ({ id: item.id, title: item.title, time: `${next.label}, ${formatTime(item.time)}` }))

export const getDashboard = async () => {
  const data = await api.get('/dashboard')
  const reminders = await getReminders()
  const { stats } = data

  return {
    ...data,
    stats: {
      ...stats,
      caloriesBurnedChange: formatPercent(stats.caloriesBurnedChange),
      weight: stats.weight === null ? '-' : toWeight(stats.weight),
      weightChange: formatChange(stats.weightChange),
    },
    reminders: upcoming(reminders),
    recent: data.recent.map((item) => ({ ...item, date: getDayLabel(item.date) })),
  }
}
