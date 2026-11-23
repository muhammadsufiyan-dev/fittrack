import { env } from '../config/env.js'

export const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' })
}

export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500
  let message = err.message || 'Something went wrong'

  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')
  }

  if (err.code === 11000) {
    status = 409
    message = 'This value is already in use'
  }

  if (err.name === 'CastError') {
    status = 400
    message = 'Invalid id'
  }

  if (err.type === 'entity.parse.failed') message = 'The request body is not valid JSON'

  if (status === 500) console.error(err)

  res.status(status).json({ message: status === 500 && env.isProd ? 'Server error' : message })
}

