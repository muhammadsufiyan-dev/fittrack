const path =
  'M0 70 H250 C262 70 266 58 280 58 C294 58 298 70 312 70 H350 L362 80 L382 12 L402 104 L416 70 H450 C470 70 478 48 502 48 C526 48 534 70 554 70 H800 C810 70 814 62 824 62 C834 62 838 70 848 70 H872 L880 76 L894 34 L908 94 L916 70 H940 C954 70 960 56 976 56 C992 56 998 70 1012 70 H1200'

function Ecg() {
  return (
    <svg className="ecg" viewBox="0 0 1200 120" aria-hidden="true">
      <path className="ecg-base" pathLength="1" d={path} />
      <path className="ecg-glow" pathLength="1" d={path} />
      <path className="ecg-pulse" pathLength="1" d={path} />
    </svg>
  )
}

export default Ecg