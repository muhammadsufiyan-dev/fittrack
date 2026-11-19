import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import Reveal from '../../components/ui/Reveal'
import StatCard from '../../components/ui/StatCard'
import WorkoutForm from '../../components/workouts/WorkoutForm'
import useConfirm from '../../hooks/useConfirm'
import { deleteWorkout, getWorkout, updateWorkout } from '../../services/workoutService'
import { formatDate } from '../../utils/format'

function WorkoutDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const confirm = useConfirm()
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
    if (await confirm({ title: 'Delete workout?', message: `"${item.name}" will be removed for good.` })) {
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

  const totalSets = item.exercises.reduce((sum, exercise) => sum + exercise.sets, 0)
  const totalVolume = item.exercises.reduce((sum, exercise) => sum + exercise.sets * exercise.reps * exercise.weight, 0)
  const heaviest = Math.max(0, ...item.exercises.map((exercise) => exercise.weight))

  return (
    <>
      <Link to="/workouts" className="back-link">
        <i className="bi bi-arrow-left"></i>All workouts
      </Link>

      <section className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-date">
            <i className="bi bi-calendar3"></i>
            {formatDate(item.date)}
            <span className="detail-dot"></span>
            {item.category}
          </span>
          <h1 className="dash-hero-title">{item.name}</h1>
          {item.tags.length > 0 && (
            <p className="detail-tags">
              {item.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </p>
          )}
          <div className="dash-hero-actions">
            <button type="button" className="btn btn-light" onClick={() => setEditing(true)}>
              <i className="bi bi-pencil me-1"></i>Edit workout
            </button>
            <button type="button" className="btn btn-outline-light" onClick={handleDelete}>
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <Reveal className="h-100">
            <StatCard icon="bi-clock" label="Duration" value={item.duration} unit="min" />
          </Reveal>
        </div>
        <div className="col-6 col-xl-3">
          <Reveal delay={80} className="h-100">
            <StatCard icon="bi-fire" label="Calories burned" value={item.calories} unit="kcal" />
          </Reveal>
        </div>
        <div className="col-6 col-xl-3">
          <Reveal delay={160} className="h-100">
            <StatCard icon="bi-list-check" label={`Exercises (${totalSets} sets)`} value={item.exercises.length} />
          </Reveal>
        </div>
        <div className="col-6 col-xl-3">
          <Reveal delay={240} className="h-100">
            <StatCard icon="bi-bar-chart" label="Total volume" value={totalVolume} unit="kg" />
          </Reveal>
        </div>
      </div>

      <Reveal>
        <div className="ft-card p-3 p-md-4 mb-4">
          <h2 className="panel-title">Exercises</h2>

          {item.exercises.length === 0 ? (
            <p className="text-secondary mb-0">No exercises added.</p>
          ) : (
            item.exercises.map((exercise, index) => (
              <div className="exercise-row" key={exercise.id} style={{ '--i': index }}>
                <span className="exercise-number">{index + 1}</span>

                <div className="exercise-main">
                  <div className="fw-semibold">{exercise.name}</div>
                  <small className="text-secondary">
                    {exercise.sets} sets x {exercise.reps} reps
                  </small>
                  {heaviest > 0 && (
                    <div className="mini-bar">
                      <span style={{ width: `${(exercise.weight / heaviest) * 100}%` }}></span>
                    </div>
                  )}
                </div>

                <div className="exercise-weight">{exercise.weight ? `${exercise.weight} kg` : 'Bodyweight'}</div>
              </div>
            ))
          )}
        </div>
      </Reveal>

      <div className="row g-3">
        <div className="col-md-8">
          <Reveal className="h-100">
            <div className="ft-card p-3 p-md-4 h-100">
              <h2 className="panel-title">Notes</h2>
              <p className="text-secondary mb-0">{item.notes || 'No notes for this workout.'}</p>
            </div>
          </Reveal>
        </div>
        <div className="col-md-4">
          <Reveal delay={100} className="h-100">
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
          </Reveal>
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
