const path = 'M0 70 H300 L320 70 L335 40 L355 100 L370 15 L392 100 L405 70 H700 L715 70 L728 50 L742 85 L755 70 H1200'

function Ecg() {
  return (
    <svg className="ecg" viewBox="0 0 1200 120" aria-hidden="true">
      <path className="ecg-base" pathLength="1" d={path} />
      <path className="ecg-pulse" pathLength="1" d={path} />
    </svg>
  )
}

export default Ecg