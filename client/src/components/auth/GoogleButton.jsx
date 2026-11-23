import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const scriptSrc = 'https://accounts.google.com/gsi/client'

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve()

    const found = document.querySelector('script[src="' + scriptSrc + '"]')
    const script = found || document.createElement('script')
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)

    if (!found) {
      script.src = scriptSrc
      script.async = true
      document.head.appendChild(script)
    }
  })

function GoogleButton() {
  const { google } = useAuth()
  const latest = useRef(google)
  const wrap = useRef(null)
  const box = useRef(null)
  const [error, setError] = useState('')

  latest.current = google

  useEffect(() => {
    if (!clientId) return

    let active = true

    loadScript()
      .then(() => {
        if (!active || !box.current) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            setError('')
            try {
              await latest.current(credential)
            } catch (err) {
              setError(err.message)
            }
          },
        })

        window.google.accounts.id.renderButton(box.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: Math.min(400, wrap.current.offsetWidth || 320),
        })
      })
      .catch(() => setError('Could not load Google sign-in'))

    return () => {
      active = false
    }
  }, [])

  if (!clientId) return null

  return (
    <div>
      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="google-wrap" ref={wrap}>
        <div className="google-face">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Continue with Google</span>
        </div>
        <div ref={box} className="google-hit"></div>
      </div>

      <p className="small text-secondary mt-3 mb-0">
        By continuing with Google you agree to the <Link to="/privacy">privacy policy</Link>.
      </p>
    </div>
  )
}

export default GoogleButton