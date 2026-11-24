import { useRef, useState } from 'react'
import { resizeImage } from '../../utils/image'

function PhotoPicker({ value, onChange }) {
  const input = useRef(null)
  const [error, setError] = useState('')

  const handlePick = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }

    setError('')
    try {
      onChange(await resizeImage(file))
    } catch {
      setError('This image could not be read')
    }
  }

  return (
    <div className="pp-row">
      {value && (
        <span className="pp-thumb">
          <img src={value} alt="" />
        </span>
      )}

      <div>
        <div className="pp-buttons">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => input.current.click()}>
            <i className="bi bi-camera me-1"></i>
            {value ? 'Change photo' : 'Add photo'}
          </button>
          {value && (
            <button type="button" className="btn btn-sm text-danger" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        <small className="text-secondary d-block mt-1">{error || 'Optional. JPG or PNG.'}</small>
      </div>

      <input ref={input} type="file" accept="image/*" hidden onChange={handlePick} />
    </div>
  )
}

export default PhotoPicker