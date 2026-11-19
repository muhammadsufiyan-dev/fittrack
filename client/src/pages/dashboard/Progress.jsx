import { useEffect, useState } from 'react'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import useConfirm from '../../hooks/useConfirm'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import PersonalBests from '../../components/progress/PersonalBests'
import ProgressChart from '../../components/progress/ProgressChart'
import ProgressForm from '../../components/progress/ProgressForm'
import { addEntry, deleteEntry, getEntries, updateEntry } from '../../services/progressService'
import { getWorkouts } from '../../services/workoutService'
import { progressMetrics } from '../../utils/constants'
import { formatDate } from '../../utils/format'

const show = (value, unit) => (value === null || value === undefined ? '-' : `${value} ${unit}`)

function Progress() {
  const [entries, setEntries] = useState(null)
  const [workouts, setWorkouts] = useState([])
  const [metric, setMetric] = useState(progressMetrics[0])
  const [modal, setModal] = useState(null)
  const confirm = useConfirm()

  const load = async () => {
    setEntries(await getEntries())
  }

  useEffect(() => {
    getEntries().then(setEntries)
    getWorkouts().then(setWorkouts)
  }, [])

  const handleSave = async (data) => {
    if (modal.mode === 'edit') {
      await updateEntry(modal.item.id, data)
    } else {
      await addEntry(data)
    }
    setModal(null)
    load()
  }

  const handleDelete = async (item) => {
    if (await confirm({ title: 'Delete entry?', message: `The entry from ${formatDate(item.date)} will be removed.` })) {
      await deleteEntry(item.id)
      load()
    }
  }

  if (!entries) return <Loader />

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
      <i className="bi bi-plus-lg me-1"></i>Add entry
    </button>
  )

  const oldestFirst = [...entries].reverse()
  const chartData = oldestFirst
    .filter((item) => item[metric.key] !== null && item[metric.key] !== undefined)
    .map((item) => ({ date: item.date, value: item[metric.key] }))

  const latestWeight = entries.length > 0 ? entries[0].weight : null
  const change = entries.length > 1 ? Math.round((latestWeight - oldestFirst[0].weight) * 10) / 10 : 0
  const latestBodyFat = entries.find((item) => item.bodyFat)?.bodyFat
  const latestWaist = entries.find((item) => item.waist)?.waist

  return (
    <>
      <PageHeader title="Progress" subtitle="Log your weight and measurements and watch them change." action={addButton} />

      {entries.length === 0 ? (
        <EmptyState
          icon="bi-graph-up-arrow"
          title="No entries yet"
          text="Add your first entry to start tracking your progress."
          action={addButton}
        />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-xl-3">
              <StatCard icon="bi-speedometer2" label="Current weight" value={latestWeight} unit="kg" />
            </div>
            <div className="col-6 col-xl-3">
              <StatCard
                icon="bi-arrow-down-up"
                label="Change since first entry"
                value={`${change > 0 ? '+' : ''}${change}`}
                unit="kg"
              />
            </div>
            <div className="col-6 col-xl-3">
              <StatCard icon="bi-percent" label="Body fat" value={latestBodyFat ?? '-'} unit={latestBodyFat ? '%' : ''} />
            </div>
            <div className="col-6 col-xl-3">
              <StatCard icon="bi-rulers" label="Waist" value={latestWaist ?? '-'} unit={latestWaist ? 'cm' : ''} />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="ft-card p-3 p-md-4 h-100">
                <h2 className="panel-title">{metric.label} over time</h2>

                <div className="chip-row mb-3">
                  {progressMetrics.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`chip-btn ${metric.key === item.key ? 'active' : ''}`}
                      onClick={() => setMetric(item)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {chartData.length < 2 ? (
                  <p className="text-secondary mb-0">Add at least two entries with {metric.label.toLowerCase()} to see the chart.</p>
                ) : (
                  <ProgressChart data={chartData} label={metric.label} unit={metric.unit} />
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <PersonalBests workouts={workouts} />
            </div>
          </div>

          <div className="ft-card p-3 p-md-4">
            <h2 className="panel-title">All entries</h2>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Body fat</th>
                    <th>Waist</th>
                    <th>Chest</th>
                    <th>Hips</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((item) => (
                    <tr key={item.id}>
                      <td className="text-nowrap">{formatDate(item.date)}</td>
                      <td className="fw-semibold">{show(item.weight, 'kg')}</td>
                      <td>{show(item.bodyFat, '%')}</td>
                      <td>{show(item.waist, 'cm')}</td>
                      <td>{show(item.chest, 'cm')}</td>
                      <td>{show(item.hips, 'cm')}</td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => setModal({ mode: 'edit', item })}
                          aria-label="Edit entry"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item)}
                          aria-label="Delete entry"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit entry' : 'Add entry'} onClose={() => setModal(null)}>
          <ProgressForm initial={modal.item} onSubmit={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </>
  )
}

export default Progress
