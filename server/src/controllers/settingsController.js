import Settings, { notifyKeys } from '../models/Settings.js'
import asyncHandler from '../utils/asyncHandler.js'

const load = async (userId) => (await Settings.findOne({ user: userId })) || Settings.create({ user: userId })

export const getSettings = asyncHandler(async (req, res) => {
  res.json({ settings: await load(req.user.id) })
})

export const updateSettings = asyncHandler(async (req, res) => {
  const units = req.body.units || {}
  const notify = req.body.notify || {}
  const settings = await load(req.user.id)

  if (req.body.theme !== undefined) settings.theme = req.body.theme
  if (units.weight !== undefined) settings.units.weight = units.weight
  if (units.length !== undefined) settings.units.length = units.length

  for (const key of notifyKeys) {
    if (typeof notify[key] === 'boolean') settings.notify[key] = notify[key]
  }

  await settings.save()
  res.json({ settings })
})
