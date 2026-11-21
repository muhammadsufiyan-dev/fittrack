import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ActivityRings from '../../components/charts/ActivityRings'
import MacroChart from '../../components/charts/MacroChart'
import WeeklyChart from '../../components/charts/WeeklyChart'
import Loader from '../../components/ui/Loader'
import Reveal from '../../components/ui/Reveal'
import StatCard from '../../components/ui/StatCard'
import useAuth from '../../hooks/useAuth'
import { getDashboard } from '../../services/dashboardService'
import { weightUnit } from '../../utils/units'

const quickActions = [
  { to: '/workouts', icon: 'bi-lightning-charge', title: 'Log workout', text: 'Record a session' },
  { to: '/nutrition', icon: 'bi-egg-fried', title: 'Log meal', text: 'Track what you eat' },
  { to: '/progress', icon: 'bi-speedometer2', title: 'Add weight', text: 'Update your progress' },
  { to: '/goals', icon: 'bi-bullseye', title: 'Set a goal', text: 'Aim for something new' },
]

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const getToday = () => {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    getDashboard().then(setData)
  }, [])

  if (!data) return <Loader />

  const { stats } = data
  const workoutProgress = Math.round((stats.workoutsThisWeek / stats.workoutsGoal) * 100)
  const calorieProgress = Math.round((stats.caloriesEaten / stats.caloriesTarget) * 100)
  const remaining = Math.max(stats.workoutsGoal - stats.workoutsThisWeek, 0)

  return (
    <>
      <section className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-date">
            <i className="bi bi-calendar3"></i>
            {getToday()}
          </span>
          <h1 className="dash-hero-title">
            {getGreeting()}, <span>{user.name.split(' ')[0]}</span>
          </h1>
          <p>
            {remaining === 0
              ? 'You reached your weekly workout goal. Great work!'
              : `${stats.workoutsThisWeek} of ${stats.workoutsGoal} workouts done this week. ${remaining} more to reach your goal.`}
          </p>
          <div className="dash-hero-actions">
            <Link to="/workouts" className="btn btn-light">
              <i className="bi bi-plus-lg me-1"></i>Log workout
            </Link>
            <Link to="/nutrition" className="btn btn-outline-light">
              Log meal
            </Link>
          </div>
        </div>

        <div className="dash-hero-rings">
          <ActivityRings />
        </div>
      </section>

      <div className="row g-3 mb-4">
        {quickActions.map((item, index) => (
          <div className="col-6 col-lg-3" key={item.to}>
            <Reveal delay={index * 70} className="h-100">
              <Link to={item.to} className="quick-link ft-hover">
                <span className="ft-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </Link>
            </Reveal>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <Reveal className="h-100">
            <StatCard
              icon="bi-fire"
              label="Calories burned"
              value={stats.caloriesBurned}
              unit="kcal"
              change={stats.caloriesBurnedChange}
            />
          </Reveal>
        </div>
        <div className="col-6 col-xl-3">
          <Reveal delay={80} className="h-100">
            <StatCard
              icon="bi-lightning-charge"
              label={`Workouts this week (goal ${stats.workoutsGoal})`}
              value={stats.workoutsThisWeek}
              progress={workoutProgress}
            />
          </Reveal>
        </div>
        <div className="col-6 col-xl-3">
          <Reveal delay={160} className="h-100">
            <StatCard
              icon="bi-egg-fried"
              label={`Calories eaten (target ${stats.caloriesTarget.toLocaleString()})`}
              value={stats.caloriesEaten}
              unit="kcal"
              progress={calorieProgress}
            />
          </Reveal>
        </div>
        <div className="col-6 col-xl-3">
          <Reveal delay={240} className="h-100">
            <StatCard
              icon="bi-speedometer2"
              label="Current weight"
              value={stats.weight}
              unit={weightUnit()}
              change={stats.weightChange}
            />
          </Reveal>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <Reveal className="h-100">
            <div className="ft-card ft-hover h-100 p-3 p-md-4">
              <h2 className="panel-title">Calories burned this week</h2>
              <WeeklyChart data={data.weekly} />
            </div>
          </Reveal>
        </div>
        <div className="col-lg-4">
          <Reveal delay={120} className="h-100">
            <div className="ft-card ft-hover h-100 p-3 p-md-4">
              <h2 className="panel-title">Macros today</h2>
              <MacroChart data={data.macros} />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <Reveal className="h-100">
            <div className="ft-card ft-hover h-100 p-3 p-md-4">
              <div className="panel-head">
                <h2 className="panel-title">Goals</h2>
                <Link to="/goals" className="panel-link">
                  View all
                </Link>
              </div>
              {data.goals.map((goal) => (
                <div key={goal.id} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{goal.title}</span>
                    <strong>{goal.progress}%</strong>
                  </div>
                  <div className="progress ft-progress">
                    <div className="progress-bar" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="col-lg-4">
          <Reveal delay={100} className="h-100">
            <div className="ft-card ft-hover h-100 p-3 p-md-4">
              <div className="panel-head">
                <h2 className="panel-title">Reminders</h2>
                <Link to="/reminders" className="panel-link">
                  View all
                </Link>
              </div>
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
          </Reveal>
        </div>

        <div className="col-lg-4">
          <Reveal delay={200} className="h-100">
            <div className="ft-card ft-hover h-100 p-3 p-md-4">
              <div className="panel-head">
                <h2 className="panel-title">Recent workouts</h2>
                <Link to="/workouts" className="panel-link">
                  View all
                </Link>
              </div>
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
          </Reveal>
        </div>
      </div>
    </>
  )
}

export default Dashboard

