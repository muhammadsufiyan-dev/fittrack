import { api } from './api'

export const getLogsByDate = async (date) => {
  const { logs } = await api.get('/nutrition', { date })
  return logs
}

export const addLog = async (data) => {
  const { log } = await api.post('/nutrition', data)
  return log
}

export const updateLog = async (id, data) => {
  await api.put(`/nutrition/${id}`, data)
}

export const deleteLog = async (id) => {
  await api.remove(`/nutrition/${id}`)
}

export const getAllLogs = async () => {
  const { logs } = await api.get('/nutrition')
  return logs
}
