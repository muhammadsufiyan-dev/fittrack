import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/error.js'
import { apiLimiter } from './middleware/rateLimit.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import dataRoutes from './routes/dataRoutes.js'
import goalsRoutes from './routes/goalsRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import nutritionRoutes from './routes/nutritionRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import reminderRoutes from './routes/remindersRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import supportRoutes from './routes/supportRoutes.js'
import userRoutes from './routes/userRoutes.js'
import workoutRoutes from './routes/workoutsRoutes.js'

const app = express()

if (env.isProd) app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({ origin: env.clientUrls }))
app.use(express.json({ limit: '2mb' }))
app.use((req, res, next) => {
  req.body = req.body || {}
  next()
})
app.use(morgan(env.isProd ? 'combined' : 'dev', { skip: () => process.env.NODE_ENV === 'test' }))
app.use('/api', apiLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/reminders', reminderRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/data', dataRoutes)

app.use(notFound)
app.use(errorHandler)

export default app





