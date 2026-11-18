import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import WorkoutForm from '../../components/workouts/WorkoutForm'
import { deleteWorkout, getWorkout, updateWorkout } from '../../services/workoutService'
import { formatDate } from '../../utils/format'

function WorkoutDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(undefined)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    getWorkout(id).then(setItem)
  }, [id])

  const handleSave = async (data) => {
    setItem(await updateWorkout(id, data))
    setEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete "${item.name}"?`)) {
      await deleteWorkout(id)
      navigate('/workouts')
    }
  }

  if (item === undefined) return <Loader />

  if (item === null) {
    return (
      <EmptyState
        icon="bi-emoji-frown"
        title="Workout not found"
        text="It may have been deleted."
        action={
          <Link to="/workouts" className="btn btn-primary">
            Back to workouts
          </Link>
        }
      />
    )
  }

  return (
    <>
      <Link to="/workouts" className="auth-back d-inline-block mb-3">
        <i className="bi bi-arrow-left me-1"></i>All workouts
      </Link>

      <PageHeader
        title={item.name}
        subtitle={`${item.category} - ${formatDate(item.date)}`}
        action={
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(true)}>
              <i className="bi bi-pencil me-1"></i>Edit
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-4">
          <div className="ft-card p-3 text-center h-100">
            <div className="stat-number">
              {item.duration}
              <small>min</small>
            </div>
            <div className="text-secondary small">Duration</div>
          </div>
        </div>
        <div className="col-4">
          <div className="ft-card p-3 text-center h-100">
            <div className="stat-number">
              {item.calories}
              <small>kcal</small>
            </div>
            <div className="text-secondary small">Burned</div>
          </div>
        </div>
        <div className="col-4">
          <div className="ft-card p-3 text-center h-100">
            <div className="stat-number">{item.exercises.length}</div>
            <div className="text-secondary small">Exercises</div>
          </div>
        </div>
      </div>

      <div className="ft-card p-3 p-md-4 mb-4">
        <h2 className="panel-title">Exercises</h2>
        {item.exercises.length === 0 ? (
          <p className="text-secondary mb-0">No exercises added.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {item.exercises.map((exercise, index) => (
                  <tr key={exercise.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{exercise.name}</td>
                    <td>{exercise.sets}</td>
                    <td>{exercise.reps}</td>
                    <td>{exercise.weight ? `${exercise.weight} kg` : 'Bodyweight'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="row g-3">
        <div className="col-md-8">
          <div className="ft-card p-3 p-md-4 h-100">
            <h2 className="panel-title">Notes</h2>
            <p className="text-secondary mb-0">{item.notes || 'No notes for this workout.'}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ft-card p-3 p-md-4 h-100">
            <h2 className="panel-title">Tags</h2>
            <div className="tags">
              {item.tags.length === 0 && <span className="text-secondary">No tags</span>}
              {item.tags.map((tag) => (
                <span className="tag" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <Modal title="Edit workout" onClose={() => setEditing(false)}>
          <WorkoutForm initial={item} onSubmit={handleSave} onCancel={() => setEditing(false)} />
        </Modal>
      )}
    </>
  )
}

export default WorkoutDetails
