export const workoutCategories = ['Strength', 'Cardio', 'HIIT', 'Flexibility']

export const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export const nutritionTargets = {
  calories: 2200,
  protein: 140,
  carbs: 250,
  fats: 70,
}

export const progressMetrics = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'bodyFat', label: 'Body fat', unit: '%' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
]

export const goalTypes = [
  { value: 'weight', label: 'Body weight', icon: 'bi-speedometer2' },
  { value: 'workouts', label: 'Workouts per week', icon: 'bi-lightning-charge' },
  { value: 'custom', label: 'Custom goal', icon: 'bi-bullseye' },
]
