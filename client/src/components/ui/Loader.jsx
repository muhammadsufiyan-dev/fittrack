function Loader() {
  return (
    <div role="status" aria-label="Loading">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-line"></div>

      <div className="row g-3 mt-2">
        {[1, 2, 3, 4].map((item) => (
          <div className="col-6 col-xl-3" key={item}>
            <div className="skeleton skeleton-card"></div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-8">
          <div className="skeleton skeleton-chart"></div>
        </div>
        <div className="col-lg-4">
          <div className="skeleton skeleton-chart"></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
