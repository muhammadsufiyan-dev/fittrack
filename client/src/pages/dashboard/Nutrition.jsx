import { useEffect, useState } from 'react'
import MacroChart from '../../components/charts/MacroChart'
import MealCard from '../../components/nutrition/MealCard'
import NutritionForm from '../../components/nutrition/NutritionForm'
import CountUp from '../../components/ui/CountUp'
import DatePicker from '../../components/ui/DatePicker'
import EmptyState from '../../components/ui/EmptyState'
import Loader from '../../components/ui/Loader'
import useConfirm from '../../hooks/useConfirm'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { addLog, deleteLog, getLogsByDate, updateLog } from '../../services/nutritionService'
import { mealTypes, nutritionTargets } from '../../utils/constants'
import { formatDate, shiftDate, todayISO } from '../../utils/format'

const percent = (value, target) => Math.min(100, Math.round((value / target) * 100))

function Nutrition() {
  const [date, setDate] = useState(todayISO)
  const [logs, setLogs] = useState(null)
  const [modal, setModal] = useState(null)
  const confirm = useConfirm()

  const load = async () => {
    setLogs(await getLogsByDate(date))
  }

  useEffect(() => {
    getLogsByDate(date).then(setLogs)
  }, [date])

  const handleSave = async (data) => {
    if (modal.mode === 'edit') {
      await updateLog(modal.item.id, data)
    } else {
      await addLog(data)
    }
    setModal(null)
    setDate(data.date)
    load()
  }

  const handleDelete = async (log) => {
    if (await confirm({ title: 'Delete meal?', message: `This ${log.mealType.toLowerCase()} will be removed.` })) {
      await deleteLog(log.id)
      load()
    }
  }

  if (!logs) return <Loader />

  const items = logs.flatMap((log) => log.items)
  const sum = (field) => items.reduce((total, item) => total + item[field], 0)
  const calories = sum('calories')
  const protein = sum('protein')
  const carbs = sum('carbs')
  const fats = sum('fats')
  const gramsTotal = protein + carbs + fats
  const remaining = nutritionTargets.calories - calories

  const macroData = [
    { name: 'Protein', value: Math.round((protein / gramsTotal) * 100) },
    { name: 'Carbs', value: Math.round((carbs / gramsTotal) * 100) },
    { name: 'Fats', value: Math.round((fats / gramsTotal) * 100) },
  ]

  const sortedLogs = [...logs].sort((a, b) => mealTypes.indexOf(a.mealType) - mealTypes.indexOf(b.mealType))
  const isToday = date === todayISO()

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
      <i className="bi bi-plus-lg me-1"></i>Add meal
    </button>
  )

  return (
    <>
      <PageHeader title="Nutrition" subtitle={isToday ? 'Today' : formatDate(date)} action={addButton} />

      <div className="date-nav mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setDate(shiftDate(date, -1))}
          aria-label="Previous day"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="date-pick">
          <DatePicker value={date} onChange={setDate} />
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setDate(shiftDate(date, 1))}
          aria-label="Next day"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
        {!isToday && (
          <button type="button" className="btn btn-outline-primary" onClick={() => setDate(todayISO())}>
            Today
          </button>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-fire"
            label={`Calories (target ${nutritionTargets.calories})`}
            value={calories}
            unit="kcal"
            progress={percent(calories, nutritionTargets.calories)}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-egg-fried"
            label={`Protein (target ${nutritionTargets.protein} g)`}
            value={protein}
            unit="g"
            progress={percent(protein, nutritionTargets.protein)}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-basket"
            label={`Carbs (target ${nutritionTargets.carbs} g)`}
            value={carbs}
            unit="g"
            progress={percent(carbs, nutritionTargets.carbs)}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon="bi-droplet"
            label={`Fats (target ${nutritionTargets.fats} g)`}
            value={fats}
            unit="g"
            progress={percent(fats, nutritionTargets.fats)}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          {sortedLogs.length === 0 ? (
            <EmptyState icon="bi-egg-fried" title="No meals logged" text="Add what you ate on this day." action={addButton} />
          ) : (
            sortedLogs.map((log) => (
              <MealCard
                key={log.id}
                log={log}
                onEdit={() => setModal({ mode: 'edit', item: log })}
                onDelete={() => handleDelete(log)}
              />
            ))
          )}
        </div>

        <div className="col-lg-4">
          <div className="ft-card p-3 p-md-4 mb-3 text-center">
            <div className="stat-number">
              <CountUp to={Math.abs(remaining)} />
              <small>kcal</small>
            </div>
            <div className="text-secondary small">{remaining >= 0 ? 'Remaining today' : 'Over your target'}</div>
          </div>

          <div className="ft-card p-3 p-md-4">
            <h2 className="panel-title">Macro split</h2>
            {gramsTotal > 0 ? (
              <MacroChart data={macroData} />
            ) : (
              <p className="text-secondary mb-0">Log a meal to see your macros.</p>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit meal' : 'Add meal'} onClose={() => setModal(null)}>
          <NutritionForm initial={modal.item} date={date} onSubmit={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </>
  )
}

export default Nutrition
