import { api } from './api'

export const searchAll = async (term) => {
  const query = term.trim()
  if (!query) return { workouts: [], meals: [], goals: [], members: [] }
  return api.get('/search', { q: query })
}
