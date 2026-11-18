import Reveal from '../../components/ui/Reveal'

const stats = [
  { value: '14', label: 'Core modules' },
  { value: '2', label: 'Export formats' },
  { value: '2', label: 'Themes' },
  { value: '24/7', label: 'Access anywhere' },
]

function Stats() {
  return (
    <section className="container pt-5">
      <Reveal>
        <div className="stats">
          <div className="row g-0 text-center">
            {stats.map((item) => (
              <div className="col-6 col-md-3 stat-item" key={item.label}>
                <div className="stat-value gradient-text">{item.value}</div>
                <div className="text-secondary small">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default Stats
