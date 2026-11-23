import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import ResendVerification from '../../components/auth/ResendVerification'
import useAuth from '../../hooks/useAuth'

function VerifyEmail() {
  const [params] = useSearchParams()
  const { user, verify } = useAuth()
  const token = params.get('token') || ''
  const email = params.get('email') || ''
  const [error, setError] = useState('')
  const started = useRef(false)

  useEffect(() => {
    if (!token || !email || started.current) return
    started.current = true
    verify({ email, token }).catch((err) => setError(err.message))
  }, [token, email, verify])

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <AuthShell
      title="Verify email"
      subtitle="We are checking your verification link."
      footer={
        <>
          Back to <Link to="/login">Log in</Link>
        </>
      }
    >
      {!token || !email ? (
        <div className="alert alert-warning" role="alert">
          This verification link is not valid.
        </div>
      ) : error ? (
        <>
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
          <ResendVerification email={email} />
        </>
      ) : (
        <div className="d-flex align-items-center gap-2 text-secondary">
          <span className="spinner-border spinner-border-sm"></span>
          Verifying your email...
        </div>
      )}
    </AuthShell>
  )
}

export default VerifyEmail