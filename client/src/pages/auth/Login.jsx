import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthShell from '../../components/AuthShell'
import FormField from '../../components/FormField'
import PasswordField from '../../components/PasswordField'
import useAuth from '../../hooks/useAuth'
import { isEmail } from '../../utils/validators'

const demoAccount = { email: 'demo@fittrack.com', password: 'Demo@123' }

function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isEmail(form.email) || !form.password) {
      setError('Enter your email and password')
      return
    }

    setLoading(true)
    try {
      await login(form)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your training."
      footer={
        <>
          New to FitTrack? <Link to="/register">Create an account</Link>
        </>
      }
    >
      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          name="email"
          label="Email"
          icon="bi-envelope"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="auth-divider">or</div>

      <div className="text-center">
        <button type="button" className="demo-chip" onClick={() => setForm(demoAccount)}>
          <i className="bi bi-magic"></i>Use demo account
        </button>
      </div>
    </AuthShell>
  )
}

export default Login