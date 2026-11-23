import { useEffect, useState } from 'react'
import ReminderCard from '../../components/reminders/ReminderCard'
import ReminderForm from '../../components/reminders/ReminderForm'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import useConfirm from '../../hooks/useConfirm'
import { addReminder, deleteReminder, getReminders, updateReminder } from '../../services/reminderService'
import { formatIn, formatTime, fullDays, getNext, periodOf, periods, weekDays } from '../../utils/reminders'

const todayIndex = () => (new Date().getDay() + 6) % 7

function Reminders() {
  const [reminders, setReminders] = useState(null)
  const [day, setDay] = useState(todayIndex)
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
  const visible = day === null ? reminders : reminders.filter((item) => item.days.includes(day))
  const today = todayIndex()

  return (
    <>
      <PageHeader title="Reminders" subtitle="Weekly reminders for workouts, meals and more." action={addButton} />

      {reminders.length === 0 ? (
        <EmptyState
          icon="bi-alarm"
          title="No reminders yet"
          text="Add one to stay on track with your routine."
          action={addButton}
        />
      ) : (
        <>
          <section className="rem-hero">
            <div className="rem-hero-main">
              <span className="rem-hero-tag">
                <i className="bi bi-hourglass-split"></i>Next reminder
              </span>

              {next ? (
                <>
                  <h2>{next.item.title}</h2>
                  <p>
                    <span>
                      <i className="bi bi-clock"></i>
                      {formatTime(next.item.time)}
                    </span>
                    <span>{next.label}</span>
                    <span className="rem-in">in {formatIn(next.distance)}</span>
                  </p>
                </>
              ) : (
                <>
                  <h2>Nothing scheduled</h2>
                  <p>Turn a reminder on or add a new one.</p>
                </>
              )}
            </div>

            <div className="rem-hero-stats">
              <div>
                <strong>{active}</strong>
                <small>Active</small>
              </div>
              <div>
                <strong>{reminders.length}</strong>
                <small>Total</small>
              </div>
            </div>
          </section>

          <div className="rem-week-head">
            <h2 className="panel-title mb-0">{day === null ? 'All reminders' : fullDays[day]}</h2>
            {day !== null && (
              <button type="button" className="rem-all" onClick={() => setDay(null)}>
                Show all
              </button>
            )}
          </div>

          <div className="rem-week">
            {weekDays.map((name, index) => {
              const count = reminders.filter((item) => item.enabled && item.days.includes(index)).length

              return (
                <button
                  key={name}
                  type="button"
                  className={`rem-day ${day === index ? 'active' : ''} ${today === index ? 'today' : ''}`}
                  onClick={() => setDay(index)}
                >
                  <small>{name}</small>
                  <strong>{count}</strong>
                </button>
              )
            })}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon="bi-calendar-x"
              title={day === null ? 'No reminders' : `No reminders on ${fullDays[day]}`}
              text="Add one for this day or pick another."
              action={addButton}
            />
          ) : (
            periods.map((period) => {
              const list = visible.filter((item) => periodOf(item.time).key === period.key)
              if (list.length === 0) return null

              return (
                <section className="rem-group" key={period.key}>
                  <h3 className="rem-group-title">
                    <i className={`bi ${period.icon}`}></i>
                    {period.title}
                  </h3>

                  {list.map((item, index) => (
                    <ReminderCard
                      key={item.id}
                      item={item}
                      index={index}
                      onToggle={handleToggle}
                      onEdit={(entry) => setModal({ mode: 'edit', item: entry })}
                      onDelete={handleDelete}
                    />
                  ))}
                </section>
              )
            })
          )}
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
