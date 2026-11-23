import { formatTime, reminderTypes, weekDays } from '../../utils/reminders'

function ReminderCard({ item, index, onToggle, onEdit, onDelete }) {
  const type = reminderTypes.find((entry) => entry.value === item.type) || reminderTypes[reminderTypes.length - 1]
  const [clock, suffix] = formatTime(item.time).split(' ')

  return (
    <article className={`rem-row ${item.enabled ? '' : 'off'}`} style={{ '--i': index }}>
      <div className="rem-clock">
        <strong>{clock}</strong>
        <small>{suffix}</small>
      </div>

      <div className="ft-card rem-card">
        <div className="rem-main">
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

        <div className="rem-foot">
          <div className="rem-days">
            {weekDays.map((day, position) => (
              <span key={day} className={item.days.includes(position) ? 'on' : ''}>
                {day[0]}
              </span>
            ))}
          </div>

          <div className="rem-actions">
            <button type="button" onClick={() => onEdit(item)} aria-label="Edit reminder">
              <i className="bi bi-pencil"></i>
            </button>
            <button type="button" className="danger" onClick={() => onDelete(item)} aria-label="Delete reminder">
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ReminderCard
