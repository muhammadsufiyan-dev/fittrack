import { Link } from 'react-router-dom'
import ActivityRings from '../../components/charts/ActivityRings'
import Ecg from '../../components/ui/Ecg'

const perks = ['Free to use', 'Works on mobile', 'Light and dark mode']

const stats = [
  { label: 'Move', value: '82%', color: '#14b8a6' },
  { label: 'Exercise', value: '64%', color: '#06b6d4' },
  { label: 'Goal', value: '45%', color: '#84cc16' },
]

function Hero() {
  const scrollToFeatures = () => {
    const target = document.getElementById('features')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-grid"></div>

      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-7 hero-copy">
            <span className="ft-badge mb-4">
              <span className="dot"></span>
              Your all-in-one fitness companion
            </span>

            <h1 className="fit-title">
              Train. <span className="outline-text">Track.</span>
              <br />
              <span className="gradient-text">Transform.</span>
            </h1>

            <p className="lead text-secondary hero-text mt-4 mb-4">
              Log every workout, meal and measurement. See your progress in clear charts and reach your goals faster.
            </p>

            <div className="hero-actions mb-4">
              <Link to="/register" className="btn btn-primary btn-lg btn-glow">
                Start for free <i className="bi bi-arrow-right ms-1"></i>
              </Link>
              <button type="button" className="btn btn-outline-secondary btn-lg" onClick={scrollToFeatures}>
                See features
              </button>
            </div>

            <ul className="hero-perks">
              {perks.map((perk) => (
                <li key={perk}>
                  <i className="bi bi-check-circle-fill text-primary me-1"></i>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-5">
            <div className="hero-visual">
              <div className="today-card">
                <div className="today-head">
                  <span>Today</span>
                  <span className="today-pill">On track</span>
                </div>

                <div className="today-rings">
                  <ActivityRings />
                </div>

                {stats.map((item) => (
                  <div className="today-row" key={item.label}>
                    <span className="today-dot" style={{ background: item.color }}></span>
                    {item.label}
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="chip chip-top float">
                <i className="bi bi-heart-pulse-fill text-danger beat"></i>
                <div>
                  <div className="fw-bold lh-1">128 bpm</div>
                  <small>Heart rate</small>
                </div>
              </div>

              <div className="chip chip-bottom float float-delay">
                <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                <div>
                  <div className="fw-bold lh-1">Workout complete</div>
                  <small>45 min strength</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Ecg />
    </section>
  )
}

export default Hero
