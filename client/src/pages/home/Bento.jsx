import Reveal from '../../components/ui/Reveal'

const weekBars = [40, 65, 50, 80, 60, 92, 70]

const macros = [
  { label: 'Protein', value: 30, color: '#14b8a6' },
  { label: 'Carbs', value: 45, color: '#06b6d4' },
  { label: 'Fats', value: 25, color: '#a3e635' },
]

const goals = [
  { label: 'Run 5 km', value: 80 },
  { label: 'Bench press 60 kg', value: 65 },
  { label: 'Drink 3 L water', value: 45 },
]

const circumference = 2 * Math.PI * 54
let offset = 0

const segments = macros.map((item) => {
  const length = (item.value / 100) * circumference
  const segment = { ...item, length, offset }
  offset += length
  return segment
})

function Bento() {
  return (
    <section id="features" className="container py-5">
      <div className="py-3">
        <div className="text-center mb-5">
          <span className="ft-badge mb-3">Features</span>
          <h2 className="section-title">Built for every rep</h2>
          <p className="text-secondary mb-0">One simple app for your whole fitness journey.</p>
        </div>

        <div className="bento">
          <Reveal className="span-7">
            <div className="ft-card ft-hover bento-card h-100 p-4">
              <span className="ft-icon mb-3">
                <i className="bi bi-lightning-charge"></i>
              </span>
              <h3 className="h4">Workout tracking</h3>
              <p className="text-secondary">
                Build routines with exercises, sets, reps and weights. Organize them by category and tags.
              </p>
              <div className="week-bars">
                {weekBars.map((value, index) => (
                  <div
                    key={index}
                    className="week-bar"
                    style={{ height: `${value}%`, transitionDelay: `${index * 80}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="span-5" delay={100}>
            <div className="ft-card ft-hover bento-card h-100 p-4">
              <span className="ft-icon mb-3">
                <i className="bi bi-egg-fried"></i>
              </span>
              <h3 className="h4">Nutrition logs</h3>
              <p className="text-secondary">Log your meals and see calories and macros for every day.</p>
              <div className="donut-row">
                <svg viewBox="0 0 140 140" width="130" height="130" role="img" aria-label="Macro split">
                  <g transform="rotate(-90 70 70)">
                    <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="18" />
                    {segments.map((item) => (
                      <circle
                        key={item.label}
                        className="donut-seg"
                        cx="70"
                        cy="70"
                        r="54"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="18"
                        style={{ '--len': item.length, '--c': circumference, strokeDashoffset: -item.offset }}
                      />
                    ))}
                  </g>
                </svg>

                <ul className="legend-list">
                  {macros.map((item) => (
                    <li key={item.label}>
                      <span className="legend-dot" style={{ background: item.color }}></span>
                      {item.label}
                      <span className="text-secondary">{item.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal className="span-4">
            <div className="ft-card ft-hover bento-card h-100 p-4">
              <span className="ft-icon mb-3">
                <i className="bi bi-graph-up-arrow"></i>
              </span>
              <h3 className="h5">Progress charts</h3>
              <p className="text-secondary">Weight, measurements and personal bests over time.</p>
              <svg viewBox="0 0 240 90" className="w-100 mt-2" aria-hidden="true">
                <path className="line-area" d="M0 80 L40 70 L80 74 L120 52 L160 46 L200 28 L240 18 L240 90 L0 90 Z" />
                <path
                  className="draw"
                  pathLength="1"
                  d="M0 80 L40 70 L80 74 L120 52 L160 46 L200 28 L240 18"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Reveal>

          <Reveal className="span-4" delay={100}>
            <div className="ft-card ft-hover bento-card h-100 p-4">
              <span className="ft-icon mb-3">
                <i className="bi bi-bullseye"></i>
              </span>
              <h3 className="h5">Goals and reminders</h3>
              <p className="text-secondary">Set goals and get reminded for workouts and meals.</p>
              {goals.map((goal, index) => (
                <div key={goal.label} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{goal.label}</span>
                    <span className="text-secondary">{goal.value}%</span>
                  </div>
                  <div className="progress ft-progress">
                    <div
                      className="progress-bar fill"
                      style={{ '--w': `${goal.value}%`, transitionDelay: `${index * 150}ms` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="span-4" delay={200}>
            <div className="ft-card ft-hover bento-card h-100 p-4">
              <span className="ft-icon mb-3">
                <i className="bi bi-file-earmark-arrow-down"></i>
              </span>
              <h3 className="h5">Reports and export</h3>
              <p className="text-secondary">Download your progress and nutrition reports whenever you need them.</p>
              <div className="file-chips">
                <span className="file-chip">
                  <i className="bi bi-file-earmark-pdf"></i>PDF
                </span>
                <span className="file-chip">
                  <i className="bi bi-filetype-csv"></i>CSV
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ft-card ft-hover bento-card p-4 p-md-5">
              <div className="row align-items-center g-4">
                <div className="col-md-6">
                  <span className="ft-badge mb-3">Coming soon</span>
                  <h3 className="h4">Ask your fitness guide</h3>
                  <p className="text-secondary mb-0">
                    Get quick answers about workouts, nutrition and recovery from the built-in fitness chatbot.
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="chat">
                    <div className="bubble bubble-user">How much protein do I need?</div>
                    <div className="bubble bubble-bot">It depends on your goal and body weight. Let us work it out together.</div>
                    <div className="bubble bubble-bot typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Bento
