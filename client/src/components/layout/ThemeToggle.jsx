import useTheme from '../../hooks/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="btn btn-outline-secondary theme-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <i key={theme} className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'}`}></i>
    </button>
  )
}

export default ThemeToggle
