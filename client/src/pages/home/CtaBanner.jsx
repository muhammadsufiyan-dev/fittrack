import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import Ecg from '../../components/Ecg'

function CtaBanner() {
  return (
    <section className="container pb-5">
      <Reveal>
        <div className="cta-banner" data-bs-theme="dark">
          <h2 className="fit-title cta-title">
            Ready to <span className="gradient-text">move?</span>
          </h2>
          <p className="text-secondary my-4">Create your free account and log your first workout today.</p>
          <Link to="/register" className="btn btn-primary btn-lg btn-glow">Create free account</Link>
          <Ecg />
        </div>
      </Reveal>
    </section>
  )
}

export default CtaBanner