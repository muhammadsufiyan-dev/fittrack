import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import { getUsers } from '../../services/authService'
import { follow, getMemberPosts, getMemberStats, isFollowing, topics, unfollow } from '../../services/communityService'
import { formatDate } from '../../utils/format'
import { ago } from '../../utils/time'

const topicOf = (key) => topics.find((item) => item.key === key) || topics[topics.length - 1]

function UserProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [following, setFollowing] = useState(() => isFollowing(id))
  const [data, setData] = useState(null)
  const member = getUsers().find((item) => item.id === id)
  const isMe = member && member.id === user.id

  const load = () => {
    Promise.all([getMemberStats(id), getMemberPosts(id)]).then(([stats, posts]) => setData({ stats, posts }))
  }

  useEffect(() => {
    setFollowing(isFollowing(id))
    load()
  }, [id])

  if (!member || (!isMe && member.discoverable === false)) {
    return (
      <>
        <PageHeader title="Member" subtitle="This profile is not available." icon="bi-person-badge" />
        <EmptyState
          icon="bi-person-x"
          title="Member not found"
          text="They may have removed their account or hidden their profile."
          action={
            <Link to="/community" className="btn btn-primary">
              Back to community
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
    load()
  }

  const stats = data ? data.stats : { posts: 0, followers: 0, following: 0, likes: 0 }
  const posts = data ? data.posts : []
  const firstName = member.name.split(' ')[0]

  return (
    <>
      <PageHeader title={member.name} subtitle={member.city || 'FitTrack member'} icon="bi-person-badge" />

      <div className="row g-3">
        <div className="col-lg-4 order-lg-2">
          <div className="ft-card prof-card">
            <div className="prof-cover"></div>
            <div className="prof-body">
              <Avatar user={member} className="prof-avatar" />
              <h2>{isMe ? `${member.name} (You)` : member.name}</h2>
              {member.city && (
                <p className="prof-email">
                  <i className="bi bi-geo-alt me-1"></i>
                  {member.city}
                </p>
              )}
              <p className="prof-bio">{member.bio || 'This member has not added a bio yet.'}</p>
              <div className="prof-chips">
                <span>
                  <i className="bi bi-calendar-check"></i>
                  Joined {formatDate(member.createdAt)}
                </span>
              </div>

              <div className="mini-stats">
                <div>
                  <strong>{stats.posts}</strong>
                  <small>Posts</small>
                </div>
                <div>
                  <strong>{stats.followers}</strong>
                  <small>Followers</small>
                </div>
                <div>
                  <strong>{stats.following}</strong>
                  <small>Following</small>
                </div>
              </div>

              {isMe ? (
                <Link to="/profile" className="btn btn-outline-secondary w-100">
                  <i className="bi bi-pencil me-1"></i>Edit my profile
                </Link>
              ) : (
                <button type="button" className={`btn w-100 ${following ? 'btn-outline-secondary' : 'btn-primary'}`} onClick={toggleFollow}>
                  <i className={`bi ${following ? 'bi-person-check' : 'bi-person-plus'} me-1`}></i>
                  {following ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8 order-lg-1">
          <div className="member-head">
            <h2 className="panel-title mb-0">{isMe ? 'Your posts' : `Posts by ${firstName}`}</h2>
            <span className="status-pill">
              {stats.posts} {stats.posts === 1 ? 'post' : 'posts'} - {stats.likes} {stats.likes === 1 ? 'like' : 'likes'}
            </span>
          </div>

          {posts.length === 0 ? (
            <EmptyState
              icon="bi-chat-dots"
              title="No posts yet"
              text={isMe ? 'Share something with the community.' : `${firstName} has not posted anything yet.`}
              action={
                <Link to="/community" className="btn btn-primary">
                  Open community
                </Link>
              }
            />
          ) : (
            posts.map((post) => {
              const tag = topicOf(post.topic)
              return (
                <article className="ft-card post-card" key={post.id}>
                  <div className="post-head">
                    <small className="text-secondary flex-grow-1">{ago(post.createdAt)}</small>
                    <span className={`topic-tag topic-${post.topic}`}>
                      <i className={`bi ${tag.icon}`}></i>
                      {tag.label}
                    </span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-body">{post.body}</p>
                  <div className="post-actions">
                    <span className="post-btn static">
                      <i className="bi bi-heart"></i>
                      {post.likes.length}
                    </span>
                    <span className="post-btn static">
                      <i className="bi bi-chat-dots"></i>
                      {post.replies.length}
                    </span>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile
