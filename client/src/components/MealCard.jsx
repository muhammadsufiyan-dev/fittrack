function MealCard({ log, onEdit, onDelete }) {
  const total = log.items.reduce((sum, item) => sum + item.calories, 0)

  return (
    <div className="ft-card p-3 p-md-4 mb-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className={`cat meal-${log.mealType.toLowerCase()}`}>{log.mealType}</span>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onEdit} aria-label="Edit meal">
            <i className="bi bi-pencil"></i>
          </button>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={onDelete} aria-label="Delete meal">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>

      {log.items.map((item) => (
        <div key={item.id} className="list-row">
          <div className="flex-grow-1">
            <div className="fw-semibold">{item.name}</div>
            <small className="text-secondary">
              P {item.protein}g - C {item.carbs}g - F {item.fats}g
            </small>
          </div>
          <span className="fw-semibold">{item.calories} kcal</span>
        </div>
      ))}

      <div className="meal-total">
        <span className="text-secondary small">{log.notes || 'Total'}</span>
        <strong>{total} kcal</strong>
      </div>
    </div>
  )
}

export default MealCard