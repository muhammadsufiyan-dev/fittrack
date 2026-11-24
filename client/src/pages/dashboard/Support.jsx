import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FormGroup from '../../components/ui/FormGroup'
import PageHeader from '../../components/ui/PageHeader'
import useConfirm from '../../hooks/useConfirm'
import useAuth from '../../hooks/useAuth'
import { addRequest, deleteRequest, getRequests, sendToFormspree, supportTypes } from '../../services/supportService'
import { formatDate } from '../../utils/format'

const emptyForm = { type: 'question', subject: '', message: '' }

const contacts = [
  { icon: 'bi-envelope', title: 'Email us', text: 'support@fittrack.com' },
  { icon: 'bi-clock', title: 'Reply time', text: 'Within 1 working day' },
  { icon: 'bi-calendar-week', title: 'Support hours', text: 'Mon to Sat, 9 am to 6 pm' },
]

function Support() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [requests, setRequests] = useState([])
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const { user } = useAuth()
  const confirm = useConfirm()

  useEffect(() => {
    getRequests().then(setRequests)
  }, [])

  const handleChange = (event) => {
    setSent(false)
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const found = {}
    if (form.subject.trim().length < 3) found.subject = 'Write a short subject'
    if (form.message.trim().length < 10) found.message = 'Tell us a little more (at least 10 letters)'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)

    try {
      const data = { type: form.type, subject: form.subject.trim(), message: form.message.trim() }
      await addRequest(data)
      await sendToFormspree({ ...data, name: user.name, email: user.email })
      setForm(emptyForm)
      setSent(true)
      setRequests(await getRequests())
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (item) => {
    if (await confirm({ title: 'Delete this message?', message: `"${item.subject}" will be removed.` })) {
      await deleteRequest(item.id)
      setRequests(await getRequests())
    }
  }

  return (
    <>
      <PageHeader title="Support" subtitle="We are here to help. Send us a message." />

      <div className="contact-grid">
        {contacts.map((item) => (
          <div className="ft-card contact-card" key={item.title}>
            <span className="ft-icon">
              <i className={`bi ${item.icon}`}></i>
            </span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <form className="ft-card p-3 p-md-4" onSubmit={handleSubmit} noValidate>
            <h2 className="panel-title">Send us a message</h2>

            {sent && (
              <div className="alert alert-success py-2 d-flex align-items-center gap-2">
                <i className="bi bi-check-circle"></i>
                Thanks! We received your message and will reply by email.
              </div>
            )}

            <div className="support-types mb-3">
              {supportTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`support-type ${form.type === item.value ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, type: item.value })}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {item.label}
                </button>
              ))}
            </div>

            <FormGroup label="Subject" htmlFor="subject" error={errors.subject} className="mb-3">
              <input
                id="subject"
                name="subject"
                className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                value={form.subject}
                onChange={handleChange}
                placeholder="What is this about?"
              />
            </FormGroup>

            <FormGroup label="Message" htmlFor="message" error={errors.message} className="mb-3">
              <textarea
                id="message"
                name="message"
                rows="5"
                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here"
              ></textarea>
            </FormGroup>

            <button type="submit" className="btn btn-primary" disabled={sending}>
              <i className="bi bi-send me-1"></i>{sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="ft-card p-3 p-md-4 mb-3">
            <h2 className="panel-title">Your messages</h2>
            {requests.length === 0 ? (
              <p className="text-secondary mb-0">Nothing sent yet. Your messages will show here.</p>
            ) : (
              requests.map((item) => {
                const type = supportTypes.find((entry) => entry.value === item.type) || supportTypes[0]
                return (
                  <div className="ticket" key={item.id}>
                    <span className="ft-icon">
                      <i className={`bi ${type.icon}`}></i>
                    </span>
                    <div>
                      <strong>{item.subject}</strong>
                      <small>{formatDate(item.createdAt.slice(0, 10))}</small>
                    </div>
                    <span className="status-pill">{item.status}</span>
                    <button type="button" className="icon-btn" onClick={() => handleDelete(item)} aria-label="Delete message">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div className="ft-card p-3 p-md-4">
            <h2 className="panel-title">Looking for a quick answer?</h2>
            <p className="text-secondary">Most questions are answered in our guides and FAQ.</p>
            <Link to="/help" className="btn btn-outline-secondary">
              <i className="bi bi-question-circle me-1"></i>Open Help and FAQ
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Support
