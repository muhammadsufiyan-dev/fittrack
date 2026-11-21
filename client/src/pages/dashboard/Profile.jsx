import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileForm from '../../components/profile/ProfileForm'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import { getFollowers, getFollowingIds, getPosts } from '../../services/communityService'
import { getGoals } from '../../services/goalService'
import { getAllLogs } from '../../services/nutritionService'
import { getWorkouts } from '../../services/workoutService'
import { formatDate } from '../../utils/format'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [counts, setCounts] = useState({ workouts: 0, meals: 0, goals: 0, posts: 0 })

  useEffect(() => {
    Promise.all([getWorkouts(), getAllLogs(), getGoals(), getPosts()]).then(([workouts, meals, goals, posts]) =>
      setCounts({
        workouts: workouts.length,
        meals: meals.length,
        goals: goals.length,
        posts: posts.filter((post) => post.authorId === user.id).length,
      })
    )
  }, [user.id])

  const handleSave = async (data) => {
    await updateProfile(data)
    setEditing(false)
  }

  const editButton = (
    <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
      <i className="bi bi-pencil me-1"></i>Edit profile
    </button>
  )

  const steps = [
    { label: 'Add a profile photo', done: Boolean(user.photo), icon: 'bi-camera' },
    { label: 'Add your phone number', done: Boolean(user.phone), icon: 'bi-telephone' },
    { label: 'Add your city', done: Boolean(user.city), icon: 'bi-geo-alt' },
    { label: 'Write a short bio', done: Boolean(user.bio), icon: 'bi-card-text' },
  ]
  const percent = Math.round((steps.filter((item) => item.done).length / steps.length) * 100)

  const stats = [
    { label: 'Workouts', value: counts.workouts, icon: 'bi-lightning-charge' },
    { label: 'Meals', value: counts.meals, icon: 'bi-egg-fried' },
    { label: 'Goals', value: counts.goals, icon: 'bi-bullseye' },
    { label: 'Posts', value: counts.posts, icon: 'bi-chat-dots' },
  ]

  const details = [
    { label: 'Full name', value: user.name, icon: 'bi-person' },
    { label: 'Email', value: user.email, icon: 'bi-envelope' },
    { label: 'Phone', value: user.phone || 'Not added', icon: 'bi-telephone' },
    { label: 'City', value: user.city || 'Not added', icon: 'bi-geo-alt' },
    { label: 'Member since', value: formatDate(user.createdAt), icon: 'bi-calendar-check' },
    { label: 'Privacy policy accepted', value: formatDate(user.consentAcceptedAt), icon: 'bi-shield-check' },
  ]

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details and how others see you." action={editButton} />

      <div className="row g-3">
        <div className="col-lg-4 order-lg-2">
          <div className="ft-card prof-card">
            <div className="prof-cover"></div>
            <div className="prof-body">
              <Avatar user={user} className="prof-avatar" />
              <h2>{user.name}</h2>
              <p className="prof-email">{user.email}</p>
              <p className="prof-bio">{user.bio || 'No bio yet. Tell others about your fitness journey.'}</p>
              <div className="prof-chips">
                {user.city && (
                  <span>
                    <i className="bi bi-geo-alt"></i>
                    {user.city}
                  </span>
                )}
                <span>
                  <i className="bi bi-calendar-check"></i>
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="mini-stats">
                <div>
                  <strong>{getFollowers().length}</strong>
                  <small>Followers</small>
                </div>
                <div>
                  <strong>{getFollowingIds().length}</strong>
                  <small>Following</small>
                </div>
                <div>
                  <strong>{counts.posts}</strong>
                  <small>Posts</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8 order-lg-1">
          <div className="ft-card p-3 p-md-4 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="panel-title mb-0">Profile strength</h2>
              <strong>{percent}%</strong>
            </div>
            <div className="mini-bar mb-3">
              <span style={{ width: `${percent}%` }}></span>
            </div>
            <div className="prof-steps">
              {steps.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`prof-step ${item.done ? 'done' : ''}`}
                  onClick={() => !item.done && setEditing(true)}
                  disabled={item.done}
                >
                  <i className={`bi ${item.done ? 'bi-check-circle-fill' : item.icon}`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-3 mb-3">
            {stats.map((item) => (
              <div className="col-6 col-md-3" key={item.label}>
                <div className="ft-card prof-stat">
                  <i className={`bi ${item.icon}`}></i>
                  <strong>{item.value}</strong>
                  <small>{item.label}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="ft-card p-3 p-md-4 mb-3">
            <h2 className="panel-title">Account details</h2>
            {details.map((row) => (
              <div className="detail-row" key={row.label}>
                <span className="detail-icon">
                  <i className={`bi ${row.icon}`}></i>
                </span>
                <span className="text-secondary">{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>

          <div className="ft-card p-3 p-md-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
              <strong>Privacy and alerts</strong>
              <div className="text-secondary">Choose who can find you and what notifications you get.</div>
            </div>
            <Link to="/settings" className="btn btn-outline-secondary">
              <i className="bi bi-gear me-1"></i>Open settings
            </Link>
          </div>
        </div>
      </div>

      {editing && (
        <Modal title="Edit profile" onClose={() => setEditing(false)}>
          <ProfileForm user={user} onSubmit={handleSave} onCancel={() => setEditing(false)} />
        </Modal>
      )}
    </>
  )
}

export default Profile

