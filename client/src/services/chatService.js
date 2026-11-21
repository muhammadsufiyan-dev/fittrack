import { formatDate, shiftDate, todayISO } from '../utils/format'
import { showWeight } from '../utils/units'
import { getGoals } from './goalService'
import { getAllLogs } from './nutritionService'
import { getEntries } from './progressService'
import { getReminders } from './reminderService'
import { getWorkouts } from './workoutService'

export const suggestions = [
  'How was my week?',
  'Calories today',
  'My goals',
  'My weight',
  'How do I add a workout?',
  'Give me a tip',
]

const tips = [
  'Drink a glass of water before every meal. It helps you eat just enough.',
  'Sleep 7 to 9 hours. Muscles grow while you rest, not while you train.',
  'Warm up for 5 minutes before lifting. It lowers the chance of injury.',
  'Add protein to every meal. It keeps you full and helps muscles recover.',
  'Increase your weights a little each week. Small steps beat big jumps.',
  'Walk for 10 minutes after meals. It is easy and good for digestion.',
  'Plan tomorrow workout tonight. A plan makes it much easier to start.',
  'Take one full rest day each week. Your body needs it to get stronger.',
  'Log your meals the same day. It is easy to forget them later.',
  'Weigh yourself at the same time each week, ideally in the morning.',
]

const sum = (list, key) => list.reduce((total, item) => total + (Number(item[key]) || 0), 0)

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const streakOf = (workouts) => {
  const days = new Set(workouts.map((item) => item.date))
  let day = todayISO()
  if (!days.has(day)) day = shiftDate(day, -1)

  let count = 0
  while (days.has(day)) {
    count += 1
    day = shiftDate(day, -1)
  }
  return count
}

const workoutsReply = async () => {
  const list = await getWorkouts()

  if (list.length === 0) {
    return {
      text: 'You have not logged any workouts yet. Add your first one and I will track your week.',
      links: [{ label: 'Add workout', to: '/workouts' }],
    }
  }

  const week = list.filter((item) => item.date >= shiftDate(todayISO(), -6))
  const streak = streakOf(list)

  return {
    text: [
      `This week: ${plural(week.length, 'workout')}, ${sum(week, 'duration')} minutes, ${sum(week, 'calories')} kcal burned.`,
      `Last workout: ${list[0].name} (${formatDate(list[0].date)}).`,
      streak > 1 ? `You are on a ${streak} day streak. Keep it going!` : 'Train today to start a new streak.',
    ].join('\n'),
    links: [
      { label: 'Open workouts', to: '/workouts' },
      { label: 'Analytics', to: '/analytics' },
    ],
  }
}

const nutritionReply = async () => {
  const logs = (await getAllLogs()).filter((item) => item.date === todayISO())
  const items = logs.flatMap((log) => log.items)

  if (items.length === 0) {
    return {
      text: 'No meals logged today yet. Log what you ate and I will add up your calories and macros.',
      links: [{ label: 'Log a meal', to: '/nutrition' }],
    }
  }

  return {
    text: [
      `Today you ate ${sum(items, 'calories')} kcal in ${plural(logs.length, 'meal')}.`,
      `Protein ${sum(items, 'protein')} g, carbs ${sum(items, 'carbs')} g, fats ${sum(items, 'fats')} g.`,
    ].join('\n'),
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
  }
}

const weightReply = async () => {
  const entries = await getEntries()

  if (entries.length === 0) {
    return {
      text: 'No progress entries yet. Add your weight and measurements to see your trend.',
      links: [{ label: 'Add entry', to: '/progress' }],
    }
  }

  const latest = entries[0]
  const first = entries[entries.length - 1]
  const lines = [`Your latest weight is ${showWeight(latest.weight)} (${formatDate(latest.date)}).`]

  if (entries.length > 1) {
    const change = Math.round((latest.weight - first.weight) * 10) / 10
    lines.push(`Since ${formatDate(first.date)} it changed by ${change > 0 ? '+' : ''}${showWeight(change)}.`)
  }
  if (latest.bodyFat) lines.push(`Body fat: ${latest.bodyFat}%.`)

  return { text: lines.join('\n'), links: [{ label: 'Open progress', to: '/progress' }] }
}

const goalsReply = async () => {
  const goals = await getGoals()

  if (goals.length === 0) {
    return { text: 'You have no goals yet. Set one and I will track it for you.', links: [{ label: 'Set a goal', to: '/goals' }] }
  }

  const done = goals.filter((item) => item.percent >= 100).length
  const lines = goals.slice(0, 5).map((item) => `- ${item.title}: ${item.percent}%`)
  lines.push(done > 0 ? `${plural(done, 'goal')} completed. Great work!` : 'Keep going, you are getting closer.')

  return { text: lines.join('\n'), links: [{ label: 'Open goals', to: '/goals' }] }
}

const remindersReply = async () => {
  const active = (await getReminders()).filter((item) => item.enabled)

  if (active.length === 0) {
    return { text: 'You have no active reminders.', links: [{ label: 'Add reminder', to: '/reminders' }] }
  }

  const lines = [`You have ${plural(active.length, 'active reminder')}:`]
  active.slice(0, 4).forEach((item) => lines.push(`- ${item.time}  ${item.title}`))

  return { text: lines.join('\n'), links: [{ label: 'Open reminders', to: '/reminders' }] }
}

const answer = (text, links = []) => () => ({ text, links })

const intents = [
  {
    words: ['hi', 'hello', 'hey', 'salam', 'assalam', 'good morning', 'good evening'],
    reply: (user) => ({
      text: `Hi ${user.name.split(' ')[0]}! How can I help? You can ask about your week, calories, goals or how to use FitTrack.`,
      links: [],
    }),
  },
  { words: ['thanks', 'thank you', 'thx', 'shukriya'], reply: answer('You are welcome! Ask me anything else.') },
  {
    words: ['what can you do', 'who are you', 'what are you', 'help me', 'features'],
    reply: answer(
      'I am FitBot. I can:\n- show your week, meals, weight and goals\n- explain how to use any page\n- give you quick fitness tips',
      [{ label: 'Help and FAQ', to: '/help' }]
    ),
  },
  { words: ['workout', 'exercise', 'trained', 'streak', 'burned', 'how many', 'week', 'last session'], reply: workoutsReply },
  { words: ['calorie', 'eaten', 'ate', 'macros', 'protein', 'carbs', 'fats', 'nutrition', 'food today'], reply: nutritionReply },
  { words: ['weight', 'progress', 'body fat', 'waist', 'lost', 'measurement'], reply: weightReply },
  { words: ['goal', 'target', 'achievement'], reply: goalsReply },
  { words: ['reminder', 'alert', 'remind me'], reply: remindersReply },
  { words: ['tip', 'advice', 'motivate', 'motivation', 'suggest'], reply: () => ({ text: tips[Math.floor(Math.random() * tips.length)], links: [] }) },
  {
    words: ['add workout', 'add a workout', 'log workout', 'log a workout', 'new workout', 'create workout', 'record workout'],
    reply: answer('Open Workouts, press Add workout, then fill the name, date, duration and add your exercises with sets, reps and weight.', [
      { label: 'Go to workouts', to: '/workouts' },
    ]),
  },
  {
    words: ['add meal', 'add a meal', 'log meal', 'log a meal', 'log food', 'add food', 'new meal'],
    reply: answer('Open Nutrition, press Add meal, choose breakfast, lunch, dinner or snack, then add each food with calories and macros.', [
      { label: 'Go to nutrition', to: '/nutrition' },
    ]),
  },
  {
    words: ['add weight', 'log weight', 'add measurement', 'add progress', 'log progress', 'update weight'],
    reply: answer('Open Progress, press Add entry, then enter your weight and body measurements. Charts update right away.', [
      { label: 'Go to progress', to: '/progress' },
    ]),
  },
  {
    words: ['set goal', 'set a goal', 'add goal', 'add a goal', 'new goal', 'create goal'],
    reply: answer('Open Goals, press Add goal, choose a target and a deadline. Weight and weekly workout goals update by themselves.', [
      { label: 'Go to goals', to: '/goals' },
    ]),
  },
  {
    words: ['add reminder', 'set reminder', 'new reminder', 'create reminder'],
    reply: answer('Open Reminders, press Add reminder, then pick the time and the days you want to be reminded.', [
      { label: 'Go to reminders', to: '/reminders' },
    ]),
  },
  {
    words: ['report', 'export', 'csv', 'pdf', 'download', 'print'],
    reply: answer('Open Reports, choose a period, then download a CSV or print a PDF. To get everything at once, use Settings, then Your data.', [
      { label: 'Go to reports', to: '/reports' },
    ]),
  },
  {
    words: ['dark mode', 'light mode', 'theme', 'dark', 'appearance'],
    reply: answer('Open Settings and pick Light or Dark under Appearance. You can also use the profile menu at the top.', [
      { label: 'Open settings', to: '/settings' },
    ]),
  },
  {
    words: ['pound', 'lbs', 'lb', 'inch', 'inches', 'units', 'convert'],
    reply: answer('Open Settings and change Units. You can use kg or lb for weight and cm or in for measurements. Saved data does not change.', [
      { label: 'Open settings', to: '/settings' },
    ]),
  },
  {
    words: ['follow', 'follower', 'community', 'forum', 'post'],
    reply: answer('Open Community to read posts, share your own and follow members. Open a member profile to see their posts and followers.', [
      { label: 'Open community', to: '/community' },
    ]),
  },
  {
    words: ['search', 'find'],
    reply: answer('Use the search box at the top, or open Search. You can find workouts, meals, goals and other members.', [
      { label: 'Open search', to: '/search' },
    ]),
  },
  {
    words: ['notification', 'notifications'],
    reply: answer('Notifications show missed workouts, goals, followers and replies. Turn each kind on or off in Settings.', [
      { label: 'Open notifications', to: '/notifications' },
    ]),
  },
  {
    words: ['privacy', 'private', 'who can see', 'delete account', 'delete my account', 'gdpr', 'data safe'],
    reply: answer(
      'Your workouts, meals and progress are private. Only your name, city and bio can be found by others, and you can turn that off in Settings. You can also delete your account there.',
      [{ label: 'Open settings', to: '/settings' }]
    ),
  },
  {
    words: ['photo', 'picture', 'profile pic', 'avatar', 'profile', 'bio'],
    reply: answer('Open Profile and press Edit profile to change your photo, phone, city and bio.', [{ label: 'Open profile', to: '/profile' }]),
  },
  {
    words: ['support', 'contact', 'problem', 'bug', 'issue', 'feedback', 'complain', 'not working'],
    reply: answer('Sorry about that. Send us a message from Support and we will reply within one working day.', [
      { label: 'Contact support', to: '/support' },
    ]),
  },
]

const fallback = {
  text: 'I am not sure about that one yet. Try asking about your workouts, calories, weight or goals, or how to use a page.',
  links: [
    { label: 'Help and FAQ', to: '/help' },
    { label: 'Contact support', to: '/support' },
  ],
}

export const getReply = async (text, user) => {
  const query = text.toLowerCase()
  let best = null
  let top = 0

  for (const intent of intents) {
    const score = intent.words.reduce((total, word) => (new RegExp(`\\b${word}s?\\b`).test(query) ? total + word.length : total), 0)
    if (score > top) {
      top = score
      best = intent
    }
  }

  return best ? best.reply(user) : fallback
}
