import { useEffect, useState } from 'react'
import ReminderCard from '../../components/reminders/ReminderCard'
import ReminderForm from '../../components/reminders/ReminderForm'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import useConfirm from '../../hooks/useConfirm'
import { addReminder, deleteReminder, getReminders, updateReminder } from '../../services/reminderService'
import { formatTime, getNext } from '../../utils/reminders'

function Reminders() {
  const [reminders, setReminders] = useState(null)
  const [modal, setModal] = useState(null)
  const confirm = useConfirm()

  const load = async () => {
    setReminders(await getReminders())
  }

  useEffect(() => {
    getReminders().then(setReminders)
  }, [])

  const handleSave = async (data) => {
    if (modal.mode === 'edit') {
      await updateReminder(modal.item.id, data)
    } else {
      await addReminder(data)
    }
    setModal(null)
    load()
  }

  const handleToggle = async (item) => {
    await updateReminder(item.id, { enabled: !item.enabled })
    load()
  }

  const handleDelete = async (item) => {
    if (await confirm({ title: 'Delete reminder?', message: `"${item.title}" will be removed.` })) {
      await deleteReminder(item.id)
      load()
    }
  }

  if (!reminders) return <Loader />

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
      <i className="bi bi-plus-lg me-1"></i>Add reminder
    </button>
  )

  const next = getNext(reminders)
  const active = reminders.filter((item) => item.enabled).length

  return (
    <>
      <PageHeader title="Reminders" subtitle="Set weekly reminders so you never miss a workout or a meal." action={addButton} />

      {reminders.length === 0 ? (
        <EmptyState
          icon="bi-alarm"
          title="No reminders yet"
          text="Add one to stay on track with your routine."
          action={addButton}
        />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4">
              <StatCard icon="bi-alarm" label="Total reminders" value={reminders.length} />
            </div>
            <div className="col-6 col-md-4">
              <StatCard icon="bi-bell" label="Active" value={active} />
            </div>
            <div className="col-12 col-md-4">
              <StatCard
                icon="bi-hourglass-split"
                label={next ? `Next: ${next.item.title}` : 'Next reminder'}
                value={next ? formatTime(next.item.time) : '-'}
                unit={next ? next.label : ''}
              />
            </div>
          </div>

          <div className="row g-3">
            {reminders.map((item) => (
              <div className="col-md-6 col-xl-4" key={item.id}>
                <ReminderCard
                  item={item}
                  onToggle={handleToggle}
                  onEdit={(entry) => setModal({ mode: 'edit', item: entry })}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit reminder' : 'New reminder'} onClose={() => setModal(null)}>
          <ReminderForm initial={modal.item} onSubmit={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </>
  )
}

export default Reminders
