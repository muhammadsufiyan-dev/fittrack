import { useEffect, useRef, useState } from 'react'

function ConfirmDialog({
  title = 'Are you sure?',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  icon = 'bi-trash3',
  onConfirm,
  onCancel,
}) {
  const [closing, setClosing] = useState(false)
  const cancelButton = useRef(null)

  const finish = (action) => {
    setClosing(true)
    setTimeout(action, 180)
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') finish(onCancel)
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    cancelButton.current.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className={`confirm-overlay ${closing ? 'closing' : ''}`} onClick={() => finish(onCancel)}>
      <div
        className="confirm-box"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-icon">
          <i className={`bi ${icon}`}></i>
        </div>
        <h2 className="confirm-title">{title}</h2>
        {message && <p className="confirm-text">{message}</p>}
        <div className="confirm-actions">
          <button ref={cancelButton} type="button" className="btn btn-outline-secondary" onClick={() => finish(onCancel)}>
            {cancelText}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => finish(onConfirm)}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
