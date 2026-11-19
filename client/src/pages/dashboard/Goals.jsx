import { useEffect, useState } from 'react'
import GoalCard from '../../components/goals/GoalCard'
import GoalForm from '../../components/goals/GoalForm'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import useConfirm from '../../hooks/useConfirm'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { addGoal, deleteGoal, getGoals, getLatestWeight, updateGoal } from '../../services/goalService'

function Goals() {
  const [goals, setGoals] = useState(null)
  const [latestWeight, setLatestWeight] = useState(null)
  const [modal, setModal] = useState(null)
  const confirm = useConfirm()

  const load = async () => {
    setGoals(await getGoals())
  }

  useEffect(() => {
    getGoals().then(setGoals)
    getLatestWeight().then(setLatestWeight)
  }, [])

  const handleSave = async (data) => {
    if (modal.mode === 'edit') {
      await updateGoal(modal.item.id, data)
    } else {
      await addGoal(data)
    }
    setModal(null)
    load()
  }

  const handleDelete = async (item) => {
    if (await confirm({ title: 'Delete goal?', message: `"${item.title}" will be removed for good.` })) {
      await deleteGoal(item.id)
      load()
    }
  }

  if (!goals) return <Loader />

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
      <i className="bi bi-plus-lg me-1"></i>Add goal
    </button>
  )

  const reached = goals.filter((item) => item.percent >= 100).length
  const average = goals.length > 0 ? Math.round(goals.reduce((sum, item) => sum + item.percent, 0) / goals.length) : 0

  return (
    <>
      <PageHeader title="Goals" subtitle="Set targets and see how close you are." action={addButton} />

      {goals.length === 0 ? (
        <EmptyState
          icon="bi-bullseye"
          title="No goals yet"
          text="Add a goal like a target weight or a weekly workout count."
          action={addButton}
        />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4">
              <StatCard icon="bi-bullseye" label="Total goals" value={goals.length} />
            </div>
            <div className="col-6 col-md-4">
              <StatCard icon="bi-check2-circle" label="Reached" value={reached} />
            </div>
            <div className="col-12 col-md-4">
              <StatCard icon="bi-graph-up-arrow" label="Average progress" value={average} unit="%" progress={average} />
            </div>
          </div>

          <div className="row g-3">
            {goals.map((item) => (
              <div className="col-md-6 col-xl-4" key={item.id}>
                <GoalCard
                  goal={item}
                  onEdit={() => setModal({ mode: 'edit', item })}
                  onDelete={() => handleDelete(item)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit goal' : 'Add goal'} onClose={() => setModal(null)}>
          <GoalForm
            initial={modal.item}
            latestWeight={latestWeight}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  )
}

export default Goals
