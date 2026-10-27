import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { contact, services, steps, questions } from './content';
import './styles.css';

function Arrow({ diagonal = false, className = '' }) {
  return <svg className={`arrow ${className}`} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ServiceIcon({ type }) {
  const paths = {
    door: <><path d="M6 25V5h17v20M3 25h25M10 25V9h9v16" /><path d="M16 17h.01" strokeWidth="3" /></>,
    people: <><circle cx="15" cy="9" r="4" /><path d="M7 26v-3a8 8 0 0 1 16 0v3M4 10a3 3 0 0 0 0 6m23-6a3 3 0 0 1 0 6M2 24v-2a5 5 0 0 1 3-4m24 6v-2a5 5 0 0 0-3-4" /></>,
    bell: <><path d="M4 24h24M6 20a10 10 0 0 1 20 0v1H6ZM13 6h6m-3 0v4" /></>,
    plan: <><rect x="5" y="4" width="22" height="24" rx="1" /><path d="M10 10h2m4 0h7m-13 6h2m4 0h7m-13 6h2m4 0h7" /></>,
    spark: <><path d="m16 3 3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5ZM26 3v5m-2.5-2.5h5" /></>,
  };
  return <svg className="service-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function Brand({ light = false }) {
  return <a href="#home" className={`brand ${light ? 'brand-light' : ''}`} aria-label="SK Management home"><span className="brand-monogram">S<span>K</span></span><span className="brand-name">SK MANAGEMENT<span>LE GRANDE AURA HOTEL GROUP</span></span></a>;
}

function Label({ children, number, light = false }) {
  return <div className={`eyebrow ${light ? 'light' : ''}`}><span className="tiny-cross">✳</span>{children}{number && <span className="section-number">{number}</span>}</div>;
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  return <Tag className={`reveal ${className}`} style={{ '--delay': `${delay}ms` }}>{children}</Tag>;
}

function Photo({ src, alt, className = '', loading = 'lazy', position }) {
  return <div className={`photo ${className}`}><img src={`/images/${src}.jpeg`} alt={alt} loading={loading} decoding="async" style={position ? { objectPosition: position } : undefined} /></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const heroRef = useRef(null);
  const processRef = useRef(null);
  const navLinks = [['about', 'Our story'], ['services', 'Expertise'], ['people', 'Our people'], ['process', 'Our approach']];

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 36);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--page-progress', `${scrollable > 0 ? y / scrollable : 0}`);
      if (heroRef.current && !motion.matches && window.innerWidth > 760) {
        heroRef.current.style.setProperty('--parallax', `${Math.min(y * .09, 100)}px`);
      }
      if (processRef.current) {
        const rect = processRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight * .8 - rect.top) / (rect.height * .85)));
        processRef.current.style.setProperty('--process-progress', progress);
      }
      frame = null;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(el => sectionObserver.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="scroll-progress" aria-hidden="true" />
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">{navLinks.map(([id, title]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`}>{title}</a>)}</nav>
        <a href="#contact" className="header-cta">Let’s connect <Arrow diagonal /></a>
        <button className={`menu-button ${menuOpen ? 'open' : ''}`} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
      <nav id="mobile-menu" className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation" inert={!menuOpen}>{[...navLinks, ['contact', 'Let’s connect']].map(([id, title], i) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ '--i': i }}><small>0{i + 1}</small>{title}<Arrow diagonal /></a>)}</nav>
    </header>

    <main id="main">
      <section id="home" className="hero container" ref={heroRef}>
        <div className="hero-copy">
          <div className="hero-eyebrow entrance"><span />PEOPLE. PREPARATION. HOSPITALITY.</div>
          <h1><span className="word-mask"><span>Great hotels</span></span><span className="word-mask"><span>begin with</span></span><span className="word-mask"><em>great people.</em></span></h1>
          <p className="hero-description entrance">Your vision deserves an exceptional team.<br className="desktop-break" /> Hospitality staffing and pre-opening expertise,<br className="desktop-break" /> thoughtfully brought together.</p>
          <a className="button button-dark entrance" href="#services">Discover our expertise <span><Arrow diagonal /></span></a>
          <div className="hero-footnote entrance"><span className="fine-line" /><p>SK MANAGEMENT<span>In association with Le Grande Aura Hotel Group</span></p></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame"><Photo src="banquet" alt="A hospitality professional at a carefully prepared banquet table" loading="eager" className="hero-photo" position="50% 57%" /><div className="photo-shade" /><span className="image-top-caption">THE ART OF BEING READY</span><div className="image-bottom-caption"><span>A considered approach.<br />An exceptional welcome.</span><span className="image-cross">✳</span></div></div>
          <div className="vertical-caption">YOUR VISION. OUR EXPERTISE.</div>
          <a className="circle-seal" href="#about" aria-label="Scroll to our story"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circle-text" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs><text><textPath href="#circle-text" textLength="276">PEOPLE · PREPARATION · HOSPITALITY · </textPath></text></svg><span>↓</span></a>
        </div>
        <div className="hero-bottom"><span>HOTEL PRE-OPENING & STAFFING SOLUTIONS</span><a href="#about">SCROLL TO EXPLORE <span>↓</span></a><span>PANIPAT, HARYANA · INDIA</span></div>
      </section>

      <div className="ticker" aria-label="Our focus: skilled people, considered preparation, exceptional hospitality"><div className="ticker-track" aria-hidden="true">{[0,1,2,3].map(n => <span key={n}>Skilled people <i>✳</i> Considered preparation <i>✳</i> Exceptional hospitality <i>✳</i></span>)}</div></div>

      <section className="about section-pad container" id="about">
        <Reveal className="section-top"><Label number="01">OUR STORY</Label><span className="section-note">A PEOPLE-FIRST PERSPECTIVE</span></Reveal>
        <div className="about-heading"><Reveal><h2>Before the first guest.<br />Before the first welcome.<br /><em>There’s the right team.</em></h2></Reveal><Reveal className="about-intro" delay={150}><p className="lead">A remarkable hotel is more than a beautiful building. It’s the people who bring it to life.</p><p>At SK Management, associated with Le Grande Aura Hotel Group, we help hotels build that foundation. We specialise in management and operational staffing for the all-important pre-opening phase.</p><p>From understanding your property to identifying the people it needs, our approach is personal, practical and shaped around your vision.</p><a className="text-link" href="#process">A closer look at our approach <Arrow diagonal /></a></Reveal></div>
        <div className="about-images"><Reveal className="about-team"><Photo src="team" alt="Hospitality team gathered outside a hotel entrance" /><div className="photo-caption"><span>THE PEOPLE BEHIND THE WELCOME</span><span>01 / 02</span></div></Reveal><Reveal className="about-detail" delay={150}><Photo src="portrait" alt="A member of the SK Management team in a hotel dining setting" position="52% 48%" /><div className="photo-caption"><span>HOSPITALITY, PERSONALLY</span><span>02 / 02</span></div></Reveal><Reveal className="about-margin" delay={250}><span className="editorial-star">✳</span><p>People first.<br />Purpose always.</p></Reveal></div>
        <Reveal className="mission-row"><div><span className="micro-label">OUR MISSION</span><p>Build capable teams that support a smooth opening and a lasting culture of professional service.</p></div><div><span className="micro-label">OUR VISION</span><p>Be a trusted hospitality partner, known for reliability, professionalism and people-focused solutions.</p></div><div className="mission-signature">Your vision.<br /><em>Our commitment.</em></div></Reveal>
      </section>

      <section id="services" className="services section-pad">
        <div className="container"><Reveal className="section-top"><Label number="02">OUR EXPERTISE</Label><span className="section-note">FROM YOUR FIRST PLAN TO YOUR FIRST GUEST</span></Reveal><div className="section-heading"><Reveal><h2>Ready for opening.<br /><em>Prepared for excellence.</em></h2></Reveal><Reveal delay={150}><p>Every hotel is different. So is every team.<br />Our support is built around your property’s<br className="desktop-break" /> people, priorities and possibilities.</p></Reveal></div>
          <div className="service-list">{services.map((service, i) => <Reveal className="service-row" delay={i * 35} key={service.title}><div className="service-index">0{i + 1}<ServiceIcon type={service.icon} /></div><h3>{service.title}</h3><div className="service-description"><p>{service.text}</p><div className="service-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><span className="service-arrow" aria-hidden="true"><Arrow diagonal /></span></Reveal>)}</div>
          <Reveal className="services-note"><span>BUILT AROUND YOUR PROPERTY</span><p>For hotel owners, developers, management companies, independent hotels and growing hospitality businesses.</p></Reveal>
        </div>
      </section>

      <section className="people section-pad" id="people"><div className="container"><Reveal className="section-top"><Label number="03" light>THE HUMAN SIDE</Label><span className="section-note">RELATIONSHIPS AT THE HEART OF HOSPITALITY</span></Reveal><div className="people-heading"><Reveal><h2>It’s a people business.<br /><em>We keep it that way.</em></h2></Reveal><Reveal delay={150}><p>Behind every smooth opening are people working together. We value the conversations, the collaboration and the shared commitment that make a hospitality team.</p></Reveal></div>
          <div className="people-gallery"><Reveal className="gallery-item gallery-recognition"><Photo src="recognition" alt="Hospitality professionals sharing a moment of recognition" /><span className="gallery-caption"><i>01</i> Moments of recognition</span></Reveal><Reveal className="gallery-item gallery-partnership" delay={150}><Photo src="partnership" alt="Three hospitality professionals with a welcoming bouquet" /><span className="gallery-caption"><i>02</i> Meaningful connections</span></Reveal><Reveal className="gallery-item gallery-welcome" delay={250}><Photo src="welcome" alt="Hospitality colleagues exchanging a welcome bouquet" /><span className="gallery-caption"><i>03</i> A warm welcome</span></Reveal><Reveal className="gallery-item gallery-team" delay={100}><Photo src="gathering" alt="Hospitality colleagues gathered for a team occasion" /><span className="gallery-caption"><i>04</i> A shared commitment</span></Reveal><Reveal className="gallery-quote"><span>“</span><p>Behind every successful guest experience is a team<br /><em>working together.</em></p><span className="quote-rule" /></Reveal></div>
        </div></section>

      <section className="process section-pad container" id="process" ref={processRef}><Reveal className="section-top"><Label number="04">OUR APPROACH</Label><span className="section-note">THOUGHTFUL AT EVERY STEP</span></Reveal><div className="section-heading"><Reveal><h2>Your next chapter.<br /><em>A clear way forward.</em></h2></Reveal><Reveal delay={150}><p>Good teams start with understanding.<br />We bring clarity and coordination to<br className="desktop-break" /> each stage of your staffing journey.</p></Reveal></div><div className="process-steps">{steps.map((step, i) => <Reveal className="process-step" delay={i * 100} key={step.title}><div className="step-top"><span>0{i + 1}</span><i /></div><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div><Reveal className="process-footnote"><span>YOUR PROPERTY. YOUR PRIORITIES. OUR STARTING POINT.</span><p>Specific roles, personnel availability, timelines and engagement terms are discussed individually. Our process adapts to your project and agreed scope.</p></Reveal></section>

      <section className="values"><div className="container values-inner"><Reveal><span className="micro-label">WHAT GUIDES US</span><h2>A standard of service.<br /><em>A shared set of values.</em></h2></Reveal><div className="values-list">{['Professionalism', 'People first', 'Commitment', 'Quality', 'Collaboration'].map((v,i) => <Reveal delay={i * 55} key={v}><span>0{i+1}</span><p>{v}</p><i>✳</i></Reveal>)}</div></div></section>

      <section className="faq section-pad container" id="questions"><Reveal className="section-top"><Label number="05">A LITTLE CLARITY</Label><span className="section-note">BEFORE WE BEGIN</span></Reveal><div className="faq-layout"><Reveal><h2>Good questions.<br /><em>Clear answers.</em></h2><p>A few things you might<br />like to know.</p></Reveal><div className="faq-questions">{questions.map((item,i) => <Reveal className="faq-item" delay={i * 60} key={item.question}><span>0{i + 1}</span><div><h3>{item.question}</h3><p>{item.answer}</p></div></Reveal>)}</div></div></section>

      <section className="contact" id="contact"><div className="container"><Reveal><Label light>LET’S CREATE YOUR NEXT CHAPTER</Label></Reveal><Reveal><h2>Your hotel’s story<br />starts with <em>its people.</em></h2></Reveal><Reveal className="contact-bottom"><p>Tell us about your vision.<br />Let’s prepare for your first welcome.</p><a className="contact-jump" href="#contact-details" aria-label="View our contact details"><Arrow diagonal /></a></Reveal><Reveal className="contact-details" as="address"><div id="contact-details"><span className="micro-label">FIND US</span><p>{contact.address}<br />{contact.region}</p></div><div><span className="micro-label">CALL OUR TEAM</span><p>{contact.phone}</p></div><div><span className="micro-label">WRITE TO US</span><p>{contact.email}</p></div></Reveal></div><span className="contact-watermark" aria-hidden="true">SK</span></section>
    </main>

    <footer className="footer container"><div className="footer-top"><Brand /><p>Building hospitality teams.<br />Preparing for exceptional beginnings.</p><a className="back-top" href="#home">BACK TO TOP <span>↑</span></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SK Management. All rights reserved.</span><span>LE GRANDE AURA HOTEL GROUP</span><span>PEOPLE. PREPARATION. HOSPITALITY.</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
