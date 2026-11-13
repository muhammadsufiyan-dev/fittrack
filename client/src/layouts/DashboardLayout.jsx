import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import UserMenu from '../components/UserMenu'

function DashboardLayout() {
  return (
    <div className="d-lg-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <header className="d-flex align-items-center justify-content-between px-3 py-2 sticky-top ft-glass">
          <button
            className="btn btn-outline-secondary d-lg-none"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
            aria-label="Open menu"
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="ms-auto">
            <UserMenu />
          </div>
        </header>
        <main className="p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout