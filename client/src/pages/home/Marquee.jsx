const words = ['Workouts', 'Nutrition', 'Progress', 'Goals', 'Analytics', 'Reminders', 'Reports']

function Marquee() {
  const items = [...words, ...words, ...words, ...words]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((word, index) => (
          <span key={index}>
            {word}
            <i className="bi bi-lightning-charge-fill"></i>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee