import seedPosts from '../data/posts.json'
import { getCurrentUser, getUsers } from './authService'
import { createStore } from './localStore'

const posts = createStore('ft_community', seedPosts)

export const topics = [
  { key: 'workouts', label: 'Workouts', icon: 'bi-lightning-charge' },
  { key: 'nutrition', label: 'Nutrition', icon: 'bi-egg-fried' },
  { key: 'progress', label: 'Progress', icon: 'bi-graph-up-arrow' },
  { key: 'motivation', label: 'Motivation', icon: 'bi-fire' },
  { key: 'questions', label: 'Questions', icon: 'bi-question-circle' },
]

const me = () => getCurrentUser()

const person = (id) => {
  const found = getUsers().find((item) => item.id === id)
  return found ? { id: found.id, name: found.name, photo: found.photo || '' } : { id, name: 'A member', photo: '' }
}

const others = () => getUsers().filter((item) => item.id !== me().id && item.discoverable !== false)

const followingStore = () => createStore(`ft_following_${me().id}`, [])

const followersStore = () =>
  createStore(
    `ft_followers_${me().id}`,
    others()
      .slice(0, 2)
      .map((item, index) => ({ id: item.id, at: new Date(Date.now() - (index + 1) * 3600000).toISOString() }))
  )

const isVisible = (reply) => new Date(reply.at) <= new Date()

export const getPosts = async () => {
  return posts
    .read()
    .map((post) => ({
      ...post,
      topic: post.topic || 'questions',
      likes: post.likes || [],
      liked: (post.likes || []).includes(me().id),
      author: person(post.authorId),
      replies: post.replies.filter(isVisible).map((reply) => ({ ...reply, author: person(reply.authorId) })),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const addPost = async ({ title, body, topic }) => {
  const now = Date.now()
  const post = {
    id: `p${now}`,
    authorId: me().id,
    topic,
    title,
    body,
    createdAt: new Date(now).toISOString(),
    likes: [],
    replies: [],
  }

  const helper = others()[0]
  if (helper) {
    post.replies.push({
      id: `r${now}`,
      authorId: helper.id,
      text: 'Welcome to the community! Thanks for sharing this.',
      at: new Date(now + 60000).toISOString(),
    })
  }

  posts.save([post, ...posts.read()])
}

export const addReply = async (postId, text) => {
  const reply = { id: `r${Date.now()}`, authorId: me().id, text, at: new Date().toISOString() }
  posts.save(posts.read().map((post) => (post.id === postId ? { ...post, replies: [...post.replies, reply] } : post)))
}

export const toggleLike = async (postId) => {
  const id = me().id
  posts.save(
    posts.read().map((post) => {
      if (post.id !== postId) return post
      const likes = post.likes || []
      return { ...post, likes: likes.includes(id) ? likes.filter((item) => item !== id) : [...likes, id] }
    })
  )
}

export const deletePost = async (postId) => {
  posts.save(posts.read().filter((post) => !(post.id === postId && post.authorId === me().id)))
}

export const getPeople = () => others().map((item) => ({ id: item.id, name: item.name, photo: item.photo || '', city: item.city || '' }))

export const getFollowingIds = () => followingStore().read()

export const isFollowing = (id) => followingStore().read().includes(id)

export const follow = (id) => {
  const store = followingStore()
  store.save([...new Set([...store.read(), id])])
}

export const unfollow = (id) => {
  const store = followingStore()
  store.save(store.read().filter((item) => item !== id))
}

export const getFollowers = () => followersStore().read().map((item) => ({ ...person(item.id), at: item.at }))

export const getStats = async () => {
  const list = posts.read()
  return {
    members: getUsers().length,
    posts: list.length,
    replies: list.reduce((total, post) => total + post.replies.length, 0),
  }
}

export const getTopContributors = async () => {
  const list = posts.read()

  return getUsers()
    .map((item) => {
      const written = list.filter((post) => post.authorId === item.id).length
      const replied = list.reduce((total, post) => total + post.replies.filter((reply) => reply.authorId === item.id).length, 0)
      return { id: item.id, name: item.name, photo: item.photo || '', posts: written, replies: replied, score: written * 3 + replied }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export const getCommunityAlerts = async () => {
  const user = me()
  const mine = (await getPosts()).filter((post) => post.authorId === user.id)

  return {
    followers: getFollowers(),
    replies: mine.flatMap((post) =>
      post.replies.filter((reply) => reply.authorId !== user.id).map((reply) => ({ ...reply, postTitle: post.title }))
    ),
  }
}

const followerIds = (id) =>
  getUsers()
    .filter((item) => item.id !== id && createStore(`ft_following_${item.id}`, []).read().includes(id))
    .map((item) => item.id)

export const getFollowerCount = (id) => {
  const ids = followerIds(id)
  if (id === me().id) getFollowers().forEach((item) => ids.push(item.id))
  return new Set(ids).size
}

export const getFollowingCount = (id) => createStore(`ft_following_${id}`, []).read().length

export const getMemberPosts = async (id) => (await getPosts()).filter((post) => post.authorId === id)

export const getMemberStats = async (id) => {
  const written = posts.read().filter((post) => post.authorId === id)

  return {
    posts: written.length,
    likes: written.reduce((total, post) => total + (post.likes || []).length, 0),
    followers: getFollowerCount(id),
    following: getFollowingCount(id),
  }
}
