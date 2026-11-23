import app from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

const start = async () => {
  try {
    await connectDB()
    app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`))
  } catch (error) {
    console.error('Could not start the server:', error.message)
    process.exit(1)
  }
}

start()
