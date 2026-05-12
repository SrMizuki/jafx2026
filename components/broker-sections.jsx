/* Homepage broker sections — what a forex broker actually needs.
   Sections: TrustStripFull · MarketsTabbed · SpreadsExecution · PlatformsStrip · WhyJafx
*/

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB, useMemo: useMemoB } = React;

/* ============================================================
   1. TRUST STRIP — sits right under hero, small horizontal band
   ============================================================ */
function TrustStripFull() {
  const items = [
    { k: 'FSCA', v: 'Regulated · FSP 51243', icon: 'assets/i-regulated.svg' },
    { k: 'FUNDS', v: 'Segregated · Tier-1 banks', icon: 'assets/i-funds.svg' },
    { k: 'CLIENTS', v: '100,000+ traders', icon: 'assets/i-users.svg' },
    { k: 'PROTECTION', v: 'Negative balance · 100%', icon: 'assets/i-protection.svg' },
    { k: 'SINCE', v: '2015 · 10+ years live', icon: 'assets/i-since-2015.svg' },
  ];
  return (
    <section className="trust-strip" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)', padding: '20px 0' }}>
      <div className="wrap trust-strip__grid" data-reveal-stagger>
        {items.map((it) => (
          <div key={it.k} className="trust-strip__cell">
            <img className="trust-strip__icon" src={it.icon} alt="" width={36} height={36} loading="lazy" decoding="async" />
            <div className="trust-strip__body">
              <div className="mono trust-strip__label">{it.k}</div>
              <div className="trust-strip__value">{it.v}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   2. MARKETS — tabbed grid with live prices
   ============================================================ */
const MARKETS_DATA = {
  'FX Majors': [
    ['EUR/USD', 1.08472, 0.14, 0.0],
    ['GBP/USD', 1.26340, -0.08, 0.1],
    ['USD/JPY', 149.8594, 0.24, 0.1],
    ['USD/CHF', 0.87410, -0.04, 0.2],
    ['AUD/USD', 0.65980, -0.18, 0.2],
    ['USD/CAD', 1.35890, 0.05, 0.2],
    ['NZD/USD', 0.61250, -0.22, 0.3],
    ['EUR/GBP', 0.85870, 0.11, 0.3],
  ],
  'FX Minors': [
    ['EUR/JPY', 162.450, 0.18, 0.4],
    ['GBP/JPY', 189.320, -0.11, 0.5],
    ['EUR/AUD', 1.64280, 0.32, 0.6],
    ['GBP/AUD', 1.91470, 0.20, 0.7],
    ['AUD/JPY', 98.840, 0.06, 0.5],
    ['CAD/JPY', 110.290, 0.19, 0.6],
    ['EUR/CHF', 0.94720, -0.03, 0.5],
    ['CHF/JPY', 171.420, 0.27, 0.7],
  ],
  'FX Exotics': [
    ['USD/MXN', 17.0420, 0.42, 1.5],
    ['USD/ZAR', 18.2640, -0.31, 2.5],
    ['USD/TRY', 32.4120, 0.88, 4.0],
    ['EUR/TRY', 35.1480, 0.71, 5.5],
    ['USD/SGD', 1.34280, -0.04, 0.8],
    ['USD/HKD', 7.81930, 0.01, 1.2],
    ['USD/PLN', 3.96420, 0.18, 1.8],
    ['USD/SEK', 10.4720, -0.22, 2.0],
  ],
  'Indices': [
    ['US500', 5421.30, 0.42, 0.4],
    ['US100', 19284.5, 0.68, 0.8],
    ['US30', 39842.7, 0.21, 1.2],
    ['UK100', 8194.20, -0.14, 0.7],
    ['GER40', 18642.8, 0.31, 0.9],
    ['FRA40', 7842.50, 0.18, 1.0],
    ['JP225', 38210.3, -0.42, 4.0],
    ['HK50', 17820.4, 0.84, 5.0],
  ],
  'Metals': [
    ['XAU/USD', 2348.12, 0.67, 0.18],
    ['XAG/USD', 28.420, 1.24, 0.020],
    ['XPT/USD', 942.10, -0.31, 0.40],
    ['XPD/USD', 1024.60, 0.84, 0.60],
  ],
  'Energies': [
    ['UKOIL', 84.42, 0.62, 0.03],
    ['USOIL', 79.18, 0.71, 0.03],
    ['NGAS', 2.4120, -1.42, 0.004],
  ],
  'Crypto': [
    ['BTC/USD', 67842.30, 1.24, 12.0],
    ['ETH/USD', 3724.50, 0.84, 1.2],
    ['SOL/USD', 184.20, 2.31, 0.4],
    ['XRP/USD', 0.5240, -0.42, 0.0008],
    ['DOGE/USD', 0.1620, 1.84, 0.0002],
    ['ADA/USD', 0.4820, -0.21, 0.0006],
    ['LINK/USD', 18.420, 0.62, 0.04],
    ['AVAX/USD', 38.420, 1.42, 0.08],
  ],
};

function MarketsTabbed() {
  const tabs = Object.keys(MARKETS_DATA);
  const [tab, setTab] = useStateB(tabs[0]);
  const [tick, setTick] = useStateB(0);
  useEffectB(() => {
    const id = setInterval(() => setTick(t => t + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const data = MARKETS_DATA[tab];
  return (
    <section style={{ padding: 'clamp(80px, 10vw, 140px) 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
          <div>
            <div className="mono" data-reveal style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 16 }}>
              <span className="live-dot"/>&nbsp;&nbsp;MARKETS
            </div>
            <h2 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', margin: 0, maxWidth: 800 }}>
              Trade <span data-count-to="2400" data-count-suffix="+" style={{ color: 'var(--accent)', display: 'inline-block', minWidth: '5ch', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>0+</span> instruments<br/>across every asset class.
            </h2>
            <p data-reveal data-reveal-delay="0.2" style={{ color: 'var(--text-1)', fontSize: 17, marginTop: 24, maxWidth: 580, lineHeight: 1.55 }}>
              FX, indices, metals, energies, crypto. Same terminal, same AI, same raw spreads. One account, one login.
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 0, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className="mono" style={{
              padding: '14px 22px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t ? 'var(--text-0)' : 'var(--text-2)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s ease',
            }}>
              {t.toUpperCase()}
              <span style={{ marginLeft: 8, color: 'var(--text-3)', fontSize: 9 }}>{MARKETS_DATA[t].length}</span>
            </button>
          ))}
        </div>
        {/* Table */}
        <div style={{ background: 'var(--bg-1)', borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)' }}>
          <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr', padding: '12px 24px', fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-3)', borderBottom: '1px solid var(--line)' }}>
            <span>SYMBOL</span>
            <span style={{ textAlign: 'right' }}>BID</span>
            <span style={{ textAlign: 'right' }}>ASK</span>
            <span style={{ textAlign: 'right' }}>SPREAD</span>
            <span style={{ textAlign: 'right' }}>24H</span>
          </div>
          {data.map((row, i) => {
            const [sym, base, chg, spread] = row;
            const wobble = Math.sin(tick * 0.7 + i * 1.3) * (base > 1000 ? 0.5 : base > 10 ? 0.005 : 0.00005);
            const live = base + wobble;
            const bid = live - spread / 2;
            const ask = live + spread / 2;
            const dec = base > 1000 ? 2 : base > 10 ? 3 : base > 1 ? 5 : 5;
            const up = chg >= 0;
            const flashKey = Math.floor((tick + i * 7) % 6);
            const flash = flashKey < 1;
            return (
              <div key={sym} className="mono" style={{
                display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr',
                padding: '12px 24px', fontSize: 12,
                borderBottom: i < data.length - 1 ? '1px solid var(--line)' : 'none',
                background: flash ? 'rgba(0,229,153,0.03)' : 'transparent',
                transition: 'background 0.4s ease',
              }}>
                <span style={{ color: 'var(--text-0)', fontWeight: 500 }}>{sym}</span>
                <span style={{ textAlign: 'right', color: 'var(--red)' }}>{bid.toFixed(dec)}</span>
                <span style={{ textAlign: 'right', color: 'var(--accent)' }}>{ask.toFixed(dec)}</span>
                <span style={{ textAlign: 'right', color: 'var(--text-2)' }}>{spread.toFixed(dec >= 4 ? 1 : 2)}</span>
                <span style={{ textAlign: 'right', color: up ? 'var(--accent)' : 'var(--red)' }}>
                  {up ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}%
                </span>
              </div>
            );
          })}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              <span className="live-dot"/> &nbsp;LIVE PRICES · UPDATED EVERY 1.5S
            </span>
            <a href="trader.html" className="mono" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.1em' }}>OPEN TERMINAL →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. SPREADS & EXECUTION — three big numbers
   ============================================================ */
function SpreadsExecution() {
  const stats = [
    { v: '0.0', suf: '', label: 'Pips · raw spreads from', sub: 'Direct bank liquidity' },
    { v: '14', suf: 'ms', label: 'Median execution', sub: 'Equinix LD4 · NY4' },
    { v: '99.99', suf: '%', label: 'Fill rate', sub: 'No requotes · ever' },
  ];
  return (
    <section className="spreads-exec-section" style={{ padding: 'clamp(80px, 10vw, 140px) 0', borderBottom: '1px solid var(--line)', position: 'relative' }}>
      <div className="grid-bg spreads-exec-section__bg" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}/>
      <div className="wrap spreads-exec-section__inner" style={{ position: 'relative' }}>
        <div className="mono" data-reveal style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 16 }}>
          <span className="live-dot"/>&nbsp;&nbsp;EXECUTION
        </div>
        <h2 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', margin: 0, maxWidth: 900, marginBottom: 24 }}>
          Built where the<br/>liquidity actually <span style={{ color: 'var(--accent)' }}>lives</span>.
        </h2>
        <p data-reveal data-reveal-delay="0.2" style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, maxWidth: 620, marginBottom: 80 }}>
          Co-located in Equinix LD4 and NY4. Direct connections to 14 Tier-1 liquidity providers. No B-book. No dealing desk.
        </p>
        <div className="spreads-stat-grid" data-reveal-stagger style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {stats.map((s) => (
            <div key={s.label} className="spreads-stat-cell" style={{ padding: 'clamp(40px, 6vw, 64px) clamp(20px, 3vw, 40px)' }}>
              <div className="display spreads-stat-value" style={{ fontSize: 'clamp(56px, 9vw, 120px)', color: 'var(--text-0)', lineHeight: 1, letterSpacing: '-0.04em' }}>
                <span
                  data-count-to={s.v}
                  data-count-decimals={s.v.includes('.') ? 2 : 0}
                  data-count-suffix={s.suf}
                  className="spreads-stat-num"
                >
                  0{s.suf}
                </span>
              </div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)', marginTop: 24, textTransform: 'uppercase' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
        <div className="mono" data-reveal style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginTop: 24, textAlign: 'right' }}>
          STATS VERIFIED MONTHLY BY THIRD-PARTY EXECUTION AUDIT · LAST UPDATED Q1 2026
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4. PLATFORMS STRIP — Web · Mobile · MT5 · API
   ============================================================ */
function PlatformsStrip() {
  const platforms = [
    {
      k: 'WEB TERMINAL',
      t: 'JAFX Terminal',
      d: 'AI-native browser terminal. Multi-chart workspaces, voice orders, Copilot built-in.',
      tag: 'Most popular',
      cta: 'Launch →',
      href: 'trader.html',
      visual: <PlatformVisualWeb/>,
    },
    {
      k: 'MOBILE',
      t: 'iOS & Android',
      d: 'Trade, scan, and journal on the move. Push alerts when the AI spots your saved setups.',
      tag: '4.8 ★',
      cta: 'Get the app →',
      href: '#',
      visual: <PlatformVisualMobile/>,
    },
    {
      k: 'MT5',
      t: 'MetaTrader 5',
      d: 'Bring your existing EAs. Same liquidity, same spreads, JAFX risk overlay attached.',
      tag: 'For migrators',
      cta: 'Download MT5 →',
      href: '#',
      visual: <PlatformVisualMT5/>,
    },
    {
      k: 'API',
      t: 'FIX & REST',
      d: 'For systematic traders and prop desks. Sub-millisecond order entry, full history.',
      tag: 'For pros',
      cta: 'Get API keys →',
      href: '#',
      visual: <PlatformVisualAPI/>,
    },
  ];
  return (
    <section style={{ padding: 'clamp(80px, 10vw, 140px) 0', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div style={{ marginBottom: 64 }}>
          <div className="mono" data-reveal style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 16 }}>
            ◇&nbsp;&nbsp;PLATFORMS
          </div>
          <h2 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', margin: 0, maxWidth: 900 }}>
            Four ways to trade.<br/>One <span style={{ color: 'var(--accent)' }}>account</span>.
          </h2>
        </div>
        <div className="grid-4" data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {platforms.map(p => (
            <a key={p.k} href={p.href} style={{
              background: 'var(--bg-1)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              padding: 0,
              display: 'flex', flexDirection: 'column',
              textDecoration: 'none',
              position: 'relative',
              transition: 'border-color .22s ease, transform .22s ease, box-shadow .22s ease',
              overflow: 'hidden',
            }} onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.015)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 45%, var(--line))';
              e.currentTarget.style.boxShadow = '0 14px 34px rgba(0,0,0,0.26), inset 0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent)';
              const visual = e.currentTarget.querySelector('.platform-visual');
              if (visual) visual.style.transform = 'scale(1.04)';
              const svg = e.currentTarget.querySelector('.platform-visual svg');
              if (svg) svg.style.transform = 'scale(1.03)';
              const glow = e.currentTarget.querySelector('.platform-glow');
              if (glow) {
                glow.style.opacity = '0.5';
                glow.style.filter = 'blur(92px)';
              }
              const shine = e.currentTarget.querySelector('.platform-shine');
              if (shine) {
                shine.style.opacity = '0.34';
                shine.style.transform = 'translateX(320%) skewX(-18deg)';
              }
            }} onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.boxShadow = 'none';
              const visual = e.currentTarget.querySelector('.platform-visual');
              if (visual) visual.style.transform = 'scale(1)';
              const svg = e.currentTarget.querySelector('.platform-visual svg');
              if (svg) svg.style.transform = 'scale(1)';
              const glow = e.currentTarget.querySelector('.platform-glow');
              if (glow) {
                glow.style.opacity = '0.05';
                glow.style.filter = 'blur(28px)';
              }
              const shine = e.currentTarget.querySelector('.platform-shine');
              if (shine) {
                shine.style.opacity = '0';
                shine.style.transform = 'translateX(-160%) skewX(-18deg)';
              }
            }}>
              <div
                className="platform-glow"
                style={{
                  position: 'absolute',
                  width: 180,
                  height: 180,
                  right: -90,
                  bottom: -90,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  opacity: 0.05,
                  filter: 'blur(28px)',
                  transition: 'opacity .28s ease, filter .32s ease',
                  pointerEvents: 'none',
                }}
              />
              <div
                className="platform-shine"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '52%',
                  height: '100%',
                  opacity: 0,
                  transform: 'translateX(-160%) skewX(-18deg)',
                  background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.015) 32%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.015) 68%, transparent 100%)',
                  transition: 'transform .82s cubic-bezier(.22,.61,.36,1), opacity .24s ease',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ height: 160, position: 'relative', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="platform-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', transition: 'transform .22s ease' }}>
                {p.visual}
                </div>
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.16em' }}>{p.k}</span>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', padding: '3px 7px', border: '1px solid var(--line)', borderRadius: 3 }}>{p.tag}</span>
                </div>
                <div style={{ fontSize: 22, color: 'var(--text-0)', fontFamily: 'var(--font-display)', fontWeight: 500, marginBottom: 8 }}>{p.t}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, flex: 1, margin: 0 }}>{p.d}</p>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginTop: 16 }}>{p.cta}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* tiny visuals for each platform card */
function PlatformVisualWeb() {
  return (
    <img
      src="assets/terminal.svg"
      alt="Terminal preview"
      width="100%"
      height="100%"
      style={{ display: 'block', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
    />
  );
}

function PlatformVisualMobile() {
  return (
    <img
      src="assets/apple-android.svg"
      alt="Mobile trading app preview"
      width="100%"
      height="100%"
      style={{ display: 'block', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
    />
  );
}

function PlatformVisualMT5() {
  return (
    <img
      src="assets/metatrader.svg"
      alt="MetaTrader preview"
      width="100%"
      height="100%"
      style={{ display: 'block', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
    />
  );
}

function PlatformVisualAPI() {
  return (
    <img
      src="assets/fix-rest.svg"
      alt="FIX and REST preview"
      width="100%"
      height="100%"
      style={{ display: 'block', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
    />
  );
}

/* ============================================================
   5. WHY JAFX — 4 reason cards
   ============================================================ */
function WhyJafx({ zone = null }) {
  const zoneClass = zone ? `zone zone-${zone}` : '';
  const dotColor = zone ? `var(--zone-${zone})` : 'var(--accent)';
  const reasons = [
    {
      k: '01', t: 'Regulated by FSCA',
      d: 'FSP 51243. Funds segregated daily at Tier-1 banks. Audited quarterly.',
      icon: <ReasonShield/>,
    },
    {
      k: '02', t: 'True ECN',
      d: 'No dealing desk. No requotes. Your order hits the bank that quoted it. Period.',
      icon: <ReasonECN/>,
    },
    {
      k: '03', t: 'Same-day funding',
      d: '12 deposit & withdraw rails. Instant card. Crypto rails. Same-day SEPA & ACH.',
      icon: <ReasonRails/>,
    },
    {
      k: '04', t: 'AI-native, by default',
      d: 'Every account gets the Copilot, the journal, and the proactive risk warnings. Always free, always on.',
      icon: <ReasonAI/>,
      cta: { label: 'See the AI →', href: 'ai.html' },
    },
  ];
  return (
    <section className={zoneClass} style={{ padding: 'clamp(80px, 10vw, 140px) 0', borderBottom: '1px solid var(--line)', position: 'relative' }}>
      <div className="wrap">
        <div style={{ marginBottom: 56 }}>
          <div className="mono" data-reveal style={{ fontSize: 11, color: dotColor, letterSpacing: '0.2em', marginBottom: 16 }}>
            ◆&nbsp;&nbsp;WHY JAFX
          </div>
          <h2 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', margin: 0, maxWidth: 900 }}>
            The basics, raised<br/>to a <span style={{ color: 'var(--accent)' }}>higher floor</span>.
          </h2>
        </div>
        <div className="grid-4" data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {reasons.map(r => (
            <div key={r.k} style={{
              background: 'var(--bg-1)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              padding: 28,
              display: 'flex', flexDirection: 'column',
              minHeight: 320,
              position: 'relative',
              overflow: 'hidden',
              transform: 'scale(1)',
              transition: 'transform .24s ease, box-shadow .26s ease, border-color .22s ease',
            }} onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 42%, var(--line))';
              e.currentTarget.style.boxShadow = '0 18px 42px -18px rgba(0,230,160,0.35), 0 22px 46px -28px rgba(0,0,0,0.7), inset 0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent)';
              const rail = e.currentTarget.querySelector('.reason-rail');
              if (rail) rail.style.transform = 'scaleX(1)';
              const pulse = e.currentTarget.querySelector('.reason-pulse');
              if (pulse) {
                pulse.style.opacity = '0.4';
                pulse.style.transform = 'scale(1.18)';
              }
              const title = e.currentTarget.querySelector('.reason-title');
              if (title) {
                title.style.color = 'var(--accent)';
                title.style.letterSpacing = '0.01em';
              }
              const ctaLine = e.currentTarget.querySelector('.reason-cta-line');
              if (ctaLine) ctaLine.style.transform = 'scaleX(1)';
            }} onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.boxShadow = 'none';
              const rail = e.currentTarget.querySelector('.reason-rail');
              if (rail) rail.style.transform = 'scaleX(0.2)';
              const pulse = e.currentTarget.querySelector('.reason-pulse');
              if (pulse) {
                pulse.style.opacity = '0';
                pulse.style.transform = 'scale(1)';
              }
              const title = e.currentTarget.querySelector('.reason-title');
              if (title) {
                title.style.color = 'var(--text-0)';
                title.style.letterSpacing = '0';
              }
              const ctaLine = e.currentTarget.querySelector('.reason-cta-line');
              if (ctaLine) ctaLine.style.transform = 'scaleX(0)';
            }}>
              <div className="reason-rail" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2, background: 'var(--accent)', transformOrigin: 'left center', transform: 'scaleX(0.2)', transition: 'transform .3s ease' }}/>
              <div style={{ height: 56, marginBottom: 24, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span className="reason-pulse" style={{ position: 'absolute', width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', opacity: 0, filter: 'blur(16px)', transition: 'opacity .25s ease, transform .3s ease', transform: 'scale(1)' }}/>
                <span style={{ position: 'relative' }}>{r.icon}</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.16em', marginBottom: 12 }}>{r.k}</div>
              <div className="reason-title" style={{ fontSize: 22, color: 'var(--text-0)', fontFamily: 'var(--font-display)', fontWeight: 500, marginBottom: 12, transition: 'color .22s ease, letter-spacing .22s ease' }}>{r.t}</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, flex: 1, margin: 0 }}>{r.d}</p>
              {r.cta && (
                <a href={r.cta.href} className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginTop: 16, textDecoration: 'none', position: 'relative', width: 'fit-content' }}>
                  {r.cta.label}
                  <span className="reason-cta-line" style={{ position: 'absolute', left: 0, bottom: -3, width: '100%', height: 1, background: 'var(--accent)', transformOrigin: 'left center', transform: 'scaleX(0)', transition: 'transform .25s ease' }}/>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonShield() {
  return (
    <img
      src="assets/i-tick-sheild.svg"
      alt="Shield check icon"
      width="56"
      height="56"
      style={{ display: 'block' }}
    />
  );
}
function ReasonECN() {
  return (
    <img
      src="assets/i-hub.svg"
      alt="Hub icon"
      width="56"
      height="56"
      style={{ display: 'block' }}
    />
  );
}
function ReasonRails() {
  return (
    <img
      src="assets/i-funding.svg"
      alt="Funding icon"
      width="56"
      height="56"
      style={{ display: 'block' }}
    />
  );
}
function ReasonAI() {
  return (
    <img
      src="assets/i-ai.svg"
      alt="AI icon"
      width="56"
      height="56"
      style={{ display: 'block' }}
    />
  );
}

Object.assign(window, { TrustStripFull, MarketsTabbed, SpreadsExecution, PlatformsStrip, WhyJafx });
