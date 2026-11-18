import { useState } from 'react'
import { workoutCategories } from '../../utils/constants'
import { todayISO } from '../../utils/format'

const emptyExercise = { name: '', sets: '', reps: '', weight: '' }

const startForm = (initial) => {
  if (initial) {
    return { ...initial, tags: initial.tags.join(', ') }
  }

  return {
    name: '',
    category: workoutCategories[0],
    date: todayISO(),
    duration: '',
    calories: '',
    notes: '',
    tags: '',
    exercises: [{ ...emptyExercise }],
  }
}

function WorkoutForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => startForm(initial))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const updateExercise = (index, field, value) => {
    const exercises = form.exercises.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setForm({ ...form, exercises })
  }

  const addExercise = () => {
    setForm({ ...form, exercises: [...form.exercises, { ...emptyExercise }] })
  }

  const removeExercise = (index) => {
    setForm({ ...form, exercises: form.exercises.filter((item, i) => i !== index) })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const found = {}
    if (!form.name.trim()) found.name = 'Enter a workout name'
    if (!form.date) found.date = 'Choose a date'
    if (!(Number(form.duration) > 0)) found.duration = 'Enter the duration in minutes'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      date: form.date,
      duration: Number(form.duration),
      calories: Number(form.calories) || 0,
      notes: form.notes.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      exercises: form.exercises
        .filter((item) => item.name.trim())
        .map((item, index) => ({
          id: item.id || `${Date.now()}-${index}`,
          name: item.name.trim(),
          sets: Number(item.sets) || 0,
          reps: Number(item.reps) || 0,
          weight: Number(item.weight) || 0,
        })),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-semibold small">
          Workout name
        </label>
        <input
          id="name"
          name="name"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          placeholder="e.g. Upper body strength"
          value={form.name}
          onChange={handleChange}
        />
        <div className="invalid-feedback">{errors.name}</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="category" className="form-label fw-semibold small">
            Category
          </label>
          <select id="category" name="category" className="form-select" value={form.category} onChange={handleChange}>
            {workoutCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-6">
          <label htmlFor="date" className="form-label fw-semibold small">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            value={form.date}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.date}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="duration" className="form-label fw-semibold small">
            Duration (min)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="0"
            className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
            value={form.duration}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.duration}</div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="calories" className="form-label fw-semibold small">
            Calories burned
          </label>
          <input id="calories" name="calories" type="number" min="0" className="form-control" value={form.calories} onChange={handleChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold small">Exercises</label>
        {form.exercises.map((item, index) => (
          <div className="ex-row" key={index}>
            <input className="form-control ex-name" placeholder="Exercise name" aria-label="Exercise name" value={item.name} onChange={(event) => updateExercise(index, 'name', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="Sets" aria-label="Sets" value={item.sets} onChange={(event) => updateExercise(index, 'sets', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="Reps" aria-label="Reps" value={item.reps} onChange={(event) => updateExercise(index, 'reps', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="kg" aria-label="Weight in kg" value={item.weight} onChange={(event) => updateExercise(index, 'weight', event.target.value)} />
            <button type="button" className="btn btn-outline-danger" onClick={() => removeExercise(index)} aria-label="Remove exercise">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={addExercise}>
          <i className="bi bi-plus-lg me-1"></i>Add exercise
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label fw-semibold small">
          Tags (separate with commas)
        </label>
        <input id="tags" name="tags" className="form-control" placeholder="chest, gym" value={form.tags} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="form-label fw-semibold small">
          Notes
        </label>
        <textarea id="notes" name="notes" rows="3" className="form-control" value={form.notes} onChange={handleChange}></textarea>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save workout
        </button>
      </div>
    </form>
  )
}

export default WorkoutForm
