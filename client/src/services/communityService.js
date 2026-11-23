import { api } from './api'
import { getCurrentUser } from './authService'

export const topics = [
  { key: 'workouts', label: 'Workouts', icon: 'bi-lightning-charge' },
  { key: 'nutrition', label: 'Nutrition', icon: 'bi-egg-fried' },
  { key: 'progress', label: 'Progress', icon: 'bi-graph-up-arrow' },
  { key: 'motivation', label: 'Motivation', icon: 'bi-fire' },
  { key: 'questions', label: 'Questions', icon: 'bi-question-circle' },
]

const unknown = { id: '', name: 'A member', photo: '' }

let social = { following: [], followers: [], people: [] }

export const loadSocial = async () => {
  const [following, followers, people] = await Promise.all([
    api.get('/community/following'),
    api.get('/community/followers'),
    api.get('/community/people'),
  ])
  social = { following: following.ids, followers: followers.followers, people: people.people }
}

const resync = () => loadSocial().catch(() => {})

const bump = (id, change) => {
  social.people = social.people.map((item) => (item.id === id ? { ...item, followers: Math.max(0, item.followers + change) } : item))
}

const attach = ({ posts, people }) =>
  posts.map((post) => ({
    ...post,
    author: people[post.authorId] || unknown,
    replies: post.replies.map((reply) => ({ ...reply, author: people[reply.authorId] || unknown })),
  }))

export const getPosts = async () => attach(await api.get('/community/posts'))

export const addPost = async ({ title, body, topic }) => {
  await api.post('/community/posts', { title, body, topic })
}

export const addReply = async (postId, text) => {
  await api.post(`/community/posts/${postId}/replies`, { text })
}

export const toggleLike = async (postId) => {
  await api.post(`/community/posts/${postId}/like`)
}

export const deletePost = async (postId) => {
  await api.remove(`/community/posts/${postId}`)
}

export const getPeople = () => social.people

export const getFollowingIds = () => social.following

export const isFollowing = (id) => social.following.includes(id)

export const follow = (id) => {
  if (social.following.includes(id)) return
  social.following = [...social.following, id]
  bump(id, 1)
  api.post(`/community/follow/${id}`).catch(resync)
}

export const unfollow = (id) => {
  social.following = social.following.filter((item) => item !== id)
  bump(id, -1)
  api.remove(`/community/follow/${id}`).catch(resync)
}

export const getFollowers = () => social.followers

export const getFollowerCount = (id) => {
  if (id === getCurrentUser().id) return social.followers.length
  const found = social.people.find((item) => item.id === id)
  return found ? found.followers : 0
}

export const getMember = async (id) => {
  try {
    const { user } = await api.get(`/users/${id}`)
    return user
  } catch (error) {
    if (error.status === 404 || error.status === 400) return null
    throw error
  }
}

export const getMemberPosts = async (id) => attach(await api.get('/community/posts', { author: id }))

export const getMemberStats = async (id) => {
  const { stats } = await api.get(`/community/members/${id}/stats`)
  return stats
}

export const getStats = async () => {
  const { stats } = await api.get('/community/stats')
  return stats
}

export const getTopContributors = async () => {
  const { contributors } = await api.get('/community/contributors')
  return contributors
}

export const getCommunityAlerts = () => api.get('/community/alerts')
