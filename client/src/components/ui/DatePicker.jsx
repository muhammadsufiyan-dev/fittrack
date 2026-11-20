import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatDate, todayISO } from '../../utils/format'

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const POPUP_WIDTH = 300
const POPUP_HEIGHT = 400

const pad = (number) => String(number).padStart(2, '0')
const toISO = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`
const isPhone = () => window.innerWidth < 576

const getView = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : new Date()
  return { year: date.getFullYear(), month: date.getMonth() }
}

function DatePicker({ id, value, onChange, placeholder = 'Select a date', clearable = false, invalid = false }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => getView(value))
  const [position, setPosition] = useState({ top: 0, left: 0, width: POPUP_WIDTH, centered: false })
  const button = useRef(null)
  const popup = useRef(null)

  useEffect(() => {
    if (!open) return

    const startWidth = window.innerWidth
    const close = () => setOpen(false)
    const onResize = () => {
      if (window.innerWidth !== startWidth) close()
    }
    const onScroll = (event) => {
      if (position.centered || popup.current.contains(event.target)) return
      close()
    }
    const onClick = (event) => {
      if (!button.current.contains(event.target) && !popup.current.contains(event.target)) close()
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close()
      }
    }

    document.addEventListener('pointerdown', onClick)
    document.addEventListener('keydown', onKey, true)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, true)

    return () => {
      document.removeEventListener('pointerdown', onClick)
      document.removeEventListener('keydown', onKey, true)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  const openPicker = () => {
    if (isPhone()) {
      const width = Math.min(340, window.innerWidth - 32)
      setPosition({
        top: Math.max(16, (window.innerHeight - POPUP_HEIGHT) / 2),
        left: (window.innerWidth - width) / 2,
        width,
        centered: true,
      })
    } else {
      const rect = button.current.getBoundingClientRect()
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - POPUP_WIDTH - 8)
      const spaceBelow = window.innerHeight - rect.bottom

      let top = rect.bottom + 8
      if (spaceBelow < POPUP_HEIGHT) {
        top = rect.top >= POPUP_HEIGHT ? rect.top - POPUP_HEIGHT - 8 : Math.max(8, window.innerHeight - POPUP_HEIGHT - 8)
      }

      setPosition({ top, left, width: POPUP_WIDTH, centered: false })
    }

    setView(getView(value))
    setOpen(true)
  }

  const changeMonth = (step) => {
    const date = new Date(view.year, view.month + step, 1)
    setView({ year: date.getFullYear(), month: date.getMonth() })
  }

  const choose = (nextValue) => {
    onChange(nextValue)
    setOpen(false)
  }

  const firstDay = new Date(view.year, view.month, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const totalDays = new Date(view.year, view.month + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: totalDays }, (item, index) => index + 1)]
  const monthTitle = firstDay.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const today = todayISO()

  return (
    <>
      <button
        type="button"
        id={id}
        ref={button}
        className={`datepick-btn ${invalid ? 'invalid' : ''} ${open ? 'open' : ''}`}
        onClick={open ? () => setOpen(false) : openPicker}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <i className="bi bi-calendar3"></i>
        <span className={value ? '' : 'datepick-placeholder'}>{value ? formatDate(value) : placeholder}</span>
        <i className="bi bi-chevron-down datepick-chevron"></i>
      </button>

      {open &&
        createPortal(
          <>
            {position.centered && <div className="cal-backdrop"></div>}

            <div
              className={`cal ${position.centered ? 'centered' : ''}`}
              ref={popup}
              role="dialog"
              aria-label="Choose a date"
              style={{ top: position.top, left: position.left, width: position.width }}
            >
              <div className="cal-head">
                <button type="button" className="cal-nav" onClick={() => changeMonth(-1)} aria-label="Previous month">
                  <i className="bi bi-chevron-left"></i>
                </button>
                <strong>{monthTitle}</strong>
                <button type="button" className="cal-nav" onClick={() => changeMonth(1)} aria-label="Next month">
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              <div className="cal-grid">
                {weekDays.map((day) => (
                  <span className="cal-dow" key={day}>
                    {day}
                  </span>
                ))}
              </div>

              <div className="cal-grid cal-days" key={`${view.year}-${view.month}`}>
                {cells.map((day, index) => {
                  if (!day) return <span key={`empty-${index}`}></span>

                  const iso = toISO(view.year, view.month, day)
                  const classes = ['cal-day']
                  if (iso === value) classes.push('selected')
                  if (iso === today) classes.push('today')

                  return (
                    <button type="button" key={iso} className={classes.join(' ')} onClick={() => choose(iso)}>
                      {day}
                    </button>
                  )
                })}
              </div>

              <div className="cal-foot">
                <button type="button" className="cal-link" onClick={() => choose(today)}>
                  Today
                </button>
                {clearable && value && (
                  <button type="button" className="cal-link cal-clear" onClick={() => choose('')}>
                    Clear
                  </button>
                )}
                {position.centered && (
                  <button type="button" className="cal-link cal-close" onClick={() => setOpen(false)}>
                    Close
                  </button>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}

export default DatePicker
