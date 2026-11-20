import CountUp from '../ui/CountUp'

const RADIUS = 52
const LENGTH = 2 * Math.PI * RADIUS

function CalorieCard({ eaten, target }) {
  const remaining = target - eaten
  const ratio = Math.min(1, eaten / target)
  const over = remaining < 0

  return (
    <div className={`ft-card cal-card h-100 ${over ? 'over' : ''}`}>
      <div className="cal-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="cal-track" cx="60" cy="60" r={RADIUS} />
          <circle
            className="cal-value"
            cx="60"
            cy="60"
            r={RADIUS}
            style={{ strokeDasharray: LENGTH, strokeDashoffset: LENGTH * (1 - ratio), '--len': LENGTH }}
          />
        </svg>
        <div className="cal-center">
          <strong>
            <CountUp to={eaten} />
          </strong>
          <small>kcal eaten</small>
        </div>
      </div>

      <div className="cal-info">
        <span className="cal-label">{over ? 'Over your target' : 'Remaining today'}</span>
        <div className="cal-big">
          <CountUp to={Math.abs(remaining)} />
          <small>kcal</small>
        </div>
        <span className="cal-target">Daily target {target.toLocaleString()} kcal</span>
        <div className="mini-bar">
          <span style={{ width: `${ratio * 100}%` }}></span>
        </div>
      </div>
    </div>
  )
}

export default CalorieCard
