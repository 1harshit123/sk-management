import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import './LanyardCard.css';

const Lanyard = lazy(() => import('./Lanyard'));

class LanyardBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function LanyardCard() {
  const holder = useRef(null);
  const [near, setNear] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [back, setBack] = useState(false);
  const enhance = near && eligible && !failed;
  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => { setFailed(true); setReady(false); }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const update = () => setEligible(!motion.matches && desktop.matches);
    update();
    motion.addEventListener('change', update);
    desktop.addEventListener('change', update);
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      }, { rootMargin: '200px 0px' });
      observer.observe(holder.current);
    } else setNear(true);
    return () => {
      observer?.disconnect();
      motion.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => { if (!enhance) setReady(false); }, [enhance]);

  return <aside ref={holder} className={`profile-lanyard ${ready && enhance ? 'is-interactive' : ''}`} aria-label="Meet Sandeep Kumai">
    <p className="profile-sr-only" aria-live="polite">{back
      ? 'SK Management: pre-opening consultancy, experienced team recruitment, operations and service standards, training and revenue growth.'
      : 'Sandeep Kumai, Director – Hotel Consultancy & Operations. 18 years of hospitality experience.'}</p>
    <div className="profile-stage">
      <div className="profile-static" aria-hidden="true">
        <span className="profile-strap"><span>SK MANAGEMENT</span></span>
        <span className="profile-clip" />
        <img className="profile-card-art" src={back ? '/lanyard/card-back.webp' : '/lanyard/card-front.webp'} width="1024" height="1440" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="profile-live" aria-hidden="true">
        {enhance && <LanyardBoundary onError={handleError}><Suspense fallback={null}>
          <Lanyard frontImage="/lanyard/card-front.webp" backImage="/lanyard/card-back.webp" strapImage="/lanyard/strap.webp"
            cardColor="#f5f2eb" strapColor="#24352a" metal="gold" finish="matte" cornerRadius={0.22}
            size={0.66} strapLength={0.2} strapWidth={0.6} gravity={0.8} damping={0.85} elasticity={0.25}
            breeze={0} intro={false} backFacing={back} onReady={handleReady} onError={handleError} onFlip={setBack} />
        </Suspense></LanyardBoundary>}
      </div>
    </div>
    <div className="profile-controls">
      <p className={`profile-hint ${ready && enhance ? '' : 'is-hidden'}`} aria-hidden="true">Drag to move · Click to flip</p>
      <button className="profile-flip" type="button" aria-pressed={back} aria-label={back ? 'Show the front of Sandeep Kumai’s card' : 'Show the back of Sandeep Kumai’s card'} onClick={() => setBack(value => !value)}>Flip card <span aria-hidden="true">↻</span></button>
    </div>
  </aside>;
}
