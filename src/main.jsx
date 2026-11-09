import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { contact, services, steps, questions } from './content';
import FoldText from './components/FoldText';
import './styles.css';

const imageDimensions = {
  hero: [853, 1280],
  banquet: [1800, 3200],
  portrait: [1800, 3200],
  gathering: [1776, 1304],
  recognition: [1977, 1803],
  welcome: [1896, 896],
  partnership: [1686, 1455],
  team: [2476, 1492],
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

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  return <Tag className={`reveal ${className}`} style={{ '--delay': `${delay}ms` }}>{children}</Tag>;
}

function Photo({ src, alt, className = '', loading = 'lazy', position, sizes = '(max-width: 760px) 100vw, 50vw', filename = `${src}_enhanced.webp` }) {
  const [width, height] = imageDimensions[src];
  return <div className={`photo ${className}`}><img src={`/images/${filename}`} alt={alt} width={width} height={height} loading={loading} fetchPriority={loading === 'eager' ? 'high' : 'low'} decoding="async" sizes={sizes} style={position ? { objectPosition: position } : undefined} /></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navLinks = [['about', 'Our Experience'], ['services', 'Expertise'], ['people', 'Our people'], ['process', 'Our approach']];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      revealObserver.disconnect();
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
    </header>

    <main id="main">
      <section id="home" className="hero container">
        <div className="hero-copy">
          <h1><span className="word-mask"><span>Great hotels</span></span><span className="word-mask"><span>begin with</span></span><span className="word-mask"><span>great people.</span></span></h1>
          <p className="hero-description entrance">Your vision deserves an exceptional team. Hospitality staffing and pre-opening expertise, thoughtfully brought together.</p>
          <a className="premium-button entrance" href="#services">Explore our services</a>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame"><Photo src="hero" filename="hero-portrait.webp" alt="A hospitality professional in a beige suit in a hotel interior" loading="eager" className="hero-photo" position="50% 40%" sizes="(max-width: 760px) 100vw, 48vw" /></div>
        </div>
      </section>

      <section className="about section-pad container optimized-section" id="about">
        <div className="about-heading"><h2><FoldText text="Our Experience" splitBy="char" foldAngle={85} duration={0.65} stagger={0.025} creaseShading={0.35} /></h2><Reveal as="p" className="lead" delay={80}>Welcome to professional Hotel Consultancy &amp; Hospitality Management Services.</Reveal></div>
        <Reveal className="about-copy">
          <p>With 18 years of hands-on experience in the hospitality industry, Sandeep Kumai, Director – Hotel Consultancy &amp; Operations, brings extensive expertise in hotel operations, General Management, pre-opening projects, team recruitment, food and beverage, banquet management, revenue optimization, and guest satisfaction.</p>
          <p>Our mission is to help hotel owners build experienced, qualified, and dedicated teams while improving operational efficiency and overall business performance.</p>
          <p>We offer comprehensive hospitality solutions, including hotel pre-opening consultancy, experienced manpower recruitment, operational management, staff training, SOP development, service quality improvement, and revenue growth strategies.</p>
          <p>Whether you are launching a new hotel or looking to improve an existing property, we help you find the right people, establish effective systems, and maintain professional hospitality standards.</p>
          <p>We believe that the right team, effective leadership, and exceptional guest service are the foundations of a successful hotel business.</p>
          <p>Our commitment is to provide practical, reliable, and result-oriented consultancy services that help hotel owners achieve sustainable growth and long-term success.</p>
        </Reveal>
        <div className="about-images"><Reveal className="about-team"><Photo src="team" alt="Hospitality team gathered outside a hotel entrance" sizes="(max-width: 760px) 58vw, 45vw" /></Reveal><Reveal className="about-detail" delay={80}><Photo src="portrait" alt="A member of the SK Management team in a hotel dining setting" position="52% 48%" sizes="(max-width: 760px) 42vw, 28vw" /></Reveal></div>
      </section>

      <section id="services" className="services section-pad optimized-section">
        <div className="container"><div className="section-heading"><div><h2><FoldText text="Staffing expertise for a confident hotel opening." splitBy="word" foldAngle={85} duration={0.65} stagger={0.07} creaseShading={0.35} /></h2></div><Reveal delay={80}><p>Every hotel is different. So is every team. Our support is built around your property’s people, priorities and possibilities.</p></Reveal></div>
          <div className="service-list">{services.map((service, index) => <Reveal className="service-row" delay={index * 25} key={service.title}><div className="service-index"><ServiceIcon type={service.icon} /></div><h3>{service.title}</h3><div className="service-description"><p>{service.text}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="people section-pad optimized-section" id="people"><div className="container"><div className="people-heading"><div><h2><FoldText text="Hospitality is built by people." splitBy="word" foldAngle={85} duration={0.65} stagger={0.07} creaseShading={0.35} /></h2></div><Reveal delay={80}><p>Behind every smooth opening are people working together. We value the conversations, collaboration and shared commitment that make a hospitality team.</p></Reveal></div>
          <div className="people-gallery"><Reveal className="gallery-item gallery-recognition"><Photo src="recognition" alt="Hospitality professionals sharing a moment of recognition" sizes="(max-width: 760px) 50vw, 34vw" /></Reveal><Reveal className="gallery-item gallery-partnership" delay={70}><Photo src="partnership" alt="Three hospitality professionals with a welcoming bouquet" sizes="(max-width: 760px) 50vw, 30vw" /></Reveal><Reveal className="gallery-item gallery-welcome" delay={120}><Photo src="welcome" alt="Hospitality colleagues exchanging a welcome bouquet" sizes="(max-width: 760px) 50vw, 28vw" /></Reveal><Reveal className="gallery-item gallery-team" delay={50}><Photo src="gathering" alt="Hospitality colleagues gathered for a team occasion" sizes="(max-width: 760px) 50vw, 24vw" /></Reveal><Reveal className="gallery-quote"><span>“</span><p>Behind every successful guest experience is a team working together.</p></Reveal></div>
        </div></section>

      <section className="process section-pad container optimized-section" id="process"><div className="section-heading"><Reveal><h2>A clear path from planning to opening.</h2></Reveal><Reveal delay={80}><p>Good teams start with understanding. We bring clarity and coordination to each stage of your staffing journey.</p></Reveal></div><div className="process-steps">{steps.map((step, index) => <Reveal className="process-step" delay={index * 45} key={step.title}><div className="step-top"><span>0{index + 1}</span><i /></div><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div></section>

      <section className="values optimized-section"><div className="container values-inner"><Reveal><h2>The standards behind our work.</h2></Reveal><div className="values-list">{['Professionalism', 'People first', 'Commitment', 'Quality', 'Collaboration'].map((value, index) => <Reveal delay={index * 30} key={value}><p>{value}</p></Reveal>)}</div></div></section>

      <section className="faq section-pad container optimized-section" id="questions"><div className="faq-layout"><Reveal><h2>Questions before we begin.</h2></Reveal><div className="faq-questions">{questions.map((item, index) => <Reveal className="faq-item" delay={index * 35} key={item.question}><span>0{index + 1}</span><div><h3>{item.question}</h3><p>{item.answer}</p></div></Reveal>)}</div></div></section>

      <section className="contact optimized-section" id="contact">
        <div className="container">
          <h2><FoldText text="Want to grow your hotel business?" splitBy="word" foldAngle={85} duration={0.65} stagger={0.07} creaseShading={0.35} /></h2>
          <Reveal className="contact-bottom">
            <p className="contact-lead">A great hotel starts with a great team.</p>
            <p>Find experienced, qualified and professionally trained staff for hotel operations, front office, F&amp;B, housekeeping and banquet management. Build a stronger team, improve guest satisfaction and take your business forward.</p>
            <p className="contact-prompt">Contact us today for professional hotel team hiring and staffing.</p>
          </Reveal>
          <Reveal className="contact-details" as="address"><div><h3 className="contact-label">Find us</h3><p>{contact.address}<br />{contact.region}</p></div><div><h3 className="contact-label">Call our team</h3><p>{contact.phone}</p></div><div><h3 className="contact-label">Write to us</h3><p>{contact.email}</p></div></Reveal>
        </div>
      </section>
    </main>

    <footer className="footer container"><div className="footer-top"><Brand /><p>Building hospitality teams.<br />Preparing for exceptional beginnings.</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SK Management. All rights reserved.</span><span>Le Grande Aura Hotel Group</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
