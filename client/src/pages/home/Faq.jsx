import Reveal from '../../components/Reveal'

const questions = [
  {
    q: 'Is FitTrack free to use?',
    a: 'Yes. You can create an account and use every feature at no cost.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. The whole site is responsive and works on phones, tablets and desktops.',
  },
  {
    q: 'Can I download my data?',
    a: 'You can export your progress and nutrition reports as PDF or CSV, and download all your data from Settings.',
  },
  {
    q: 'Is my data private?',
    a: 'Your data is only visible to you unless you choose to share it. You can also delete your account at any time.',
  },
]

function Faq() {
  return (
    <section id="faq" className="container py-5">
      <div className="py-3">
        <div className="text-center mb-5">
          <span className="ft-badge mb-3">FAQ</span>
          <h2 className="section-title">Questions? Answered</h2>
        </div>
        <Reveal>
          <div className="accordion ft-accordion mx-auto" id="faqList">
            {questions.map((item, index) => (
              <div className="accordion-item" key={item.q}>
                <h3 className="accordion-header">
                  <button
                    className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-${index}`}
                  >
                    {item.q}
                  </button>
                </h3>
                <div id={`faq-${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#faqList">
                  <div className="accordion-body text-secondary">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Faq