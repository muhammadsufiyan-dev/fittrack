import { storage } from '../utils/storage'
import { api } from './api'

const localKeys = ['ft_notifications', 'ft_notifications_hidden', 'ft_settings']

export const exportData = async () => {
  const data = await api.get('/data/export')
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'fittrack-my-data.json'
  link.click()
  URL.revokeObjectURL(url)
}

export const clearData = async () => {
  await api.remove('/data')
  localKeys.forEach((key) => storage.remove(key))
}
