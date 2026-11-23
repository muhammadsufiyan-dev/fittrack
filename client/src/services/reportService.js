import { api } from './api'

export const getReport = async (days) => {
  const { report } = await api.get('/reports', { days })
  return report
}
