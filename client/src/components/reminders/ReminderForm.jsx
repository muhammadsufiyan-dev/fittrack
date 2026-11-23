import { useState } from 'react'
import FormGroup from '../ui/FormGroup'
import { reminderTypes, weekDays } from '../../utils/reminders'

const everyDay = [0, 1, 2, 3, 4, 5, 6]
const weekdays = [0, 1, 2, 3, 4]

const startForm = (initial) => {
  if (initial) return { ...initial }
  return { title: '', type: 'workout', time: '07:00', days: [...weekdays], note: '' }
}

function ReminderForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => startForm(initial))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const toggleDay = (day) => {
    const days = form.days.includes(day) ? form.days.filter((item) => item !== day) : [...form.days, day]
    setForm({ ...form, days: days.sort() })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const found = {}
    if (!form.title.trim()) found.title = 'Enter a title'
    if (!form.time) found.time = 'Choose a time'
    if (form.days.length === 0) found.days = 'Pick at least one day'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      title: form.title.trim(),
      type: form.type,
      time: form.time,
      days: form.days,
      note: form.note.trim(),
    })
  }

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="form-section">Reminder</div>

        <FormGroup label="Title" htmlFor="title" error={errors.title} className="mb-3">
          <input
            id="title"
            name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g. Evening run"
            value={form.title}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Type" className="mb-3">
          <div className="chip-row">
            {reminderTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`chip-btn ${form.type === item.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, type: item.value })}
              >
                <i className={`bi ${item.icon} me-1`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </FormGroup>

        <FormGroup label="Time" htmlFor="time" error={errors.time} className="mb-3">
          <input
            id="time"
            name="time"
            type="time"
            className={`form-control time-input ${errors.time ? 'is-invalid' : ''}`}
            value={form.time}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="form-section">Repeat</div>

        <div className="day-picker">
          {weekDays.map((day, index) => (
            <button
              key={day}
              type="button"
              className={`day-btn ${form.days.includes(index) ? 'active' : ''}`}
              onClick={() => toggleDay(index)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="quick-days">
          <button type="button" onClick={() => setForm({ ...form, days: [...everyDay] })}>
            Every day
          </button>
          <button type="button" onClick={() => setForm({ ...form, days: [...weekdays] })}>
            Weekdays
          </button>
        </div>

        {errors.days && (
          <div className="form-error">
            <i className="bi bi-exclamation-circle"></i>
            {errors.days}
          </div>
        )}

        <div className="form-section">Note (optional)</div>

        <textarea
          name="note"
          rows="2"
          className="form-control"
          placeholder="Anything to remember?"
          aria-label="Note"
          value={form.note}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check2 me-1"></i>Save reminder
        </button>
      </div>
    </form>
  )
}

export default ReminderForm
