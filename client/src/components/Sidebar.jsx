import { NavLink } from 'react-router-dom'
import Brand from './Brand'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/workouts', label: 'Workouts', icon: 'bi-lightning-charge' },
  { to: '/nutrition', label: 'Nutrition', icon: 'bi-egg-fried' },
  { to: '/progress', label: 'Progress', icon: 'bi-graph-up-arrow' },
  { to: '/goals', label: 'Goals', icon: 'bi-bullseye' },
  { to: '/analytics', label: 'Analytics', icon: 'bi-bar-chart-line' },
  { to: '/reminders', label: 'Reminders', icon: 'bi-alarm' },
  { to: '/notifications', label: 'Notifications', icon: 'bi-bell' },
  { to: '/reports', label: 'Reports', icon: 'bi-file-earmark-arrow-down' },
  { to: '/search', label: 'Search', icon: 'bi-search' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' },
  { to: '/settings', label: 'Settings', icon: 'bi-gear' },
  { to: '/support', label: 'Support', icon: 'bi-headset' },
  { to: '/help', label: 'Help', icon: 'bi-question-circle' },
]

function Sidebar() {
  return (
    <aside className="offcanvas-lg offcanvas-start sidebar" tabIndex="-1" id="sidebar">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          data-bs-target="#sidebar"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body d-flex flex-column p-3">
        <div className="mb-4">
          <Brand to="/dashboard" />
        </div>
        <nav className="nav nav-pills flex-column gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="nav-link d-flex align-items-center gap-2"
              data-bs-dismiss="offcanvas"
              data-bs-target="#sidebar"
            >
              <i className={`bi ${link.icon}`}></i>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar