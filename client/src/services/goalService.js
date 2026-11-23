import { api } from './api'
import { getEntries } from './progressService'

export const getLatestWeight = async () => {
  const entries = await getEntries()
  return entries.length > 0 ? entries[0].weight : null
}

export const getGoals = async () => {
  const { goals } = await api.get('/goals')
  return goals
}

export const addGoal = async (data) => {
  const { goal } = await api.post('/goals', data)
  return goal
}

export const updateGoal = async (id, data) => {
  await api.put(`/goals/${id}`, data)
}

export const deleteGoal = async (id) => {
  await api.remove(`/goals/${id}`)
}
