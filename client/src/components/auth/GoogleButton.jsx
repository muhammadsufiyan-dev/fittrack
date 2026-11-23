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
          shape: 'pill',
          width: Math.min(400, box.current.offsetWidth || 320),
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
      <div ref={box} className="d-flex"></div>
      <p className="small text-secondary mt-3 mb-0">
        By continuing with Google you agree to the <Link to="/privacy">privacy policy</Link>.
      </p>
    </div>
  )
}

export default GoogleButton