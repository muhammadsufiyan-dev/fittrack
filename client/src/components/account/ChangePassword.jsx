import { useState } from 'react'
import { changePassword } from '../../services/authService'
import { passwordStrength } from '../../utils/validators'
import PasswordField from '../auth/PasswordField'

const emptyForm = { current: '', next: '', confirm: '' }
const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

function ChangePassword() {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const score = passwordStrength(form.next)

  const handleChange = (event) => {
    setDone(false)
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setDone(false)

    if (!form.current) {
      setError('Enter your current password')
      return
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.next)) {
      setError('Use at least 8 characters with a letter and a number')
      return
    }

    if (form.confirm !== form.next) {
      setError('The new passwords do not match')
      return
    }

    setLoading(true)
    try {
      await changePassword(form.current, form.next)
      setForm(emptyForm)
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <section className="ft-card sx-card">
      <h2 className="sx-title">
        <i className="bi bi-shield-lock"></i>Password
      </h2>

      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}
      {done && (
        <div className="alert alert-success py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle"></i>
          Your password has been changed.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="currentPassword"
          name="current"
          label="Current password"
          placeholder="Enter your current password"
          value={form.current}
          onChange={handleChange}
          autoComplete="current-password"
        />
        <PasswordField
          id="newPassword"
          name="next"
          label="New password"
          placeholder="Create a new password"
          value={form.next}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {form.next && (
          <div className="strength-wrap">
            <div className="strength">
              {[1, 2, 3, 4].map((step) => (
                <span key={step} className={step <= score ? `s${score}` : ''}></span>
              ))}
            </div>
            <small className="text-secondary">{strengthLabels[score]}</small>
          </div>
        )}
        <PasswordField
          id="confirmPassword"
          name="confirm"
          label="Confirm new password"
          placeholder="Repeat the new password"
          value={form.confirm}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Change password'}
        </button>
      </form>
    </section>
  )
}

export default ChangePassword