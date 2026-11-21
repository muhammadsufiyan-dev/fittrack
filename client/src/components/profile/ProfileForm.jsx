import { useState } from 'react'
import FormGroup from '../ui/FormGroup'
import PhotoPicker from './PhotoPicker'

function ProfileForm({ user, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || '',
    city: user.city || '',
    bio: user.bio || '',
    photo: user.photo || '',
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (form.name.trim().length < 2) {
      setError('Enter your full name')
      return
    }

    onSubmit({ ...form, name: form.name.trim(), phone: form.phone.trim(), city: form.city.trim(), bio: form.bio.trim() })
  }

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-body">
        <div className="mb-3">
          <PhotoPicker value={form.photo} name={form.name} onChange={(photo) => setForm({ ...form, photo })} />
        </div>

        <FormGroup label="Full name" htmlFor="name" error={error} className="mb-3">
          <input
            id="name"
            name="name"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={form.name}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="row g-3 mb-3">
          <FormGroup label="Phone" htmlFor="phone" className="col-sm-6">
            <input id="phone" name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} />
          </FormGroup>
          <FormGroup label="City" htmlFor="city" className="col-sm-6">
            <input id="city" name="city" className="form-control" value={form.city} onChange={handleChange} />
          </FormGroup>
        </div>

        <FormGroup label="About you" htmlFor="bio" hint="A short line about your fitness journey">
          <textarea
            id="bio"
            name="bio"
            rows="3"
            maxLength="160"
            className="form-control"
            value={form.bio}
            onChange={handleChange}
          ></textarea>
        </FormGroup>
      </div>

      <div className="form-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check2 me-1"></i>Save profile
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
