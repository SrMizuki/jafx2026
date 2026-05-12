/* JAFX Motion bundle — Lenis smooth scroll + GSAP ScrollTrigger reveals + Motion One micro-interactions.
   Idempotent: safe to call init() multiple times. */
(function () {
  const w = window;
  if (w.JAFXMotion && w.JAFXMotion.__inited) return;

  const state = { lenis: null, raf: 0, observers: [] };

  function initLenis() {
    if (!w.Lenis) return null;
    const lenis = new w.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    function raf(time) { lenis.raf(time); state.raf = requestAnimationFrame(raf); }
    state.raf = requestAnimationFrame(raf);
    if (w.gsap && w.ScrollTrigger) {
      lenis.on('scroll', w.ScrollTrigger.update);
      w.gsap.ticker.add((time) => lenis.raf(time * 1000));
      w.gsap.ticker.lagSmoothing(0);
    }
    return lenis;
  }

  function initGSAPReveals() {
    if (!w.gsap || !w.ScrollTrigger) return;
    w.gsap.registerPlugin(w.ScrollTrigger);

    // headline + paragraph rises
    w.gsap.utils.toArray('[data-reveal]').forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay || '0');
      w.gsap.fromTo(el,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    });

    // staggered children
    w.gsap.utils.toArray('[data-reveal-stagger]').forEach((el) => {
      const kids = Array.from(el.children);
      w.gsap.fromTo(kids,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    // count-up numbers — element with [data-count-to="36"]
    w.gsap.utils.toArray('[data-count-to]').forEach((el) => {
      const target = parseFloat(el.dataset.countTo);
      const decimals = parseInt(el.dataset.countDecimals || '0', 10);
      const prefix = el.dataset.countPrefix || '';
      const suffix = el.dataset.countSuffix || '';
      const obj = { v: 0 };
      w.gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    // SVG path self-draw — element with [data-draw]
    w.gsap.utils.toArray('[data-draw]').forEach((el) => {
      const len = el.getTotalLength ? el.getTotalLength() : 1000;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      w.gsap.to(el, {
        strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });
  }

  function initMicroInteractions() {
    if (!w.Motion) return;
    const { animate, inView } = w.Motion;

    // (Magnetic buttons + card hover-pop removed — buttons should not move on hover.)
  }

  function applyAll() {
    state.lenis = initLenis();
    initGSAPReveals();
    initMicroInteractions();
  }

  w.JAFXMotion = {
    __inited: false,
    init() {
      if (this.__inited) { this.refresh(); return; }
      this.__inited = true;
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyAll);
      else applyAll();
    },
    refresh() {
      // re-scan DOM after React mounts
      setTimeout(() => {
        if (w.ScrollTrigger) w.ScrollTrigger.refresh();
        initGSAPReveals();
        initMicroInteractions();
      }, 80);
    },
    stop() {
      cancelAnimationFrame(state.raf);
      if (state.lenis) state.lenis.destroy();
    },
  };
})();
