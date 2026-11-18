import seedWorkouts from '../data/workouts.json'
import { createStore } from './localStore'

const store = createStore('ft_workouts', seedWorkouts)

export const getWorkouts = async () => {
  return [...store.read()].sort((a, b) => b.date.localeCompare(a.date))
}

export const getWorkout = async (id) => {
  return store.read().find((item) => item.id === id) || null
}

export const addWorkout = async (data) => {
  const item = { ...data, id: Date.now().toString() }
  store.save([item, ...store.read()])
  return item
}

export const updateWorkout = async (id, data) => {
  const list = store.read().map((item) => (item.id === id ? { ...item, ...data } : item))
  store.save(list)
  return list.find((item) => item.id === id)
}

export const deleteWorkout = async (id) => {
  store.save(store.read().filter((item) => item.id !== id))
}
