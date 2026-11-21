import { useState } from 'react'
import DatePicker from '../ui/DatePicker'
import FormGroup from '../ui/FormGroup'
import { todayISO } from '../../utils/format'
import { fromLength, fromWeight, toLength, toWeight, unitLabel, weightUnit } from '../../utils/units'

const measurements = [
  { name: 'bodyFat', label: 'Body fat', unit: '%' },
  { name: 'waist', label: 'Waist', unit: 'cm' },
  { name: 'chest', label: 'Chest', unit: 'cm' },
  { name: 'hips', label: 'Hips', unit: 'cm' },
]

const startForm = (initial) => {
  if (initial) {
    return {
      date: initial.date,
      weight: toWeight(initial.weight),
      bodyFat: initial.bodyFat ?? '',
      waist: toLength(initial.waist ?? ''),
      chest: toLength(initial.chest ?? ''),
      hips: toLength(initial.hips ?? ''),
    }
  }

  return { date: todayISO(), weight: '', bodyFat: '', waist: '', chest: '', hips: '' }
}

const toNumber = (value) => (value === '' ? null : Number(value))

function ProgressForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => startForm(initial))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const found = {}
    if (!form.date) found.date = 'Choose a date'
    if (!(Number(form.weight) > 0)) found.weight = 'Enter your weight'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      date: form.date,
      weight: fromWeight(Number(form.weight)),
      bodyFat: toNumber(form.bodyFat),
      waist: fromLength(toNumber(form.waist)),
      chest: fromLength(toNumber(form.chest)),
      hips: fromLength(toNumber(form.hips)),
    })
  }

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="form-section">Required</div>

        <div className="row g-3">
          <FormGroup label="Date" htmlFor="date" error={errors.date} className="col-sm-6">
            <DatePicker
              id="date"
              value={form.date}
              invalid={Boolean(errors.date)}
              onChange={(value) => setForm({ ...form, date: value })}
            />
          </FormGroup>

          <FormGroup label="Weight" htmlFor="weight" error={errors.weight} className="col-sm-6">
            <div className="unit-input">
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min="0"
                className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                value={form.weight}
                onChange={handleChange}
              />
              <span>{weightUnit()}</span>
            </div>
          </FormGroup>
        </div>

        <div className="form-section">Measurements (optional)</div>

        <div className="row g-3">
          {measurements.map((field) => (
            <FormGroup key={field.name} label={field.label} htmlFor={field.name} className="col-6">
              <div className="unit-input">
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-control"
                  value={form[field.name]}
                  onChange={handleChange}
                />
                <span>{unitLabel(field.unit)}</span>
              </div>
            </FormGroup>
          ))}
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check2 me-1"></i>Save entry
        </button>
      </div>
    </form>
  )
}

export default ProgressForm

