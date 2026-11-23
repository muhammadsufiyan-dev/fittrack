import { api } from './api'

export const getEntries = async () => {
  const { entries } = await api.get('/progress')
  return entries
}

export const addEntry = async (data) => {
  const { entry } = await api.post('/progress', data)
  return entry
}

export const updateEntry = async (id, data) => {
  const { entry } = await api.put(`/progress/${id}`, data)
  return entry
}

export const deleteEntry = async (id) => {
  await api.remove(`/progress/${id}`)
}
