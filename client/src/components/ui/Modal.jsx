import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="ft-modal" onClick={onClose}>
      <div
        className="ft-modal-box"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ft-modal-head">
          <h2 className="h5 fw-bold mb-0">{title}</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
