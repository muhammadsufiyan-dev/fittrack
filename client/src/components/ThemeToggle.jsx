import useTheme from '../hooks/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="btn btn-outline-secondary" onClick={toggleTheme} aria-label="Toggle theme">
      <i className={theme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun'}></i>
    </button>
  )
}

export default ThemeToggle