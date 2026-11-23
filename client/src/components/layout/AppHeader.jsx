import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUnreadCount } from '../../services/notificationService'
import { navLinks } from '../../utils/navigation'
import AccountMenu from './AccountMenu'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'

function AppHeader({ onMenu }) {
  const [scrolled, setScrolled] = useState(false)
  const [term, setTerm] = useState('')
  const [unread, setUnread] = useState(0)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const load = () => getUnreadCount().then(setUnread)
    load()
    window.addEventListener('ft-notifications', load)
    return () => window.removeEventListener('ft-notifications', load)
  }, [pathname])

  const current = navLinks.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))

  const handleSearch = (event) => {
    event.preventDefault()
    if (!term.trim()) return
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
    setTerm('')
  }

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
      <button type="button" className="app-menu-btn" onClick={onMenu} aria-label="Open menu">
        <i className="bi bi-list"></i>
      </button>

      <div className="header-brand">
        <Brand to="/dashboard" />
      </div>

      <div className="header-title" key={pathname}>
        <span className="header-icon">
          <i className={`bi ${current ? current.icon : 'bi-grid-1x2'}`}></i>
        </span>
        <div>
          <small>FitTrack</small>
          <strong>{current ? current.label : 'Overview'}</strong>
        </div>
      </div>

      <div className="app-actions">
        <form className="header-search" onSubmit={handleSearch} role="search">
          <i className="bi bi-search"></i>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
        </form>

        <Link
          to="/notifications"
          className="btn btn-outline-secondary bell-btn"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        >
          <i className="bi bi-bell"></i>
          {unread > 0 && (
            <span className="bell-badge" key={unread}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  )
}

export default AppHeader
