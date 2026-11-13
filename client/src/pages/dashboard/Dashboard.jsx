import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MacroChart from '../../components/MacroChart'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import WeeklyChart from '../../components/WeeklyChart'
import useAuth from '../../hooks/useAuth'
import { getDashboard } from '../../services/dashboardService'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    getDashboard().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  const { stats } = data
  const workoutProgress = Math.round((stats.workoutsThisWeek / stats.workoutsGoal) * 100)
  const calorieProgress = Math.round((stats.caloriesEaten / stats.caloriesTarget) * 100)

  return (
    <>
      <PageHeader
        title={`${getGreeting()}, ${user.name.split(' ')[0]}`}
        subtitle="Here is your fitness summary for today."
        action={
          <Link to="/workouts" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>Log workout
          </Link>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-fire" label="Calories burned" value={stats.caloriesBurned.toLocaleString()} unit="kcal" change={stats.caloriesBurnedChange} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-lightning-charge" label={`Workouts this week (goal ${stats.workoutsGoal})`} value={stats.workoutsThisWeek} progress={workoutProgress} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-egg-fried" label={`Calories eaten (target ${stats.caloriesTarget.toLocaleString()})`} value={stats.caloriesEaten.toLocaleString()} unit="kcal" progress={calorieProgress} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="bi-speedometer2" label="Current weight" value={stats.weight} unit="kg" change={stats.weightChange} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="ft-card h-100 p-3 p-md-4">
            <h2 className="panel-title">Calories burned this week</h2>
            <WeeklyChart data={data.weekly} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="ft-card h-100 p-3 p-md-4">
            <h2 className="panel-title">Macros today</h2>
            <MacroChart data={data.macros} />
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="ft-card h-100 p-3 p-md-4">
            <h2 className="panel-title">Goals</h2>
            {data.goals.map((goal) => (
              <div key={goal.id} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>{goal.title}</span>
                  <span className="text-secondary">{goal.progress}%</span>
                </div>
                <div className="progress ft-progress">
                  <div className="progress-bar" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="ft-card h-100 p-3 p-md-4">
            <h2 className="panel-title">Reminders</h2>
            {data.reminders.map((item) => (
              <div key={item.id} className="list-row">
                <span className="ft-icon">
                  <i className="bi bi-bell"></i>
                </span>
                <div className="flex-grow-1">{item.title}</div>
                <small className="text-secondary">{item.time}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="ft-card h-100 p-3 p-md-4">
            <h2 className="panel-title">Recent workouts</h2>
            {data.recent.map((item) => (
              <div key={item.id} className="list-row">
                <span className="ft-icon">
                  <i className="bi bi-lightning-charge"></i>
                </span>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.name}</div>
                  <small className="text-secondary">
                    {item.date} - {item.duration} min
                  </small>
                </div>
                <small className="fw-semibold">{item.calories} kcal</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard