import { useEffect, useState } from 'react'
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Details', to: '/details' },
  { label: 'Committees', to: '/committees' },
  { label: 'OC & EB', to: '/team' },
  { label: 'Registration', to: '/registration' },
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

const stats = [
  { value: '400+', label: 'delegates' },
  { value: '14', label: 'committees' },
  { value: '3', label: 'days of debate' },
  { value: '1', label: 'shared resolution' },
]

const agenda = [
  {
    day: 'Day 01',
    title: 'Opening session',
    detail: 'Registration, orientation, and the opening address set the tone for a serious and collaborative conference.',
  },
  {
    day: 'Day 02',
    title: 'Research and debate',
    detail: 'Delegates move through moderated discussion, alliances, and drafting as the room tackles complex issues head-on.',
  },
  {
    day: 'Day 03',
    title: 'Resolution and close',
    detail: 'Final negotiations, voting, and closing reflections highlight the outcome of diplomatic engagement.',
  },
]

const committees = [
  { name: 'UNGA', focus: 'Global governance and international cooperation', size: '80 delegates' },
  { name: 'UNSC', focus: 'Security and crisis response', size: '40 delegates' },
  { name: 'WHO', focus: 'Health policy and public welfare', size: '35 delegates' },
  { name: 'UNESCO', focus: 'Culture, education, and knowledge', size: '30 delegates' },
]

const values = [
  { title: 'Critical thinking', text: 'Delegates are expected to think beyond slogans and craft positions grounded in evidence.' },
  { title: 'Ethical leadership', text: 'DYMUN encourages students to lead with integrity, respect, and precision in dialogue.' },
  { title: 'Global responsibility', text: 'The event frames diplomacy as an active form of citizenship with real-world stakes.' },
]

const details = [
  { title: 'Date', text: 'October 2026, with three days of committee sessions and closing proceedings.' },
  { title: 'Venue', text: 'D. Y. Patil International School, Navi Mumbai.' },
  { title: 'Format', text: 'Research-led committee work with speeches, amendments, draft resolutions, and crisis updates.' },
  { title: 'Dress code', text: 'Business formal with delegates expected to present themselves professionally.' },
]

const ocTeam = [
  { role: 'Secretary General', note: 'Conference vision, overall strategy, and leadership.' },
  { role: 'Director General', note: 'Operational oversight, delegate experience, and cross-committee coordination.' },
  { role: 'Deputy Secretary General', note: 'Committee support, logistics, and delegate communications.' },
  { role: 'Under Secretary General', note: 'Session planning, logistics, and execution.' },
]

const ebTeam = [
  { role: 'President', note: 'Committee flow, moderation, and procedural guidance.' },
  { role: 'Vice President', note: 'Motivating debate, managing speakers lists, and timekeeping.' },
  { role: 'Research & Drafting Lead', note: 'Resolution quality, research support, and drafting review.' },
  { role: 'Press & Outreach Lead', note: 'Media, communications, and delegates-facing updates.' },
]

const registrationSteps = [
  'Prepare delegate and school details.',
  'Think about your committee preferences.',
  'Check back here for the official registration form.',
]

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function PageShell({ menuOpen, setMenuOpen, closeMenu, children }) {
  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/" onClick={closeMenu} aria-label="DYMUN home">
          <img className="brand__logo" src="/logo.jpeg" alt="D. Y. Patil International School, Navi Mumbai" />
          <span className="brand__text">
            <strong>DYMUN</strong>
            <small>Model United Nations / 2026</small>
          </span>
        </NavLink>

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
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink className="site-nav__contact" to="/registration" onClick={closeMenu}>
            Register <span aria-hidden="true">↗</span>
          </NavLink>
        </nav>
      </header>

      {children}

      <footer className="site-footer" id="contact">
        <div className="site-footer__main">
          <div className="footer-brand">
            <NavLink className="brand brand--footer" to="/">
              <img className="brand__logo" src="/logo.jpeg" alt="D. Y. Patil International School, Navi Mumbai" />
              <span className="brand__text"><strong>DYMUN</strong><small>Ideas into action.</small></span>
            </NavLink>
            <p>A Model United Nations experience by D. Y. Patil International School, Navi Mumbai.</p>
          </div>
          <div className="footer-contact">
            <span className="footer-heading">Get in touch</span>
            <a href="mailto:dymun@dypisnerul.in">dymun@dypisnerul.in</a>
            <NavLink to="/registration">Registration</NavLink>
            <span>D. Y. Patil International School</span>
          </div>
          <div className="footer-links">
            <span className="footer-heading">Explore</span>
            <NavLink to="/about">About DYMUN</NavLink>
            <NavLink to="/details">Conference details</NavLink>
            <NavLink to="/committees">Committees</NavLink>
            <NavLink to="/team">OC & EB</NavLink>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 DYMUN</span>
          <NavLink to="/">Back to top ↑</NavLink>
        </div>
      </footer>
    </>
  )
}

function HomePage() {
  return (
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
            <NavLink className="button button--lime" to="/registration">Find your place <span aria-hidden="true">↗</span></NavLink>
            <NavLink className="hero__text-link" to="/about">Discover DYMUN <span aria-hidden="true">↓</span></NavLink>
          </div>
        </div>
        <div className="hero__index" aria-hidden="true"><span>01</span> / 03</div>
        <div className="hero__caption"><span>Debate with direction.</span><span>Diplomacy in action.</span></div>
      </section>

      <section className="intro-band" aria-labelledby="intro-title">
        <div className="intro section-wrap" id="about">
          <div className="section-label"><span className="section-label__dot" /> The DYMUN approach</div>
          <div className="intro__body">
            <h2 id="intro-title">A room full of perspectives.<br /><em>One shared challenge.</em></h2>
            <div className="intro__copy">
              <p>
                Model United Nations invites students to step into the work of diplomacy.
                As delegates, they represent a country, examine a global issue, and work
                with others toward a resolution.
              </p>
              <NavLink className="inline-link" to="/details">See how it works <span aria-hidden="true">↘</span></NavLink>
            </div>
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

      <section className="experience-band">
        <div className="experience section-wrap" id="experience" aria-labelledby="experience-title">
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
        </div>
      </section>

      <section className="stats-band">
        <div className="stats section-wrap" id="agenda" aria-labelledby="agenda-title">
          <div className="section-label"><span className="section-label__dot" /> Agenda and highlights</div>
          <div className="stats__header">
            <h2 id="agenda-title">A sharper view of the conference.<br /><em>Built for action.</em></h2>
            <p>From opening remarks to final resolutions, DYMUN is designed to turn preparation into purposeful participation.</p>
          </div>

          <div className="stats-grid" aria-label="Conference statistics">
            {stats.map((item) => (
              <div className="stat-card" key={item.label}>
                <span className="stat-card__value">{item.value}</span>
                <span className="stat-card__label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="agenda-grid" aria-label="Conference agenda overview">
            {agenda.map((entry) => (
              <article className="agenda-card" key={entry.day}>
                <span className="agenda-card__day">{entry.day}</span>
                <h3>{entry.title}</h3>
                <p>{entry.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="delegate-band" id="delegates" aria-labelledby="delegate-title">
        <div className="delegate-band__inner">
          <p className="eyebrow">Your voice belongs in the room</p>
          <h2 id="delegate-title">Bring your questions.<br /><em>Leave with perspective.</em></h2>
          <p>For students ready to listen carefully, think critically, and help shape the conversation.</p>
          <NavLink className="button button--dark" to="/registration">Start a conversation <span aria-hidden="true">↗</span></NavLink>
        </div>
        <span className="delegate-band__stamp" aria-hidden="true">D<br />/M</span>
      </section>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--compact">
        <div className="page-hero__inner section-wrap">
          <div className="section-label"><span className="section-label__dot" /> About DYMUN</div>
          <h1>Conference culture shaped by research, dialogue, and action.</h1>
        </div>
      </section>

      <section className="content-section section-wrap">
        <div className="content-copy">
          <p>
            DYMUN is a student-led Model United Nations conference designed to challenge delegates to think beyond headlines,
            appreciate multiple perspectives, and practice the habits of global citizenship.
          </p>
          <p>
            Every debate is grounded in preparation. Delegates are encouraged to study the positions of their assigned states,
            listen carefully in committee, and negotiate with respect toward a practical, workable outcome.
          </p>
        </div>
        <div className="story-panel">
          <h3>What makes DYMUN different</h3>
          <ul>
            <li>High-quality committee experience</li>
            <li>Debate with academic seriousness</li>
            <li>Practical diplomacy and negotiation</li>
          </ul>
        </div>
      </section>

      <section className="section-wrap values-section">
        <div className="section-label"><span className="section-label__dot" /> Our values</div>
        <div className="value-grid">
          {values.map((value) => (
            <article className="info-card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function DetailsPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--compact">
        <div className="page-hero__inner section-wrap">
          <div className="section-label"><span className="section-label__dot" /> Conference details</div>
          <h1>Everything delegates need to know before the first gavel.</h1>
        </div>
      </section>

      <section className="section-wrap details-section">
        <div className="detail-grid">
          {details.map((detail) => (
            <article className="info-card" key={detail.title}>
              <h3>{detail.title}</h3>
              <p>{detail.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function CommitteesPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--compact">
        <div className="page-hero__inner section-wrap">
          <div className="section-label"><span className="section-label__dot" /> Committees</div>
          <h1>Choose a room where your ideas can take shape.</h1>
        </div>
      </section>

      <section className="section-wrap committees-section">
        <div className="committee-grid">
          {committees.map((committee) => (
            <article className="committee-card" key={committee.name}>
              <span className="committee-card__name">{committee.name}</span>
              <h3>{committee.focus}</h3>
              <p>{committee.size}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function TeamPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--compact">
        <div className="page-hero__inner section-wrap">
          <div className="section-label"><span className="section-label__dot" /> OC & EB</div>
          <h1>The team behind the conference.</h1>
        </div>
      </section>

      <section className="section-wrap team-section">
        <div className="team-column">
          <h2>Organising Committee</h2>
          <div className="team-grid">
            {ocTeam.map((member) => (
              <article className="info-card" key={member.role}>
                <h3>{member.role}</h3>
                <p>{member.note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="team-column">
          <h2>Executive Board</h2>
          <div className="team-grid">
            {ebTeam.map((member) => (
              <article className="info-card" key={member.role}>
                <h3>{member.role}</h3>
                <p>{member.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function RegistrationPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--compact">
        <div className="page-hero__inner section-wrap">
          <div className="section-label"><span className="section-label__dot" /> Registration</div>
          <h1>Begin your DYMUN journey with a strong first step.</h1>
        </div>
      </section>

      <section className="section-wrap registration-layout">
        <div className="registration-card">
          <h3>Before you register</h3>
          <ol>
            {registrationSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="registration-card registration-card--highlight">
          <h3>Registration is opening soon</h3>
          <p>We’re getting everything ready for DYMUN 2026. Check back here soon to register your delegation.</p>
          <form className="registration-preview" aria-label="Registration form preview">
            <fieldset disabled>
              <legend>Registration form preview</legend>
              <label>
                Delegate name
                <input type="text" placeholder="Your full name" />
              </label>
              <label>
                School
                <input type="text" placeholder="Your school name" />
              </label>
              <label>
                Committee preference
                <select defaultValue="">
                  <option value="" disabled>Select a committee</option>
                  {committees.map((committee) => (
                    <option key={committee.name} value={committee.name}>{committee.name}</option>
                  ))}
                </select>
              </label>
              <button className="button button--lime" type="button">Registration opening soon</button>
            </fieldset>
          </form>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={<PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}><HomePage /></PageShell>}
        />
        <Route
          path="/about"
          element={<PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}><AboutPage /></PageShell>}
        />
        <Route
          path="/details"
          element={<PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}><DetailsPage /></PageShell>}
        />
        <Route
          path="/committees"
          element={<PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}><CommitteesPage /></PageShell>}
        />
        <Route
          path="/team"
          element={<PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}><TeamPage /></PageShell>}
        />
        <Route
          path="/registration"
          element={<PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}><RegistrationPage /></PageShell>}
        />
      </Routes>
    </HashRouter>
  )
}

export default App
