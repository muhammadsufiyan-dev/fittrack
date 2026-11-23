import { useState } from 'react'
import DatePicker from '../ui/DatePicker'
import FormGroup from '../ui/FormGroup'
import { workoutCategories } from '../../utils/constants'
import { todayISO } from '../../utils/format'
import { fromWeight, toWeight, weightUnit } from '../../utils/units'

const emptyExercise = { name: '', sets: '', reps: '', weight: '' }

const startForm = (initial) => {
  if (initial) {
    return {
      ...initial,
      tags: initial.tags.join(', '),
      exercises: initial.exercises.map((item) => ({ ...item, weight: toWeight(item.weight) })),
    }
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

const splitTags = (value) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

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
    if (!(Number(form.duration) > 0)) found.duration = 'Enter the duration'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      date: form.date,
      duration: Number(form.duration),
      calories: Number(form.calories) || 0,
      notes: form.notes.trim(),
      tags: splitTags(form.tags),
      exercises: form.exercises
        .filter((item) => item.name.trim())
        .map((item, index) => ({
          id: item.id || `${Date.now()}-${index}`,
          name: item.name.trim(),
          sets: Number(item.sets) || 0,
          reps: Number(item.reps) || 0,
          weight: fromWeight(Number(item.weight) || 0),
        })),
    })
  }

  const tags = splitTags(form.tags)

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="form-section">Basics</div>

        <FormGroup label="Workout name" htmlFor="name" error={errors.name} className="mb-3">
          <input
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. Upper body strength"
            value={form.name}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Category" className="mb-3">
          <div className="chip-row">
            {workoutCategories.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip-btn ${form.category === item ? 'active' : ''}`}
                onClick={() => setForm({ ...form, category: item })}
              >
                {item}
              </button>
            ))}
          </div>
        </FormGroup>

        <div className="row g-3">
          <FormGroup label="Date" htmlFor="date" error={errors.date} className="col-sm-4">
            <DatePicker
              id="date"
              value={form.date}
              invalid={Boolean(errors.date)}
              onChange={(value) => setForm({ ...form, date: value })}
            />
          </FormGroup>

          <FormGroup label="Duration" htmlFor="duration" error={errors.duration} className="col-6 col-sm-4">
            <div className="unit-input">
              <input
                id="duration"
                name="duration"
                type="number"
                min="0"
                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                value={form.duration}
                onChange={handleChange}
              />
              <span>min</span>
            </div>
          </FormGroup>

          <FormGroup label="Calories" htmlFor="calories" className="col-6 col-sm-4">
            <div className="unit-input">
              <input
                id="calories"
                name="calories"
                type="number"
                min="0"
                className="form-control"
                value={form.calories}
                onChange={handleChange}
              />
              <span>kcal</span>
            </div>
          </FormGroup>
        </div>

        <div className="form-section">Exercises</div>

        {form.exercises.map((item, index) => (
          <div className="ex-card" key={index}>
            <div className="ex-card-head">
              <span className="ex-number">{index + 1}</span>
              <input
                className="form-control"
                placeholder="Exercise name"
                aria-label="Exercise name"
                value={item.name}
                onChange={(event) => updateExercise(index, 'name', event.target.value)}
              />
              <button type="button" className="ex-remove" onClick={() => removeExercise(index)} aria-label="Remove exercise">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="ex-grid">
              <div>
                <span className="ex-label">Sets</span>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  aria-label="Sets"
                  value={item.sets}
                  onChange={(event) => updateExercise(index, 'sets', event.target.value)}
                />
              </div>
              <div>
                <span className="ex-label">Reps</span>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  aria-label="Reps"
                  value={item.reps}
                  onChange={(event) => updateExercise(index, 'reps', event.target.value)}
                />
              </div>
              <div>
                <span className="ex-label">Weight ({weightUnit()})</span>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="any"
                  aria-label="Weight"
                  value={item.weight}
                  onChange={(event) => updateExercise(index, 'weight', event.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="add-row-btn" onClick={addExercise}>
          <i className="bi bi-plus-lg"></i>Add exercise
        </button>

        <div className="form-section">More details</div>

        <FormGroup label="Tags" htmlFor="tags" hint="Separate tags with commas" className="mb-3">
          <input
            id="tags"
            name="tags"
            className="form-control"
            placeholder="chest, gym"
            value={form.tags}
            onChange={handleChange}
          />
          {tags.length > 0 && (
            <div className="tags mt-2">
              {tags.map((tag) => (
                <span className="tag" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </FormGroup>

        <FormGroup label="Notes" htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="form-control"
            placeholder="How did it feel?"
            value={form.notes}
            onChange={handleChange}
          ></textarea>
        </FormGroup>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check2 me-1"></i>Save workout
        </button>
      </div>
    </form>
  )
}

export default WorkoutForm

