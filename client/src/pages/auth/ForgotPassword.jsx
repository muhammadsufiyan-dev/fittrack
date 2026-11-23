import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import FormField from '../../components/auth/FormField'
import { forgotPassword } from '../../services/authService'
import { isEmail } from '../../utils/validators'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isEmail(email)) {
      setError('Enter a valid email address')
      return
    }

    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we will send you a link to set a new password."
      footer={
        <>
          Remembered it? <Link to="/login">Log in</Link>
        </>
      }
    >
      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      {sent ? (
        <div className="alert alert-success d-flex align-items-start gap-2" role="alert">
          <i className="bi bi-check-circle mt-1"></i>
          <div>
            If an account exists for <strong>{email}</strong>, a reset link is on its way. It works for 30 minutes. Check your spam folder too.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="email"
            name="email"
            label="Email"
            icon="bi-envelope"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

export default ForgotPassword