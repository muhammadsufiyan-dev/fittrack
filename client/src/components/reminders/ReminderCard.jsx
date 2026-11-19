import { formatTime, reminderTypes, weekDays } from '../../utils/reminders'

function ReminderCard({ item, onToggle, onEdit, onDelete }) {
  const type = reminderTypes.find((entry) => entry.value === item.type) || reminderTypes[reminderTypes.length - 1]

  return (
    <article className={`ft-card ft-hover rem-card ${item.enabled ? '' : 'off'}`}>
      <div className="rem-top">
        <span className="ft-icon">
          <i className={`bi ${type.icon}`}></i>
        </span>

        <div className="rem-info">
          <h3>{item.title}</h3>
          <small>{item.note || type.label}</small>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={item.enabled}
            onChange={() => onToggle(item)}
            aria-label={`Turn ${item.title} ${item.enabled ? 'off' : 'on'}`}
          />
        </div>
      </div>

      <div className="rem-time">{formatTime(item.time)}</div>

      <div className="rem-days">
        {weekDays.map((day, index) => (
          <span key={day} className={item.days.includes(index) ? 'on' : ''}>
            {day[0]}
          </span>
        ))}
      </div>

      <div className="rem-actions">
        <button type="button" onClick={() => onEdit(item)}>
          <i className="bi bi-pencil"></i>Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(item)}>
          <i className="bi bi-trash3"></i>Delete
        </button>
      </div>
    </article>
  )
}

export default ReminderCard
