import { useState } from 'react'
import { resendVerification } from '../../services/authService'

function ResendVerification({ email }) {
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  const handleClick = async () => {
    setState('sending')
    setError('')

    try {
      await resendVerification(email)
      setState('sent')
    } catch (err) {
      setError(err.message)
      setState('idle')
    }
  }

  return (
    <div className="mb-3">
      {state === 'sent' ? (
        <div className="alert alert-success py-2 mb-0">A new verification link has been sent. Check your inbox.</div>
      ) : (
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleClick} disabled={state === 'sending' || !email}>
          {state === 'sending' ? 'Sending...' : 'Resend verification email'}
        </button>
      )}
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}

export default ResendVerification