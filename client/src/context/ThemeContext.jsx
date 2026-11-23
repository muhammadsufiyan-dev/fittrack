import { createContext, useEffect, useState } from 'react'
import { storage } from '../utils/storage'

export const ThemeContext = createContext(null)

const getStartTheme = () => {
  const saved = storage.get('ft_theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStartTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    storage.set('ft_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}
