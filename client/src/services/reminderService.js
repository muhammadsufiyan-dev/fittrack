import { api } from './api'

export const getReminders = async () => {
  const { reminders } = await api.get('/reminders')
  return reminders
}

export const addReminder = async (data) => {
  const { reminder } = await api.post('/reminders', data)
  return reminder
}

export const updateReminder = async (id, data) => {
  await api.put(`/reminders/${id}`, data)
}

export const deleteReminder = async (id) => {
  await api.remove(`/reminders/${id}`)
}
