import { useEffect, useState } from 'react'

function CountUp({ to, duration = 1600 }) {
  const [value, setValue] = useState(0)
  const decimals = Number.isInteger(to) ? 0 : 1

  useEffect(() => {
    let frame
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Number((to * eased).toFixed(decimals)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, duration, decimals])

  return <>{value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>
}

export default CountUp
