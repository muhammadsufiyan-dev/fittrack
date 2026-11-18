function FormField({ id, label, icon, error, right, ...inputProps }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold small">
        {label}
      </label>
      <div className={`field ${error ? 'invalid' : ''}`}>
        <i className={`bi ${icon} field-icon`}></i>
        <input id={id} className="field-input" {...inputProps} />
        {right}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}

export default FormField
