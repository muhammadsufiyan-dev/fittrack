import { useState } from 'react'
import DatePicker from '../ui/DatePicker'
import FormGroup from '../ui/FormGroup'
import { mealTypes } from '../../utils/constants'

const emptyItem = { name: '', calories: '', protein: '', carbs: '', fats: '' }

const mealIcons = {
  Breakfast: 'bi-cup-hot',
  Lunch: 'bi-egg-fried',
  Dinner: 'bi-moon-stars',
  Snack: 'bi-apple',
}

const macroFields = [
  { key: 'calories', label: 'Calories (kcal)' },
  { key: 'protein', label: 'Protein (g)' },
  { key: 'carbs', label: 'Carbs (g)' },
  { key: 'fats', label: 'Fats (g)' },
]

const startForm = (initial, date) => {
  if (initial) return { ...initial }
  return { mealType: mealTypes[0], date, notes: '', items: [{ ...emptyItem }] }
}

function NutritionForm({ initial, date, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => startForm(initial, date))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const updateItem = (index, field, value) => {
    const items = form.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setForm({ ...form, items })
  }

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { ...emptyItem }] })
  }

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((item, i) => i !== index) })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const filled = form.items.filter((item) => item.name.trim())
    const found = {}
    if (!form.date) found.date = 'Choose a date'
    if (filled.length === 0) found.items = 'Add at least one food item with a name'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      mealType: form.mealType,
      date: form.date,
      notes: form.notes.trim(),
      items: filled.map((item, index) => ({
        id: item.id || `${Date.now()}-${index}`,
        name: item.name.trim(),
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fats: Number(item.fats) || 0,
      })),
    })
  }

  const totalCalories = form.items.reduce((sum, item) => sum + (Number(item.calories) || 0), 0)

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="form-section">Meal</div>

        <FormGroup label="Meal type" className="mb-3">
          <div className="chip-row">
            {mealTypes.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip-btn ${form.mealType === item ? 'active' : ''}`}
                onClick={() => setForm({ ...form, mealType: item })}
              >
                <i className={`bi ${mealIcons[item]} me-1`}></i>
                {item}
              </button>
            ))}
          </div>
        </FormGroup>

        <FormGroup label="Date" htmlFor="date" error={errors.date} className="mb-3">
          <DatePicker
            id="date"
            value={form.date}
            invalid={Boolean(errors.date)}
            onChange={(value) => setForm({ ...form, date: value })}
          />
        </FormGroup>

        <div className="form-section">
          Food items
          <span className="form-total">{totalCalories} kcal</span>
        </div>

        {form.items.map((item, index) => (
          <div className="ex-card" key={index}>
            <div className="ex-card-head">
              <span className="ex-number">{index + 1}</span>
              <input
                className="form-control"
                placeholder="Food name"
                aria-label="Food name"
                value={item.name}
                onChange={(event) => updateItem(index, 'name', event.target.value)}
              />
              <button type="button" className="ex-remove" onClick={() => removeItem(index)} aria-label="Remove item">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="ex-grid four">
              {macroFields.map((field) => (
                <div key={field.key}>
                  <span className="ex-label">{field.label}</span>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    aria-label={field.label}
                    value={item[field.key]}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {errors.items && (
          <div className="form-error mb-2">
            <i className="bi bi-exclamation-circle"></i>
            {errors.items}
          </div>
        )}

        <button type="button" className="add-row-btn" onClick={addItem}>
          <i className="bi bi-plus-lg"></i>Add food item
        </button>

        <div className="form-section">Notes</div>

        <textarea
          id="notes"
          name="notes"
          rows="2"
          className="form-control"
          placeholder="Anything to remember about this meal?"
          aria-label="Notes"
          value={form.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check2 me-1"></i>Save meal
        </button>
      </div>
    </form>
  )
}

export default NutritionForm
