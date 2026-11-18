function EmptyState({ icon, title, text, action }) {
  return (
    <div className="ft-card empty-state">
      <i className={`bi ${icon}`}></i>
      <h2 className="h5">{title}</h2>
      {text && <p className="text-secondary">{text}</p>}
      {action}
    </div>
  )
}

export default EmptyState
