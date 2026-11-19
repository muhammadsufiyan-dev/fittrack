import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import Highlight from '../../components/ui/Highlight'
import PageHeader from '../../components/ui/PageHeader'
import { searchAll } from '../../services/searchService'
import { formatDate } from '../../utils/format'

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'workouts', label: 'Workouts' },
  { key: 'meals', label: 'Meals' },
  { key: 'goals', label: 'Goals' },
]

const mealTotal = (meal) => meal.items.reduce((total, item) => total + item.calories, 0)

function Result({ to, icon, title, meta, query }) {
  return (
    <Link to={to} className="result-row">
      <span className="ft-icon">
        <i className={`bi ${icon}`}></i>
      </span>
      <div className="result-text">
        <strong>
          <Highlight text={title} query={query} />
        </strong>
        <small>{meta}</small>
      </div>
      <i className="bi bi-chevron-right"></i>
    </Link>
  )
}

function SearchResults() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [term, setTerm] = useState(query)
  const [results, setResults] = useState(null)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    setTerm(query)
    searchAll(query).then(setResults)
  }, [query])

  const handleSubmit = (event) => {
    event.preventDefault()
    setParams(term.trim() ? { q: term.trim() } : {})
  }

  const counts = results
    ? { workouts: results.workouts.length, meals: results.meals.length, goals: results.goals.length }
    : { workouts: 0, meals: 0, goals: 0 }
  const total = counts.workouts + counts.meals + counts.goals
  const showing = (key) => tab === 'all' || tab === key

  return (
    <>
      <PageHeader title="Search" subtitle="Find workouts, meals and goals in one place." />

      <form className="search-box" onSubmit={handleSubmit} role="search">
        <i className="bi bi-search"></i>
        <input
          type="search"
          className="form-control"
          placeholder="Try bench press, chicken or weight"
          aria-label="Search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {!query ? (
        <EmptyState icon="bi-search" title="Start typing" text="Search by workout name, exercise, tag, food or goal." />
      ) : !results ? null : total === 0 ? (
        <EmptyState icon="bi-emoji-neutral" title="No results" text={`Nothing matched "${query}". Try a shorter word.`} />
      ) : (
        <>
          <div className="chip-row mb-4">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`chip-btn ${tab === item.key ? 'active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                {item.label}
                <span className="chip-count">{item.key === 'all' ? total : counts[item.key]}</span>
              </button>
            ))}
          </div>

          {showing('workouts') && counts.workouts > 0 && (
            <section className="result-group">
              <h2 className="result-heading">Workouts</h2>
              {results.workouts.map((item, index) => (
                <div key={item.id} style={{ '--i': index }}>
                  <Result
                    to={`/workouts/${item.id}`}
                    icon="bi-lightning-charge"
                    title={item.name}
                    meta={`${formatDate(item.date)} - ${item.category} - ${item.duration} min`}
                    query={query}
                  />
                </div>
              ))}
            </section>
          )}

          {showing('meals') && counts.meals > 0 && (
            <section className="result-group">
              <h2 className="result-heading">Meals</h2>
              {results.meals.map((item, index) => (
                <div key={item.id} style={{ '--i': index }}>
                  <Result
                    to="/nutrition"
                    icon="bi-egg-fried"
                    title={item.items.map((food) => food.name).join(', ')}
                    meta={`${formatDate(item.date)} - ${item.mealType} - ${mealTotal(item)} kcal`}
                    query={query}
                  />
                </div>
              ))}
            </section>
          )}

          {showing('goals') && counts.goals > 0 && (
            <section className="result-group">
              <h2 className="result-heading">Goals</h2>
              {results.goals.map((item, index) => (
                <div key={item.id} style={{ '--i': index }}>
                  <Result to="/goals" icon="bi-bullseye" title={item.title} meta={`${item.percent}% complete`} query={query} />
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </>
  )
}

export default SearchResults
