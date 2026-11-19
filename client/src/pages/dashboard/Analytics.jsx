import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CaloriesChart from '../../components/analytics/CaloriesChart'
import CategoryChart from '../../components/analytics/CategoryChart'
import MinutesChart from '../../components/analytics/MinutesChart'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import PageHeader from '../../components/ui/PageHeader'
import Reveal from '../../components/ui/Reveal'
import StatCard from '../../components/ui/StatCard'
import { getAnalytics } from '../../services/analyticsService'
import { nutritionTargets } from '../../utils/constants'

const ranges = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

const macroRows = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fats', label: 'Fats', unit: 'g' },
]

function Analytics() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)

  useEffect(() => {
    getAnalytics(days).then(setData)
  }, [days])

  if (!data) return <Loader />

  const picker = (
    <div className="chip-row">
      {ranges.map((item) => (
        <button
          key={item.days}
          type="button"
          className={`chip-btn ${days === item.days ? 'active' : ''}`}
          onClick={() => setDays(item.days)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <PageHeader title="Analytics" subtitle="See how your training and eating add up over time." action={picker} />

      {data.totalWorkouts === 0 && data.avgEaten === 0 ? (
        <EmptyState
          icon="bi-bar-chart"
          title="Nothing to show yet"
          text={`No workouts or meals were logged in the last ${days} days.`}
          action={
            <Link to="/workouts" className="btn btn-primary">
              Log a workout
            </Link>
          }
        />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-xl-3">
              <StatCard icon="bi-lightning-charge" label="Workouts" value={data.totalWorkouts} />
            </div>
            <div className="col-6 col-xl-3">
              <StatCard icon="bi-clock" label="Time trained" value={data.minutes} unit="min" />
            </div>
            <div className="col-6 col-xl-3">
              <StatCard icon="bi-fire" label="Calories burned" value={data.burned} unit="kcal" />
            </div>
            <div className="col-6 col-xl-3">
              <StatCard
                icon="bi-calendar-check"
                label="Active days"
                value={data.activeDays}
                unit={`/ ${days}`}
                progress={(data.activeDays / days) * 100}
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-lg-7">
              <Reveal className="h-100">
                <div className="ft-card p-3 p-md-4 h-100">
                  <h2 className="panel-title">{days > 30 ? 'Weekly training time' : 'Daily training time'}</h2>
                  <MinutesChart data={data.trend} />
                </div>
              </Reveal>
            </div>
            <div className="col-lg-5">
              <Reveal delay={100} className="h-100">
                <div className="ft-card p-3 p-md-4 h-100">
                  <h2 className="panel-title">Workout types</h2>
                  {data.categories.length === 0 ? (
                    <p className="text-secondary mb-0">No workouts in this period.</p>
                  ) : (
                    <CategoryChart data={data.categories} />
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-lg-7">
              <Reveal className="h-100">
                <div className="ft-card p-3 p-md-4 h-100">
                  <h2 className="panel-title">Calories eaten and burned</h2>
                  <CaloriesChart data={data.trend} />
                </div>
              </Reveal>
            </div>
            <div className="col-lg-5">
              <Reveal delay={100} className="h-100">
                <div className="ft-card p-3 p-md-4 h-100">
                  <h2 className="panel-title">Daily average vs target</h2>
                  {data.avgEaten === 0 ? (
                    <p className="text-secondary mb-0">Log meals on the Nutrition page to see this.</p>
                  ) : (
                    macroRows.map((row) => {
                      const target = nutritionTargets[row.key]
                      const percent = Math.round((data.macros[row.key] / target) * 100)

                      return (
                        <div className="macro-row" key={row.key}>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">{row.label}</span>
                            <small className="text-secondary">
                              {data.macros[row.key]} / {target} {row.unit}
                            </small>
                          </div>
                          <div className="mini-bar">
                            <span style={{ width: `${Math.min(percent, 100)}%` }}></span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Analytics
