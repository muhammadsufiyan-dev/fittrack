export const ago = (iso) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h ago`
  return `${Math.floor(minutes / 1440)} d ago`
}
