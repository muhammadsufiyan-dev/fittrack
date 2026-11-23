import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import FormGroup from '../../components/ui/FormGroup'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import useConfirm from '../../hooks/useConfirm'
import {
  addPost,
  addReply,
  deletePost,
  follow,
  getFollowerCount,
  getFollowers,
  getFollowingIds,
  getPeople,
  getPosts,
  getStats,
  getTopContributors,
  loadSocial,
  toggleLike,
  topics,
  unfollow,
} from '../../services/communityService'
import { ago } from '../../utils/time'

const tabs = [
  { key: 'latest', label: 'Latest' },
  { key: 'popular', label: 'Popular' },
  { key: 'following', label: 'Following' },
  { key: 'people', label: 'People' },
]

const topicOf = (key) => topics.find((item) => item.key === key) || topics[topics.length - 1]

function PostForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ topic: topics[0].key, title: '', body: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const found = {}
    if (form.title.trim().length < 3) found.title = 'Write a short title'
    if (form.body.trim().length < 5) found.body = 'Write a little more'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({ topic: form.topic, title: form.title.trim(), body: form.body.trim() })
  }

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="form-section">Topic</div>
        <div className="chip-row mb-3">
          {topics.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`chip-btn ${form.topic === item.key ? 'active' : ''}`}
              onClick={() => setForm({ ...form, topic: item.key })}
            >
              <i className={`bi ${item.icon} me-1`}></i>
              {item.label}
            </button>
          ))}
        </div>

        <FormGroup label="Title" htmlFor="title" error={errors.title} className="mb-3">
          <input
            id="title"
            name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="What do you want to ask or share?"
            value={form.title}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Details" htmlFor="body" error={errors.body}>
          <textarea
            id="body"
            name="body"
            rows="5"
            className={`form-control ${errors.body ? 'is-invalid' : ''}`}
            value={form.body}
            onChange={handleChange}
          ></textarea>
        </FormGroup>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-send me-1"></i>Post
        </button>
      </div>
    </form>
  )
}

function Community() {
  const { user } = useAuth()
  const confirm = useConfirm()
  const [posts, setPosts] = useState(null)
  const [stats, setStats] = useState({ members: 0, posts: 0, replies: 0 })
  const [top, setTop] = useState([])
  const [following, setFollowing] = useState(getFollowingIds)
  const [tab, setTab] = useState('latest')
  const [topic, setTopic] = useState('all')
  const [term, setTerm] = useState('')
  const [openId, setOpenId] = useState(null)
  const [reply, setReply] = useState('')
  const [modal, setModal] = useState(false)

  const load = async () => {
    await loadSocial()
    setFollowing(getFollowingIds())
    setPosts(await getPosts())
    setStats(await getStats())
    setTop(await getTopContributors())
  }

  useEffect(() => {
    load()
  }, [])

  const handlePost = async (data) => {
    await addPost(data)
    setModal(false)
    setTab('latest')
    setTopic('all')
    load()
  }

  const handleReply = async (event, postId) => {
    event.preventDefault()
    if (!reply.trim()) return
    await addReply(postId, reply.trim())
    setReply('')
    load()
  }

  const handleLike = async (postId) => {
    await toggleLike(postId)
    load()
  }

  const handleDelete = async (post) => {
    if (await confirm({ title: 'Delete post?', message: `"${post.title}" will be removed.` })) {
      await deletePost(post.id)
      load()
    }
  }

  const toggleFollow = (id) => {
    if (following.includes(id)) unfollow(id)
    else follow(id)
    setFollowing(getFollowingIds())
  }

  if (!posts) return <Loader />

  const people = getPeople()
  const followers = getFollowers()
  const query = term.trim().toLowerCase()
  const isPeople = tab === 'people'

  let visible = posts.filter((post) => topic === 'all' || post.topic === topic)
  if (tab === 'following') visible = visible.filter((post) => following.includes(post.authorId))
  if (query) visible = visible.filter((post) => `${post.title} ${post.body}`.toLowerCase().includes(query))
  if (tab === 'popular') {
    visible = [...visible].sort((a, b) => b.likes.length * 2 + b.replies.length - (a.likes.length * 2 + a.replies.length))
  }

  const members = people.filter((item) => !query || `${item.name} ${item.city}`.toLowerCase().includes(query))

  const followButton = (id, className = '') => {
    const isFollowed = following.includes(id)
    return (
      <button
        type="button"
        className={`btn btn-sm ${isFollowed ? 'btn-outline-secondary' : 'btn-primary'} ${className}`}
        onClick={() => toggleFollow(id)}
      >
        <i className={`bi ${isFollowed ? 'bi-person-check' : 'bi-person-plus'} me-1`}></i>
        {isFollowed ? 'Following' : 'Follow'}
      </button>
    )
  }

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
      <i className="bi bi-plus-lg me-1"></i>New post
    </button>
  )

  return (
    <>
      <PageHeader title="Community" subtitle="Ask questions, share wins and cheer each other on." action={addButton} />

      <div className="comm-layout">
        <main className="comm-main">
          <div className="ft-card composer">
            <Avatar user={user} className="avatar member-avatar" />
            <button type="button" className="composer-pill" onClick={() => setModal(true)}>
              Share a tip, a win or ask a question...
            </button>
            <button type="button" className="btn btn-primary composer-send" onClick={() => setModal(true)} aria-label="New post">
              <i className="bi bi-pencil-square"></i>
              <span>Post</span>
            </button>
          </div>

          <div className="comm-bar">
            <div className="comm-tabs">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`comm-tab ${tab === item.key ? 'active' : ''}`}
                  onClick={() => setTab(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="comm-search">
              <i className="bi bi-search"></i>
              <input
                type="search"
                className="form-control"
                placeholder={isPeople ? 'Search members' : 'Search posts'}
                aria-label={isPeople ? 'Search members' : 'Search posts'}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
              />
            </div>
          </div>

          {!isPeople && (
            <div className="chip-row mb-3">
              <button type="button" className={`chip-btn ${topic === 'all' ? 'active' : ''}`} onClick={() => setTopic('all')}>
                All
              </button>
              {topics.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`chip-btn ${topic === item.key ? 'active' : ''}`}
                  onClick={() => setTopic(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {isPeople &&
            (members.length === 0 ? (
              <EmptyState icon="bi-people" title="No members found" text="Try another name or city." />
            ) : (
              <div className="people-grid">
                {members.map((item) => (
                  <div className="ft-card person-card" key={item.id}>
                    <Avatar user={item} className="avatar member-avatar big" />
                    <Link to={`/users/${item.id}`} className="post-author">
                      {item.name}
                    </Link>
                    <small className="person-city">{item.city || 'FitTrack member'}</small>
                    <div className="person-stats">
                      <span>
                        <strong>{posts.filter((post) => post.authorId === item.id).length}</strong>
                        Posts
                      </span>
                      <span>
                        <strong>{getFollowerCount(item.id)}</strong>
                        Followers
                      </span>
                    </div>
                    <div className="person-actions">
                      {followButton(item.id)}
                      <Link to={`/users/${item.id}`} className="btn btn-sm btn-outline-secondary">
                        Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {!isPeople &&
            (visible.length === 0 ? (
              <EmptyState
                icon={tab === 'following' ? 'bi-person-plus' : 'bi-chat-dots'}
                title={tab === 'following' ? 'Nothing from people you follow' : 'No posts found'}
                text={tab === 'following' ? 'Open the People tab and follow a few members.' : 'Be the first to start this conversation.'}
                action={addButton}
              />
            ) : (
              visible.map((post, index) => {
                const isOpen = openId === post.id
                const tag = topicOf(post.topic)

                return (
                  <article className="ft-card post-card" key={post.id} style={{ '--i': index }}>
                    <div className="post-head">
                      <Avatar user={post.author} className="avatar member-avatar" />
                      <div className="post-who">
                        <Link to={`/users/${post.author.id}`} className="post-author">
                          {post.author.id === user.id ? 'You' : post.author.name}
                        </Link>
                        <small>{ago(post.createdAt)}</small>
                      </div>
                      <span className={`topic-tag topic-${post.topic}`}>
                        <i className={`bi ${tag.icon}`}></i>
                        {tag.label}
                      </span>
                    </div>

                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-body">{post.body}</p>

                    <div className="post-actions">
                      <button type="button" className={`post-btn like ${post.liked ? 'on' : ''}`} onClick={() => handleLike(post.id)}>
                        <i className={`bi ${post.liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        {post.likes.length}
                      </button>
                      <button type="button" className={`post-btn ${isOpen ? 'on' : ''}`} onClick={() => setOpenId(isOpen ? null : post.id)}>
                        <i className="bi bi-chat-dots"></i>
                        {post.replies.length}
                      </button>
                      {post.authorId !== user.id && (
                        <span className="ms-auto">{followButton(post.authorId)}</span>
                      )}
                      {post.authorId === user.id && (
                        <button type="button" className="post-btn danger ms-auto" onClick={() => handleDelete(post)} aria-label="Delete post">
                          <i className="bi bi-trash3"></i>
                        </button>
                      )}
                    </div>

                    {isOpen && (
                      <div className="post-replies">
                        {post.replies.map((item) => (
                          <div className="reply-row" key={item.id}>
                            <Avatar user={item.author} className="avatar member-avatar small" />
                            <div className="reply-bubble">
                              <strong>{item.author.id === user.id ? 'You' : item.author.name}</strong>
                              <small>{ago(item.at)}</small>
                              <p>{item.text}</p>
                            </div>
                          </div>
                        ))}

                        <form className="reply-form" onSubmit={(event) => handleReply(event, post.id)}>
                          <input
                            className="form-control"
                            placeholder="Write a reply"
                            aria-label="Write a reply"
                            value={reply}
                            onChange={(event) => setReply(event.target.value)}
                          />
                          <button type="submit" className="btn btn-primary" aria-label="Send reply">
                            <i className="bi bi-send"></i>
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                )
              })
            ))}
        </main>

        <aside className="comm-side">
          <div className="ft-card side-card you-card">
            <Avatar user={user} className="avatar member-avatar big" />
            <strong>{user.name}</strong>
            <div className="mini-stats">
              <div>
                <strong>{followers.length}</strong>
                <small>Followers</small>
              </div>
              <div>
                <strong>{following.length}</strong>
                <small>Following</small>
              </div>
              <div>
                <strong>{posts.filter((post) => post.authorId === user.id).length}</strong>
                <small>Posts</small>
              </div>
            </div>
            <Link to={`/users/${user.id}`} className="btn btn-sm btn-outline-secondary w-100">
              View my profile
            </Link>
            <small className="side-note">
              {stats.members} members - {stats.posts} posts - {stats.replies} {stats.replies === 1 ? 'reply' : 'replies'}
            </small>
          </div>

          <div className="ft-card side-card">
            <h2 className="side-title">Topics</h2>
            {topics.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`topic-row ${topic === item.key ? 'active' : ''}`}
                onClick={() => {
                  setTab(tab === 'people' ? 'latest' : tab)
                  setTopic(topic === item.key ? 'all' : item.key)
                }}
              >
                <span className={`topic-dot topic-${item.key}`}>
                  <i className={`bi ${item.icon}`}></i>
                </span>
                {item.label}
                <span className="topic-count">{posts.filter((post) => post.topic === item.key).length}</span>
              </button>
            ))}
          </div>

          <div className="ft-card side-card">
            <h2 className="side-title">Top contributors</h2>
            {top.length === 0 ? (
              <p className="text-secondary mb-0">Post or reply to appear here.</p>
            ) : (
              top.map((item, index) => (
                <div className="side-row" key={item.id}>
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                  <Avatar user={item} className="avatar member-avatar" />
                  <div>
                    <Link to={`/users/${item.id}`} className="post-author">
                      {item.id === user.id ? 'You' : item.name}
                    </Link>
                    <small>
                      {item.posts} {item.posts === 1 ? 'post' : 'posts'} - {item.replies} {item.replies === 1 ? 'reply' : 'replies'}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="ft-card side-card">
            <h2 className="side-title">People to follow</h2>
            {people.length === 0 ? (
              <p className="text-secondary mb-0">No other members yet.</p>
            ) : (
              people.slice(0, 5).map((item) => (
                <div className="side-row" key={item.id}>
                  <Avatar user={item} className="avatar member-avatar" />
                  <div>
                    <Link to={`/users/${item.id}`} className="post-author">
                      {item.name}
                    </Link>
                    <small>{item.city || 'FitTrack member'}</small>
                  </div>
                  {followButton(item.id)}
                </div>
              ))
            )}
            {people.length > 5 && (
              <button type="button" className="btn btn-sm btn-outline-secondary w-100 mt-2" onClick={() => setTab('people')}>
                See all members
              </button>
            )}
          </div>
        </aside>
      </div>

      {modal && (
        <Modal title="New post" onClose={() => setModal(false)}>
          <PostForm onSubmit={handlePost} onCancel={() => setModal(false)} />
        </Modal>
      )}
    </>
  )
}

export default Community


