import Reveal from '../../components/Reveal'

const steps = [
  { number: '01', title: 'Create your account', text: 'Sign up in a minute with your basic details.' },
  { number: '02', title: 'Log your activity', text: 'Add workouts, meals and measurements as you go.' },
  { number: '03', title: 'See your progress', text: 'Use the dashboard and charts to stay on track.' },
]

function Steps() {
  return (
    <section id="how" className="container py-5">
      <div className="py-3">
        <div className="text-center mb-5">
          <span className="ft-badge mb-3">How it works</span>
          <h2 className="section-title">Three steps to get moving</h2>
        </div>
        <div className="row g-4">
          {steps.map((item, index) => (
            <div className="col-md-4" key={item.number}>
              <Reveal delay={index * 120}>
                <div className="step-number">{item.number}</div>
                <h5 className="mt-2">{item.title}</h5>
                <p className="text-secondary mb-0">{item.text}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Steps