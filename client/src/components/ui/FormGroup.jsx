function FormGroup({ label, htmlFor, error, hint, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>
      {children}
      {hint && !error && <div className="form-hint">{hint}</div>}
      {error && (
        <div className="form-error">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}
    </div>
  )
}

export default FormGroup
