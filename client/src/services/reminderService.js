import seedReminders from '../data/reminders.json'
import { createStore } from './localStore'

const store = createStore('ft_reminders', seedReminders)

export const getReminders = async () => {
  return [...store.read()].sort((a, b) => a.time.localeCompare(b.time))
}

export const addReminder = async (data) => {
  const item = { ...data, id: Date.now().toString(), enabled: true }
  store.save([item, ...store.read()])
  return item
}

export const updateReminder = async (id, data) => {
  store.save(store.read().map((item) => (item.id === id ? { ...item, ...data } : item)))
}

export const deleteReminder = async (id) => {
  store.save(store.read().filter((item) => item.id !== id))
}
