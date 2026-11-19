import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import ReportSheet from '../../components/reports/ReportSheet'
import PageHeader from '../../components/ui/PageHeader'
import Reveal from '../../components/ui/Reveal'
import StatCard from '../../components/ui/StatCard'
import { getReport } from '../../services/reportService'
import { downloadCSV } from '../../utils/download'
import { formatDate } from '../../utils/format'

const ranges = [
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
]

const show = (value, unit) => (value === null || value === undefined ? '-' : `${value} ${unit}`)

function Reports() {
  const [days, setDays] = useState(30)
  const [report, setReport] = useState(null)

  useEffect(() => {
    getReport(days).then(setReport)
  }, [days])

  if (!report) return <Loader />

  const exportCSV = () => {
    const rows = [['Date', 'Workout', 'Category', 'Duration (min)', 'Calories', 'Exercises']]
    report.workouts.forEach((item) => {
      rows.push([
        item.date,
        item.name,
        item.category,
        item.duration,
        item.calories,
        item.exercises.map((exercise) => exercise.name).join('; '),
      ])
    })
    downloadCSV(`fittrack-report-${report.to}.csv`, rows)
  }

  const actions = (
    <div className="report-actions">
      <button type="button" className="btn btn-outline-secondary" onClick={exportCSV} disabled={report.workouts.length === 0}>
        <i className="bi bi-filetype-csv me-1"></i>Download CSV
      </button>
      <button type="button" className="btn btn-primary" onClick={() => window.print()}>
        <i className="bi bi-printer me-1"></i>Print or save PDF
      </button>
    </div>
  )

  return (
    <>
      <div className="report-screen">
        <PageHeader title="Reports" subtitle="A summary of your activity that you can print or download." action={actions} />

        <div className="chip-row mb-4">
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

        <div className="row g-3 mb-4">
          <div className="col-6 col-xl-3">
            <StatCard icon="bi-lightning-charge" label="Workouts" value={report.workouts.length} />
          </div>
          <div className="col-6 col-xl-3">
            <StatCard icon="bi-clock" label="Time trained" value={report.minutes} unit="min" />
          </div>
          <div className="col-6 col-xl-3">
            <StatCard icon="bi-fire" label="Calories burned" value={report.burned} unit="kcal" />
          </div>
          <div className="col-6 col-xl-3">
            <StatCard icon="bi-egg-fried" label="Avg calories eaten" value={report.avgEaten} unit="kcal" />
          </div>
        </div>

        <Reveal>
          <div className="ft-card p-3 p-md-4 mb-4">
            <h2 className="panel-title">Workouts</h2>

            {report.workouts.length === 0 ? (
              <EmptyState
                icon="bi-file-earmark-text"
                title="No workouts in this period"
                text="Log a workout and it will show up here."
                action={
                  <Link to="/workouts" className="btn btn-primary">
                    Go to workouts
                  </Link>
                }
              />
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Workout</th>
                      <th>Category</th>
                      <th>Duration</th>
                      <th>Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.workouts.map((item) => (
                      <tr key={item.id}>
                        <td>{formatDate(item.date)}</td>
                        <td className="fw-semibold">{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.duration} min</td>
                        <td>{item.calories} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Reveal>

        <div className="row g-3">
          <div className="col-lg-6">
            <Reveal className="h-100">
              <div className="ft-card p-3 p-md-4 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <h2 className="panel-title">Body progress</h2>
                  {report.weightChange !== null && (
                    <span className="form-total">
                      {report.weightChange > 0 ? '+' : ''}
                      {report.weightChange} kg
                    </span>
                  )}
                </div>

                {report.entries.length === 0 ? (
                  <p className="text-secondary mb-0">No entries in this period.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weight</th>
                          <th>Body fat</th>
                          <th>Waist</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.entries.map((item) => (
                          <tr key={item.id}>
                            <td>{formatDate(item.date)}</td>
                            <td>{show(item.weight, 'kg')}</td>
                            <td>{show(item.bodyFat, '%')}</td>
                            <td>{show(item.waist, 'cm')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <div className="col-lg-6">
            <Reveal delay={100} className="h-100">
              <div className="ft-card p-3 p-md-4 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <h2 className="panel-title">Goals</h2>
                  <span className="form-total">
                    {report.goalsDone} of {report.goals.length} done
                  </span>
                </div>

                {report.goals.length === 0 ? (
                  <p className="text-secondary mb-0">No goals yet.</p>
                ) : (
                  report.goals.map((goal) => (
                    <div className="macro-row" key={goal.id}>
                      <div className="d-flex justify-content-between mb-1 gap-2">
                        <span className="fw-semibold">{goal.title}</span>
                        <small className="text-secondary text-nowrap">{goal.percent}%</small>
                      </div>
                      <div className="mini-bar">
                        <span style={{ width: `${goal.percent}%` }}></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <ReportSheet report={report} />
    </>
  )
}

export default Reports
