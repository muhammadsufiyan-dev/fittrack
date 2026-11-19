export const reminderTypes = [
  { value: 'workout', label: 'Workout', icon: 'bi-lightning-charge' },
  { value: 'meal', label: 'Meal', icon: 'bi-egg-fried' },
  { value: 'water', label: 'Water', icon: 'bi-droplet' },
  { value: 'weigh', label: 'Weigh-in', icon: 'bi-speedometer2' },
  { value: 'custom', label: 'Other', icon: 'bi-bell' },
]

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const formatTime = (value) => {
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export const getNext = (list) => {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const today = (now.getDay() + 6) % 7
  let best = null

  list
    .filter((item) => item.enabled)
    .forEach((item) => {
      const [hours, minutes] = item.time.split(':').map(Number)
      const at = hours * 60 + minutes

      for (let offset = 0; offset <= 7; offset++) {
        const day = (today + offset) % 7
        if (!item.days.includes(day)) continue
        if (offset === 0 && at <= nowMinutes) continue

        const distance = offset * 1440 + at - nowMinutes
        if (!best || distance < best.distance) {
          best = { item, distance, label: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : fullDays[day] }
        }
        break
      }
    })

  return best
}
