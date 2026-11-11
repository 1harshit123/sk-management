import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { contact, services, steps, questions } from './content';
import FoldText from './components/FoldText';
import LanyardCard from './components/LanyardCard';
import { observeViewportEntry } from './animation/viewportEntry';
import './styles.css';

const imageDimensions = {
  hero: [853, 1280],
  banquet: [900, 1600],
  kitchen: [1200, 1600],
  hospitality: [1280, 960],
  management: [1600, 1200],
  operations: [1600, 1200],
  welcome: [1600, 718],
  recognition: [1200, 1600],
  team: [6000, 4000],
};

function ServiceIcon({ type }) {
  const paths = {
    door: <><path d="M6 25V5h17v20M3 25h25M10 25h9V9h-9v16" /><path d="M16 17h.01" strokeWidth="3" /></>,
    people: <><circle cx="15" cy="9" r="4" /><path d="M7 26v-3a8 8 0 0 1 16 0v3M4 10a3 3 0 0 0 0 6m23-6a3 3 0 0 1 0 6M2 24v-2a5 5 0 0 1 3-4m24 6v-2a5 5 0 0 0-3-4" /></>,
    bell: <><path d="M4 24h24M6 20a10 10 0 0 1 20 0v1H6ZM13 6h6m-3 0v4" /></>,
    plan: <><rect x="5" y="4" width="22" height="24" rx="1" /><path d="M10 10h2m4 0h7m-13 6h2m4 0h7m-13 6h2m4 0h7" /></>,
    spark: <><path d="m16 3 3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5ZM26 3v5m-2.5-2.5h5" /></>,
  };
  return <svg className="service-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function Brand() {
  return <a href="#home" className="brand" aria-label="SK Management home"><span className="brand-monogram">S<span>K</span></span><span className="brand-name"><span className="brand-wordmark">SK Management</span><span className="brand-tagline">Le Grande Aura Hotel Group</span></span></a>;
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...props }) {
  return <Tag {...props} className={`reveal ${className}`} style={{ '--delay': `${delay}ms` }}>{children}</Tag>;
}

function Photo({ src, alt, className = '', loading = 'lazy', position, sizes = '(max-width: 760px) 100vw, 50vw', filename = `${src}_enhanced.webp` }) {
  const [width, height] = imageDimensions[src];
  return <div className={`photo ${className}`}><img src={`/images/${filename}`} alt={alt} width={width} height={height} loading={loading} fetchPriority={loading === 'eager' ? 'high' : 'low'} decoding="async" sizes={sizes} style={position ? { objectPosition: position } : undefined} /></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navLinks = [['about', 'About Us'], ['services', 'Expertise'], ['people', 'Our people'], ['process', 'Our approach']];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    const stopReveals = Array.from(document.querySelectorAll('.reveal'), element =>
      observeViewportEntry(element, () => element.classList.add('is-visible'), { waitForImages: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      stopReveals.forEach(stop => stop());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = event => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">{navLinks.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav>
        <a href="#contact" className="header-cta premium-link">Let’s connect</a>
        <button className={`menu-button ${menuOpen ? 'open' : ''}`} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
      <nav id="mobile-menu" className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation" inert={!menuOpen}>{[...navLinks, ['contact', 'Let’s connect']].map(([id, title]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{title}</a>)}</nav>
      <div className="header-contact-bar">
        <nav className="container header-contact-links" aria-label="Contact and social links">
          <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.email}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>Email: {contact.email}</a>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="SK Management on Instagram (opens in a new tab)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>Instagram</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Sandeep Kumai on LinkedIn (opens in a new tab)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7m4 0v-7m0 3a3 3 0 0 1 6 0v4" /><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" /></svg>LinkedIn</a>
        </nav>
      </div>
    </header>

    <main id="main">
      <section id="home" className="hero container">
        <div className="hero-copy">
          <Reveal as="h1" className="hero-title"><span className="word-mask"><span>Great hotels</span></span><span className="word-mask"><span>begin with</span></span><span className="word-mask"><span>great people.</span></span></Reveal>
          <Reveal as="p" className="hero-description" delay={120}>Your vision deserves an exceptional team. Hospitality staffing and pre-opening expertise, thoughtfully brought together.</Reveal>
          <Reveal as="a" className="premium-button" href="#services" delay={180}>Explore our services</Reveal>
        </div>
        <Reveal className="hero-visual" delay={100}>
          <div className="hero-image-frame"><Photo src="hero" filename="hero-portrait.webp" alt="A hospitality professional in a beige suit in a hotel interior" loading="eager" className="hero-photo" position="50% 40%" sizes="(max-width: 760px) 100vw, 48vw" /></div>
        </Reveal>
      </section>

      <section className="about section-pad container optimized-section" id="about">
        <div className="about-heading"><h2><FoldText text="About Us" splitBy="char" foldAngle={85} duration={0.65} stagger={0.025} creaseShading={0.35} hoverRefold refoldRadius={110} refoldAngle={30} /></h2><Reveal as="p" className="lead" delay={80}>Welcome to professional Hotel Consultancy &amp; Hospitality Management Services.</Reveal></div>
        <Reveal className="about-copy">
          <p>With 18 years of hands-on experience in the hospitality industry, Sandeep Kumai, Director – Hotel Consultancy &amp; Operations, brings extensive expertise in hotel operations, General Management, pre-opening projects, team recruitment, food and beverage, banquet management, revenue optimization, and guest satisfaction.</p>
          <p>Our mission is to help hotel owners build experienced, qualified, and dedicated teams while improving operational efficiency and overall business performance.</p>
          <p>We offer comprehensive hospitality solutions, including hotel pre-opening consultancy, experienced manpower recruitment, operational management, staff training, SOP development, service quality improvement, and revenue growth strategies.</p>
          <p>Whether you are launching a new hotel or looking to improve an existing property, we help you find the right people, establish effective systems, and maintain professional hospitality standards.</p>
          <p>We believe that the right team, effective leadership, and exceptional guest service are the foundations of a successful hotel business.</p>
          <p>Our commitment is to provide practical, reliable, and result-oriented consultancy services that help hotel owners achieve sustainable growth and long-term success.</p>
        </Reveal>
        <div className="about-images">
          <Reveal className="about-team"><Photo src="team" filename="experience-team.webp" alt="Seven hospitality professionals standing together in a hotel lobby" sizes="(max-width: 760px) 100vw, 1040px" /></Reveal>
          <Reveal className="about-detail"><Photo src="banquet" filename="experience-banquet.webp" alt="A hospitality professional seated at a banquet table decorated with flowers" position="50% 55%" sizes="(max-width: 560px) 100vw, (max-width: 1150px) 50vw, 520px" /></Reveal>
          <Reveal className="about-detail" delay={80}><Photo src="kitchen" filename="experience-kitchen.webp" alt="Hospitality professionals and chefs beside prepared dishes in a hotel kitchen" sizes="(max-width: 560px) 100vw, (max-width: 1150px) 50vw, 520px" /></Reveal>
        </div>
      </section>

      <section id="services" className="services section-pad optimized-section">
        <div className="container"><div className="section-heading"><div><h2><FoldText text="Staffing expertise for a confident hotel opening." splitBy="word" foldAngle={85} duration={0.65} stagger={0.07} creaseShading={0.35} hoverRefold refoldRadius={110} refoldAngle={30} /></h2></div><Reveal delay={80}><p>Every hotel is different. So is every team. Our support is built around your property’s people, priorities and possibilities.</p></Reveal></div>
          <div className="service-list">{services.map((service, index) => <Reveal className="service-row" delay={index * 25} key={service.title}><div className="service-index"><ServiceIcon type={service.icon} /></div><h3>{service.title}</h3><div className="service-description"><p>{service.text}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="people section-pad optimized-section" id="people"><div className="container"><div className="people-heading"><div><h2><FoldText text="Hospitality is built by people." splitBy="word" foldAngle={85} duration={0.65} stagger={0.07} creaseShading={0.35} hoverRefold refoldRadius={110} refoldAngle={30} /></h2></div><Reveal delay={80}><p>Behind every smooth opening are people working together. We value the conversations, collaboration and shared commitment that make a hospitality team.</p></Reveal></div>
          <div className="people-gallery">
            <div className="people-team-grid">
              <Reveal className="gallery-item"><Photo src="hospitality" filename="people-hospitality-team.webp" alt="Hotel professionals and a chef standing together in a banquet setting" sizes="(max-width: 760px) 100vw, 33vw" /></Reveal>
              <Reveal className="gallery-item" delay={60}><Photo src="management" filename="people-management.webp" alt="Three hospitality professionals standing together at a hotel event" sizes="(max-width: 760px) 100vw, 33vw" /></Reveal>
              <Reveal className="gallery-item" delay={120}><Photo src="operations" filename="people-operations.webp" alt="A hotel professional with four team members in a hotel lobby" sizes="(max-width: 760px) 100vw, 33vw" /></Reveal>
            </div>
            <div className="people-moments-grid">
              <Reveal className="gallery-item gallery-welcome"><Photo src="welcome" filename="people-welcome.webp" alt="A group sharing a welcoming bouquet inside a hotel" sizes="(max-width: 760px) 100vw, 75vw" /></Reveal>
              <Reveal className="gallery-item gallery-recognition" delay={80}><Photo src="recognition" filename="people-recognition.webp" alt="Hospitality professionals presenting a commemorative plaque" sizes="(max-width: 760px) 100vw, 25vw" /></Reveal>
            </div>
          </div>
          <Reveal className="gallery-quote"><span aria-hidden="true">“</span><p>Behind every successful guest experience is a team working together.</p></Reveal>
        </div></section>

      <section className="process section-pad container optimized-section" id="process"><div className="section-heading"><Reveal><h2>A clear path from planning to opening.</h2></Reveal><Reveal delay={80}><p>Good teams start with understanding. We bring clarity and coordination to each stage of your staffing journey.</p></Reveal></div><div className="process-steps">{steps.map((step, index) => <Reveal className="process-step" delay={index * 45} key={step.title}><div className="step-top"><span>0{index + 1}</span><i /></div><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div></section>

      <section className="values optimized-section"><div className="container values-inner"><Reveal><h2>The standards behind our work.</h2></Reveal><div className="values-list">{['Professionalism', 'People first', 'Commitment', 'Quality', 'Collaboration'].map((value, index) => <Reveal delay={index * 30} key={value}><p>{value}</p></Reveal>)}</div></div></section>

      <section className="faq section-pad container optimized-section" id="questions"><div className="faq-layout"><Reveal><h2>Questions before we begin.</h2></Reveal><div className="faq-questions">{questions.map((item, index) => <Reveal className="faq-item" delay={index * 35} key={item.question}><span>0{index + 1}</span><div><h3>{item.question}</h3><p>{item.answer}</p></div></Reveal>)}</div></div></section>

      <section className="contact optimized-section" id="contact">
        <div className="container">
          <div className="contact-layout">
          <div className="contact-copy">
          <h2><FoldText text="Want to grow your hotel business?" splitBy="word" foldAngle={85} duration={0.65} stagger={0.07} creaseShading={0.35} hoverRefold refoldRadius={110} refoldAngle={30} /></h2>
          <Reveal className="contact-bottom">
            <p className="contact-lead">A great hotel starts with a great team.</p>
            <p>Find experienced, qualified and professionally trained staff for hotel operations, front office, F&amp;B, housekeeping and banquet management. Build a stronger team, improve guest satisfaction and take your business forward.</p>
            <p className="contact-prompt">Contact us today for professional hotel team hiring and staffing.</p>
            <a className="secondary-button contact-linkedin" href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Connect with Sandeep Kumai on LinkedIn (opens in a new tab)">Connect on LinkedIn <svg className="linkedin-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path fillRule="evenodd" d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zM3.743 5.182c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.763-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169H6.25c.03.678 0 7.225 0 7.225h2.401z" /></svg></a>
          </Reveal>
          </div>
          <LanyardCard />
          </div>
          <Reveal className="contact-details" as="address"><div><h3 className="contact-label">Find us</h3><p>{contact.address}<br />{contact.region}</p></div><div><h3 className="contact-label">Call our team</h3><p>{contact.phone}</p></div><div><h3 className="contact-label">Write to us</h3><p>{contact.email}</p></div></Reveal>
        </div>
      </section>
    </main>

    <footer className="footer container"><div className="footer-top"><Brand /><p>Building hospitality teams.<br />Preparing for exceptional beginnings.</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SK Management. All rights reserved.</span><span>Le Grande Aura Hotel Group</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
