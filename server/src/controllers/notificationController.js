import NotificationState from '../models/NotificationState.js'
import asyncHandler from '../utils/asyncHandler.js'
import { list } from '../utils/fields.js'
import { text } from '../utils/text.js'

const keep = 1000

const load = async (userId) => (await NotificationState.findOne({ user: userId })) || NotificationState.create({ user: userId })

const ids = (value) => list(value, 100).map((item) => text(item).trim().slice(0, 120)).filter(Boolean)

const merge = (field) =>
  asyncHandler(async (req, res) => {
    const state = await load(req.user.id)
    state[field] = [...new Set([...state[field], ...ids(req.body.ids)])].slice(-keep)
    await state.save()
    res.json({ read: state.read, hidden: state.hidden })
  })

export const getState = asyncHandler(async (req, res) => {
  const state = await load(req.user.id)
  res.json({ read: state.read, hidden: state.hidden })
})

export const markRead = merge('read')
export const dismiss = merge('hidden')
