export const navGroups = [
  {
    title: 'Main',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
      { to: '/workouts', label: 'Workouts', icon: 'bi-lightning-charge' },
      { to: '/nutrition', label: 'Nutrition', icon: 'bi-egg-fried' },
      { to: '/progress', label: 'Progress', icon: 'bi-graph-up-arrow' },
      { to: '/goals', label: 'Goals', icon: 'bi-bullseye' },
    ],
  },
  {
    title: 'Insights',
    links: [
      { to: '/analytics', label: 'Analytics', icon: 'bi-bar-chart' },
      { to: '/reports', label: 'Reports', icon: 'bi-file-earmark-text' },
      { to: '/search', label: 'Search', icon: 'bi-search' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/reminders', label: 'Reminders', icon: 'bi-alarm' },
      { to: '/notifications', label: 'Notifications', icon: 'bi-bell' },
      { to: '/profile', label: 'Profile', icon: 'bi-person' },
      { to: '/settings', label: 'Settings', icon: 'bi-gear' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/support', label: 'Support', icon: 'bi-headset' },
      { to: '/help', label: 'Help and FAQ', icon: 'bi-question-circle' },
    ],
  },
]

export const navLinks = navGroups.flatMap((group) => group.links)
