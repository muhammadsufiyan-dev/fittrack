import app from '../src/app.js'
import { connectDB } from '../src/config/db.js'

let connecting

export default async (req, res) => {
  try {
    connecting = connecting || connectDB()
    await connecting
  } catch (error) {
    connecting = null
    return res.status(500).json({ message: 'Database connection failed' })
  }
  return app(req, res)
}
