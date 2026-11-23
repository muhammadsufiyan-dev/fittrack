import { Link } from 'react-router-dom'
import ActivityRings from '../charts/ActivityRings'
import Brand from '../layout/Brand'
import ThemeToggle from '../layout/ThemeToggle'
import Ecg from '../ui/Ecg'

function AuthShell({ title, subtitle, children, footer }) {
  const words = title.split(' ')
  const lastWord = words.pop()

  return (
    <div className="auth-page">
      <aside className="auth-side" data-bs-theme="dark">
        <Brand />

        <div>
          <div className="side-visual">
            <div className="side-glass">
              <div className="today-head">
                <span>Today</span>
                <span className="today-pill">On track</span>
              </div>
              <div className="side-rings">
                <ActivityRings />
              </div>
            </div>

            <div className="chip chip-top float">
              <i className="bi bi-heart-pulse-fill text-danger beat"></i>
              <div>
                <div className="fw-bold lh-1">128 bpm</div>
                <small>Heart rate</small>
              </div>
            </div>
            <div className="chip chip-bottom float float-delay">
              <i className="bi bi-fire text-warning fs-4"></i>
              <div>
                <div className="fw-bold lh-1">7-day streak</div>
                <small>Keep it going</small>
              </div>
            </div>
          </div>

          <h2 className="fit-title side-title">
            Every rep <span className="gradient-text">counts.</span>
          </h2>
          <p className="text-secondary side-text">
            Log workouts, meals and progress in one place and see how far you have come.
          </p>
        </div>

        <Ecg />
      </aside>

      <main className="auth-main">
        <div className="auth-top">
          <Link to="/" className="auth-back">
            <i className="bi bi-arrow-left me-1"></i>Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="auth-box">
          <div className="d-lg-none mb-4">
            <Brand />
          </div>

          <h1 className="fit-title auth-heading">
            {words.join(' ')} <span className="gradient-text">{lastWord}</span>
          </h1>
          <p className="auth-sub">{subtitle}</p>

          {children}

          <p className="auth-foot">{footer}</p>
        </div>
      </main>
    </div>
  )
}

export default AuthShell
