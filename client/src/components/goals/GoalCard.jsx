import { goalTypes } from '../../utils/constants'
import { formatDate, todayISO } from '../../utils/format'

const getDeadlineText = (goal) => {
  if (goal.percent >= 100) return 'Goal reached'
  if (!goal.deadline) return 'No deadline'

  const days = Math.ceil((new Date(goal.deadline) - new Date(todayISO())) / 86400000)
  if (days < 0) return `Ended ${formatDate(goal.deadline)}`
  if (days === 0) return 'Due today'
  return `${days} ${days === 1 ? 'day' : 'days'} left`
}

function GoalCard({ goal, onEdit, onDelete }) {
  const type = goalTypes.find((item) => item.value === goal.type)
  const reached = goal.percent >= 100

  return (
    <div className={`ft-card ft-hover goal-card p-3 p-md-4 h-100 ${reached ? 'reached' : ''}`}>
      <div className="goal-head">
        <span className="ft-icon">
          <i className={`bi ${reached ? 'bi-check-lg' : type.icon}`}></i>
        </span>
        <div className="flex-grow-1">
          <h2 className="h6 fw-bold mb-1">{goal.title}</h2>
          <div className="text-secondary small">{type.label}</div>
        </div>
        <div className="goal-actions">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onEdit} aria-label="Edit goal">
            <i className="bi bi-pencil"></i>
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={onDelete} aria-label="Delete goal">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <div className="goal-numbers">
        <span>
          <strong>{goal.current}</strong> / {goal.target} {goal.unit}
        </span>
        <strong>{goal.percent}%</strong>
      </div>

      <div className="mini-bar">
        <span style={{ width: `${goal.percent}%` }}></span>
      </div>

      <div className="text-secondary small mt-3">
        <i className="bi bi-calendar-event me-1"></i>
        {getDeadlineText(goal)}
      </div>
    </div>
  )
}

export default GoalCard
