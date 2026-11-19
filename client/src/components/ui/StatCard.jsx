import CountUp from './CountUp'

function StatCard({ icon, label, value, unit, change, positive = true, progress }) {
  return (
    <div className="ft-card ft-hover stat-card h-100 p-3 p-md-4">
      <div className="stat-top">
        <span className="ft-icon">
          <i className={`bi ${icon}`}></i>
        </span>
        {change && <span className={`trend ${positive ? 'up' : 'down'}`}>{change}</span>}
      </div>

      <div className="stat-number mt-3">
        {typeof value === 'number' ? <CountUp to={value} /> : value}
        {unit && <small>{unit}</small>}
      </div>
      <div className="text-secondary small">{label}</div>

      {progress !== undefined && (
        <div className="mini-bar">
          <span style={{ width: `${Math.min(progress, 100)}%` }}></span>
        </div>
      )}
    </div>
  )
}

export default StatCard
