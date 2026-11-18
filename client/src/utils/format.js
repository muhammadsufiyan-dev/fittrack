export const formatDate = (value) => {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const todayISO = () => new Date().toLocaleDateString('en-CA')

export const shiftDate = (value, days) => {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
