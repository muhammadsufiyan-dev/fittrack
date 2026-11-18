import seedLogs from '../data/nutrition.json'
import { createStore } from './localStore'

const store = createStore('ft_nutrition', seedLogs)

export const getLogsByDate = async (date) => {
  return store.read().filter((item) => item.date === date)
}

export const addLog = async (data) => {
  const item = { ...data, id: Date.now().toString() }
  store.save([...store.read(), item])
  return item
}

export const updateLog = async (id, data) => {
  store.save(store.read().map((item) => (item.id === id ? { ...item, ...data } : item)))
}

export const deleteLog = async (id) => {
  store.save(store.read().filter((item) => item.id !== id))
}
