import CountUp from './CountUp'

const rings = [
  { r: 100, progress: 0.82, color: '#14b8a6' },
  { r: 76, progress: 0.64, color: '#06b6d4' },
  { r: 52, progress: 0.45, color: '#84cc16' },
]

function ActivityRings() {
  return (
    <div className="rings">
      <svg viewBox="0 0 240 240" role="img" aria-label="Activity rings">
        {rings.map((ring) => {
          const circumference = 2 * Math.PI * ring.r
          return (
            <g key={ring.r} transform="rotate(-90 120 120)">
              <circle className="ring-track" cx="120" cy="120" r={ring.r} fill="none" strokeWidth="16" />
              <circle
                className="ring-progress"
                cx="120"
                cy="120"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth="16"
                strokeLinecap="round"
                style={{
                  '--c': circumference,
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference * (1 - ring.progress),
                }}
              />
            </g>
          )
        })}
      </svg>
      <div className="rings-center">
        <div className="rings-value">
          <CountUp to={1240} />
        </div>
        <div className="rings-label">kcal burned</div>
      </div>
    </div>
  )
}

export default ActivityRings