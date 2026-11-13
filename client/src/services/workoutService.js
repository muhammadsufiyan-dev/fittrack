import seedWorkouts from '../data/workouts.json'

const KEY = 'ft_workouts'

const read = () => {
  const saved = localStorage.getItem(KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(KEY, JSON.stringify(seedWorkouts))
  return seedWorkouts
}

const save = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const getWorkouts = async () => {
  return [...read()].sort((a, b) => b.date.localeCompare(a.date))
}

export const getWorkout = async (id) => {
  return read().find((item) => item.id === id) || null
}

export const addWorkout = async (data) => {
  const item = { ...data, id: Date.now().toString() }
  save([item, ...read()])
  return item
}

export const updateWorkout = async (id, data) => {
  const list = read().map((item) => (item.id === id ? { ...item, ...data } : item))
  save(list)
  return list.find((item) => item.id === id)
}

export const deleteWorkout = async (id) => {
  save(read().filter((item) => item.id !== id))
}