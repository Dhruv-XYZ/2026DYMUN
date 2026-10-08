import { useState } from 'react'
import './App.css'

const navigation = [
  { label: 'About', href: '#about' },
  { label: 'The experience', href: '#experience' },
  { label: 'Who it is for', href: '#delegates' },
]

const principles = [
  {
    number: '01',
    title: 'Think beyond headlines',
    text: 'Build a grounded view of the issue, the people it affects, and the choices on the table.',
  },
  {
    number: '02',
    title: 'Speak with purpose',
    text: 'Make your case clearly, listen closely, and bring other perspectives into the room.',
  },
  {
    number: '03',
    title: 'Make progress together',
    text: 'Turn disagreement into negotiation and negotiate toward practical shared action.',
  },
]

const steps = [
  { number: '01', title: 'Research', text: 'Understand your country, committee, and the issue at hand.' },
  { number: '02', title: 'Debate', text: 'Present ideas, challenge assumptions, and find common ground.' },
  { number: '03', title: 'Resolve', text: 'Work with fellow delegates to shape a considered way forward.' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="DYMUN home">
          <span className="brand__mark" aria-hidden="true">D</span>
          <span className="brand__text">
            <strong>DYMUN</strong>
            <small>D. Y. Patil International School</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="site-nav__contact" href="#contact" onClick={closeMenu}>
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero__image"
            src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=2200&q=85"
            alt="Assembly hall prepared for an international conference"
            fetchPriority="high"
          />
          <div className="hero__shade" />
          <div className="hero__content">
            <p className="eyebrow eyebrow--light">D. Y. Patil International School <span>Navi Mumbai</span></p>
            <h1 id="hero-title">The world changes<br />when you <em>take the floor.</em></h1>
            <p className="hero__summary">
              A student-led Model United Nations experience built around sharp research,
              thoughtful debate, and diplomacy that moves ideas forward.
            </p>
            <div className="hero__actions">
              <a className="button button--lime" href="#contact">Find your place <span aria-hidden="true">↗</span></a>
              <a className="hero__text-link" href="#about">Discover DYMUN <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="hero__index" aria-hidden="true"><span>01</span> / 03</div>
          <div className="hero__caption"><span>Debate with direction.</span><span>Diplomacy in action.</span></div>
        </section>

        <section className="intro section-wrap" id="about" aria-labelledby="intro-title">
          <div className="section-label"><span className="section-label__dot" /> The DYMUN approach</div>
          <div className="intro__body">
            <h2 id="intro-title">A room full of perspectives.<br /><em>One shared challenge.</em></h2>
            <div className="intro__copy">
              <p>
                Model United Nations invites students to step into the work of diplomacy.
                As delegates, they represent a country, examine a global issue, and work
                with others toward a resolution.
              </p>
              <a className="inline-link" href="#experience">See how it works <span aria-hidden="true">↘</span></a>
            </div>
          </div>
        </section>

        <section className="principles" aria-labelledby="principles-title">
          <div className="section-wrap">
            <div className="principles__heading">
              <div>
                <div className="section-label"><span className="section-label__dot" /> Why take part</div>
                <h2 id="principles-title">More than a speech.<br /><em>A practice in progress.</em></h2>
              </div>
              <p>Learn to make a case, hear another one, and find the opening where collaboration can begin.</p>
            </div>
            <div className="principle-list">
              {principles.map((item) => (
                <article className="principle" key={item.number}>
                  <span className="principle__number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="principle__arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience section-wrap" id="experience" aria-labelledby="experience-title">
          <div className="experience__intro">
            <div className="section-label"><span className="section-label__dot" /> From brief to resolution</div>
            <h2 id="experience-title">A clear path<br />into the conversation.</h2>
            <p>Every strong resolution starts with curiosity. Bring that, and we’ll take it from there.</p>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <article className="step" key={step.number}>
                <span className="step__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="delegate-band" id="delegates" aria-labelledby="delegate-title">
          <div className="delegate-band__inner">
            <p className="eyebrow">Your voice belongs in the room</p>
            <h2 id="delegate-title">Bring your questions.<br /><em>Leave with perspective.</em></h2>
            <p>For students ready to listen carefully, think critically, and help shape the conversation.</p>
            <a className="button button--dark" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a>
          </div>
          <span className="delegate-band__stamp" aria-hidden="true">D<br />/M</span>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="site-footer__main">
          <div className="footer-brand">
            <a className="brand brand--footer" href="#home">
              <span className="brand__mark" aria-hidden="true">D</span>
              <span className="brand__text"><strong>DYMUN</strong><small>Ideas into action.</small></span>
            </a>
            <p>A Model United Nations experience by D. Y. Patil International School, Navi Mumbai.</p>
          </div>
          <div className="footer-contact">
            <span className="footer-heading">Get in touch</span>
            <a href="mailto:dymun@dypisnerul.in">dymun@dypisnerul.in</a>
            <span>D. Y. Patil International School</span>
          </div>
          <div className="footer-links">
            <span className="footer-heading">Explore</span>
            <a href="#about">About DYMUN</a>
            <a href="#experience">The experience</a>
            <a href="#delegates">For delegates</a>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 DYMUN</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </>
  )
}

export default App
