import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import useAuth from '../hooks/useAuth'

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <ThemeToggle />
      <div className="dropdown">
        <button type="button" className="user-btn" data-bs-toggle="dropdown" aria-expanded="false">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <span className="d-none d-sm-inline fw-semibold">{user.name.split(' ')[0]}</span>
          <i className="bi bi-chevron-down small"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow">
          <li>
            <Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserMenu