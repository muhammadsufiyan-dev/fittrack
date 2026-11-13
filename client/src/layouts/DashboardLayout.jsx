import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import UserMenu from '../components/UserMenu'

function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="app-backdrop" onClick={() => setOpen(false)}></div>}

      <div className="app-main">
        <header className="app-header">
          <button type="button" className="app-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <i className="bi bi-list"></i>
          </button>
          <div className="app-actions">
            <UserMenu />
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout