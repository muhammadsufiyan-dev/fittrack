import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar'
import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import useConfirm from '../../hooks/useConfirm'
import useTheme from '../../hooks/useTheme'
import { removeUser } from '../../services/authService'
import { clearData, exportData } from '../../services/dataService'
import { getSettings, notifyTypes, saveSettings } from '../../services/settingsService'

const sections = [
  { key: 'appearance', label: 'Appearance', icon: 'bi-palette', text: 'Choose a light or dark look.' },
  { key: 'units', label: 'Units', icon: 'bi-rulers', text: 'How weight and measurements are shown.' },
  { key: 'notifications', label: 'Alerts', icon: 'bi-bell', text: 'Pick the notifications you want to get.' },
  { key: 'privacy', label: 'Privacy', icon: 'bi-shield-lock', text: 'Control who can find you.' },
  { key: 'data', label: 'Data', icon: 'bi-database', text: 'Download or delete your information.' },
]

const themes = [
  { value: 'light', label: 'Light', icon: 'bi-sun', text: 'Bright and clear' },
  { value: 'dark', label: 'Dark', icon: 'bi-moon-stars', text: 'Easy on the eyes' },
]

const unitGroups = [
  { key: 'weight', label: 'Weight', icon: 'bi-speedometer2', choices: [['kg', 'Kilograms (kg)'], ['lb', 'Pounds (lb)']] },
  { key: 'length', label: 'Body measurements', icon: 'bi-rulers', choices: [['cm', 'Centimetres (cm)'], ['in', 'Inches (in)']] },
]

function Switch({ checked, onChange, label }) {
  return (
    <div className="form-check form-switch">
      <input className="form-check-input" type="checkbox" role="switch" checked={checked} onChange={onChange} aria-label={label} />
    </div>
  )
}

function Settings() {
  const { theme, setTheme } = useTheme()
  const { user, updateProfile, logout } = useAuth()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [settings, setSettings] = useState(getSettings)
  const [section, setSection] = useState('appearance')

  const update = (next) => {
    setSettings(next)
    saveSettings(next)
  }

  const setUnit = (key, value) => update({ ...settings, units: { ...settings.units, [key]: value } })
  const toggleNotify = (key) => update({ ...settings, notify: { ...settings.notify, [key]: !settings.notify[key] } })

  const handleClear = async () => {
    const ok = await confirm({
      title: 'Clear all your data?',
      message: 'Workouts, meals, progress, goals and reminders will be removed. Your account stays.',
      confirmText: 'Clear data',
      icon: 'bi-eraser',
    })
    if (ok) {
      clearData()
      window.location.reload()
    }
  }

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete your account?',
      message: 'Your account and all your data will be removed. This cannot be undone.',
      confirmText: 'Delete account',
      icon: 'bi-trash3',
    })
    if (ok) {
      removeUser(user.id)
      clearData()
      logout()
      navigate('/')
    }
  }

  const current = sections.find((item) => item.key === section)

  return (
    <>
      <PageHeader title="Settings" subtitle="Make FitTrack work the way you like." />

      <div className="set-layout">
        <aside className="set-side">
          <Link to="/profile" className="ft-card set-user">
            <Avatar user={user} className="avatar member-avatar big" />
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </Link>

          <nav className="set-nav" aria-label="Settings sections">
            {sections.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`set-link ${section === item.key ? 'active' : ''}`}
                onClick={() => setSection(item.key)}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="ft-card set-panel" key={section}>
          <div className="set-head">
            <span className="set-head-icon">
              <i className={`bi ${current.icon}`}></i>
            </span>
            <div>
              <h2 className="set-title">{current.label}</h2>
              <p className="set-text">{current.text}</p>
            </div>
          </div>

          {section === 'appearance' && (
            <div className="theme-cards">
              {themes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`theme-card theme-${item.value} ${theme === item.value ? 'active' : ''}`}
                  onClick={() => setTheme(item.value)}
                >
                  <span className="theme-preview">
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                  <span className="theme-meta">
                    <i className={`bi ${item.icon}`}></i>
                    <strong>{item.label}</strong>
                    <small>{item.text}</small>
                  </span>
                  {theme === item.value && <i className="bi bi-check-circle-fill theme-check"></i>}
                </button>
              ))}
            </div>
          )}

          {section === 'units' && (
            <>
              {unitGroups.map((group) => (
                <div className="unit-block" key={group.key}>
                  <div className="unit-label">
                    <i className={`bi ${group.icon}`}></i>
                    {group.label}
                  </div>
                  <div className="chip-row">
                    {group.choices.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={`chip-btn ${settings.units[group.key] === value ? 'active' : ''}`}
                        onClick={() => setUnit(group.key, value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-secondary small mb-0">Your saved data does not change. Only how it is shown and entered.</p>
            </>
          )}

          {section === 'notifications' &&
            notifyTypes.map((item) => (
              <div className="setting-row" key={item.key}>
                <span className="ft-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.text}</small>
                </div>
                <Switch checked={settings.notify[item.key]} onChange={() => toggleNotify(item.key)} label={item.label} />
              </div>
            ))}

          {section === 'privacy' && (
            <>
              <div className="setting-row">
                <span className="ft-icon">
                  <i className="bi bi-people"></i>
                </span>
                <div>
                  <strong>Let others find me</strong>
                  <small>Other members can see your name, city and bio in search.</small>
                </div>
                <Switch
                  checked={user.discoverable !== false}
                  onChange={() => updateProfile({ discoverable: user.discoverable === false })}
                  label="Let others find me"
                />
              </div>
              <p className="text-secondary small mt-3 mb-0">
                Your workouts, meals and progress are always private. Only you can see them.
              </p>
            </>
          )}

          {section === 'data' && (
            <>
              <div className="setting-row">
                <span className="ft-icon">
                  <i className="bi bi-download"></i>
                </span>
                <div>
                  <strong>Download my data</strong>
                  <small>Get everything you logged in one file.</small>
                </div>
                <button type="button" className="btn btn-outline-secondary" onClick={() => exportData(user)}>
                  Download
                </button>
              </div>

              <div className="danger-zone">
                <h3>Danger zone</h3>
                <div className="setting-row">
                  <div>
                    <strong>Clear my data</strong>
                    <small>Removes workouts, meals, progress, goals and reminders.</small>
                  </div>
                  <button type="button" className="btn btn-outline-danger" onClick={handleClear}>
                    Clear
                  </button>
                </div>
                <div className="setting-row">
                  <div>
                    <strong>Delete account</strong>
                    <small>Permanently removes your account and data.</small>
                  </div>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}

export default Settings
