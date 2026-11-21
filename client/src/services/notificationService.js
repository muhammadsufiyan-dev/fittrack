import { formatTime } from '../utils/reminders'
import { todayISO } from '../utils/format'
import { getGoals } from './goalService'
import { createStore } from './localStore'
import { getCommunityAlerts } from './communityService'
import { getAllLogs } from './nutritionService'
import { getEntries } from './progressService'
import { getReminders } from './reminderService'
import { getWorkouts } from './workoutService'

const store = createStore('ft_notifications', [])
const hidden = createStore('ft_notifications_hidden', [])

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

  workouts
    .filter((item) => item.date === today)
    .forEach((item) => {
      list.push({
        id: `done-${item.id}`,
        type: 'workout',
        group: 'wins',
        icon: 'bi-check2-circle',
        tone: 'teal',
        title: `Workout completed: ${item.name}`,
        text: `${item.duration} minutes logged today. Great work!`,
        to: `/workouts/${item.id}`,
        action: 'View workout',
      })
    })

  if (workouts.length === 0) {
    list.push({
      id: 'idle-none',
      type: 'workout',
      group: 'attention',
      icon: 'bi-lightning-charge',
      tone: 'amber',
      title: 'Log your first workout',
      text: 'Add a session to start seeing your stats and analytics.',
      to: '/workouts',
      action: 'Log a workout',
    })
  } else {
    const gap = daysBetween(workouts[0].date, today)
    if (gap >= 3) {
      list.push({
        id: `idle-${workouts[0].date}`,
        type: 'workout',
        group: 'attention',
        icon: 'bi-lightning-charge',
        tone: 'amber',
        title: `No workout for ${gap} days`,
        text: `Your last session was "${workouts[0].name}". Even a short one today keeps you on track.`,
        to: '/workouts',
        action: 'Log a workout',
      })
    }
  }

  if (!logs.some((item) => item.date === today)) {
    list.push({
      id: `meal-${today}`,
      type: 'meal',
      group: 'attention',
      icon: 'bi-egg-fried',
      tone: 'indigo',
      title: 'No meals logged today',
      text: 'Log what you eat to see your calories and macros.',
      to: '/nutrition',
      action: 'Log a meal',
    })
  }

  if (entries.length > 0) {
    const gap = daysBetween(entries[0].date, today)
    if (gap >= 14) {
      list.push({
        id: `weigh-${entries[0].date}`,
        type: 'progress',
        group: 'attention',
        icon: 'bi-speedometer2',
        tone: 'indigo',
        title: 'Time for a weigh-in',
        text: `Your last entry was ${gap} days ago.`,
        to: '/progress',
        action: 'Add an entry',
      })
    }
  }

  reminders
    .filter((item) => item.time <= nowTime)
    .forEach((item) => {
      list.push({
        id: `rem-${item.id}-${today}`,
        type: 'reminder',
        group: 'attention',
        icon: 'bi-alarm',
        tone: 'amber',
        title: item.title,
        text: `Scheduled for ${formatTime(item.time)} today.`,
        to: '/reminders',
        action: 'Open reminders',
      })
    })

  goals.forEach((goal) => {
    const left = goal.deadline ? daysBetween(today, goal.deadline) : null

    if (goal.percent >= 100) {
      list.push({
        id: `goal-done-${goal.id}`,
        type: 'goal',
        group: 'wins',
        icon: 'bi-trophy',
        tone: 'teal',
        title: `Goal reached: ${goal.title}`,
        text: 'Well done! Set a new target to keep going.',
        to: '/goals',
        action: 'View goals',
      })
    } else if (left !== null && left >= 0 && left <= 14) {
      list.push({
        id: `goal-due-${goal.id}-${goal.deadline}`,
        type: 'goal',
        group: 'attention',
        icon: 'bi-flag',
        tone: left <= 7 ? 'red' : 'amber',
        title: `${goal.title}: ${left} days left`,
        text: `You are ${goal.percent}% of the way there.`,
        to: '/goals',
        action: 'View goals',
      })
    } else if (goal.percent >= 75) {
      list.push({
        id: `goal-near-${goal.id}`,
        type: 'goal',
        group: 'wins',
        icon: 'bi-bullseye',
        tone: 'teal',
        title: 'Almost there',
        text: `"${goal.title}" is ${goal.percent}% done.`,
        to: '/goals',
        action: 'View goals',
      })
    }
  })

  reminders
    .filter((item) => item.time > nowTime)
    .forEach((item) => {
      list.push({
        id: `rem-${item.id}-${today}`,
        type: 'reminder',
        group: 'upcoming',
        icon: 'bi-alarm',
        tone: 'teal',
        title: item.title,
        text: `Coming up at ${formatTime(item.time)} today.`,
        to: '/reminders',
        action: 'Open reminders',
      })
    })

  const community = await getCommunityAlerts()

  community.followers.forEach((item) => {
    list.push({
      id: `follower-${item.id}`,
      type: 'community',
      group: 'wins',
      icon: 'bi-person-plus',
      tone: 'indigo',
      title: `${item.name} started following you`,
      text: 'Check out their profile and follow back.',
      to: `/users/${item.id}`,
      action: 'View profile',
    })
  })

  community.replies.forEach((item) => {
    list.push({
      id: `reply-${item.id}`,
      type: 'community',
      group: 'attention',
      icon: 'bi-chat-dots',
      tone: 'indigo',
      title: `${item.author.name} replied to your post`,
      text: `"${item.text}"`,
      to: '/community',
      action: 'Open community',
    })
  })

  return list
}

export const getNotifications = async () => {
  const read = store.read()
  const gone = hidden.read()
  return (await build())
    .filter((item) => !gone.includes(item.id))
    .map((item) => ({ ...item, read: read.includes(item.id) }))
}

export const getUnreadCount = async () => {
  return (await getNotifications()).filter((item) => !item.read).length
}

export const markRead = async (ids) => {
  store.save([...new Set([...store.read(), ...ids])])
  window.dispatchEvent(new Event('ft-notifications'))
}

export const dismiss = async (ids) => {
  hidden.save([...new Set([...hidden.read(), ...ids])])
  window.dispatchEvent(new Event('ft-notifications'))
}

