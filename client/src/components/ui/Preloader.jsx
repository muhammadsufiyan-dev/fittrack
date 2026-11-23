import { useEffect, useRef, useState } from 'react'

const MIN_TIME = 2000

function Preloader() {
  const [removed, setRemoved] = useState(false)
  const [done, setDone] = useState(false)
  const wordRef = useRef(null)
  const fillRef = useRef(null)
  const hiddenRef = useRef(null)

  useEffect(() => {
    const word = wordRef.current
    const fill = fillRef.current
    const hidden = hiddenRef.current
    const start = performance.now()
    let loaded = document.readyState === 'complete'
    let progress = 0
    let frame = 0
    let timer = 0

    const onLoad = () => {
      loaded = true
    }

    const fitWord = () => {
      const current = parseFloat(getComputedStyle(word).fontSize) || 100
      const target = Math.min(window.innerWidth * 0.6, 560)
      const size = Math.min((current * target) / word.offsetWidth, window.innerHeight * 0.2)
      word.style.fontSize = `${size}px`
    }

    const finish = () => {
      fill.style.clipPath = 'inset(0 0 0 0)'
      timer = setTimeout(() => {
        setDone(true)
        timer = setTimeout(() => {
          document.documentElement.style.overflow = ''
          setRemoved(true)
        }, 950)
      }, 450)
    }

    const tick = (now) => {
      const t = Math.min((now - start) / MIN_TIME, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const goal = loaded ? eased * 100 : Math.min(eased * 100, 90)
      progress += (goal - progress) * 0.12

      const total = word.offsetWidth
      const fitWidth = hidden.offsetWidth
      const filled = fitWidth + ((total - fitWidth) * progress) / 100
      fill.style.clipPath = `inset(0 ${100 - (filled / total) * 100}% 0 0)`

      if (loaded && t >= 1 && progress > 99.5) return finish()
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('load', onLoad)
    window.addEventListener('resize', fitWord)
    document.documentElement.style.overflow = 'hidden'
    fitWord()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWord)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', fitWord)
      document.documentElement.style.overflow = ''
    }
  }, [])

  if (removed) return null

  return (
    <div className={`ft-loader ${done ? 'done' : ''}`} role="status" aria-label="Loading FitTrack">
      <div className="loader-box">
        <span className="loader-word" ref={wordRef}>
          <span className="loader-outline">
            <span className="loader-white">Fit</span>Track.
          </span>
          <span className="loader-fill" ref={fillRef} aria-hidden="true">
            <span className="loader-hidden" ref={hiddenRef}>
              Fit
            </span>
            <span className="loader-gradient">Track.</span>
          </span>
        </span>
        <svg className="loader-ecg" viewBox="0 0 600 34" preserveAspectRatio="none">
          <path d="M0 18H210L224 18L238 4L254 30L268 10L278 18H600" />
        </svg>
      </div>
    </div>
  )
}

export default Preloader
