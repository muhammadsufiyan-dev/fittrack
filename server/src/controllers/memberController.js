import Follow from '../models/Follow.js'
import Post from '../models/Post.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { loadPeople } from './postController.js'

const visible = async (id, me) => {
  const user = await User.findById(id)
  if (!user || (!user.discoverable && user.id !== me)) throw new AppError('Member not found', 404)
  return user
}

export const getPeople = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id }, discoverable: true }).sort({ createdAt: -1 }).limit(100)
  const ids = users.map((item) => item._id)

  const [followers, posts] = await Promise.all([
    Follow.aggregate([{ $match: { following: { $in: ids } } }, { $group: { _id: '$following', total: { $sum: 1 } } }]),
    Post.aggregate([{ $match: { author: { $in: ids } } }, { $group: { _id: '$author', total: { $sum: 1 } } }]),
  ])
  const count = (list, id) => (list.find((item) => String(item._id) === id) || { total: 0 }).total

  res.json({
    people: users.map((item) => ({
      id: item.id,
      name: item.name,
      photo: item.photo,
      city: item.city,
      followers: count(followers, item.id),
      posts: count(posts, item.id),
    })),
  })
})

export const getFollowing = asyncHandler(async (req, res) => {
  const list = await Follow.find({ follower: req.user._id })
  res.json({ ids: list.map((item) => String(item.following)) })
})

export const getFollowers = asyncHandler(async (req, res) => {
  const list = await Follow.find({ following: req.user._id }).sort({ createdAt: -1 }).limit(100)
  const people = await loadPeople(list.map((item) => item.follower))
  const followers = list.filter((item) => people[item.follower]).map((item) => ({ ...people[item.follower], at: item.createdAt }))
  res.json({ followers })
})

export const follow = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) throw new AppError('You cannot follow yourself')
  await visible(req.params.id, req.user.id)

  await Follow.updateOne(
    { follower: req.user._id, following: req.params.id },
    { $setOnInsert: { follower: req.user._id, following: req.params.id } },
    { upsert: true }
  )
  res.json({ following: true })
})

export const unfollow = asyncHandler(async (req, res) => {
  await Follow.deleteOne({ follower: req.user._id, following: req.params.id })
  res.status(204).end()
})

export const getMemberStats = asyncHandler(async (req, res) => {
  const user = await visible(req.params.id, req.user.id)

  const [posts, likes, followers, following] = await Promise.all([
    Post.countDocuments({ author: user._id }),
    Post.aggregate([{ $match: { author: user._id } }, { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }]),
    Follow.countDocuments({ following: user._id }),
    Follow.countDocuments({ follower: user._id }),
  ])

  res.json({ stats: { posts, likes: likes.length ? likes[0].total : 0, followers, following } })
})

export const getCommunityStats = asyncHandler(async (req, res) => {
  const [members, posts, replies] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Post.aggregate([{ $group: { _id: null, total: { $sum: { $size: '$replies' } } } }]),
  ])

  res.json({ stats: { members, posts, replies: replies.length ? replies[0].total : 0 } })
})

export const getContributors = asyncHandler(async (req, res) => {
  const [written, replied] = await Promise.all([
    Post.aggregate([{ $group: { _id: '$author', total: { $sum: 1 } } }]),
    Post.aggregate([{ $unwind: '$replies' }, { $group: { _id: '$replies.author', total: { $sum: 1 } } }]),
  ])

  const scores = new Map()
  written.forEach((item) => scores.set(String(item._id), { posts: item.total, replies: 0 }))
  replied.forEach((item) => {
    const entry = scores.get(String(item._id)) || { posts: 0, replies: 0 }
    scores.set(String(item._id), { ...entry, replies: item.total })
  })

  const users = await User.find({ _id: { $in: [...scores.keys()] }, discoverable: true })

  const contributors = users
    .map((item) => {
      const { posts, replies } = scores.get(item.id)
      return { id: item.id, name: item.name, photo: item.photo, posts, replies, score: posts * 3 + replies }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  res.json({ contributors })
})

export const getAlerts = asyncHandler(async (req, res) => {
  const [list, mine] = await Promise.all([
    Follow.find({ following: req.user._id }).sort({ createdAt: -1 }).limit(20),
    Post.find({ author: req.user._id }).sort({ createdAt: -1 }).limit(50),
  ])

  const replies = mine
    .flatMap((post) =>
      post.replies.filter((reply) => String(reply.author) !== req.user.id).map((reply) => ({ id: reply.id, authorId: String(reply.author), text: reply.text, at: reply.createdAt, postTitle: post.title }))
    )
    .sort((a, b) => b.at - a.at)
    .slice(0, 20)

  const people = await loadPeople([...list.map((item) => item.follower), ...replies.map((item) => item.authorId)])
  const unknown = { id: '', name: 'A member', photo: '' }

  res.json({
    followers: list.filter((item) => people[item.follower]).map((item) => ({ ...people[item.follower], at: item.createdAt })),
    replies: replies.map(({ authorId, ...reply }) => ({ ...reply, author: people[authorId] || unknown })),
  })
})

