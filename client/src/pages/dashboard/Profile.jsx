import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'

function Profile() {
  const { user } = useAuth()

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details." />

      <div className="row g-3">
        <div className="col-md-4">
          <div className="ft-card p-4 text-center h-100">
            <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <h2 className="h5 mb-1">{user.name}</h2>
            <p className="text-secondary mb-0">{user.email}</p>
          </div>
        </div>

        <div className="col-md-8">
          <div className="ft-card p-3 p-md-4 h-100">
            <h2 className="panel-title">Account</h2>
            <div className="info-row">
              <span className="text-secondary">Full name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="info-row">
              <span className="text-secondary">Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="info-row">
              <span className="text-secondary">Member since</span>
              <strong>{formatDate(user.createdAt)}</strong>
            </div>
            <div className="info-row">
              <span className="text-secondary">Privacy policy accepted</span>
              <strong>{formatDate(user.consentAcceptedAt)}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
