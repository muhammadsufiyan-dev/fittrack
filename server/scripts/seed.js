import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import Follow from '../src/models/Follow.js'
import Goal from '../src/models/Goal.js'
import NotificationState from '../src/models/NotificationState.js'
import Nutrition from '../src/models/Nutrition.js'
import Post from '../src/models/Post.js'
import Progress from '../src/models/Progress.js'
import Reminder from '../src/models/Reminder.js'
import Settings from '../src/models/Settings.js'
import Support from '../src/models/Support.js'
import User from '../src/models/User.js'
import Workout from '../src/models/Workout.js'
import { shift } from '../src/utils/dates.js'

const today = new Date().toISOString().slice(0, 10)
const ago = (days) => shift(today, -days)
const hoursAgo = (hours) => new Date(Date.now() - hours * 3600000)

const password = 'Demo@123'

const members = [
  { name: 'Demo Member', email: 'demo@fittrack.com', city: 'Karachi', bio: 'Training for a stronger, fitter year.' },
  { name: 'Ayesha Khan', email: 'ayesha@fittrack.com', city: 'Lahore', bio: 'Runner and yoga lover.' },
  { name: 'Hamza Ali', email: 'hamza@fittrack.com', city: 'Islamabad', bio: 'Lifting four days a week.' },
  { name: 'Sara Ahmed', email: 'sara@fittrack.com', city: 'Karachi', bio: 'Meal prep and morning workouts.' },
]

const lift = (name, sets, reps, weight) => ({ id: `${name}-${sets}`.toLowerCase().replace(/\s+/g, '-'), name, sets, reps, weight })

const food = (name, calories, protein, carbs, fats) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, calories, protein, carbs, fats })

const workouts = [
  { name: 'Upper body strength', category: 'Strength', date: ago(0), duration: 45, calories: 320, tags: ['chest', 'arms'], exercises: [lift('Bench Press', 4, 8, 60), lift('Shoulder Press', 3, 10, 30)] },
  { name: 'Morning run', category: 'Cardio', date: ago(1), duration: 30, calories: 290, tags: ['run'], exercises: [] },
  { name: 'Leg day', category: 'Strength', date: ago(2), duration: 55, calories: 410, tags: ['legs'], exercises: [lift('Squat', 4, 8, 80), lift('Lunges', 3, 12, 20)] },
  { name: 'HIIT circuit', category: 'HIIT', date: ago(3), duration: 25, calories: 300, tags: ['fat loss'], exercises: [] },
  { name: 'Yoga flow', category: 'Flexibility', date: ago(5), duration: 40, calories: 160, tags: ['mobility'], exercises: [] },
  { name: 'Back and biceps', category: 'Strength', date: ago(6), duration: 50, calories: 340, tags: ['back'], exercises: [lift('Deadlift', 3, 5, 100), lift('Barbell Row', 4, 8, 50)] },
  { name: 'Evening ride', category: 'Cardio', date: ago(8), duration: 45, calories: 380, tags: ['cycling'], exercises: [] },
  { name: 'Core blast', category: 'HIIT', date: ago(9), duration: 20, calories: 220, tags: ['core'], exercises: [] },
  { name: 'Full body strength', category: 'Strength', date: ago(11), duration: 60, calories: 430, tags: ['full body'], exercises: [lift('Squat', 4, 6, 85), lift('Bench Press', 4, 6, 62)] },
  { name: 'Easy jog', category: 'Cardio', date: ago(13), duration: 30, calories: 260, tags: ['run'], exercises: [] },
]

const meals = [
  { date: ago(0), mealType: 'Breakfast', items: [food('Oats with banana', 320, 11, 58, 6), food('Boiled eggs', 140, 12, 1, 10)] },
  { date: ago(0), mealType: 'Lunch', items: [food('Chicken rice bowl', 560, 38, 62, 14)] },
  { date: ago(1), mealType: 'Breakfast', items: [food('Paratha with omelette', 480, 18, 42, 26)] },
  { date: ago(1), mealType: 'Dinner', items: [food('Daal and roti', 450, 20, 70, 9)] },
  { date: ago(1), mealType: 'Snack', items: [food('Greek yogurt', 150, 15, 9, 5)] },
  { date: ago(2), mealType: 'Lunch', items: [food('Beef karahi with roti', 640, 36, 48, 30)] },
  { date: ago(2), mealType: 'Dinner', items: [food('Grilled fish and salad', 420, 40, 14, 22)] },
  { date: ago(3), mealType: 'Breakfast', items: [food('Protein shake', 220, 30, 12, 4)] },
]

const weights = [
  { date: ago(0), weight: 72.4, bodyFat: 18.5, waist: 82, chest: 98, hips: 94 },
  { date: ago(7), weight: 73, bodyFat: 18.9, waist: 83, chest: 98, hips: 94 },
  { date: ago(14), weight: 73.6, bodyFat: 19.2, waist: 84, chest: 97, hips: 95 },
  { date: ago(21), weight: 74.1, bodyFat: 19.6, waist: 85, chest: 97, hips: 95 },
  { date: ago(28), weight: 74.8, bodyFat: 20, waist: 86, chest: 96, hips: 96 },
]

const goals = [
  { title: 'Reach 70 kg', type: 'weight', start: 76, target: 70, current: 72.4, unit: 'kg', deadline: shift(today, 60) },
  { title: 'Workouts per week', type: 'workouts', start: 0, target: 5, current: 0, unit: 'workouts', deadline: '' },
  { title: 'Run 5 km without stopping', type: 'custom', start: 0, target: 5, current: 4, unit: 'km', deadline: shift(today, 20) },
]

const reminders = [
  { title: 'Evening workout', type: 'workout', time: '18:00', days: [0, 1, 2, 3, 4], enabled: true, note: '' },
  { title: 'Log dinner', type: 'meal', time: '21:00', days: [0, 1, 2, 3, 4, 5, 6], enabled: true, note: '' },
  { title: 'Weigh in', type: 'weigh', time: '07:00', days: [6], enabled: true, note: 'Before breakfast' },
]

const run = async () => {
  await mongoose.connect(env.mongoUri)
  console.log('Connected to', mongoose.connection.name)

  const emails = members.map((item) => item.email)
  const old = await User.find({ email: { $in: emails } })
  const oldIds = old.map((item) => item._id)

  await Promise.all(
    [Workout, Nutrition, Progress, Goal, Reminder, Settings, Support, NotificationState].map((Model) => Model.deleteMany({ user: { $in: oldIds } }))
  )
  await Post.deleteMany({ author: { $in: oldIds } })
  await Post.updateMany({}, { $pull: { likes: { $in: oldIds }, replies: { author: { $in: oldIds } } } })
  await Follow.deleteMany({ $or: [{ follower: { $in: oldIds } }, { following: { $in: oldIds } }] })
  await User.deleteMany({ _id: { $in: oldIds } })

  const hash = await bcrypt.hash(password, 10)
  const [demo, ayesha, hamza, sara] = await User.create(
    members.map((item) => ({ ...item, password: hash, consentAcceptedAt: new Date() }))
  )

  const mine = { user: demo._id }
  await Workout.create(workouts.map((item) => ({ ...item, ...mine })))
  await Nutrition.create(meals.map((item) => ({ ...item, ...mine })))
  await Progress.create(weights.map((item) => ({ ...item, ...mine })))
  await Goal.create(goals.map((item) => ({ ...item, ...mine })))
  await Reminder.create(reminders.map((item) => ({ ...item, ...mine })))

  await Post.create([
    {
      author: ayesha._id,
      topic: 'workouts',
      title: 'Training for my first half marathon',
      body: 'Four weeks in and running three times a week. Any tips for building distance without getting injured?',
      likes: [demo._id, hamza._id],
      replies: [
        { author: hamza._id, text: 'Increase your long run by about 10% each week and keep one rest day between runs.', createdAt: hoursAgo(40) },
        { author: demo._id, text: 'Good shoes make a big difference too. Good luck!', createdAt: hoursAgo(30) },
      ],
      createdAt: hoursAgo(48),
    },
    {
      author: hamza._id,
      topic: 'motivation',
      title: 'How do you stay consistent?',
      body: 'I keep missing workouts in the second week. What helps you keep a routine?',
      likes: [ayesha._id],
      replies: [],
      createdAt: hoursAgo(26),
    },
    {
      author: sara._id,
      topic: 'nutrition',
      title: 'Best high protein breakfast?',
      body: 'Looking for quick breakfast ideas with at least 25 g of protein.',
      likes: [],
      replies: [{ author: ayesha._id, text: 'Eggs with oats or a protein shake with a banana works for me.', createdAt: hoursAgo(5) }],
      createdAt: hoursAgo(8),
    },
  ])

  await Follow.create([
    { follower: ayesha._id, following: demo._id },
    { follower: hamza._id, following: demo._id },
    { follower: demo._id, following: ayesha._id },
  ])

  console.log('Seeded: demo@fittrack.com / ' + password)
  await mongoose.disconnect()
}

run().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
