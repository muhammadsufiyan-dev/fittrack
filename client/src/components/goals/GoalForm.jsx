import { useState } from 'react'
import DatePicker from '../ui/DatePicker'
import FormGroup from '../ui/FormGroup'
import { goalTypes } from '../../utils/constants'
import { fromWeight, toWeight } from '../../utils/units'

const typeHints = {
  weight: 'Follows the weight you log on the Progress page.',
  workouts: 'Follows the workouts you log in the last 7 days.',
  custom: 'You update your own progress.',
}

const startForm = (initial) => {
  if (initial) {
    const weight = initial.type === 'weight'
    return {
      ...initial,
      start: weight ? toWeight(initial.start) : initial.start,
      target: weight ? toWeight(initial.target) : initial.target,
      deadline: initial.deadline || '',
    }
  }

  return { title: '', type: 'weight', start: '', target: '', current: '', unit: '', deadline: '' }
}

function GoalForm({ initial, latestWeight, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => startForm(initial))
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(initial)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const found = {}
    if (!form.title.trim()) found.title = 'Enter a goal name'
    if (!(Number(form.target) > 0)) found.target = 'Enter a target'
    if (form.type === 'custom' && form.start === '') found.start = 'Enter your starting value'
    if (form.type === 'custom' && !form.unit.trim()) found.unit = 'Enter a unit, e.g. kg'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const data = {
      title: form.title.trim(),
      type: form.type,
      target: form.type === 'weight' ? fromWeight(Number(form.target)) : Number(form.target),
      deadline: form.deadline,
    }

    if (form.type === 'weight') {
      data.start = isEdit ? fromWeight(Number(form.start)) : latestWeight || fromWeight(Number(form.target))
      data.current = 0
      data.unit = 'kg'
    } else if (form.type === 'workouts') {
      data.start = 0
      data.current = 0
      data.unit = 'workouts'
    } else {
      data.start = Number(form.start)
      data.current = form.current === '' ? Number(form.start) : Number(form.current)
      data.unit = form.unit.trim()
    }

    onSubmit(data)
  }

  const isCustom = form.type === 'custom'

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="form-section">Goal</div>

        <FormGroup label="Goal name" htmlFor="title" error={errors.title} className="mb-3">
          <input
            id="title"
            name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g. Reach 75 kg"
            value={form.title}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Goal type" hint={typeHints[form.type]} className="mb-3">
          <div className="type-options">
            {goalTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                disabled={isEdit}
                className={`type-option ${form.type === item.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, type: item.value })}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </FormGroup>

        <div className="form-section">Target</div>

        <div className="row g-3">
          {isCustom && (
            <>
              <FormGroup label="Start" htmlFor="start" error={errors.start} className="col-6 col-sm-4">
                <input
                  id="start"
                  name="start"
                  type="number"
                  step="any"
                  className={`form-control ${errors.start ? 'is-invalid' : ''}`}
                  value={form.start}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup label="Now" htmlFor="current" className="col-6 col-sm-4">
                <input
                  id="current"
                  name="current"
                  type="number"
                  step="any"
                  className="form-control"
                  value={form.current}
                  onChange={handleChange}
                />
              </FormGroup>
            </>
          )}

          <FormGroup
            label="Target"
            htmlFor="target"
            error={errors.target}
            className={isCustom ? 'col-12 col-sm-4' : 'col-sm-6'}
          >
            <input
              id="target"
              name="target"
              type="number"
              step="any"
              className={`form-control ${errors.target ? 'is-invalid' : ''}`}
              value={form.target}
              onChange={handleChange}
            />
          </FormGroup>

          {isCustom && (
            <FormGroup label="Unit" htmlFor="unit" error={errors.unit} className="col-sm-6">
              <input
                id="unit"
                name="unit"
                className={`form-control ${errors.unit ? 'is-invalid' : ''}`}
                placeholder="kg, km, min"
                value={form.unit}
                onChange={handleChange}
              />
            </FormGroup>
          )}

          <FormGroup label="Deadline (optional)" htmlFor="deadline" className="col-sm-6">
            <DatePicker
              id="deadline"
              value={form.deadline}
              clearable
              placeholder="No deadline"
              onChange={(value) => setForm({ ...form, deadline: value })}
            />
          </FormGroup>
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check2 me-1"></i>Save goal
        </button>
      </div>
    </form>
  )
}

export default GoalForm

