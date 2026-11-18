import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format'

function WorkoutCard({ item, onEdit, onDelete }) {
  return (
    <div className="ft-card ft-hover h-100 p-3 p-md-4 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className={`cat cat-${item.category.toLowerCase()}`}>{item.category}</span>
        <small className="text-secondary">{formatDate(item.date)}</small>
      </div>

      <h3 className="h5 fw-bold">{item.name}</h3>

      <div className="text-secondary small mb-3">
        <i className="bi bi-clock me-1"></i>
        {item.duration} min
        <i className="bi bi-fire ms-3 me-1"></i>
        {item.calories} kcal
        <i className="bi bi-list-check ms-3 me-1"></i>
        {item.exercises.length}
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
          View
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
