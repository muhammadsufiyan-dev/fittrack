import { api } from './api'

export const getAnalytics = (days) => api.get('/analytics', { days })
