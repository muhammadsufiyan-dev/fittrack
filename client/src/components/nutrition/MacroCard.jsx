import CountUp from '../ui/CountUp'

function MacroCard({ label, value, target, tone }) {
  return (
    <div className={`ft-card macro-card ${tone}`}>
      <span className="macro-name">{label}</span>
      <div className="macro-value">
        <CountUp to={value} />
        <small>g</small>
      </div>
      <div className="mini-bar">
        <span style={{ width: `${Math.min(100, (value / target) * 100)}%` }}></span>
      </div>
      <span className="macro-goal">of {target} g</span>
    </div>
  )
}

export default MacroCard
