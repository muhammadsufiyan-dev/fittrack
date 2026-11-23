import { storage } from '../utils/storage'
import { api } from './api'

const KEY = 'ft_settings'

export const notifyTypes = [
  { key: 'workout', label: 'Workouts', text: 'Workouts you complete and reminders when you have not trained for a few days', icon: 'bi-lightning-charge' },
  { key: 'meal', label: 'Meals', text: 'A nudge when no meals are logged today', icon: 'bi-egg-fried' },
  { key: 'progress', label: 'Progress', text: 'When it is time for a new weigh-in', icon: 'bi-graph-up-arrow' },
  { key: 'goal', label: 'Goals', text: 'Goals you achieve, are close to, or that are due', icon: 'bi-bullseye' },
  { key: 'reminder', label: 'Reminders', text: 'Your own workout and meal reminders', icon: 'bi-alarm' },
  { key: 'community', label: 'Community', text: 'New followers and replies to your forum posts', icon: 'bi-people' },
]

const defaults = {
  notify: { workout: true, meal: true, progress: true, goal: true, reminder: true, community: true },
  units: { weight: 'kg', length: 'cm' },
}

export const getSettings = () => {
  try {
    const saved = JSON.parse(storage.get(KEY)) || {}
    return {
      ...defaults,
      ...saved,
      notify: { ...defaults.notify, ...saved.notify },
      units: { ...defaults.units, ...saved.units },
    }
  } catch {
    return defaults
  }
}

export const loadSettings = async () => {
  const { settings } = await api.get('/settings')
  storage.set(KEY, JSON.stringify({ notify: settings.notify, units: settings.units }))
  window.dispatchEvent(new Event('ft-notifications'))
}

export const saveSettings = (settings) => {
  storage.set(KEY, JSON.stringify(settings))
  window.dispatchEvent(new Event('ft-notifications'))
  api.put('/settings', { notify: settings.notify, units: settings.units }).catch(() => {})
}
