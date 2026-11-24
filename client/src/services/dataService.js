import { storage } from '../utils/storage'
import { api } from './api'

const localKeys = ['ft_notifications', 'ft_notifications_hidden', 'ft_settings']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const value = (item) => item ?? ''

const exerciseText = (exercise) =>
  `${exercise.name} (${value(exercise.sets)} x ${value(exercise.reps)}${exercise.weight ? ` @ ${exercise.weight}` : ''})`

export const exportData = async () => {
  const { profile, workouts, nutrition, progress, goals, reminders } = await api.get('/data/export')
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default

  const tables = [
    [
      'Workouts',
      ['Date', 'Name', 'Category', 'Min', 'Calories', 'Exercises', 'Notes'],
      workouts.map((item) => [
        item.date,
        item.name,
        item.category,
        value(item.duration),
        value(item.calories),
        item.exercises.map(exerciseText).join('; '),
        value(item.notes),
      ]),
    ],
    [
      'Meals',
      ['Date', 'Meal', 'Item', 'Calories', 'Protein', 'Carbs', 'Fats'],
      nutrition.flatMap((meal) =>
        (meal.items.length > 0 ? meal.items : [{}]).map((item) => [
          meal.date,
          meal.mealType,
          value(item.name),
          value(item.calories),
          value(item.protein),
          value(item.carbs),
          value(item.fats),
        ]),
      ),
    ],
    [
      'Progress',
      ['Date', 'Weight', 'Body fat %', 'Waist', 'Chest', 'Hips'],
      progress.map((item) => [item.date, value(item.weight), value(item.bodyFat), value(item.waist), value(item.chest), value(item.hips)]),
    ],
    [
      'Goals',
      ['Title', 'Type', 'Start', 'Target', 'Current', 'Unit', 'Deadline'],
      goals.map((item) => [item.title, item.type, value(item.start), value(item.target), value(item.current), value(item.unit), value(item.deadline)]),
    ],
    [
      'Reminders',
      ['Title', 'Type', 'Time', 'Days', 'On'],
      reminders.map((item) => [item.title, item.type, item.time, item.days.map((day) => dayNames[day]).join(' '), item.enabled ? 'Yes' : 'No']),
    ],
  ]

  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setTextColor(15, 118, 110)
  doc.text('FitTrack - My data', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`${profile.name} (${profile.email})`, 14, 25)
  doc.text(`Exported on ${new Date().toLocaleDateString()}`, 14, 30)

  let y = 40

  for (const [title, head, body] of tables) {
    if (body.length === 0) continue

    if (y > 250) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(13)
    doc.setTextColor(30)
    doc.text(title, 14, y)

    autoTable(doc, {
      startY: y + 3,
      head: [head],
      body,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [20, 184, 166] },
      alternateRowStyles: { fillColor: [245, 248, 250] },
    })

    y = doc.lastAutoTable.finalY + 12
  }

  if (y === 40) {
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text('Nothing has been logged yet.', 14, y)
  }

  doc.save('fittrack-my-data.pdf')
}

export const clearData = async () => {
  await api.remove('/data')
  localKeys.forEach((key) => storage.remove(key))
}