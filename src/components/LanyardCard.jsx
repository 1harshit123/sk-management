import { Component, Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './LanyardCard.css';
import { observeViewportEntry } from '../animation/viewportEntry';

let lanyardModule;
const loadLanyard = () => lanyardModule ||= import('./Lanyard');
const Lanyard = lazy(loadLanyard);

class LanyardBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function LanyardCard() {
  const holder = useRef(null);
  const stage = useRef(null);
  const [near, setNear] = useState(false);
  const [entered, setEntered] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [touchDevice, setTouchDevice] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [back, setBack] = useState(false);
  const [viewport, setViewport] = useState({ left: 0, width: undefined, anchor: 0.5 });
  const enhance = entered && eligible && !failed;
  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => { setFailed(true); setReady(false); }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const card = stage.current.getBoundingClientRect();
      const section = holder.current.closest('section')?.getBoundingClientRect();
      if (!section?.width || !card.width) return;
      const next = { left: section.left - card.left, width: section.width,
        anchor: (card.left + card.width / 2 - section.left) / section.width };
      setViewport(previous => previous.left === next.left && previous.width === next.width && previous.anchor === next.anchor ? previous : next);
    };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(stage.current);
    if (holder.current.closest('section')) observer?.observe(holder.current.closest('section'));
    window.addEventListener('resize', measure, { passive: true });
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(pointer: coarse)');
    const update = () => { setEligible(!motion.matches); setTouchDevice(pointer.matches); };
    update();
    motion.addEventListener('change', update);
    pointer.addEventListener('change', update);
    const stopEntrance = observeViewportEntry(holder.current, () => setEntered(true));
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
      stopEntrance();
      motion.removeEventListener('change', update);
      pointer.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => { if (near && eligible && !failed) loadLanyard().catch(handleError); }, [near, eligible, failed, handleError]);

  useEffect(() => { if (!enhance) setReady(false); }, [enhance]);

  return <aside ref={holder} className={`profile-lanyard ${entered ? 'has-entered' : ''} ${ready && enhance ? 'is-interactive' : ''}`} aria-label="Meet Sandeep Kumai">
    <p className="profile-sr-only" aria-live="polite">{back
      ? 'SK Management: pre-opening consultancy, experienced team recruitment, operations and service standards, training and revenue growth.'
      : 'Sandeep Kumai, Director – Hotel Consultancy & Operations. 18 years of hospitality experience.'}</p>
    <div ref={stage} className="profile-stage">
      <div className={`profile-static ${entered && (!eligible || failed) ? 'is-visible' : ''}`} aria-hidden="true">
        <span className="profile-strap"><span>SK MANAGEMENT</span></span>
        <span className="profile-clip" />
        <img className="profile-card-art" src={back ? '/lanyard/card-back.webp' : '/lanyard/card-front.webp'} width="1024" height="1440" alt="" loading="lazy" decoding="async" />
      </div>
      <div className={`profile-live ${ready && enhance ? 'is-ready' : ''}`} style={{ left: viewport.left, width: viewport.width }} aria-hidden="true">
        {enhance && <LanyardBoundary onError={handleError}><Suspense fallback={null}>
          <Lanyard frontImage="/lanyard/card-front.webp" backImage="/lanyard/card-back.webp" strapImage="/lanyard/strap.webp"
            cardColor="#f5f2eb" strapColor="#24352a" metal="gold" finish="matte" cornerRadius={0.22}
            size={0.66} anchor={viewport.anchor} strapLength={0.2} strapWidth={0.6} gravity={1} damping={0.6} elasticity={0.45}
            breeze={0} intro backFacing={back} onReady={handleReady} onError={handleError} onFlip={setBack} />
        </Suspense></LanyardBoundary>}
      </div>
    </div>
    <div className="profile-controls">
      <p className={`profile-hint ${ready && enhance ? '' : 'is-hidden'}`} aria-hidden="true">{touchDevice ? 'Pull to move · Tap to flip' : 'Drag to move · Click to flip'}</p>
      <button className="profile-flip" type="button" aria-pressed={back} aria-label={back ? 'Show the front of Sandeep Kumai’s card' : 'Show the back of Sandeep Kumai’s card'} onClick={() => setBack(value => !value)}>Flip card <span aria-hidden="true">↻</span></button>
    </div>
  </aside>;
}
