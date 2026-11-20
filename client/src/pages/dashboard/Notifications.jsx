import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import { dismiss, getNotifications, markRead } from '../../services/notificationService'

const tabs = [
  { key: 'all', label: 'All', icon: 'bi-grid' },
  { key: 'unread', label: 'Unread', icon: 'bi-envelope' },
  { key: 'workout', label: 'Workouts', icon: 'bi-lightning-charge' },
  { key: 'meal', label: 'Meals', icon: 'bi-egg-fried' },
  { key: 'progress', label: 'Progress', icon: 'bi-graph-up-arrow' },
  { key: 'goal', label: 'Goals', icon: 'bi-bullseye' },
  { key: 'reminder', label: 'Reminders', icon: 'bi-alarm' },
]

const groups = [
  { key: 'attention', title: 'Needs attention', icon: 'bi-exclamation-circle' },
  { key: 'upcoming', title: 'Coming up today', icon: 'bi-clock' },
  { key: 'wins', title: 'Achievements', icon: 'bi-trophy' },
]

const quickLinks = [
  { to: '/workouts', icon: 'bi-lightning-charge', label: 'Log workout' },
  { to: '/nutrition', icon: 'bi-egg-fried', label: 'Log meal' },
  { to: '/progress', icon: 'bi-speedometer2', label: 'Add weight' },
  { to: '/reminders', icon: 'bi-alarm', label: 'Reminders' },
]

const typeLabel = (key) => tabs.find((item) => item.key === key)

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
  const countOf = (key) => {
    if (key === 'all') return items.length
    if (key === 'unread') return unread.length
    return items.filter((item) => item.type === key).length
  }

  const shown = items.filter((item) => {
    if (tab === 'all') return true
    if (tab === 'unread') return !item.read
    return item.type === tab
  })

  const handleRead = async (item) => {
    await markRead([item.id])
    load()
  }

  const handleMarkAll = async () => {
    await markRead(unread.map((item) => item.id))
    load()
  }

  const handleDismiss = async (item) => {
    await dismiss([item.id])
    load()
  }

  const typeCounts = tabs.slice(2).map((item) => ({ ...item, count: countOf(item.key) }))
  const biggest = Math.max(1, ...typeCounts.map((item) => item.count))

  return (
    <>
      <section className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-date">
            <i className="bi bi-bell"></i>Notification centre
          </span>
          <h1 className="dash-hero-title">
            {unread.length > 0 ? (
              <>
                {unread.length} new <span>{unread.length === 1 ? 'alert' : 'alerts'}</span>
              </>
            ) : (
              <>
                All <span>caught up</span>
              </>
            )}
          </h1>
          <p>
            {unread.length > 0
              ? 'Reminders, goals and gentle nudges to keep your routine on track.'
              : 'Nothing needs your attention right now. Keep up the great work.'}
          </p>
          <div className="dash-hero-actions">
            <button type="button" className="btn btn-light" onClick={handleMarkAll} disabled={unread.length === 0}>
              <i className="bi bi-check2-all me-1"></i>Mark all as read
            </button>
            <Link to="/reminders" className="btn btn-outline-light">
              <i className="bi bi-alarm me-1"></i>Reminders
            </Link>
          </div>
        </div>

        <div className="notice-orb" aria-hidden="true">
          <span className="orb-ring"></span>
          <span className="orb-ring second"></span>
          <span className="orb-core">
            <i className="bi bi-bell-fill"></i>
            {unread.length > 0 && <b>{unread.length}</b>}
          </span>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="chip-row notice-tabs mb-4">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`chip-btn ${tab === item.key ? 'active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                <i className={`bi ${item.icon} me-1`}></i>
                {item.label}
                <span className="chip-count">{countOf(item.key)}</span>
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <EmptyState
              icon="bi-bell-slash"
              title={tab === 'unread' ? 'You are all caught up' : 'Nothing here'}
              text="New alerts will show up as you use FitTrack."
            />
          ) : (
            groups.map((group) => {
              const list = shown.filter((item) => item.group === group.key)
              if (list.length === 0) return null

              return (
                <section className="nc-group" key={group.key}>
                  <h2 className="nc-group-title">
                    <i className={`bi ${group.icon}`}></i>
                    {group.title}
                    <span>{list.length}</span>
                  </h2>

                  {list.map((item, index) => (
                    <article className={`nc ${item.read ? '' : 'unread'}`} key={item.id} style={{ '--i': index }}>
                      <span className={`nc-icon ${item.tone}`}>
                        <i className={`bi ${item.icon}`}></i>
                      </span>

                      <div className="nc-body">
                        <div className="nc-top">
                          <span className={`nc-tag ${item.tone}`}>{typeLabel(item.type).label}</span>
                          {!item.read && <span className="nc-dot"></span>}
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>

                        <div className="nc-actions">
                          <Link to={item.to} className="nc-btn primary" onClick={() => markRead([item.id])}>
                            {item.action}
                            <i className="bi bi-arrow-right"></i>
                          </Link>
                          {!item.read && (
                            <button type="button" className="nc-btn" onClick={() => handleRead(item)}>
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>

                      <button type="button" className="nc-x" onClick={() => handleDismiss(item)} aria-label="Dismiss">
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </article>
                  ))}
                </section>
              )
            })
          )}
        </div>

        <div className="col-lg-4">
          <div className="ft-card p-3 p-md-4 mb-4">
            <h2 className="panel-title">Overview</h2>
            {typeCounts.map((item) => (
              <div className="ov-row" key={item.key}>
                <span className="ov-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <div className="ov-main">
                  <div className="d-flex justify-content-between">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>
                  <div className="mini-bar">
                    <span style={{ width: `${(item.count / biggest) * 100}%` }}></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ft-card p-3 p-md-4">
            <h2 className="panel-title">Quick actions</h2>
            <div className="qa-grid">
              {quickLinks.map((item) => (
                <Link to={item.to} className="qa-tile" key={item.to}>
                  <i className={`bi ${item.icon}`}></i>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications
