import { formatDate } from '../../utils/format'
import { showWeight } from '../../utils/units'

const getBests = (workouts) => {
  const best = {}

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const current = best[exercise.name]
      if (exercise.weight > 0 && (!current || exercise.weight > current.weight)) {
        best[exercise.name] = { name: exercise.name, weight: exercise.weight, date: workout.date }
      }
    })
  })

  return Object.values(best)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
}

function PersonalBests({ workouts }) {
  const bests = getBests(workouts)

  return (
    <div className="ft-card p-3 p-md-4 h-100">
      <h2 className="panel-title">Personal bests</h2>

      {bests.length === 0 ? (
        <p className="text-secondary mb-0">Log workouts with weights and your best lifts will show here.</p>
      ) : (
        bests.map((item) => (
          <div className="list-row" key={item.name}>
            <span className="ft-icon">
              <i className="bi bi-trophy"></i>
            </span>
            <div className="flex-grow-1">
              <div className="fw-semibold">{item.name}</div>
              <div className="text-secondary small">{formatDate(item.date)}</div>
            </div>
            <strong>{showWeight(item.weight)}</strong>
          </div>
        ))
      )}
    </div>
  )
}

export default PersonalBests

