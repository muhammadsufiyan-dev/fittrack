import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useConfirm from '../../hooks/useConfirm'
import { formatDate } from '../../utils/format'

const links = [
  { to: '/profile', label: 'View profile', icon: 'bi-person' },
  { to: '/settings', label: 'Settings', icon: 'bi-gear' },
  { to: '/help', label: 'Help and FAQ', icon: 'bi-question-circle' },
]

function AccountMenu() {
  const { user, logout } = useAuth()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (!open) return

    const onClick = (event) => {
      if (!box.current.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    const ok = await confirm({
      title: 'Log out?',
      message: 'You will need to sign in again to see your data.',
      confirmText: 'Log out',
      icon: 'bi-box-arrow-right',
    })

    if (ok) {
      logout()
      navigate('/')
    }
  }

  const initial = user.name.charAt(0).toUpperCase()

  return (
    <div className="account" ref={box}>
      <button
        type="button"
        className={`account-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="avatar avatar-online">{initial}</span>
        <span className="account-info">
          <strong>{user.name.split(' ')[0]}</strong>
          <small>Member</small>
        </span>
        <i className="bi bi-chevron-down account-chevron"></i>
      </button>

      {open && (
        <div className="account-card" role="menu">
          <div className="account-cover"></div>
          <div className="account-body">
            <span className="account-avatar">{initial}</span>
            <h2 className="account-name">{user.name}</h2>
            <div className="account-email">{user.email}</div>
            <span className="account-since">
              <i className="bi bi-calendar-check"></i>
              Member since {formatDate(user.createdAt)}
            </span>
          </div>

          <div className="account-links">
            {links.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="account-link"
                style={{ '--i': index }}
                onClick={() => setOpen(false)}
                role="menuitem"
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
                <i className="bi bi-chevron-right account-arrow"></i>
              </Link>
            ))}

            <button
              type="button"
              className="account-link account-logout"
              style={{ '--i': links.length }}
              onClick={handleLogout}
              role="menuitem"
            >
              <i className="bi bi-box-arrow-right"></i>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountMenu
