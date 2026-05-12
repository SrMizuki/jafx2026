/* global components — expose to window for cross-file use */
const { useState, useEffect, useLayoutEffect, useRef, useMemo } = React;

/* ---------- Top nav ---------- */
function Nav({ current = 'home' }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') || 'dark'
      : 'dark'
  );
  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(t);
  }, []);
  const items = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'ai', label: 'AI Copilot', href: 'ai.html' },
    { id: 'platform', label: 'Trading Platforms', href: 'platform.html' },
    { id: 'pricing', label: 'Pricing', href: 'pricing.html' },
    { id: 'about', label: 'About', href: 'about.html' },
  ];
  const toggleTheme = () => {
    const r = document.documentElement;
    const next = r.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    r.setAttribute('data-theme', next);
    setTheme(next);
    try { localStorage.setItem('jafx-theme', next); } catch(e){}
  };

  const navLinksRef = useRef(null);
  const navHoverRef = useRef(null);
  const navFocusRef = useRef(null);
  const activeNavIdxRef = useRef(0);
  const [navLine, setNavLine] = useState({ left: 0, width: 0, ready: false });
  const [navHoverIdx, setNavHoverIdx] = useState(null);
  const [navFocusIdx, setNavFocusIdx] = useState(null);
  const activeNavIdx = Math.max(0, items.findIndex(x => x.id === current));

  navHoverRef.current = navHoverIdx;
  navFocusRef.current = navFocusIdx;
  activeNavIdxRef.current = activeNavIdx;

  const updateNavLine = (idx) => {
    const wrap = navLinksRef.current;
    if (!wrap) return;
    const el = wrap.querySelector(`[data-nav-idx="${idx}"]`);
    if (!el) return;
    let left;
    let width = el.offsetWidth;
    /* offsetLeft matches the line’s containing block (nav-links padding edge); getBoundingClientRect can drift vs flex + subpixels */
    if (el.offsetParent === wrap) {
      left = el.offsetLeft;
    } else {
      const wr = wrap.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      left = er.left - wr.left;
      width = er.width;
    }
    setNavLine({ left, width, ready: width > 0 });
  };

  const navVisualIdx = navHoverIdx !== null ? navHoverIdx : navFocusIdx !== null ? navFocusIdx : activeNavIdx;
  const navLineSliding = navHoverIdx !== null || navFocusIdx !== null;

  useLayoutEffect(() => {
    updateNavLine(navVisualIdx);
  }, [navVisualIdx, current]);

  useEffect(() => {
    const onResize = () => {
      const h = navHoverRef.current;
      const f = navFocusRef.current;
      const a = activeNavIdxRef.current;
      updateNavLine(h !== null ? h : f !== null ? f : a);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const wrap = navLinksRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    const remeasure = () => {
      const h = navHoverRef.current;
      const f = navFocusRef.current;
      const a = activeNavIdxRef.current;
      updateNavLine(h !== null ? h : f !== null ? f : a);
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(wrap);
    if (document.fonts?.ready) document.fonts.ready.then(remeasure);
    return () => ro.disconnect();
  }, []);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'color-mix(in srgb, var(--bg-0) 85%, transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap nav-inner">
        <a href="index.html" className="nav-logo">
          <Logo />
        </a>
        <div
          ref={navLinksRef}
          className={
            'nav-links' +
            (navLine.ready ? ' nav-links--line-ready' : '') +
            (navLineSliding ? ' nav-links--line-sliding' : '')
          }
          onMouseLeave={() => setNavHoverIdx(null)}
          onFocusOut={(e) => {
            const next = e.relatedTarget;
            if (!next || !navLinksRef.current?.contains(next)) setNavFocusIdx(null);
          }}
        >
          {items.map((i, idx) => (
            <a
              key={i.id}
              href={i.href}
              data-nav-idx={idx}
              className={'nav-links__a' + (current === i.id ? ' nav-links__a--active' : '')}
              onMouseEnter={() => setNavHoverIdx(idx)}
              onFocus={() => setNavFocusIdx(idx)}
            >
              {i.label}
            </a>
          ))}
          <span
            className="nav-links__line"
            aria-hidden="true"
            style={{ transform: `translateX(${navLine.left}px)`, width: navLine.width }}
          />
        </div>
        <div className="nav-ctas">
          <button
            type="button"
            onClick={toggleTheme}
            className={'nav-theme nav-theme--' + theme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="nav-theme__stack" aria-hidden="true">
              <svg className="nav-theme__icon nav-theme__icon--moon" width="24" height="24" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg className="nav-theme__icon nav-theme__icon--sun" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2.5v2.5M12 19v2.5M4.5 12H2.5M21.5 12H19.5M5.64 5.64L7.05 7.05M16.95 16.95l1.41 1.41M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41" />
              </svg>
            </span>
          </button>
          <a href="trader.html" className="btn btn-ghost nav-login" style={{ padding: '8px 14px' }}>Log in</a>
          <a href="trader.html" className="btn btn-primary" style={{ padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor', boxShadow: '0 0 8px currentColor' }}/>
            <span className="nav-cta-label">Launch terminal</span>
            <span className="nav-cta-label-short">Launch</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-drawer"
            className={'nav-burger' + (open ? ' nav-burger--open' : '')}
          >
            <span className="nav-burger__bars" aria-hidden="true">
              <span className="nav-burger__line nav-burger__line--top" />
              <span className="nav-burger__line nav-burger__line--mid" />
              <span className="nav-burger__line nav-burger__line--btm" />
            </span>
          </button>
        </div>
      </div>
      <div
        id="nav-drawer"
        className={'nav-drawer' + (open ? ' nav-drawer--open' : '')}
        aria-hidden={!open}
      >
        {items.map(i => (
          <a key={i.id} href={i.href} style={{
            display: 'block', padding: '14px 4px', fontSize: 15,
            color: current === i.id ? 'var(--accent)' : 'var(--text-0)',
            borderBottom: '1px solid var(--line)',
          }}>{i.label}</a>
        ))}
        <a href="trader.html" style={{ display: 'block', padding: '14px 4px', fontSize: 15, color: 'var(--text-1)' }}>Log in</a>
      </div>
    </nav>
  );
}

function Logo({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="assets/jafx-logo.svg"
        alt="JAFX"
        style={{ height: size, width: 'auto', display: 'block' }}
      />
    </div>
  );
}

/* ---------- Live ticker ---------- */
function LiveTicker() {
  const pairs = [
    ['EUR/USD', 1.0847, 0.12], ['GBP/USD', 1.2634, -0.08], ['USD/JPY', 149.82, 0.24],
    ['AUD/USD', 0.6598, -0.18], ['USD/CAD', 1.3584, 0.05], ['NZD/USD', 0.6124, -0.22],
    ['EUR/GBP', 0.8584, 0.11], ['XAU/USD', 2348.12, 0.67], ['BTC/USD', 67842, 1.24],
    ['USD/CHF', 0.8743, -0.04], ['GBP/JPY', 189.32, 0.31], ['ETH/USD', 3612, -0.88],
  ];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);
  const jitter = (base, i) => base * (1 + (Math.sin((tick + i) * 0.7) * 0.0004));
  const items = [...pairs, ...pairs];
  return (
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 48, padding: '10px 0', animation: 'ticker-scroll 60s linear infinite', whiteSpace: 'nowrap' }}>
        {items.map((p, i) => {
          const up = p[2] >= 0;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
              <span className="mono" style={{ color: 'var(--text-1)', letterSpacing: '0.04em' }}>{p[0]}</span>
              <span className="mono" style={{ color: 'var(--text-0)' }}>{jitter(p[1], i).toFixed(p[1] > 1000 ? 2 : 4)}</span>
              <span className="mono" style={{ color: up ? 'var(--accent)' : 'var(--red)', fontSize: 11 }}>
                {up ? '▲' : '▼'} {Math.abs(p[2]).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Sparkline ---------- */
function Sparkline({ data, color = 'var(--accent)', w = 120, h = 32, fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {fill && <polygon points={area} fill={color} opacity="0.12" />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- Candles ---------- */
function Candles({ data, w = 480, h = 180 }) {
  const vals = data.flatMap(d => [d.h, d.l]);
  const max = Math.max(...vals), min = Math.min(...vals);
  const range = max - min || 1;
  const cw = w / data.length;
  const toY = v => h - ((v - min) / range) * (h - 20) - 10;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {[0,1,2,3].map(i => (
        <line key={i} x1="0" x2={w} y1={(h/3)*i + 10} y2={(h/3)*i + 10} stroke="var(--line)" strokeDasharray="2,4" />
      ))}
      {data.map((d, i) => {
        const up = d.c >= d.o;
        const x = i * cw + cw/2;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={toY(d.h)} y2={toY(d.l)} stroke={up ? 'var(--accent)' : 'var(--red)'} strokeWidth="1" />
            <rect x={x - cw*0.3} y={Math.min(toY(d.o), toY(d.c))} width={cw*0.6} height={Math.max(2, Math.abs(toY(d.o) - toY(d.c)))} fill={up ? 'var(--accent)' : 'var(--red)'} />
          </g>
        );
      })}
    </svg>
  );
}

/* generate deterministic candle data */
function genCandles(n = 40, seed = 1, base = 1.08) {
  const d = []; let v = base; let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < n; i++) {
    const o = v;
    const change = (rnd() - 0.48) * 0.004;
    v = v + change;
    const h = Math.max(o, v) + rnd() * 0.002;
    const l = Math.min(o, v) - rnd() * 0.002;
    d.push({ o, c: v, h, l });
  }
  return d;
}

function genSpark(n = 24, seed = 2, base = 100) {
  const d = []; let v = base; let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < n; i++) { v += (rnd() - 0.45) * 3; d.push(v); }
  return d;
}

/* ---------- Footer ---------- */
function Footer() {
  const cols = [
    { h: 'Trading Platforms', items: [
      ['JAFX Web Trader', 'platform.html#web'],
      ['MT5 for Windows', 'platform.html#mt5-win'],
      ['MT5 for macOS', 'platform.html#mt5-mac'],
      ['MT5 for iOS', 'platform.html#mt5-ios'],
      ['MT5 for Android', 'platform.html#mt5-and'],
    ]},
    { h: 'AI Tools', items: [
      ['Copilot Chat', 'ai.html#tool-01'],
      ['Canvas', 'ai.html#tool-02'],
      ['AI Order Ticket', 'ai.html#tool-03'],
      ['Position Coach', 'ai.html#tool-04'],
      ['Proactive Nudges', 'ai.html#tool-05'],
      ['Thread Memory', 'ai.html#tool-06'],
    ]},
    { h: 'Markets', items: [
      ['Forex (70+)', 'markets.html#forex'],
      ['Indices', 'markets.html#indices'],
      ['Commodities', 'markets.html#commodities'],
      ['Crypto CFDs', 'markets.html#crypto'],
      ['Stocks', 'markets.html#stocks'],
    ]},
    { h: 'Company', items: [
      ['About', 'about.html'],
      ['Regulation', 'about.html#regulation'],
      ['Pricing', 'pricing.html'],
      ['Contact', 'contact.html'],
    ]},
  ];
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-1)' }}>
      <div className="wrap" style={{ padding: '64px 32px 24px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: 48, marginBottom: 64 }}>
          <div>
            <Logo size={26} />
            <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6, marginTop: 18, maxWidth: 260 }}>
              An AI-native forex broker for retail traders. Regulated by the FSCA (South Africa), FSP No. 51243.
            </p>
            <div className="mono" style={{ marginTop: 20, fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              © 2026 JAFX CAPITAL (PTY) LTD
            </div>
          </div>
          {cols.map(c => (
            <div key={c.h}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{c.h}</div>
              {c.items.map(([label, href]) => (
                <a key={label} href={href} className="footer-link">{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', color: 'var(--text-3)', fontSize: 11 }} className="mono">
          <span>RISK WARNING — CFDs ARE COMPLEX AND COME WITH HIGH RISK OF RAPID LOSS DUE TO LEVERAGE. 74% OF RETAIL ACCOUNTS LOSE MONEY TRADING CFDS WITH THIS PROVIDER.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Section wrapper ---------- */
function Section({ eyebrow, title, intro, children, dense = false, zone = null }) {
  const zoneClass = zone ? `zone zone-${zone}` : '';
  const dotColor = zone ? `var(--zone-${zone})` : 'var(--accent)';
  return (
    <section className={zoneClass} style={{ padding: dense ? 'clamp(40px, 6vw, 64px) 0' : 'clamp(64px, 9vw, 112px) 0', borderTop: '1px solid var(--line)', position: 'relative' }}>
      <div className="wrap">
        {(eyebrow || title) && (
          <div className="grid-2 section-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, marginBottom: 48, alignItems: 'end' }}>
            <div>
              {eyebrow && <div className="eyebrow" style={{ marginBottom: 20 }}>
                <span style={{ color: dotColor }}>●</span>&nbsp;&nbsp;{eyebrow}
              </div>}
              {title && <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: 0 }}>{title}</h2>}
            </div>
            {intro && <p style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, margin: 0, maxWidth: 540 }}>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Logo, LiveTicker, Sparkline, Candles, genCandles, genSpark, Footer, Section });
