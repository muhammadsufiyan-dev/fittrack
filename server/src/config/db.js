import mongoose from 'mongoose'
import { env } from './env.js'

let connecting = null

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return
  if (!connecting) {
    connecting = mongoose
      .connect(env.mongoUri, { maxPoolSize: 10, serverSelectionTimeoutMS: 8000 })
      .then(() => console.log('MongoDB connected'))
      .catch((error) => {
        connecting = null
        throw error
      })
  }
  await connecting
}