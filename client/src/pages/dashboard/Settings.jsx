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

const themes = [
  { value: 'light', label: 'Light', icon: 'bi-sun' },
  { value: 'dark', label: 'Dark', icon: 'bi-moon-stars' },
]

const unitRows = [
  { key: 'weight', label: 'Weight', text: 'Workouts and body weight', choices: [['kg', 'kg'], ['lb', 'lb']] },
  { key: 'length', label: 'Body measurements', text: 'Chest, waist, hips and more', choices: [['cm', 'cm'], ['in', 'in']] },
]

function Switch({ checked, onChange, label }) {
  return (
    <div className="form-check form-switch m-0">
      <input className="form-check-input" type="checkbox" role="switch" checked={checked} onChange={onChange} aria-label={label} />
    </div>
  )
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="seg">
      {options.map((item) => (
        <button key={item.value} type="button" className={`seg-btn ${value === item.value ? 'active' : ''}`} onClick={() => onChange(item.value)}>
          {item.icon && <i className={`bi ${item.icon}`}></i>}
          {item.label}
        </button>
      ))}
    </div>
  )
}

function Settings() {
  const { theme, setTheme } = useTheme()
  const { user, updateProfile, logout } = useAuth()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [settings, setSettings] = useState(getSettings)

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

  return (
    <>
      <PageHeader title="Settings" subtitle="Make FitTrack work the way you like." />

      <div className="ft-card sx-top">
        <Avatar user={user} className="avatar member-avatar big" />
        <div>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
        <Link to="/profile" className="btn btn-outline-secondary">
          <i className="bi bi-pencil me-1"></i>Edit profile
        </Link>
      </div>

      <div className="sx-grid">
        <div className="sx-col">
          <section className="ft-card sx-card">
            <h2 className="sx-title">
              <i className="bi bi-palette"></i>Appearance
            </h2>
            <div className="sx-row">
              <div>
                <strong>Theme</strong>
                <small>Pick a light or dark look</small>
              </div>
              <Segmented value={theme} options={themes} onChange={setTheme} />
            </div>
          </section>

          <section className="ft-card sx-card">
            <h2 className="sx-title">
              <i className="bi bi-rulers"></i>Units
            </h2>
            {unitRows.map((row) => (
              <div className="sx-row" key={row.key}>
                <div>
                  <strong>{row.label}</strong>
                  <small>{row.text}</small>
                </div>
                <Segmented
                  value={settings.units[row.key]}
                  options={row.choices.map(([value, label]) => ({ value, label }))}
                  onChange={(value) => setUnit(row.key, value)}
                />
              </div>
            ))}
            <p className="sx-note">Your saved data does not change. Only how it is shown and entered.</p>
          </section>

          <section className="ft-card sx-card">
            <h2 className="sx-title">
              <i className="bi bi-shield-lock"></i>Privacy
            </h2>
            <div className="sx-row">
              <div>
                <strong>Let others find me</strong>
                <small>Members can see your name, city and bio</small>
              </div>
              <Switch
                checked={user.discoverable !== false}
                onChange={() => updateProfile({ discoverable: user.discoverable === false })}
                label="Let others find me"
              />
            </div>
            <p className="sx-note">Your workouts, meals and progress are always private.</p>
          </section>
        </div>

        <div className="sx-col">
          <section className="ft-card sx-card">
            <h2 className="sx-title">
              <i className="bi bi-bell"></i>Notifications
            </h2>
            {notifyTypes.map((item) => (
              <div className="sx-row" key={item.key}>
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
          </section>

          <section className="ft-card sx-card">
            <h2 className="sx-title">
              <i className="bi bi-database"></i>Your data
            </h2>
            <div className="sx-row">
              <div>
                <strong>Download my data</strong>
                <small>Everything you logged, in one file</small>
              </div>
              <button type="button" className="btn btn-outline-secondary" onClick={() => exportData(user)}>
                <i className="bi bi-download me-1"></i>Download
              </button>
            </div>
          </section>
        </div>
      </div>

      <section className="ft-card sx-card sx-danger">
        <h2 className="sx-title">
          <i className="bi bi-exclamation-triangle"></i>Danger zone
        </h2>
        <div className="sx-row">
          <div>
            <strong>Clear my data</strong>
            <small>Removes workouts, meals, progress, goals and reminders</small>
          </div>
          <button type="button" className="btn btn-outline-danger" onClick={handleClear}>
            Clear data
          </button>
        </div>
        <div className="sx-row">
          <div>
            <strong>Delete account</strong>
            <small>Permanently removes your account and data</small>
          </div>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete account
          </button>
        </div>
      </section>
    </>
  )
}

export default Settings
