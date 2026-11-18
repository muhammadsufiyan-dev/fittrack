import { useEffect, useState } from 'react'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import WorkoutCard from '../../components/workouts/WorkoutCard'
import WorkoutForm from '../../components/workouts/WorkoutForm'
import { addWorkout, deleteWorkout, getWorkouts, updateWorkout } from '../../services/workoutService'
import { workoutCategories } from '../../utils/constants'

function Workouts() {
  const [workouts, setWorkouts] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [modal, setModal] = useState(null)

  const load = async () => {
    setWorkouts(await getWorkouts())
  }

  useEffect(() => {
    getWorkouts().then(setWorkouts)
  }, [])

  const handleSave = async (data) => {
    if (modal.mode === 'edit') {
      await updateWorkout(modal.item.id, data)
    } else {
      await addWorkout(data)
    }
    setModal(null)
    load()
  }

  const handleDelete = async (item) => {
    if (window.confirm(`Delete "${item.name}"?`)) {
      await deleteWorkout(item.id)
      load()
    }
  }

  if (!workouts) return <Loader />

  const term = search.trim().toLowerCase()
  const visible = workouts.filter((item) => {
    const matchCategory = category === 'All' || item.category === category
    const matchSearch =
      item.name.toLowerCase().includes(term) || item.tags.some((tag) => tag.toLowerCase().includes(term))
    return matchCategory && matchSearch
  })

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
      <i className="bi bi-plus-lg me-1"></i>Add workout
    </button>
  )

  return (
    <>
      <PageHeader title="Workouts" subtitle="Plan, log and review your training sessions." action={addButton} />

      <div className="toolbar">
        <div className="field toolbar-search">
          <i className="bi bi-search field-icon"></i>
          <input
            className="field-input"
            placeholder="Search by name or tag"
            aria-label="Search workouts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="chip-row">
          {['All', ...workoutCategories].map((item) => (
            <button
              key={item}
              type="button"
              className={`chip-btn ${category === item ? 'active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="bi-search"
          title="No workouts found"
          text="Try a different search or add a new workout."
          action={addButton}
        />
      ) : (
        <div className="row g-3">
          {visible.map((item) => (
            <div className="col-md-6 col-xl-4" key={item.id}>
              <WorkoutCard
                item={item}
                onEdit={() => setModal({ mode: 'edit', item })}
                onDelete={() => handleDelete(item)}
              />
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit workout' : 'Add workout'} onClose={() => setModal(null)}>
          <WorkoutForm initial={modal.item} onSubmit={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </>
  )
}

export default Workouts
