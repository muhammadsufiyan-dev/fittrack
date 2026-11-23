import { api } from './api'

export const getWorkouts = async () => {
  const { workouts } = await api.get('/workouts')
  return workouts
}

export const getWorkout = async (id) => {
  try {
    const { workout } = await api.get(`/workouts/${id}`)
    return workout
  } catch (error) {
    if (error.status === 404 || error.status === 400) return null
    throw error
  }
}

export const addWorkout = async (data) => {
  const { workout } = await api.post('/workouts', data)
  return workout
}

export const updateWorkout = async (id, data) => {
  const { workout } = await api.put(`/workouts/${id}`, data)
  return workout
}

export const deleteWorkout = async (id) => {
  await api.remove(`/workouts/${id}`)
}
