import { formatDate, shiftDate, todayISO } from '../utils/format'
import { showWeight } from '../utils/units'
import { getGoals } from './goalService'
import { getAllLogs } from './nutritionService'
import { getEntries } from './progressService'
import { getReminders } from './reminderService'
import { getWorkouts } from './workoutService'

export const suggestions = [
  'How are you?',
  'How was my week?',
  'Calories today',
  'How do I add a meal?',
  'Beginner workout plan',
  'How to lose weight?',
  'Give me a tip',
  'What can you do?',
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
  'Learn the exercise form first, then add weight. Good form protects your joints.',
  'Do not skip legs. Big muscles burn more calories and keep you balanced.',
]

const jokes = [
  'Why did the gym close down? It just did not work out.',
  'Why do squats make bad friends? They always bring you down.',
  'I am on a seafood diet. I see food and I eat it.',
  'Why did the weight lifter bring a ladder? To reach the next level.',
]

const random = (list) => list[Math.floor(Math.random() * list.length)]

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
      next: ['Beginner workout plan', 'How do I add a workout?'],
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
    next: ['Calories today', 'My goals'],
  }
}

const nutritionReply = async () => {
  const logs = (await getAllLogs()).filter((item) => item.date === todayISO())
  const items = logs.flatMap((log) => log.items)

  if (items.length === 0) {
    return {
      text: 'No meals logged today yet. Log what you ate and I will add up your calories and macros.',
      links: [{ label: 'Log a meal', to: '/nutrition' }],
      next: ['How do I add a meal?', 'Healthy eating tips'],
    }
  }

  return {
    text: [
      `Today you ate ${sum(items, 'calories')} kcal in ${plural(logs.length, 'meal')}.`,
      `Protein ${sum(items, 'protein')} g, carbs ${sum(items, 'carbs')} g, fats ${sum(items, 'fats')} g.`,
    ].join('\n'),
    links: [{ label: 'Open nutrition', to: '/nutrition' }],
    next: ['How much protein do I need?', 'How was my week?'],
  }
}

const weightReply = async () => {
  const entries = await getEntries()

  if (entries.length === 0) {
    return {
      text: 'No progress entries yet. Add your weight and measurements to see your trend.',
      links: [{ label: 'Add entry', to: '/progress' }],
      next: [],
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

  return { text: lines.join('\n'), links: [{ label: 'Open progress', to: '/progress' }], next: ['My goals', 'How to lose weight?'] }
}

const goalsReply = async () => {
  const goals = await getGoals()

  if (goals.length === 0) {
    return {
      text: 'You have no goals yet. Set one and I will track it for you.',
      links: [{ label: 'Set a goal', to: '/goals' }],
      next: ['How do I set a goal?'],
    }
  }

  const done = goals.filter((item) => item.percent >= 100).length
  const lines = goals.slice(0, 5).map((item) => `- ${item.title}: ${item.percent}%`)
  lines.push(done > 0 ? `${plural(done, 'goal')} completed. Great work!` : 'Keep going, you are getting closer.')

  return { text: lines.join('\n'), links: [{ label: 'Open goals', to: '/goals' }], next: ['My weight', 'Give me a tip'] }
}

const remindersReply = async () => {
  const active = (await getReminders()).filter((item) => item.enabled)

  if (active.length === 0) {
    return { text: 'You have no active reminders.', links: [{ label: 'Add reminder', to: '/reminders' }], next: [] }
  }

  const lines = [`You have ${plural(active.length, 'active reminder')}:`]
  active.slice(0, 4).forEach((item) => lines.push(`- ${item.time}  ${item.title}`))

  return { text: lines.join('\n'), links: [{ label: 'Open reminders', to: '/reminders' }], next: [] }
}

const answer = (text, links = [], next = []) => () => ({ text, links, next })

const pick = (list, links = [], next = []) => () => ({ text: random(list), links, next })

const verbs = '(add|log|enter|create|record|new|make|track|save|insert)'

const how = (nouns) => new RegExp(`\\b${verbs}\\b.*\\b(${nouns})s?\\b`)

const greeting = (user) => {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  return {
    text: `Good ${part}, ${user.name.split(' ')[0]}! How can I help you today?`,
    links: [],
    next: ['How was my week?', 'How do I add a meal?', 'Give me a tip'],
  }
}

const intents = [
  { words: ['hi', 'hello', 'hey', 'salam', 'assalam', 'good morning', 'good afternoon', 'good evening', 'namaste'], reply: greeting },
  {
    words: ['how are you', 'how r u', 'how are u', 'how do you do', 'kaise ho', 'kya haal', 'whats up', "what's up", 'sup'],
    reply: pick(
      ['I am doing great, thanks for asking! Ready to help you stay on track. How are you?', 'All good here and full of energy! How about you?'],
      [],
      ['I am fine', 'Give me a tip']
    ),
  },
  {
    words: ['i am fine', 'im fine', 'i am good', 'im good', 'i am great', 'im great', 'doing good', 'theek hoon', 'main theek', 'not bad'],
    reply: answer('Glad to hear that! Want to check your week or plan a workout?', [], ['How was my week?', 'Beginner workout plan']),
  },
  {
    words: ['i am tired', 'im tired', 'i am sad', 'im sad', 'feeling low', 'lazy', 'not motivated', 'no motivation', 'demotivated', 'bored', 'stressed', 'cant start'],
    reply: pick(
      [
        'Some days feel slow and that is okay. Even a 10 minute walk counts. Want a quick tip or an easy workout idea?',
        'Thanks for telling me. Start tiny today: 5 minutes of movement. Once you begin, it gets easier.',
      ],
      [{ label: 'Set a reminder', to: '/reminders' }],
      ['Give me a tip', 'Home workout']
    ),
  },
  {
    words: ['depressed', 'hopeless', 'want to die', 'suicide', 'kill myself', 'end my life', 'self harm'],
    reply: answer(
      'I am really sorry you feel this way. I am only a fitness helper, but you deserve real support. Please talk to someone you trust or a mental health professional. If you may be in danger, contact your local emergency services right now.'
    ),
  },
  {
    words: ['your name', 'who made you', 'who built you', 'who created you', 'are you a robot', 'are you real', 'are you human', 'are you ai', 'are you a bot', 'who are you', 'what are you'],
    reply: answer(
      'I am FitBot, the virtual assistant inside FitTrack. I am not a person. I can read your FitTrack data, explain every page and share fitness tips.',
      [],
      ['What can you do?']
    ),
  },
  { words: ['thanks', 'thank you', 'thx', 'shukriya', 'jazakallah'], reply: pick(['You are welcome! Ask me anything else.', 'Happy to help! Anything else?']) },
  { words: ['bye', 'goodbye', 'see you', 'good night', 'allah hafiz', 'khuda hafiz', 'take care'], reply: pick(['Bye! Keep moving, and come back anytime.', 'Take care! See you at your next workout.']) },
  { words: ['joke', 'funny', 'make me laugh'], reply: pick(jokes, [], ['Another joke', 'Give me a tip']) },
  { words: ['another joke', 'one more joke'], reply: pick(jokes, [], ['Give me a tip']) },
  { words: ['good bot', 'great job', 'well done', 'awesome', 'you are great', 'you are smart', 'nice work', 'love it'], reply: answer('Thank you, that makes my day! Anything else I can help with?') },
  { words: ['ok', 'okay', 'cool', 'alright', 'hmm', 'fine', 'got it'], reply: answer('Alright! Tell me if you need anything.') },
  {
    words: ['what time', 'current time', 'time now'],
    reply: () => ({ text: `It is ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} right now.`, links: [], next: [] }),
  },
  {
    words: ['what day', 'todays date', 'date today', 'what is the date', 'which day'],
    reply: () => ({
      text: `Today is ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`,
      links: [],
      next: [],
    }),
  },
  {
    words: ['what can you do', 'help me', 'features', 'what do you know', 'how can you help'],
    reply: answer(
      'I can:\n- show your week, meals, weight and goals\n- explain how to use every page\n- share workout, diet and recovery guidance\n- chat and give you quick tips',
      [{ label: 'Help and FAQ', to: '/help' }],
      ['How was my week?', 'Beginner workout plan', 'How do I add a meal?']
    ),
  },

  { words: ['workout', 'exercise', 'trained', 'streak', 'burned', 'how many', 'week', 'last session'], reply: workoutsReply },
  { words: ['calorie', 'eaten', 'ate', 'eat', 'macros', 'protein', 'carbs', 'fats', 'nutrition', 'food today'], reply: nutritionReply },
  { words: ['weight', 'progress', 'body fat', 'waist', 'lost', 'measurement'], reply: weightReply },
  { words: ['goal', 'target', 'achievement'], reply: goalsReply },
  { words: ['reminder', 'alert', 'remind me'], reply: remindersReply },
  { words: ['tip', 'advice', 'motivate', 'motivation', 'suggest', 'fitness tip'], reply: () => ({ text: random(tips), links: [], next: ['Another tip', 'Beginner workout plan'] }) },
  { words: ['another tip', 'one more tip', 'more tips'], reply: () => ({ text: random(tips), links: [], next: ['Another tip'] }) },

  {
    words: ['what is fittrack', 'about fittrack', 'about this website', 'about this site', 'what is this website', 'what is this app', 'what is this site', 'what does this website do'],
    reply: answer(
      'FitTrack is a fitness tracker. You can log workouts and meals, track weight and measurements, set goals, see charts and reports, set reminders and join the community.',
      [{ label: 'Open dashboard', to: '/dashboard' }],
      ['How do I get started?', 'What pages are there?']
    ),
  },
  {
    words: ['how to use', 'getting started', 'get started', 'tutorial', 'guide me', 'use this website', 'use this app', 'how does this work', 'how does it work', 'where do i start', 'how do i start', 'how to start', 'where to begin'],
    reply: answer(
      'Quick start:\n1. Complete your profile\n2. Log a workout\n3. Log a meal\n4. Add your weight in Progress\n5. Set a goal\nThen check Dashboard and Analytics to see your progress.',
      [{ label: 'Log a workout', to: '/workouts' }, { label: 'Open dashboard', to: '/dashboard' }],
      ['What pages are there?', 'How do I add a meal?']
    ),
  },
  {
    words: ['what pages', 'pages', 'menu', 'sections', 'sidebar', 'navigation'],
    reply: answer(
      'Pages in FitTrack:\n- Dashboard: your summary\n- Workouts, Nutrition, Progress, Goals: log and track\n- Community: posts and members\n- Analytics and Reports: charts, CSV, PDF\n- Reminders and Notifications\n- Profile, Settings, Support, Help',
      [{ label: 'Open dashboard', to: '/dashboard' }]
    ),
  },
  {
    words: ['sign up', 'signup', 'register', 'create account', 'new account'],
    reply: answer('Press Sign up on the home page, enter your name, email and password, add a photo if you like, accept the privacy policy and press Create account.'),
  },
  {
    words: ['login', 'log in', 'sign in', 'signin', 'logout', 'log out', 'sign out'],
    reply: answer('Log in with your email and password. To log out, open the profile menu at the top right and press Log out.'),
  },
  {
    words: ['forgot password', 'reset password', 'change password', 'password'],
    reply: answer('FitTrack does not have password reset yet. If you are locked out or need help, send us a message from Support.', [
      { label: 'Contact support', to: '/support' },
    ]),
  },
  {
    words: ['dashboard', 'home page', 'overview'],
    reply: answer(
      'Dashboard shows your week at a glance: workouts, calories burned, weight, goals, recent workouts and today macros. Quick buttons let you log a workout, meal, weight or goal.',
      [{ label: 'Open dashboard', to: '/dashboard' }]
    ),
  },
  {
    words: ['analytics', 'chart', 'graph', 'statistics', 'stats', 'trend'],
    reply: answer(
      'Analytics shows workout frequency, minutes, calories and macros. Progress shows weight and body measurement charts. Use the period buttons to change the range.',
      [{ label: 'Open analytics', to: '/analytics' }, { label: 'Open progress', to: '/progress' }]
    ),
  },
  {
    words: ['add workout', 'add a workout', 'log workout', 'log a workout', 'new workout', 'create workout', 'record workout'],
    patterns: [how('workout|exercise|session|gym')],
    reply: answer(
      'Open Workouts, press Add workout, then fill the name, date, duration and add your exercises with sets, reps and weight. You can add notes, a category and tags too.',
      [{ label: 'Go to workouts', to: '/workouts' }],
      ['What are tags?', 'How do I edit or delete?']
    ),
  },
  {
    words: ['add meal', 'add a meal', 'log meal', 'log a meal', 'log food', 'add food', 'new meal', 'add breakfast', 'add lunch', 'add dinner', 'add snack'],
    patterns: [how('meal|food|breakfast|lunch|dinner|snack|calorie')],
    reply: answer(
      'Open Nutrition, press Add meal, choose breakfast, lunch, dinner or snack, then add each food with its calories, protein, carbs and fats.',
      [{ label: 'Go to nutrition', to: '/nutrition' }],
      ['Calories today', 'Healthy eating tips']
    ),
  },
  {
    words: ['add weight', 'log weight', 'add measurement', 'add progress', 'log progress', 'update weight'],
    patterns: [how('weight|measurement|progress|body fat|waist')],
    reply: answer('Open Progress, press Add entry, then enter your weight and body measurements. Charts update right away.', [
      { label: 'Go to progress', to: '/progress' },
    ]),
  },
  {
    words: ['set goal', 'set a goal', 'add goal', 'add a goal', 'new goal', 'create goal'],
    patterns: [how('goal|target')],
    reply: answer('Open Goals, press Add goal, choose a target and a deadline. Weight and weekly workout goals update by themselves.', [
      { label: 'Go to goals', to: '/goals' },
    ]),
  },
  {
    words: ['add reminder', 'set reminder', 'new reminder', 'create reminder'],
    patterns: [how('reminder|alert')],
    reply: answer('Open Reminders, press Add reminder, then pick the time and the days you want to be reminded.', [
      { label: 'Go to reminders', to: '/reminders' },
    ]),
  },
  {
    words: ['edit', 'delete', 'remove', 'change entry', 'update workout', 'update meal', 'edit workout', 'delete workout', 'remove workout', 'edit meal', 'delete meal', 'edit goal', 'delete goal', 'delete entry'],
    reply: answer('Every card has an edit (pencil) and a delete (bin) button. Deleting asks you to confirm first.'),
  },
  {
    words: ['tag', 'category', 'categories'],
    reply: answer('A category is the type of workout, such as strength or cardio. Tags are your own words, such as legs or morning, so you can find workouts faster.'),
  },
  {
    words: ['report', 'export', 'csv', 'pdf', 'download', 'print'],
    reply: answer('Open Reports, choose a period, then download a CSV or print a PDF. To get everything at once, use Settings, then Your data.', [
      { label: 'Go to reports', to: '/reports' },
    ]),
  },
  {
    words: ['dark mode', 'light mode', 'theme', 'dark', 'appearance'],
    reply: answer('Open Settings and pick Light or Dark under Theme. You can also use the profile menu at the top.', [
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
    words: ['settings', 'preferences'],
    reply: answer(
      'Settings lets you choose Light or Dark, kg or lb, cm or in, which notifications you get, who can find you, and download or delete your data.',
      [{ label: 'Open settings', to: '/settings' }]
    ),
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
    words: ['mobile', 'phone', 'responsive', 'tablet'],
    reply: answer('FitTrack works on phones, tablets and computers. On a phone, use the menu button at the top left to open the sidebar.'),
  },
  {
    words: ['support', 'contact', 'problem', 'bug', 'issue', 'feedback', 'complain', 'not working'],
    reply: answer('Sorry about that. Send us a message from Support and we will reply within one working day.', [
      { label: 'Contact support', to: '/support' },
    ]),
  },

  {
    words: ['lose weight', 'weight loss', 'fat loss', 'lose fat', 'burn fat', 'reduce weight', 'get lean', 'slim down', 'cutting'],
    reply: answer(
      'To lose fat steadily:\n- Eat a little fewer calories than you burn. Small cuts beat crash diets.\n- Keep protein high and fill half your plate with vegetables.\n- Train 3 to 4 times a week and walk daily.\n- Sleep well and aim for slow, steady loss.\nTrack meals and weight in FitTrack to see your trend.',
      [{ label: 'Open nutrition', to: '/nutrition' }, { label: 'Set a goal', to: '/goals' }],
      ['How many calories should I eat?', 'Best cardio']
    ),
  },
  {
    words: ['build muscle', 'gain muscle', 'muscle gain', 'bulk', 'bulking', 'get bigger', 'gain weight', 'mass gain'],
    reply: answer(
      'To build muscle:\n- Lift weights 3 to 5 days a week and train each muscle hard.\n- Add a little weight or one more rep every week.\n- Eat enough calories and protein through the day.\n- Sleep 7 to 9 hours and rest each muscle about 48 hours.\nLog your sets and weights in Workouts to see progress.',
      [{ label: 'Open workouts', to: '/workouts' }],
      ['How much protein do I need?', 'Beginner workout plan']
    ),
  },
  {
    words: ['beginner', 'new to gym', 'just starting', 'start working out', 'workout plan', 'routine', 'split', 'training plan', 'schedule'],
    reply: answer(
      'A simple 3 day plan:\n- Day 1: Full body (squat, push up, row, plank)\n- Day 2: Rest or a 30 minute walk\n- Day 3: Full body (lunge, shoulder press, lat pulldown, crunch)\n- Day 4: Rest\n- Day 5: Full body again, then light cardio\nStart light, learn the form first and add weight slowly.',
      [{ label: 'Log a workout', to: '/workouts' }],
      ['Home workout', 'How to warm up?']
    ),
  },
  {
    words: ['how much protein', 'protein intake', 'protein per day', 'protein should', 'protein do i need', 'protein sources'],
    reply: answer(
      'Protein helps muscles recover. Add some to every meal: eggs, chicken, fish, daal, chana, yogurt or milk. A common range for active people is about 1.2 to 2 g per kg of body weight a day. For an exact number, ask a doctor or dietitian.',
      [{ label: 'Open nutrition', to: '/nutrition' }],
      ['Healthy eating tips']
    ),
  },
  {
    words: ['how many calories should', 'daily calories', 'calorie intake', 'maintenance calories', 'calorie deficit', 'calorie surplus', 'calorie goal', 'deficit', 'surplus'],
    reply: answer(
      'Your daily calories depend on age, weight, height and activity. Eat a little below what you burn to lose fat, a little above to gain muscle, and about equal to stay the same. Log meals for a week to see your real average, then adjust slowly. A dietitian can give an exact number.',
      [{ label: 'Open nutrition', to: '/nutrition' }, { label: 'Analytics', to: '/analytics' }]
    ),
  },
  {
    words: ['warm up', 'warmup', 'cool down', 'cooldown', 'stretch', 'stretching', 'mobility'],
    reply: answer(
      'Warm up for 5 to 10 minutes: light cardio, then arm circles, leg swings and a few light sets. Cool down with easy walking and gentle stretches for 5 minutes. Stretch after training, not before heavy lifts.'
    ),
  },
  {
    words: ['rest day', 'recovery', 'sore', 'soreness', 'sleep', 'overtraining', 'how often'],
    reply: answer(
      'Recovery is part of training:\n- Sleep 7 to 9 hours\n- Rest each muscle group about 48 hours\n- Take one full rest day a week\n- Eat enough protein and drink water\nMild soreness is normal. Sharp or lasting pain is not, so stop and see a doctor.'
    ),
  },
  {
    words: ['cardio', 'running', 'jogging', 'walking', 'hiit', 'best exercise', 'fat burning', 'cycling', 'skipping'],
    reply: answer(
      'Good cardio options are brisk walking, jogging, cycling, skipping and swimming. Start with 20 to 30 minutes, 2 to 3 times a week, and build up. Pick what you enjoy so you stay consistent. HIIT is short and intense, so try it only after a few weeks of base fitness.'
    ),
  },
  {
    words: ['home workout', 'no equipment', 'without gym', 'bodyweight', 'push up', 'pushup', 'pull up', 'at home'],
    reply: answer(
      'No gym needed. Try:\n- Push ups, squats, lunges\n- Plank, glute bridge, mountain climbers\n- Do 3 rounds of 10 to 15 reps with 45 seconds rest\nLog it in Workouts like any other session.',
      [{ label: 'Log a workout', to: '/workouts' }]
    ),
  },
  {
    words: ['abs', 'six pack', 'belly fat', 'stomach', 'core'],
    reply: answer(
      'You cannot burn fat from just one place. Abs show when your overall body fat is lower, so combine healthy eating, cardio and strength training. Add core moves like plank, leg raises and dead bug 2 to 3 times a week.'
    ),
  },
  {
    words: ['water', 'hydration', 'hydrate', 'drink'],
    reply: answer(
      'Drinking water through the day helps energy and recovery. Many people feel good with around 2 to 3 litres a day, more in hot weather or heavy training. Pale yellow urine is a good sign. You can set a Drink water reminder.',
      [{ label: 'Open reminders', to: '/reminders' }]
    ),
  },
  {
    words: ['before workout', 'after workout', 'pre workout', 'post workout', 'what to eat', 'what should i eat', 'meal before gym'],
    reply: answer(
      'Before training (1 to 2 hours): a light meal with carbs and some protein, like banana with milk or oats. After training: protein plus carbs, such as eggs with roti, chicken with rice or yogurt with fruit. Avoid training on a very heavy stomach.'
    ),
  },
  {
    words: ['diet', 'healthy eating', 'healthy food', 'meal ideas', 'healthy meal', 'eat healthy', 'desi food'],
    reply: answer(
      'A simple healthy plate:\n- Half vegetables or salad\n- A quarter protein (eggs, chicken, fish, daal, chana)\n- A quarter carbs (roti, rice, oats)\n- Fruit, nuts and yogurt for snacks\nLimit sugary drinks and deep fried food. Log meals in Nutrition to see your calories.',
      [{ label: 'Open nutrition', to: '/nutrition' }]
    ),
  },
  {
    words: ['injury', 'injured', 'pain', 'hurt', 'knee', 'back pain', 'shoulder pain', 'sprain'],
    reply: answer(
      'If something hurts, stop the exercise. Mild muscle soreness is normal, but sharp pain, swelling, dizziness or pain that does not go away needs a doctor. I cannot diagnose injuries, so please see a doctor or physiotherapist.'
    ),
  },
  {
    words: ['bmi', 'body mass'],
    reply: answer(
      'BMI compares weight to height. It is only a rough guide and does not show muscle or body fat. Use it together with waist size, body fat and how you feel. Track weight and measurements in Progress.',
      [{ label: 'Open progress', to: '/progress' }]
    ),
  },
  {
    words: ['creatine', 'supplement', 'whey', 'protein powder'],
    reply: answer(
      'Supplements are optional. Good food, sleep and training matter far more. Protein powder and creatine are common but not needed for everyone. Talk to a doctor before taking any, especially if you have a health condition.'
    ),
  },
  {
    words: ['consistent', 'consistency', 'habit', 'stay motivated', 'stick to'],
    reply: answer(
      'Consistency beats intensity:\n- Plan workouts like appointments\n- Start small, even 15 minutes\n- Use Reminders and a weekly goal\n- Watch your streak grow\nMissing one day is fine. Just do not miss two.',
      [{ label: 'Open reminders', to: '/reminders' }, { label: 'Open goals', to: '/goals' }]
    ),
  },
]

const fallback = {
  text: 'I am not sure about that one yet. Try asking about your workouts, calories or goals, how to use a page, or a fitness question like "how to lose weight".',
  links: [
    { label: 'Help and FAQ', to: '/help' },
    { label: 'Contact support', to: '/support' },
  ],
  next: ['What can you do?', 'Give me a tip'],
}

const scoreOf = (intent, query) => {
  const words = intent.words.reduce((total, word) => (new RegExp(`\\b${word}s?\\b`).test(query) ? total + word.length : total), 0)
  const patterns = (intent.patterns || []).reduce((total, pattern) => (pattern.test(query) ? total + 25 : total), 0)
  return words + patterns
}

export const getReply = async (text, user) => {
  const query = text.toLowerCase()
  let best = null
  let top = 0

  for (const intent of intents) {
    const score = scoreOf(intent, query)
    if (score > top) {
      top = score
      best = intent
    }
  }

  return best ? best.reply(user) : fallback
}
