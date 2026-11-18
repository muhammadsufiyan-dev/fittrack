import PageHeader from '../../components/ui/PageHeader'
import useTheme from '../../hooks/useTheme'

const options = [
  { value: 'light', label: 'Light', icon: 'bi-sun' },
  { value: 'dark', label: 'Dark', icon: 'bi-moon-stars' },
]

function Settings() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <PageHeader title="Settings" subtitle="Choose how FitTrack looks for you." />

      <div className="ft-card p-3 p-md-4">
        <h2 className="panel-title">Theme</h2>
        <div className="theme-options">
          {options.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`theme-option ${theme === item.value ? 'active' : ''}`}
              onClick={() => setTheme(item.value)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default Settings
