import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import FormField from '../../components/auth/FormField'
import PasswordField from '../../components/auth/PasswordField'
import GoogleButton from '../../components/auth/GoogleButton'
import ResendVerification from '../../components/auth/ResendVerification'
import PhotoPicker from '../../components/profile/PhotoPicker'
import useAuth from '../../hooks/useAuth'
import { passwordStrength, validateRegister } from '../../utils/validators'

const emptyForm = { name: '', email: '', password: '', confirm: '', consent: false, photo: '' }
const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

function Register() {
  const { user, register } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState('')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const score = passwordStrength(form.password)

  if (sentTo) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="One last step to activate your account."
        footer={
          <>
            Wrong email?{' '}
            <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => setSentTo('')}>
              Go back
            </button>
          </>
        }
      >
        <div className="alert alert-success d-flex align-items-start gap-2" role="alert">
          <i className="bi bi-envelope-check mt-1"></i>
          <div>
            We sent a verification link to <strong>{sentTo}</strong>. Open it to activate your account. The link works for 24 hours. Check your spam folder too.
          </div>
        </div>
        <ResendVerification email={sentTo} />
      </AuthShell>
    )
  }

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
      await register({ name: form.name, email: form.email, password: form.password, photo: form.photo })
      setSentTo(form.email)
      setLoading(false)
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
          <input
            id="consent"
            name="consent"
            type="checkbox"
            className="form-check-input"
            checked={form.consent}
            onChange={handleChange}
          />
          <label htmlFor="consent" className="form-check-label">
            I agree to the <Link to="/privacy">privacy policy</Link>
          </label>
          {errors.consent && <div className="field-error">{errors.consent}</div>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="auth-divider">or</div>

      <GoogleButton />
    </AuthShell>
  )
}

export default Register



