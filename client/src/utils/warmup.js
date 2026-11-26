const base = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '')

if (base) {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = base
  link.crossOrigin = ''
  document.head.appendChild(link)

  fetch(base + '/api/health').catch(() => {})
}