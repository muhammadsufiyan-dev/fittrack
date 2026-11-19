import { formatTime } from '../utils/reminders'
import { todayISO } from '../utils/format'
import { getGoals } from './goalService'
import { createStore } from './localStore'
import { getAllLogs } from './nutritionService'
import { getEntries } from './progressService'
import { getReminders } from './reminderService'
import { getWorkouts } from './workoutService'

const store = createStore('ft_notifications', [])

const pad = (value) => String(value).padStart(2, '0')

const daysBetween = (from, to) => Math.round((new Date(to) - new Date(from)) / 86400000)

const build = async () => {
  const today = todayISO()
  const now = new Date()
  const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  const todayIndex = (now.getDay() + 6) % 7

  const workouts = await getWorkouts()
  const entries = await getEntries()
  const logs = await getAllLogs()
  const goals = await getGoals()
  const reminders = (await getReminders()).filter((item) => item.enabled && item.days.includes(todayIndex))

  const list = []

  if (workouts.length === 0) {
    list.push({
      id: 'idle-none',
      icon: 'bi-lightning-charge',
      tone: 'amber',
      title: 'Log your first workout',
      text: 'Add a session to start seeing your stats and analytics.',
      to: '/workouts',
      action: 'Workouts',
    })
  } else {
    const gap = daysBetween(workouts[0].date, today)
    if (gap >= 3) {
      list.push({
        id: `idle-${workouts[0].date}`,
        icon: 'bi-lightning-charge',
        tone: 'amber',
        title: `No workout for ${gap} days`,
        text: `Your last session was "${workouts[0].name}". Even a short one today keeps you on track.`,
        to: '/workouts',
        action: 'Workouts',
      })
    }
  }

  if (!logs.some((item) => item.date === today)) {
    list.push({
      id: `meal-${today}`,
      icon: 'bi-egg-fried',
      tone: 'indigo',
      title: 'No meals logged today',
      text: 'Log what you eat to see your calories and macros.',
      to: '/nutrition',
      action: 'Nutrition',
    })
  }

  if (entries.length > 0) {
    const gap = daysBetween(entries[0].date, today)
    if (gap >= 14) {
      list.push({
        id: `weigh-${entries[0].date}`,
        icon: 'bi-speedometer2',
        tone: 'indigo',
        title: 'Time for a weigh-in',
        text: `Your last entry was ${gap} days ago.`,
        to: '/progress',
        action: 'Progress',
      })
    }
  }

  reminders
    .filter((item) => item.time <= nowTime)
    .forEach((item) => {
      list.push({
        id: `rem-${item.id}-${today}`,
        icon: 'bi-alarm',
        tone: 'amber',
        title: item.title,
        text: `Scheduled for ${formatTime(item.time)} today.`,
        to: '/reminders',
        action: 'Reminders',
      })
    })

  goals.forEach((goal) => {
    const left = goal.deadline ? daysBetween(today, goal.deadline) : null

    if (goal.percent >= 100) {
      list.push({
        id: `goal-done-${goal.id}`,
        icon: 'bi-trophy',
        tone: 'teal',
        title: `Goal reached: ${goal.title}`,
        text: 'Well done! Set a new target to keep going.',
        to: '/goals',
        action: 'Goals',
      })
    } else if (left !== null && left >= 0 && left <= 14) {
      list.push({
        id: `goal-due-${goal.id}-${goal.deadline}`,
        icon: 'bi-flag',
        tone: left <= 7 ? 'red' : 'amber',
        title: `${goal.title}: ${left} days left`,
        text: `You are ${goal.percent}% of the way there.`,
        to: '/goals',
        action: 'Goals',
      })
    } else if (goal.percent >= 75) {
      list.push({
        id: `goal-near-${goal.id}`,
        icon: 'bi-bullseye',
        tone: 'teal',
        title: 'Almost there',
        text: `"${goal.title}" is ${goal.percent}% done.`,
        to: '/goals',
        action: 'Goals',
      })
    }
  })

  reminders
    .filter((item) => item.time > nowTime)
    .forEach((item) => {
      list.push({
        id: `rem-${item.id}-${today}`,
        icon: 'bi-alarm',
        tone: 'teal',
        title: item.title,
        text: `Coming up at ${formatTime(item.time)} today.`,
        to: '/reminders',
        action: 'Reminders',
      })
    })

  return list
}

export const getNotifications = async () => {
  const read = store.read()
  return (await build()).map((item) => ({ ...item, read: read.includes(item.id) }))
}

export const getUnreadCount = async () => {
  return (await getNotifications()).filter((item) => !item.read).length
}

export const markRead = async (ids) => {
  store.save([...new Set([...store.read(), ...ids])])
  window.dispatchEvent(new Event('ft-notifications'))
}
