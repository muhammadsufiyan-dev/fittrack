import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format'

const icons = {
  Strength: 'bi-trophy',
  Cardio: 'bi-heart-pulse',
  HIIT: 'bi-fire',
  Flexibility: 'bi-flower1',
}

function WorkoutCard({ item, onEdit, onDelete }) {
  return (
    <div className="ft-card ft-hover workout-card h-100 p-3 p-md-4 d-flex flex-column">
      <div className="workout-top">
        <span className={`workout-icon cat-${item.category.toLowerCase()}`}>
          <i className={`bi ${icons[item.category]}`}></i>
        </span>
        <div>
          <span className={`cat cat-${item.category.toLowerCase()}`}>{item.category}</span>
          <div className="text-secondary small mt-1">{formatDate(item.date)}</div>
        </div>
      </div>

      <h3 className="h5 fw-bold mb-3">{item.name}</h3>

      <div className="workout-stats">
        <div className="workout-stat">
          <strong>{item.duration}</strong>
          <small>min</small>
        </div>
        <div className="workout-stat">
          <strong>{item.calories}</strong>
          <small>kcal</small>
        </div>
        <div className="workout-stat">
          <strong>{item.exercises.length}</strong>
          <small>exercises</small>
        </div>
      </div>

      <div className="tags mb-3">
        {item.tags.map((tag) => (
          <span className="tag" key={tag}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto d-flex gap-2">
        <Link to={`/workouts/${item.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
          View details
        </Link>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onEdit} aria-label="Edit workout">
          <i className="bi bi-pencil"></i>
        </button>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={onDelete} aria-label="Delete workout">
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  )
}

export default WorkoutCard
