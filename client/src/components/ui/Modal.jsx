import { useEffect } from 'react'

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

  return (
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
        <div className="ft-modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
