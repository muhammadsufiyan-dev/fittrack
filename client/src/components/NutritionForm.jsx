import { useState } from 'react'
import { mealTypes } from '../utils/constants'

const emptyItem = { name: '', calories: '', protein: '', carbs: '', fats: '' }

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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="mealType" className="form-label fw-semibold small">Meal</label>
          <select id="mealType" name="mealType" className="form-select" value={form.mealType} onChange={handleChange}>
            {mealTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-6">
          <label htmlFor="date" className="form-label fw-semibold small">Date</label>
          <input id="date" name="date" type="date" className={`form-control ${errors.date ? 'is-invalid' : ''}`} value={form.date} onChange={handleChange} />
          <div className="invalid-feedback">{errors.date}</div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold small">Food items</label>
        {form.items.map((item, index) => (
          <div className="ex-row" key={index}>
            <input className="form-control ex-name" placeholder="Food name" aria-label="Food name" value={item.name} onChange={(event) => updateItem(index, 'name', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="kcal" aria-label="Calories" value={item.calories} onChange={(event) => updateItem(index, 'calories', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="Protein g" aria-label="Protein in grams" value={item.protein} onChange={(event) => updateItem(index, 'protein', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="Carbs g" aria-label="Carbs in grams" value={item.carbs} onChange={(event) => updateItem(index, 'carbs', event.target.value)} />
            <input className="form-control ex-num" type="number" min="0" placeholder="Fats g" aria-label="Fats in grams" value={item.fats} onChange={(event) => updateItem(index, 'fats', event.target.value)} />
            <button type="button" className="btn btn-outline-danger" onClick={() => removeItem(index)} aria-label="Remove item">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
        {errors.items && <div className="field-error mb-2">{errors.items}</div>}
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={addItem}>
          <i className="bi bi-plus-lg me-1"></i>Add food item
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="form-label fw-semibold small">Notes</label>
        <textarea id="notes" name="notes" rows="2" className="form-control" value={form.notes} onChange={handleChange}></textarea>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save meal
        </button>
      </div>
    </form>
  )
}

export default NutritionForm