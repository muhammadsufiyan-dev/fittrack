import seedLogs from '../data/nutrition.json'

const KEY = 'ft_nutrition'

const read = () => {
  const saved = localStorage.getItem(KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(KEY, JSON.stringify(seedLogs))
  return seedLogs
}

const save = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const getLogsByDate = async (date) => {
  return read().filter((item) => item.date === date)
}

export const addLog = async (data) => {
  const item = { ...data, id: Date.now().toString() }
  save([...read(), item])
  return item
}

export const updateLog = async (id, data) => {
  save(read().map((item) => (item.id === id ? { ...item, ...data } : item)))
}

export const deleteLog = async (id) => {
  save(read().filter((item) => item.id !== id))
}