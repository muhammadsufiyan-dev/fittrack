import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import { getUsers } from '../../services/authService'
import { follow, isFollowing, unfollow } from '../../services/communityService'
import { formatDate } from '../../utils/format'

function UserProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [following, setFollowing] = useState(() => isFollowing(id))
  const member = getUsers().find((item) => item.id === id)
  const isMe = member && member.id === user.id

  if (!member || (!isMe && member.discoverable === false)) {
    return (
      <>
        <PageHeader title="Member" subtitle="This profile is not available." icon="bi-person-badge" />
        <EmptyState
          icon="bi-person-x"
          title="Member not found"
          text="They may have removed their account or hidden their profile."
          action={
            <Link to="/search" className="btn btn-primary">
              Back to search
            </Link>
          }
        />
      </>
    )
  }

  const toggleFollow = () => {
    if (following) unfollow(member.id)
    else follow(member.id)
    setFollowing(!following)
  }

  return (
    <>
      <PageHeader title={member.name} subtitle={member.city || 'FitTrack member'} icon="bi-person-badge" />

      <div className="ft-card p-4 member-card">
        <Avatar user={member} className="profile-avatar" />
        <h2 className="h4 mb-1">{member.name}</h2>
        {member.city && (
          <p className="text-secondary mb-2">
            <i className="bi bi-geo-alt me-1"></i>
            {member.city}
          </p>
        )}
        <p className="profile-bio">{member.bio || 'This member has not added a bio yet.'}</p>
        <span className="account-since">
          <i className="bi bi-calendar-check"></i>
          Member since {formatDate(member.createdAt)}
        </span>

        <div className="mt-3">
          {isMe ? (
            <Link to="/profile" className="btn btn-outline-secondary">
              Edit my profile
            </Link>
          ) : (
            <button type="button" className={`btn ${following ? 'btn-outline-secondary' : 'btn-primary'}`} onClick={toggleFollow}>
              <i className={`bi ${following ? 'bi-person-check' : 'bi-person-plus'} me-1`}></i>
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile
