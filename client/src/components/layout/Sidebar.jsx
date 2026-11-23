import { NavLink } from 'react-router-dom'
import { navGroups } from '../../utils/navigation'
import Brand from './Brand'

function Sidebar({ open, onClose }) {
  let position = 0

  return (
    <aside className={`app-sidebar ${open ? 'open' : ''}`}>
      <div className="app-sidebar-head">
        <Brand to="/dashboard" />
        <button type="button" className="app-close" onClick={onClose} aria-label="Close menu">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <nav aria-label="Main navigation">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="side-group">{group.title}</div>
            {group.links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{ '--i': position++ }}
                className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
