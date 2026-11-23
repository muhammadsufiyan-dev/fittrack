import { useLocation } from 'react-router-dom'
import { navLinks } from '../../utils/navigation'

function PageHeader({ title, subtitle, action, icon }) {
  const { pathname } = useLocation()
  const current = navLinks.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
  const symbol = icon || (current ? current.icon : 'bi-stars')

  return (
    <div className="page-header ft-banner">
      <span className="banner-icon">
        <i className={`bi ${symbol}`}></i>
      </span>

      <div className="banner-text">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action && <div className="banner-action">{action}</div>}
    </div>
  )
}

export default PageHeader
