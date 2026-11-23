import { Link } from 'react-router-dom'
import Brand from '../components/layout/Brand'

function NotFound() {
  return (
    <main className="not-found">
      <div className="mb-4">
        <Brand />
      </div>
      <div className="not-found-code gradient-text">404</div>
      <h1 className="h3 mt-2">This page took a rest day</h1>
      <p className="text-secondary mb-4">The page you are looking for does not exist or has moved.</p>
      <div>
        <Link to="/" className="btn btn-primary btn-lg">
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
