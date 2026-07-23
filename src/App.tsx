import './App.css'
import { SlideDeck } from './components/SlideDeck'
import { WaitlistForm } from './components/WaitlistForm'

const features = [
  {
    icon: '⚡',
    title: 'Lightning drafts',
    body: 'Turn a rough outline into a polished deck in seconds with smart layout suggestions.',
  },
  {
    icon: '🎨',
    title: 'Brand-perfect themes',
    body: 'Every slide snaps to your palette, fonts, and spacing so your story stays on-brand.',
  },
  {
    icon: '📊',
    title: 'Live data slides',
    body: 'Charts and metrics refresh automatically, so the numbers are never stale on stage.',
  },
  {
    icon: '🤝',
    title: 'Real-time co-editing',
    body: 'Present, comment, and edit together — no more emailing v7_final_FINAL.pptx.',
  },
]

function App() {
  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            ◨
          </span>
          Slide<span className="brand-accent">XL</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
          <a href="#waitlist">Waitlist</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Presentations, supersized</p>
          <h1>
            Build decks that <span className="grad">command the room</span>.
          </h1>
          <p className="lede">
            Slide XL is the collaborative presentation studio for teams who ship
            ideas fast. Design, rehearse, and present — all in one place.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#waitlist">
              Join the waitlist
            </a>
            <a className="btn btn-ghost" href="#demo">
              See it in action
            </a>
          </div>
        </section>

        <section id="features" className="features">
          <h2 className="section-title">Everything you need to present</h2>
          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card" key={f.title}>
                <div className="feature-icon" aria-hidden="true">
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="demo" className="demo">
          <h2 className="section-title">Take the deck for a spin</h2>
          <p className="section-sub">
            Use the controls to flip through a live sample presentation.
          </p>
          <SlideDeck />
        </section>

        <section id="waitlist" className="waitlist">
          <h2 className="section-title">Be first on stage</h2>
          <p className="section-sub">
            Join the waitlist and we&rsquo;ll send an invite the moment early
            access opens.
          </p>
          <WaitlistForm />
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Slide XL</span>
        <span>Made for storytellers.</span>
      </footer>
    </div>
  )
}

export default App
