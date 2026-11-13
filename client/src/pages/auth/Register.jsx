import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import FormField from '../../components/FormField'
import PasswordField from '../../components/PasswordField'
import useAuth from '../../hooks/useAuth'
import { passwordStrength, validateRegister } from '../../utils/validators'

const emptyForm = { name: '', email: '', password: '', confirm: '', consent: false }
const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

function Register() {
  const { user, register } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const score = passwordStrength(form.password)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    const found = validateRegister(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
    } catch (err) {
      setServerError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking in under a minute."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      {serverError && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="name"
          name="name"
          label="Full name"
          icon="bi-person"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />
        <FormField
          id="email"
          name="email"
          label="Email"
          icon="bi-envelope"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
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
          label="Confirm password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <div className="form-check mb-4">
          <input id="consent" name="consent" type="checkbox" className="form-check-input" checked={form.consent} onChange={handleChange} />
          <label htmlFor="consent" className="form-check-label">
            I agree to the <Link to="/privacy">privacy policy</Link>
          </label>
          {errors.consent && <div className="field-error">{errors.consent}</div>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}

export default Register