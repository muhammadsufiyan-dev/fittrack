import { Link } from 'react-router-dom'
import Brand from './Brand'
import useGoTo from '../hooks/useGoTo'

function Footer() {
  const goTo = useGoTo()

  return (
    <footer className="ft-footer">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-5">
            <Brand />
            <p className="text-secondary mt-3 mb-0 footer-text">
              Track workouts, meals and progress in one place and stay consistent with your goals.
            </p>
          </div>
          <div className="col-6 col-lg-2 offset-lg-1">
            <h6 className="footer-title">Product</h6>
            <ul className="list-unstyled mb-0">
              <li><button type="button" className="footer-link" onClick={() => goTo('features')}>Features</button></li>
              <li><button type="button" className="footer-link" onClick={() => goTo('how')}>How it works</button></li>
              <li><button type="button" className="footer-link" onClick={() => goTo('faq')}>FAQ</button></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="footer-title">Account</h6>
            <ul className="list-unstyled mb-0">
              <li><Link className="footer-link" to="/login">Log in</Link></li>
              <li><Link className="footer-link" to="/register">Register</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="footer-title">Legal</h6>
            <ul className="list-unstyled mb-0">
              <li><Link className="footer-link" to="/privacy">Privacy policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom text-center mt-4 pt-4 small text-secondary">
          <span>&copy; {new Date().getFullYear()} FitTrack. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer