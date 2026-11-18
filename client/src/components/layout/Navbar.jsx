import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useGoTo from '../../hooks/useGoTo'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'Features', id: 'features' },
  { label: 'How it works', id: 'how' },
  { label: 'FAQ', id: 'faq' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const goTo = useGoTo()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    const menu = document.getElementById('navMenu')
    if (menu) menu.classList.remove('show')
  }

  const handleLink = (id) => {
    closeMenu()
    goTo(id)
  }

  return (
    <header className={`nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <nav className="container site-nav navbar navbar-expand-md">
        <Brand />

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto gap-md-1">
            {links.map((item) => (
              <li className="nav-item" key={item.id}>
                <button type="button" className="nav-link-btn" onClick={() => handleLink(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
            <li className="nav-item">
              <NavLink to="/privacy" className="nav-link-btn" onClick={closeMenu}>
                Privacy
              </NavLink>
            </li>
          </ul>

          <div className="nav-actions d-flex align-items-center gap-2 mt-3 mt-md-0">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" onClick={closeMenu}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary" onClick={closeMenu}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
