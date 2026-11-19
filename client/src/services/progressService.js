import seedEntries from '../data/progress.json'
import { createStore } from './localStore'

const store = createStore('ft_progress', seedEntries)

export const getEntries = async () => {
  return [...store.read()].sort((a, b) => b.date.localeCompare(a.date))
}

export const addEntry = async (data) => {
  const item = { ...data, id: Date.now().toString() }
  store.save([item, ...store.read()])
  return item
}

export const updateEntry = async (id, data) => {
  const list = store.read().map((item) => (item.id === id ? { ...item, ...data } : item))
  store.save(list)
  return list.find((item) => item.id === id)
}

export const deleteEntry = async (id) => {
  store.save(store.read().filter((item) => item.id !== id))
}
