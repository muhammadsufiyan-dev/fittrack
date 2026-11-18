const words = ['Workouts', 'Nutrition', 'Progress', 'Goals', 'Analytics', 'Reminders', 'Reports']
const items = [...words, ...words, ...words, ...words]

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((word, index) => (
          <span className="marquee-item" key={index}>
            {word}
            <i className="bi bi-lightning-charge-fill"></i>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
