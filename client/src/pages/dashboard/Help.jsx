import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'

const categories = [
  { key: 'all', label: 'All' },
  { key: 'start', label: 'Getting started' },
  { key: 'track', label: 'Tracking' },
  { key: 'account', label: 'Account and privacy' },
]

const guides = [
  { icon: 'bi-lightning-charge', title: 'Log a workout', text: 'Workouts, Add workout, then add exercises with sets, reps and weight.', to: '/workouts' },
  { icon: 'bi-egg-fried', title: 'Log a meal', text: 'Nutrition, Add meal, then pick the meal type and add foods.', to: '/nutrition' },
  { icon: 'bi-graph-up-arrow', title: 'Track progress', text: 'Progress, Add entry, then see your charts update.', to: '/progress' },
  { icon: 'bi-bullseye', title: 'Set a goal', text: 'Goals, Add goal, then choose a target and a deadline.', to: '/goals' },
  { icon: 'bi-alarm', title: 'Add a reminder', text: 'Reminders, Add reminder, then pick the time and days.', to: '/reminders' },
  { icon: 'bi-file-earmark-text', title: 'Get a report', text: 'Reports, choose a period, then download CSV or print PDF.', to: '/reports' },
]

const questions = [
  { cat: 'start', q: 'How do I create an account?', a: 'Press Sign up, enter your name, email and password, add a photo if you like, accept the privacy policy and press Create account.' },
  { cat: 'start', q: 'Can I use it on my phone?', a: 'Yes. FitTrack works on phones, tablets and computers. Use the menu button at the top left to open the sidebar.' },
  { cat: 'start', q: 'Can I use dark mode?', a: 'Yes. Open the profile menu and use the Dark mode switch, or choose a theme in Settings.' },
  { cat: 'track', q: 'How do I edit or delete a workout, meal or goal?', a: 'Every card has an edit (pencil) and a delete (bin) button. Deleting asks you to confirm first.' },
  { cat: 'track', q: 'What are tags and categories on workouts?', a: 'A category is the type of workout, such as strength or cardio. Tags are your own words, such as legs or morning, to find workouts faster.' },
  { cat: 'track', q: 'Where can I see charts of my progress?', a: 'Progress shows weight and body measurements over time. Analytics shows workout frequency, minutes, calories and macros.' },
  { cat: 'track', q: 'Can I use pounds and inches?', a: 'Yes. Open Settings, then Units, and choose what you prefer. Your saved data does not change.' },
  { cat: 'track', q: 'How do notifications and reminders work?', a: 'Notifications tell you about missed workouts, goals, followers and replies. Turn each kind on or off in Settings. Reminders are alerts you set yourself.' },
  { cat: 'track', q: 'How do I search for something?', a: 'Use the search box at the top or open Search. You can find workouts, meals, goals and other members.' },
  { cat: 'track', q: 'How do I download my data?', a: 'Reports lets you download CSV or print a PDF. Settings, then Your data, lets you download everything in one file.' },
  { cat: 'account', q: 'How do I change my photo or details?', a: 'Open Profile and press Edit profile. You can change your photo, name, phone, city and bio.' },
  { cat: 'account', q: 'Can other people see my data?', a: 'No. Your workouts, meals and progress are private. Others can only find your name, city and bio, and you can switch that off in Settings.' },
  { cat: 'account', q: 'How do I follow other members?', a: 'Open Community or a member profile and press Follow.' },
  { cat: 'account', q: 'It is not working. What now?', a: 'Refresh the page first. If the problem stays, send us a message from the Support page.' },
]

function Help() {
  const [term, setTerm] = useState('')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState(null)

  const query = term.trim().toLowerCase()
  const list = questions.filter(
    (item) => (cat === 'all' || item.cat === cat) && (!query || `${item.q} ${item.a}`.toLowerCase().includes(query))
  )

  return (
    <>
      <PageHeader title="Help and FAQ" subtitle="Quick guides and answers in simple words." />

      <div className="help-search">
        <i className="bi bi-search"></i>
        <input
          type="search"
          className="form-control form-control-lg"
          placeholder="Search for help, for example reminders or dark mode"
          aria-label="Search help"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>

      {!query && (
        <>
          <h2 className="help-heading">Quick guides</h2>
          <div className="row g-3 mb-4">
            {guides.map((item) => (
              <div className="col-sm-6 col-lg-4" key={item.title}>
                <Link to={item.to} className="ft-card guide-card">
                  <span className="ft-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="help-heading">Frequently asked questions</h2>
      <div className="chip-row mb-3">
        {categories.map((item) => (
          <button key={item.key} type="button" className={`chip-btn ${cat === item.key ? 'active' : ''}`} onClick={() => setCat(item.key)}>
            {item.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="bi-emoji-neutral"
          title="No answers found"
          text="Try another word, or ask us directly."
          action={
            <Link to="/support" className="btn btn-primary">
              Contact support
            </Link>
          }
        />
      ) : (
        <div className="faq-box">
          {list.map((item) => {
            const isOpen = open === item.q
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
                <button type="button" className="faq-q" onClick={() => setOpen(isOpen ? null : item.q)} aria-expanded={isOpen}>
                  {item.q}
                  <i className="bi bi-chevron-down"></i>
                </button>
                {isOpen && <p className="faq-a">{item.a}</p>}
              </div>
            )
          })}
        </div>
      )}

      <div className="ft-card p-3 p-md-4 mt-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <strong>Still need help?</strong>
          <div className="text-secondary">Our team replies within one working day.</div>
        </div>
        <Link to="/support" className="btn btn-primary">
          <i className="bi bi-headset me-1"></i>Contact support
        </Link>
      </div>
    </>
  )
}

export default Help
