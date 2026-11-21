import { storage } from '../utils/storage'

const dataKeys = {
  workouts: 'ft_workouts',
  nutrition: 'ft_nutrition',
  progress: 'ft_progress',
  goals: 'ft_goals',
  reminders: 'ft_reminders',
  support: 'ft_support',
}

const allKeys = [...Object.values(dataKeys), 'ft_notifications', 'ft_notifications_hidden', 'ft_settings']

const readKey = (key) => {
  try {
    return JSON.parse(storage.get(key)) || []
  } catch {
    return []
  }
}

export const exportData = (user) => {
  const data = { exportedAt: new Date().toISOString(), profile: user }
  Object.entries(dataKeys).forEach(([name, key]) => {
    data[name] = readKey(key)
  })

  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'fittrack-my-data.json'
  link.click()
  URL.revokeObjectURL(url)
}

export const clearData = () => {
  allKeys.forEach((key) => storage.remove(key))
}
