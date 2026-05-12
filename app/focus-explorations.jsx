/* ================================================================
   Focus List — 4 variations
   Bold, dense (8+ instruments), exploring layout & hierarchy
   ================================================================ */

const FE_PAIRS = [
  { sym:'EUR/USD', name:'Euro · US Dollar',   price:1.08472,   chg:+0.24, bias:'BULL',    conf:78, thesis:'1H double-bottom + DXY breakdown.',          seed:7,  glyph:'€', color:'#2962FF', horizon:'INTRADAY', rr:'1:2.4', dist:'+0.04%', cat:'FX·MAJOR' },
  { sym:'XAU/USD', name:'Gold · US Dollar',   price:2348.12,   chg:+0.67, bias:'BULL',    conf:65, thesis:'Reclaim of 2345 pivot, real yields falling.', seed:11, glyph:'Au', color:'#FFB547', horizon:'SWING',    rr:'1:2.0', dist:'@ trigger', cat:'METAL' },
  { sym:'GBP/JPY', name:'Pound · Yen',         price:198.470,   chg:+0.31, bias:'NEUTRAL', conf:52, thesis:'Consolidation ahead of UK CPI 09:30.',        seed:13, glyph:'£', color:'#1E7DCC', horizon:'INTRADAY', rr:'—',     dist:'wait',     cat:'FX·CROSS' },
  { sym:'BTC/USD', name:'Bitcoin · USD',       price:67842.00,  chg:-0.88, bias:'BEAR',    conf:61, thesis:'Rejected from 68.4k supply.',                seed:17, glyph:'₿', color:'#F7931A', horizon:'SWING',    rr:'1:1.8', dist:'-0.6%',     cat:'CRYPTO' },
  { sym:'USD/JPY', name:'Dollar · Yen',        price:154.180,   chg:-0.12, bias:'BEAR',    conf:71, thesis:'Intervention risk above 155.',               seed:19, glyph:'¥', color:'#884EA0', horizon:'WEEK',     rr:'1:3.1', dist:'@ trigger', cat:'FX·MAJOR' },
  { sym:'AUD/USD', name:'Aussie · Dollar',     price:0.65840,   chg:+0.15, bias:'BULL',    conf:45, thesis:'RBA hawkish bias, copper firm.',             seed:23, glyph:'A$', color:'#10B981', horizon:'INTRADAY', rr:'1:1.6', dist:'+0.12%',    cat:'FX·MAJOR' },
  { sym:'NAS100',  name:'Nasdaq Index',        price:18241.50,  chg:+0.42, bias:'BULL',    conf:58, thesis:'Holding 21D EMA, breadth improving.',        seed:29, glyph:'N', color:'#06B6D4', horizon:'SWING',    rr:'1:2.2', dist:'+0.3%',     cat:'INDEX' },
  { sym:'WTI',     name:'WTI Crude',           price:78.45,     chg:-1.20, bias:'BEAR',    conf:67, thesis:'OPEC+ supply rumors, demand softening.',     seed:31, glyph:'O', color:'#EF4444', horizon:'WEEK',     rr:'1:2.7', dist:'@ trigger', cat:'COMMODITY' },
  { sym:'SPX500',  name:'S&P 500',             price:5247.20,   chg:+0.18, bias:'NEUTRAL', conf:38, thesis:'Range-bound; awaiting CPI catalyst.',         seed:37, glyph:'S', color:'#14B8A6', horizon:'INTRADAY', rr:'—',     dist:'wait',      cat:'INDEX' },
  { sym:'EUR/GBP', name:'Euro · Pound',        price:0.85410,   chg:-0.08, bias:'BEAR',    conf:48, thesis:'BoE-ECB divergence narrative resuming.',      seed:41, glyph:'€', color:'#7C3AED', horizon:'SWING',    rr:'1:1.9', dist:'-0.2%',     cat:'FX·CROSS' },
];

/* ----- Shared helpers ----- */
function fePrice(p) {
  if (p.price >= 1000) return p.price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (p.sym.includes('JPY') || p.sym === 'WTI') return p.price.toFixed(p.sym === 'WTI' ? 2 : 3);
  return p.price.toFixed(5);
}
function feBiasColor(b) { return b === 'BULL' ? 'var(--buy)' : b === 'BEAR' ? 'var(--sell)' : 'var(--action)'; }

function FeSpark({ seed = 1, bias = 'BULL', height = 24, width = 200, opacity = 1, fill = true }) {
  const pts = React.useMemo(() => {
    let s = seed * 9941;
    const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = 36;
    const arr = [];
    let y = 0.5;
    const drift = bias === 'BULL' ? 0.012 : bias === 'BEAR' ? -0.012 : 0;
    for (let i = 0; i < n; i++) {
      y += drift + (rng() - 0.5) * 0.07;
      y = Math.max(0.12, Math.min(0.88, y));
      arr.push({ x: i / (n - 1), y });
    }
    return arr;
  }, [seed, bias]);
  const color = feBiasColor(bias);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * width} ${p.y * height}`).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block', opacity }}>
      <defs>
        <linearGradient id={`fegrad-${seed}-${bias}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.30" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#fegrad-${seed}-${bias})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ================================================================
   V1 — HEATMAP LIST
   Compact rows. Left edge = bias bar with thickness = confidence.
   Sparkline as background watermark. Right column = AI score chip.
   ================================================================ */
function FocusV1_Heatmap() {
  const [active, setActive] = React.useState(0);
  return (
    <div style={feShellStyle}>
      <FeRailHeader title="FOCUS · 10" subtitle="Heatmap · ranked by AI score" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 10px' }}>
        {FE_PAIRS.map((p, i) => {
          const c = feBiasColor(p.bias);
          const barW = 3 + (p.conf / 100) * 5; // 3-8px
          return (
            <div key={p.sym} onClick={() => setActive(i)} style={{
              position: 'relative', display: 'grid',
              gridTemplateColumns: `${barW}px 1fr auto auto`,
              alignItems: 'center', gap: 10,
              padding: '8px 12px 8px 0',
              background: active === i ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderBottom: '1px solid var(--trader-line)',
              cursor: 'pointer', height: 44,
            }}>
              {/* Sparkline watermark */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}>
                <FeSpark seed={p.seed} bias={p.bias} height={44} width={260} fill={false} opacity={0.5} />
              </div>
              {/* Bias bar */}
              <div style={{ background: c, height: '100%', boxShadow: `0 0 12px ${c}` }} />
              {/* Symbol + price */}
              <div style={{ position: 'relative', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 500, color: 'var(--text-0)' }}>{p.sym}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-3)', letterSpacing: '0.1em' }}>{p.cat}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span className="num" style={{ fontSize: 11.5, color: 'var(--text-1)' }}>{fePrice(p)}</span>
                  <span style={{ fontSize: 9.5, color: p.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%</span>
                </div>
              </div>
              {/* Bias label */}
              <span style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.12em', color: c, padding: '2px 5px', border: `1px solid ${c}`, borderRadius: 3 }}>
                {p.bias}
              </span>
              {/* AI score */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4, padding: '3px 7px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 3, minWidth: 44, justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.08em' }}>AI</span>
                <span className="num" style={{ fontSize: 11, fontWeight: 600, color: c }}>{p.conf}</span>
              </div>
            </div>
          );
        })}
      </div>
      <FeRailFooter />
    </div>
  );
}

/* ================================================================
   V2 — SIGNAL PULSE
   Heart-rate-monitor metaphor. Each row is a horizontal pulse
   track with a glowing dot for confidence position.
   ================================================================ */
function FocusV2_Pulse() {
  const [active, setActive] = React.useState(0);
  return (
    <div style={feShellStyle}>
      <FeRailHeader title="FOCUS · 10" subtitle="Live signal pulse" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 10px' }}>
        {FE_PAIRS.map((p, i) => {
          const c = feBiasColor(p.bias);
          const status = p.conf >= 70 ? 'READY' : p.conf >= 50 ? 'FORMING' : 'WATCH';
          const dot = p.conf >= 70 ? '●●' : p.conf >= 50 ? '●○' : '◐';
          return (
            <div key={p.sym} onClick={() => setActive(i)} style={{
              padding: '7px 12px',
              cursor: 'pointer',
              background: active === i ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderLeft: active === i ? `2px solid ${c}` : '2px solid transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: c, fontSize: 9, letterSpacing: '0.1em', minWidth: 20 }}>{dot}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 500, color: 'var(--text-0)' }}>{p.sym}</span>
                <span className="num" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-1)' }}>{fePrice(p)}</span>
                <span style={{ fontSize: 9.5, color: p.chg >= 0 ? 'var(--buy)' : 'var(--sell)', minWidth: 38, textAlign: 'right' }}>{p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%</span>
              </div>
              {/* Pulse track */}
              <div style={{ position: 'relative', height: 16 }}>
                <FePulseTrack conf={p.conf} bias={p.bias} seed={p.seed} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.1em', color: 'var(--text-3)' }}>
                <span style={{ color: c }}>{status}</span>
                <span>·</span>
                <span>{p.horizon}</span>
                <span style={{ marginLeft: 'auto' }}>R:R {p.rr}</span>
              </div>
            </div>
          );
        })}
      </div>
      <FeRailFooter />
    </div>
  );
}

function FePulseTrack({ conf, bias, seed }) {
  const c = feBiasColor(bias);
  const pts = React.useMemo(() => {
    let s = seed * 9941;
    const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = 60;
    const arr = [];
    for (let i = 0; i < n; i++) {
      // ekg-like: mostly flat, occasional spikes
      const spike = (rng() < 0.12) ? (rng() - 0.5) * 1.6 : 0;
      const y = 0.5 + spike * 0.5 + (rng() - 0.5) * 0.1;
      arr.push({ x: i / (n - 1), y: Math.max(0.05, Math.min(0.95, y)) });
    }
    return arr;
  }, [seed]);

  const W = 240;
  const H = 16;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * W} ${p.y * H}`).join(' ');
  // dot position based on conf
  const dotX = (conf / 100) * W;
  const dotPt = pts[Math.floor((conf / 100) * (pts.length - 1))];
  const dotY = dotPt ? dotPt.y * H : H / 2;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 3" />
      <path d={path} fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={dotX} cy={dotY} r="2.5" fill={c} />
      <circle cx={dotX} cy={dotY} r="5" fill={c} opacity="0.25" />
    </svg>
  );
}

/* ================================================================
   V3 — CARD STACK
   Active card at top (full info). Behind it, others fan as tabs.
   Click any tab to promote.
   ================================================================ */
function FocusV3_Stack() {
  const [active, setActive] = React.useState(0);
  const top = FE_PAIRS[active];
  const others = FE_PAIRS.filter((_, i) => i !== active);
  const c = feBiasColor(top.bias);

  return (
    <div style={feShellStyle}>
      <FeRailHeader title="FOCUS · 10" subtitle="Stack · tap to promote" />
      <div style={{ padding: '8px 12px 0', flex: '0 0 auto' }}>
        {/* Active card */}
        <div style={{
          padding: '11px 12px',
          background: 'var(--trader-panel-3)',
          border: `1px solid ${c}`,
          borderRadius: 8,
          boxShadow: `0 4px 24px -8px ${c}, 0 0 0 1px ${c} inset`,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 8, right: 10, fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', color: c }}>FOCUS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, background: top.color, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>{top.glyph}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500, color: 'var(--text-0)' }}>{top.sym}</span>
            <span style={{ marginLeft: 'auto', padding: '1px 6px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.12em', border: `1px solid ${c}`, color: c }}>{top.bias}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span className="num" style={{ fontSize: 18, color: 'var(--text-0)' }}>{fePrice(top)}</span>
            <span style={{ fontSize: 11, color: top.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{top.chg >= 0 ? '+' : ''}{top.chg.toFixed(2)}%</span>
          </div>
          <FeSpark seed={top.seed} bias={top.bias} height={28} width={220} />
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--text-3)', letterSpacing: '0.1em' }}>AI</span>
            <div style={{ flex: 1, height: 3, background: 'var(--trader-panel-2)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${top.conf}%`, height: '100%', background: c, boxShadow: `0 0 6px ${c}` }} />
            </div>
            <span className="num" style={{ fontSize: 10, color: c }}>{top.conf}</span>
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--trader-line)', fontSize: 10.5, color: 'var(--text-2)', lineHeight: 1.45 }}>
            {top.thesis}
          </div>
        </div>
      </div>

      {/* Stack — fanned tabs */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.16em', color: 'var(--text-3)', padding: '0 4px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>STACK · {others.length}</span>
          <span style={{ flex: 1, height: 1, background: 'var(--trader-line)' }} />
        </div>
        {others.map((p, i) => {
          const cc = feBiasColor(p.bias);
          // fanned offset — left margin grows slightly per item to feel stacked
          const offset = Math.min(i * 4, 16);
          return (
            <div key={p.sym} onClick={() => setActive(FE_PAIRS.indexOf(p))} style={{
              padding: '6px 8px 6px 10px',
              marginLeft: offset,
              background: 'var(--trader-panel-2)',
              border: '1px solid var(--trader-line)',
              borderLeft: `3px solid ${cc}`,
              borderRadius: 5,
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer',
              transition: 'transform 140ms ease, background 140ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = `translateX(-${offset}px)`; e.currentTarget.style.background = 'var(--trader-panel-3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'var(--trader-panel-2)'; }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 3, background: p.color, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 7.5, fontWeight: 700 }}>{p.glyph}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-1)' }}>{p.sym}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.1em', color: cc }}>{p.bias === 'BULL' ? '↑' : p.bias === 'BEAR' ? '↓' : '·'}</span>
              <span className="num" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-2)' }}>{fePrice(p)}</span>
              <span style={{ fontSize: 9, color: p.chg >= 0 ? 'var(--buy)' : 'var(--sell)', minWidth: 34, textAlign: 'right' }}>{p.chg >= 0 ? '+' : ''}{p.chg.toFixed(1)}%</span>
              <span style={{ padding: '1px 4px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 600, color: cc }}>{p.conf}</span>
            </div>
          );
        })}
      </div>
      <FeRailFooter />
    </div>
  );
}

/* ================================================================
   V4 — CONVICTION MATRIX
   2D quadrant grid: x = bias direction, y = confidence.
   Each instrument is a node. Hover/select shows details.
   ================================================================ */
function FocusV4_Matrix() {
  const [active, setActive] = React.useState(0);
  const [hover, setHover] = React.useState(null);
  const focused = hover != null ? hover : active;
  const f = FE_PAIRS[focused];
  const fc = feBiasColor(f.bias);

  // Position on grid
  const positions = React.useMemo(() => {
    return FE_PAIRS.map((p, i) => {
      // x: BULL→right, BEAR→left, NEUTRAL→center
      const xRaw = p.bias === 'BULL' ? 0.5 + (p.conf / 200) : p.bias === 'BEAR' ? 0.5 - (p.conf / 200) : 0.5;
      // y: high conf at top
      const y = 1 - (p.conf / 100) * 0.85 - 0.075;
      // jitter to avoid overlap (deterministic)
      const jx = ((p.seed * 13) % 60 - 30) / 800;
      const jy = ((p.seed * 17) % 60 - 30) / 800;
      return { x: Math.max(0.05, Math.min(0.95, xRaw + jx)), y: Math.max(0.05, Math.min(0.95, y + jy)), p, i };
    });
  }, []);

  return (
    <div style={feShellStyle}>
      <FeRailHeader title="FOCUS · 10" subtitle="Conviction matrix" />

      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', padding: '8px 10px 4px', minHeight: 0 }}>
        {/* Matrix */}
        <div style={{
          position: 'relative',
          flex: '0 0 280px',
          background: 'var(--trader-panel)',
          border: '1px solid var(--trader-line)',
          borderRadius: 6,
          overflow: 'hidden',
        }}>
          {/* Quadrant grid */}
          <svg width="100%" height="100%" viewBox="0 0 240 280" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="bullGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--sell)" stopOpacity="0.06" />
                <stop offset="0.5" stopColor="var(--action)" stopOpacity="0.04" />
                <stop offset="1" stopColor="var(--buy)" stopOpacity="0.06" />
              </linearGradient>
            </defs>
            <rect width="240" height="280" fill="url(#bullGrad)" />
            {/* Axes */}
            <line x1="120" y1="0" x2="120" y2="280" stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 3" />
            <line x1="0" y1="42" x2="240" y2="42" stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 3" />
            <line x1="0" y1="140" x2="240" y2="140" stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 3" />
            <line x1="0" y1="238" x2="240" y2="238" stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 3" />
            {/* Conf labels (left edge) */}
            <text x="4" y="14" fill="var(--text-3)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.1em">HIGH 80+</text>
            <text x="4" y="138" fill="var(--text-3)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.1em">MID 50</text>
            <text x="4" y="276" fill="var(--text-3)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.1em">LOW</text>
            {/* Bias labels (bottom) */}
            <text x="6" y="270" fill="var(--sell)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.14em" opacity="0.7">◀ BEAR</text>
            <text x="234" y="270" textAnchor="end" fill="var(--buy)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.14em" opacity="0.7">BULL ▶</text>
          </svg>
          {/* Nodes */}
          {positions.map(({ x, y, p, i }) => {
            const c = feBiasColor(p.bias);
            const isFocused = i === focused;
            const r = 11 + (p.conf / 100) * 6; // 11-17px
            return (
              <button key={p.sym}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setActive(i)}
                style={{
                  position: 'absolute',
                  left: `${x * 100}%`, top: `${y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: r * 2, height: r * 2,
                  border: 'none', padding: 0,
                  borderRadius: '50%',
                  background: isFocused ? c : `${c}22`,
                  boxShadow: isFocused ? `0 0 18px ${c}, 0 0 0 1px ${c}` : `0 0 0 1px ${c}88`,
                  color: isFocused ? '#000' : c,
                  fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '-0.02em',
                  display: 'grid', placeItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 140ms ease, box-shadow 140ms ease, background 140ms ease',
                  zIndex: isFocused ? 5 : 1,
                  lineHeight: 1,
                }}>
                {p.sym.split('/')[0].slice(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Detail strip — focused instrument */}
        <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--trader-panel-3)', border: `1px solid ${fc}55`, borderRadius: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: f.color, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 8, fontWeight: 700 }}>{f.glyph}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 500, color: 'var(--text-0)' }}>{f.sym}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.1em', color: fc }}>{f.bias} · {f.conf}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <span className="num" style={{ fontSize: 13, color: 'var(--text-0)' }}>{fePrice(f)}</span>
            <span style={{ fontSize: 10, color: f.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{f.chg >= 0 ? '+' : ''}{f.chg.toFixed(2)}%</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.1em', color: 'var(--text-3)' }}>{f.horizon} · R:R {f.rr}</span>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-2)', lineHeight: 1.45 }}>{f.thesis}</div>
        </div>
      </div>

      {/* List of all 10, very compact */}
      <div style={{ flex: '0 0 auto', borderTop: '1px solid var(--trader-line)', maxHeight: 130, overflowY: 'auto' }}>
        {FE_PAIRS.map((p, i) => {
          const c = feBiasColor(p.bias);
          return (
            <div key={p.sym} onClick={() => setActive(i)} style={{
              display: 'grid', gridTemplateColumns: '14px 1fr auto auto', gap: 8,
              alignItems: 'center', padding: '4px 12px',
              cursor: 'pointer',
              background: i === focused ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderBottom: '1px solid var(--trader-line)',
              fontSize: 10,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, justifySelf: 'center' }} />
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>{p.sym}</span>
              <span className="num" style={{ color: 'var(--text-2)' }}>{fePrice(p)}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c, minWidth: 18, textAlign: 'right' }}>{p.conf}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----- Shell, header, footer (shared) ----- */
const feShellStyle = {
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

function FeRailHeader({ title, subtitle }) {
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

function FeRailFooter() {
  return (
    <div style={{ padding: '8px 14px', borderTop: '1px solid var(--trader-line)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-3)' }}>
      <span>UPDATED 14s</span>
      <span style={{ marginLeft: 'auto' }}>SORT ↓</span>
    </div>
  );
}

Object.assign(window, {
  FocusV1_Heatmap, FocusV2_Pulse, FocusV3_Stack, FocusV4_Matrix,
  FE_PAIRS,
});
