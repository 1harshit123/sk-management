// Keep entrance effects tied to actual, painted viewport geometry.
export function isInEntranceViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = window.innerHeight || document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth || window.innerWidth;
  const inset = Math.min(96, Math.max(40, height * 0.1));
  return !document.hidden && rect.width > 0 && rect.height > 0 &&
    rect.bottom > 0 && rect.top < height - inset && rect.right > 0 && rect.left < width;
}

export function observeViewportEntry(element, onEnter, { waitForImages = false } = {}) {
  let active = true;
  let observer;
  let firstFrame = 0;
  let secondFrame = 0;
  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const pendingImages = new Set(waitForImages ? Array.from(element.querySelectorAll('img')).filter(image => !image.complete) : []);
  const cleanup = () => {
    observer?.disconnect();
    window.cancelAnimationFrame(firstFrame);
    window.cancelAnimationFrame(secondFrame);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', schedule);
    motion?.removeEventListener?.('change', onMotionChange);
    pendingImages.forEach(image => {
      image.removeEventListener('load', onImageReady);
      image.removeEventListener('error', onImageReady);
    });
  };
  const finish = () => {
    if (!active) return;
    active = false;
    cleanup();
    onEnter();
  };
  const schedule = () => {
    if (!active || pendingImages.size || firstFrame || secondFrame) return;
    // Preserve a hidden first paint, including fast loads and restored scroll.
    firstFrame = window.requestAnimationFrame(() => {
      firstFrame = 0;
      secondFrame = window.requestAnimationFrame(() => {
        secondFrame = 0;
        if (active && isInEntranceViewport(element)) finish();
      });
    });
  };
  const onMotionChange = () => { if (motion.matches) finish(); };
  const onImageReady = event => {
    const image = event.currentTarget;
    image.removeEventListener('load', onImageReady);
    image.removeEventListener('error', onImageReady);
    pendingImages.delete(image);
    if (!pendingImages.size) schedule();
  };

  if (motion?.matches) finish();
  else {
    pendingImages.forEach(image => {
      image.addEventListener('load', onImageReady);
      image.addEventListener('error', onImageReady);
    });
    const inset = Math.min(96, Math.max(40, window.innerHeight * 0.1));
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) schedule();
      }, { threshold: 0.01, rootMargin: `0px 0px -${inset}px 0px` });
      observer.observe(element);
    } else {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      schedule();
    }
    document.addEventListener('visibilitychange', schedule);
    motion?.addEventListener?.('change', onMotionChange);
    document.fonts?.ready.then(() => { if (active) schedule(); });
  }

  return () => { active = false; cleanup(); };
}
