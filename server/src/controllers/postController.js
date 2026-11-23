import Post, { topics } from '../models/Post.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { pick } from '../utils/fields.js'
import { text } from '../utils/text.js'

export const loadPeople = async (ids) => {
  const users = await User.find({ _id: { $in: ids } }).select('name photo')
  return Object.fromEntries(users.map((item) => [item.id, { id: item.id, name: item.name, photo: item.photo }]))
}

const shape = (post, me) => ({
  id: post.id,
  authorId: String(post.author),
  topic: post.topic,
  title: post.title,
  body: post.body,
  createdAt: post.createdAt,
  likes: post.likes.map(String),
  liked: post.likes.some((item) => String(item) === me),
  replies: post.replies.map((reply) => ({ id: reply.id, authorId: String(reply.author), text: reply.text, at: reply.createdAt })),
})

const present = async (posts, me) => {
  const ids = new Set()
  posts.forEach((post) => {
    ids.add(String(post.author))
    post.replies.forEach((reply) => ids.add(String(reply.author)))
  })
  return { posts: posts.map((post) => shape(post, me)), people: await loadPeople([...ids]) }
}

const respond = async (post, me) => {
  const { posts, people } = await present([post], me)
  return { post: posts[0], people }
}

export const listPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)
  const filter = req.query.author ? { author: text(req.query.author) } : {}
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(limit)
  res.json(await present(posts, req.user.id))
})

export const createPost = asyncHandler(async (req, res) => {
  const title = text(req.body.title).trim()
  const body = text(req.body.body).trim()

  if (title.length < 3) throw new AppError('Enter a title of at least 3 characters')
  if (!body) throw new AppError('Write something in your post')

  const post = await Post.create({
    author: req.user.id,
    topic: pick(req.body.topic, topics, 'Choose a valid topic'),
    title,
    body,
  })
  res.status(201).json(await respond(post, req.user.id))
})

export const toggleLike = asyncHandler(async (req, res) => {
  const current = await Post.findById(req.params.id)
  if (!current) throw new AppError('Post not found', 404)

  const liked = current.likes.some((item) => String(item) === req.user.id)
  const update = liked ? { $pull: { likes: req.user._id } } : { $addToSet: { likes: req.user._id } }
  const post = await Post.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' })
  res.json(await respond(post, req.user.id))
})

export const addReply = asyncHandler(async (req, res) => {
  const reply = text(req.body.text).trim()
  if (!reply) throw new AppError('Write a reply first')
  if (reply.length > 500) throw new AppError('Replies can be up to 500 characters')

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, 'replies.199': { $exists: false } },
    { $push: { replies: { author: req.user._id, text: reply } } },
    { returnDocument: 'after' }
  )
  if (!post) throw new AppError('Post not found', 404)
  res.status(201).json(await respond(post, req.user.id))
})

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id })
  if (!post) throw new AppError('Post not found', 404)
  res.status(204).end()
})


