import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import PasswordField from '../../components/auth/PasswordField'
import { resetPassword } from '../../services/authService'
import { passwordStrength } from '../../utils/validators'

const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const email = params.get('email') || ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const score = passwordStrength(form.password)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) {
      setError('Use at least 8 characters with a letter and a number')
      return
    }

    if (form.confirm !== form.password) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await resetPassword({ email, token, password: form.password })
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <AuthShell
      title="Set new password"
      subtitle="Choose a new password for your account."
      footer={
        <>
          Back to <Link to="/login">Log in</Link>
        </>
      }
    >
      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      {!token || !email ? (
        <div className="alert alert-warning" role="alert">
          This reset link is not valid. <Link to="/forgot-password">Ask for a new one</Link>
        </div>
      ) : done ? (
        <>
          <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-check-circle"></i>
            Your password has been changed.
          </div>
          <Link to="/login" className="btn btn-primary btn-lg w-100">
            Log in
          </Link>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <PasswordField
            id="password"
            name="password"
            label="New password"
            placeholder="Create a new password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {form.password && (
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
            id="confirm"
            name="confirm"
            label="Confirm new password"
            placeholder="Repeat the new password"
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>
            {loading ? 'Saving...' : 'Change password'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

export default ResetPassword