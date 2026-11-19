import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import PageHeader from '../../components/ui/PageHeader'
import { getNotifications, markRead } from '../../services/notificationService'

function Notifications() {
  const [items, setItems] = useState(null)
  const [tab, setTab] = useState('all')

  const load = async () => {
    setItems(await getNotifications())
  }

  useEffect(() => {
    getNotifications().then(setItems)
  }, [])

  if (!items) return <Loader />

  const unread = items.filter((item) => !item.read)
  const shown = tab === 'unread' ? unread : items

  const handleMarkAll = async () => {
    await markRead(unread.map((item) => item.id))
    load()
  }

  const markAllButton = (
    <button type="button" className="btn btn-outline-secondary" onClick={handleMarkAll} disabled={unread.length === 0}>
      <i className="bi bi-check2-all me-1"></i>Mark all as read
    </button>
  )

  return (
    <>
      <PageHeader title="Notifications" subtitle="Alerts about your workouts, meals, goals and reminders." action={markAllButton} />

      <div className="chip-row mb-4">
        <button type="button" className={`chip-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          All<span className="chip-count">{items.length}</span>
        </button>
        <button type="button" className={`chip-btn ${tab === 'unread' ? 'active' : ''}`} onClick={() => setTab('unread')}>
          Unread<span className="chip-count">{unread.length}</span>
        </button>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="bi-bell-slash"
          title={tab === 'unread' ? 'You are all caught up' : 'No notifications'}
          text="New alerts will show up here as you use FitTrack."
        />
      ) : (
        <div className="notice-list">
          {shown.map((item, index) => (
            <Link
              key={item.id}
              to={item.to}
              className={`notice-row ${item.read ? '' : 'unread'}`}
              style={{ '--i': index }}
              onClick={() => markRead([item.id])}
            >
              <span className={`notice-icon ${item.tone}`}>
                <i className={`bi ${item.icon}`}></i>
              </span>

              <div className="notice-text">
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </div>

              <span className="notice-action">
                {item.action}
                <i className="bi bi-chevron-right"></i>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default Notifications
