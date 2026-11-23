import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { verifyToken } from '../utils/token.js'

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) throw new AppError('Please log in first', 401)

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw new AppError('Your session has expired. Please log in again', 401)
  }

  const user = await User.findById(payload.id)
  if (!user) throw new AppError('This account no longer exists', 401)

  req.user = user
  next()
})

export default protect
