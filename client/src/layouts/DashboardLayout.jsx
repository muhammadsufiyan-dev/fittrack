import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Sidebar from '../components/layout/Sidebar'

function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="app-backdrop" onClick={() => setOpen(false)}></div>}

      <div className="app-main">
        <AppHeader onMenu={() => setOpen(true)} />

        <main className="app-content">
          <div className="page-enter" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
