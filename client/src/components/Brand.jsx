import { Link } from 'react-router-dom'

function Brand({ to = '/' }) {
  return (
    <Link to={to} className="d-flex align-items-center gap-2 text-decoration-none">
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="brand-icon" />
      <span className="brand-text">
        FIT<span>TRACK</span>
      </span>
    </Link>
  )
}

export default Brand