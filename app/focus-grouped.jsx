/* ================================================================
   Focus list — Heatmap + Asset-Class grouping
   4 variations on how to combine V1 heatmap rows with class splits
   ================================================================ */

/* Extended pair list with explicit class field — each class has 3-6 instruments */
const FG_PAIRS = [
  // FX (6)
  { sym:'EUR/USD', cls:'FX',        price:1.08472,  chg:+0.24, bias:'BULL',    conf:78, seed:7  },
  { sym:'GBP/USD', cls:'FX',        price:1.27184,  chg:+0.18, bias:'BULL',    conf:62, seed:101},
  { sym:'USD/JPY', cls:'FX',        price:154.180,  chg:-0.12, bias:'BEAR',    conf:71, seed:19 },
  { sym:'AUD/USD', cls:'FX',        price:0.65840,  chg:+0.15, bias:'BULL',    conf:45, seed:23 },
  { sym:'USD/CAD', cls:'FX',        price:1.36420,  chg:-0.21, bias:'BEAR',    conf:54, seed:103},
  { sym:'EUR/GBP', cls:'FX',        price:0.85410,  chg:-0.08, bias:'BEAR',    conf:48, seed:41 },
  { sym:'GBP/JPY', cls:'FX',        price:198.470,  chg:+0.31, bias:'NEUTRAL', conf:52, seed:13 },
  // Metals (3)
  { sym:'XAU/USD', cls:'METALS',    price:2348.12,  chg:+0.67, bias:'BULL',    conf:65, seed:11 },
  { sym:'XAG/USD', cls:'METALS',    price:27.84,    chg:+0.92, bias:'BULL',    conf:58, seed:107},
  { sym:'XPT/USD', cls:'METALS',    price:912.40,   chg:-0.34, bias:'NEUTRAL', conf:35, seed:109},
  // Indices (4)
  { sym:'NAS100',  cls:'INDICES',   price:18241.50, chg:+0.42, bias:'BULL',    conf:58, seed:29 },
  { sym:'SPX500',  cls:'INDICES',   price:5247.20,  chg:+0.18, bias:'NEUTRAL', conf:38, seed:37 },
  { sym:'US30',    cls:'INDICES',   price:39102.0,  chg:+0.24, bias:'BULL',    conf:51, seed:113},
  { sym:'GER40',   cls:'INDICES',   price:18347.5,  chg:-0.18, bias:'BEAR',    conf:42, seed:127},
  // Commodities (3)
  { sym:'WTI',     cls:'COMMODITY', price:78.45,    chg:-1.20, bias:'BEAR',    conf:67, seed:31 },
  { sym:'BRENT',   cls:'COMMODITY', price:82.18,    chg:-1.05, bias:'BEAR',    conf:64, seed:131},
  { sym:'NATGAS',  cls:'COMMODITY', price:2.15,     chg:+2.40, bias:'BULL',    conf:55, seed:137},
  // Crypto (4)
  { sym:'BTC/USD', cls:'CRYPTO',    price:67842.0,  chg:-0.88, bias:'BEAR',    conf:61, seed:17 },
  { sym:'ETH/USD', cls:'CRYPTO',    price:3478.20,  chg:-1.12, bias:'BEAR',    conf:57, seed:139},
  { sym:'SOL/USD', cls:'CRYPTO',    price:178.40,   chg:+2.84, bias:'BULL',    conf:69, seed:149},
  { sym:'ADA/USD', cls:'CRYPTO',    price:0.4640,   chg:-0.42, bias:'NEUTRAL', conf:32, seed:151},
];

const FG_CLASSES = [
  { id:'FX',        label:'Forex',       icon:'$',  color:'#2962FF', count: FG_PAIRS.filter(p=>p.cls==='FX').length },
  { id:'METALS',    label:'Metals',      icon:'Au', color:'#FFB547', count: FG_PAIRS.filter(p=>p.cls==='METALS').length },
  { id:'INDICES',   label:'Indices',     icon:'≡',  color:'#06B6D4', count: FG_PAIRS.filter(p=>p.cls==='INDICES').length },
  { id:'COMMODITY', label:'Commodities', icon:'◈',  color:'#EF4444', count: FG_PAIRS.filter(p=>p.cls==='COMMODITY').length },
  { id:'CRYPTO',    label:'Crypto',      icon:'₿',  color:'#F7931A', count: FG_PAIRS.filter(p=>p.cls==='CRYPTO').length },
];

/* Helpers */
function fgPrice(p) {
  if (p.price >= 1000) return p.price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (p.sym.includes('JPY')) return p.price.toFixed(3);
  if (p.cls === 'METALS' || p.cls === 'COMMODITY' || p.cls === 'INDICES') return p.price.toFixed(2);
  return p.price.toFixed(5);
}
function fgBiasColor(b) { return b === 'BULL' ? 'var(--buy)' : b === 'BEAR' ? 'var(--sell)' : 'var(--action)'; }

/* The shared heatmap row — V1 DNA */
function FgHeatmapRow({ p, active, onClick, dense = false }) {
  const c = fgBiasColor(p.bias);
  const barW = 3 + (p.conf / 100) * 5;
  return (
    <div onClick={onClick} style={{
      position: 'relative', display: 'grid',
      gridTemplateColumns: `${barW}px 1fr auto auto`,
      alignItems: 'center', gap: 8,
      padding: dense ? '6px 10px 6px 0' : '8px 12px 8px 0',
      background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
      borderBottom: '1px solid var(--trader-line)',
      cursor: 'pointer', height: dense ? 36 : 42,
    }}>
      {/* Watermark sparkline */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.22, pointerEvents: 'none' }}>
        <FgSparkBg seed={p.seed} bias={p.bias} />
      </div>
      <div style={{ background: c, height: '100%', boxShadow: `0 0 10px ${c}` }} />
      <div style={{ position: 'relative', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, fontWeight: 500, color: 'var(--text-0)' }}>{p.sym}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 1 }}>
          <span className="num" style={{ fontSize: 10.5, color: 'var(--text-1)' }}>{fgPrice(p)}</span>
          <span style={{ fontSize: 9, color: p.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%</span>
        </div>
      </div>
      <span style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 7.5, letterSpacing: '0.12em', color: c, padding: '1.5px 4px', border: `1px solid ${c}`, borderRadius: 3 }}>
        {p.bias}
      </span>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 3, minWidth: 38, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--text-3)', letterSpacing: '0.08em' }}>AI</span>
        <span className="num" style={{ fontSize: 10, fontWeight: 600, color: c }}>{p.conf}</span>
      </div>
    </div>
  );
}

function FgSparkBg({ seed, bias }) {
  const pts = React.useMemo(() => {
    let s = seed * 9941;
    const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = 36;
    const arr = [];
    let y = 0.5;
    const drift = bias === 'BULL' ? 0.012 : bias === 'BEAR' ? -0.012 : 0;
    for (let i = 0; i < n; i++) {
      y += drift + (rng() - 0.5) * 0.07;
      y = Math.max(0.15, Math.min(0.85, y));
      arr.push({ x: i / (n - 1), y });
    }
    return arr;
  }, [seed, bias]);
  const c = fgBiasColor(bias);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 280} ${p.y * 42}`).join(' ');
  return (
    <svg width="100%" height="100%" viewBox="0 0 280 42" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

/* Search bar */
function FgSearch({ placeholder = 'Search symbols…' }) {
  return (
    <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--trader-line)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 9px',
        background: 'var(--trader-panel-2)',
        border: '1px solid var(--trader-line)', borderRadius: 6,
        fontSize: 11, color: 'var(--text-3)',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span>{placeholder}</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-3)', padding: '1px 4px', border: '1px solid var(--trader-line)', borderRadius: 2 }}>⌘K</span>
      </div>
    </div>
  );
}

/* Class pill icon */
function FgClassIcon({ cls, size = 18 }) {
  const C = FG_CLASSES.find(c => c.id === cls);
  if (!C) return null;
  return (
    <span style={{
      width: size, height: size, borderRadius: 4,
      background: `${C.color}22`, color: C.color,
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: size * 0.55, fontWeight: 700,
      flex: `0 0 ${size}px`,
    }}>{C.icon}</span>
  );
}

/* ================================================================
   G1 — CLASSIC ACCORDION
   Direct port of the screenshot. Section headers expand/collapse.
   ================================================================ */
function FocusG1_Accordion() {
  const [open, setOpen] = React.useState({ FX: true, METALS: false, INDICES: true, COMMODITY: false, CRYPTO: false });
  const [active, setActive] = React.useState('EUR/USD');
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));
  return (
    <div style={fgShellStyle}>
      <FgRailHeader title="FOCUS · 21" subtitle="Grouped by asset class" />
      <FgSearch />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {FG_CLASSES.map(C => {
          const rows = FG_PAIRS.filter(p => p.cls === C.id);
          const isOpen = open[C.id];
          // class-level: avg confidence, dominant bias
          const avgConf = Math.round(rows.reduce((s, r) => s + r.conf, 0) / rows.length);
          const bullCount = rows.filter(r => r.bias === 'BULL').length;
          const bearCount = rows.filter(r => r.bias === 'BEAR').length;
          return (
            <div key={C.id}>
              <div onClick={() => toggle(C.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px',
                background: 'var(--trader-panel-2)',
                borderBottom: '1px solid var(--trader-line)',
                cursor: 'pointer',
              }}>
                <span style={{ color: 'var(--text-2)', fontSize: 9, transition: 'transform 140ms', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                <FgClassIcon cls={C.id} size={16} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 500, color: 'var(--text-0)' }}>{C.label}</span>
                {/* mini bull/bear ratio bar */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', height: 3, width: 32, borderRadius: 2, overflow: 'hidden', background: 'var(--trader-panel-3)' }}>
                    <div style={{ width: `${(bullCount / rows.length) * 100}%`, background: 'var(--buy)' }} />
                    <div style={{ width: `${((rows.length - bullCount - bearCount) / rows.length) * 100}%`, background: 'var(--action)' }} />
                    <div style={{ width: `${(bearCount / rows.length) * 100}%`, background: 'var(--sell)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', minWidth: 14, textAlign: 'right' }}>{C.count}</span>
                </div>
              </div>
              {isOpen && rows.map(p => (
                <FgHeatmapRow key={p.sym} p={p} active={active === p.sym} onClick={() => setActive(p.sym)} dense />
              ))}
            </div>
          );
        })}
      </div>
      <FgRailFooter />
    </div>
  );
}

/* ================================================================
   G2 — TAB BAR + HEATMAP
   Horizontal tab strip switches the visible class.
   ================================================================ */
function FocusG2_Tabs() {
  const [tab, setTab] = React.useState('ALL');
  const [active, setActive] = React.useState('EUR/USD');
  const tabs = [{ id: 'ALL', label: 'All', count: FG_PAIRS.length }, ...FG_CLASSES.map(c => ({ id: c.id, label: c.label, count: c.count, color: c.color }))];
  const visible = tab === 'ALL' ? FG_PAIRS : FG_PAIRS.filter(p => p.cls === tab);
  return (
    <div style={fgShellStyle}>
      <FgRailHeader title="FOCUS · 21" subtitle={tab === 'ALL' ? 'All instruments' : `${FG_CLASSES.find(c=>c.id===tab)?.label} · ${visible.length}`} />
      <FgSearch />
      {/* Tab strip */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 8px 8px', borderBottom: '1px solid var(--trader-line)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map(t => {
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: '0 0 auto',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 9px',
              borderRadius: 5,
              border: '1px solid',
              borderColor: isActive ? (t.color || 'var(--text-0)') : 'var(--trader-line)',
              background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: isActive ? 'var(--text-0)' : 'var(--text-2)',
              fontSize: 10.5,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {t.id !== 'ALL' && <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.color }}/>}
              <span>{t.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-3)', padding: '0 3px', borderRadius: 2, background: 'var(--trader-panel-3)' }}>{t.count}</span>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {visible.map(p => (
          <FgHeatmapRow key={p.sym} p={p} active={active === p.sym} onClick={() => setActive(p.sym)} />
        ))}
      </div>
      <FgRailFooter />
    </div>
  );
}

/* ================================================================
   G3 — STICKY SECTION HEADERS
   Always-expanded, ribbon headers stick while scrolling.
   ================================================================ */
function FocusG3_Sticky() {
  const [active, setActive] = React.useState('EUR/USD');
  return (
    <div style={fgShellStyle}>
      <FgRailHeader title="FOCUS · 21" subtitle="All classes · scroll" />
      <FgSearch />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {FG_CLASSES.map(C => {
          const rows = FG_PAIRS.filter(p => p.cls === C.id);
          const bullCount = rows.filter(r => r.bias === 'BULL').length;
          const bearCount = rows.filter(r => r.bias === 'BEAR').length;
          return (
            <div key={C.id}>
              <div style={{
                position: 'sticky', top: 0, zIndex: 2,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px',
                background: 'var(--trader-panel)',
                borderTop: `2px solid ${C.color}`,
                borderBottom: '1px solid var(--trader-line-strong)',
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5, letterSpacing: '0.14em',
                color: 'var(--text-2)',
                textTransform: 'uppercase',
              }}>
                <span style={{ color: C.color, fontWeight: 700, letterSpacing: '0.16em' }}>{C.label}</span>
                <span style={{ color: 'var(--text-3)' }}>· {rows.length}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em' }}>
                  <span style={{ color: 'var(--buy)' }}>↑{bullCount}</span>
                  <span style={{ color: 'var(--sell)' }}>↓{bearCount}</span>
                </div>
              </div>
              {rows.map(p => (
                <FgHeatmapRow key={p.sym} p={p} active={active === p.sym} onClick={() => setActive(p.sym)} dense />
              ))}
            </div>
          );
        })}
      </div>
      <FgRailFooter />
    </div>
  );
}

/* ================================================================
   G4 — CLASS RAIL + LIST
   Vertical mini-rail of class icons on left, heatmap on right.
   ================================================================ */
function FocusG4_Rail() {
  const [cls, setCls] = React.useState('FX');
  const [active, setActive] = React.useState('EUR/USD');
  const visible = FG_PAIRS.filter(p => p.cls === cls);
  const C = FG_CLASSES.find(c => c.id === cls);

  return (
    <div style={fgShellStyle}>
      <FgRailHeader title="FOCUS · 21" subtitle={`${C.label} · ${visible.length}`} />
      <FgSearch />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Mini rail */}
        <div style={{ flex: '0 0 44px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--trader-line)', padding: '6px 0', gap: 4 }}>
          {FG_CLASSES.map(c => {
            const isActive = cls === c.id;
            return (
              <button key={c.id} onClick={() => setCls(c.id)} style={{
                position: 'relative',
                width: '100%', padding: '7px 0',
                background: isActive ? `${c.color}11` : 'transparent',
                border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                color: isActive ? c.color : 'var(--text-3)',
              }}>
                {isActive && <div style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, background: c.color, borderRadius: 2 }}/>}
                <span style={{
                  width: 24, height: 24, borderRadius: 5,
                  background: isActive ? c.color : 'var(--trader-panel-3)',
                  color: isActive ? '#000' : c.color,
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                }}>{c.icon}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.06em' }}>{c.count}</span>
              </button>
            );
          })}
        </div>
        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          {visible.map(p => (
            <FgHeatmapRow key={p.sym} p={p} active={active === p.sym} onClick={() => setActive(p.sym)} />
          ))}
        </div>
      </div>
      <FgRailFooter />
    </div>
  );
}

/* Shell */
const fgShellStyle = {
  width: 280, height: 720,
  background: 'var(--trader-panel)',
  border: '1px solid var(--trader-line-strong)',
  borderRadius: 10,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'var(--font-body)',
  color: 'var(--text-0)',
};

function FgRailHeader({ title, subtitle }) {
  return (
    <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--trader-line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--buy)', boxShadow: '0 0 6px var(--buy)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--text-2)' }}>{title}</span>
        <button style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: 4, background: 'transparent', border: '1px solid var(--trader-line)', color: 'var(--text-2)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 12 }}>+</button>
      </div>
      <div style={{ marginTop: 6, padding: '6px 8px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 5, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--ai)', color: '#000', display: 'grid', placeItems: 'center', fontSize: 7, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>AI</span>
        <span style={{ color: 'var(--text-1)', lineHeight: 1.3 }}>{subtitle}</span>
      </div>
    </div>
  );
}

function FgRailFooter() {
  return (
    <div style={{ padding: '8px 14px', borderTop: '1px solid var(--trader-line)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-3)' }}>
      <span>UPDATED 14s</span>
      <span style={{ marginLeft: 'auto' }}>SORT ↓</span>
    </div>
  );
}

Object.assign(window, {
  FocusG1_Accordion, FocusG2_Tabs, FocusG3_Sticky, FocusG4_Rail,
  FG_PAIRS, FG_CLASSES,
});
