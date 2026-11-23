import Support, { supportTypes } from '../models/Support.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { pick } from '../utils/fields.js'
import { text } from '../utils/text.js'

export const listRequests = asyncHandler(async (req, res) => {
  const requests = await Support.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json({ requests })
})

export const createRequest = asyncHandler(async (req, res) => {
  const subject = text(req.body.subject).trim()
  const message = text(req.body.message).trim()

  if (subject.length < 3) throw new AppError('Write a short subject')
  if (message.length < 10) throw new AppError('Tell us a little more (at least 10 letters)')

  const request = await Support.create({
    user: req.user.id,
    type: pick(req.body.type, supportTypes, 'Choose a valid message type'),
    subject,
    message,
  })
  res.status(201).json({ request })
})

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Support.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!request) throw new AppError('Not found', 404)
  res.status(204).end()
})
