/* ================================================================
   Trading Workspace v2 — AI-native layout
   Diverges from HW clone:
   • Vertical Focus Rail (left) with pair cards + AI signal meters
   • Top telemetry ribbon — regime / session / risk budget / AI pulse
   • Chart canvas with AI overlays (setup zone, predicted cone, news flags)
   • Compose-trade panel — intent-driven, visual risk diagram
   • Positions as anchored cards
   • AI thinking bar at bottom (continuous narration)
   ================================================================ */

const PAIRS = [
  // FX
  { sym:'EUR/USD', cls:'FX',        name:'Euro · US Dollar',  price:1.08472, chg:+0.24, base:1.08472, bias:'BULL',    conf:78, thesis:'1H double-bottom + DXY breakdown.',                      seed:7,   session:'London' },
  { sym:'GBP/USD', cls:'FX',        name:'Pound · US Dollar', price:1.27184, chg:+0.18, base:1.27184, bias:'BULL',    conf:62, thesis:'Reclaim of 1.2700; BoE pricing supportive.',             seed:101, session:'London' },
  { sym:'USD/JPY', cls:'FX',        name:'Dollar · Yen',      price:154.180, chg:-0.12, base:154.180, bias:'BEAR',    conf:71, thesis:'Intervention risk above 155.',                          seed:19,  session:'Tokyo→London' },
  { sym:'AUD/USD', cls:'FX',        name:'Aussie · Dollar',   price:0.65840, chg:+0.15, base:0.65840, bias:'BULL',    conf:45, thesis:'Risk-on bid; iron ore firming.',                        seed:23,  session:'Sydney→London' },
  { sym:'USD/CAD', cls:'FX',        name:'Dollar · Loonie',   price:1.36420, chg:-0.21, base:1.36420, bias:'BEAR',    conf:54, thesis:'Crude bid pressuring CAD shorts.',                      seed:103, session:'NY' },
  { sym:'EUR/GBP', cls:'FX',        name:'Euro · Pound',      price:0.85410, chg:-0.08, base:0.85410, bias:'BEAR',    conf:48, thesis:'Range-bound; lean to lower bound.',                     seed:41,  session:'London' },
  { sym:'GBP/JPY', cls:'FX',        name:'Pound · Yen',       price:198.470, chg:+0.31, base:198.470, bias:'NEUTRAL', conf:52, thesis:'Consolidation ahead of UK CPI 09:30.',                  seed:13,  session:'London' },
  // Metals
  { sym:'XAU/USD', cls:'METALS',    name:'Gold · US Dollar',  price:2348.12, chg:+0.67, base:2348.12, bias:'BULL',    conf:65, thesis:'Reclaim of 2345 pivot, real yields falling.',           seed:11,  session:'London' },
  { sym:'XAG/USD', cls:'METALS',    name:'Silver · USD',      price:27.84,   chg:+0.92, base:27.84,   bias:'BULL',    conf:58, thesis:'Industrial demand + ratio compression.',                seed:107, session:'London' },
  { sym:'XPT/USD', cls:'METALS',    name:'Platinum · USD',    price:912.40,  chg:-0.34, base:912.40,  bias:'NEUTRAL', conf:35, thesis:'Stuck in range; awaiting auto demand cue.',             seed:109, session:'London' },
  // Indices
  { sym:'NAS100',  cls:'INDICES',   name:'Nasdaq 100',        price:18241.5, chg:+0.42, base:18241.5, bias:'BULL',    conf:58, thesis:'Mega-cap leadership intact above 18.1k.',                seed:29,  session:'NY' },
  { sym:'SPX500',  cls:'INDICES',   name:'S&P 500',           price:5247.20, chg:+0.18, base:5247.20, bias:'NEUTRAL', conf:38, thesis:'Tight range; OPEX pin into Friday.',                    seed:37,  session:'NY' },
  { sym:'US30',    cls:'INDICES',   name:'Dow Jones',         price:39102.0, chg:+0.24, base:39102.0, bias:'BULL',    conf:51, thesis:'Defensives leading; rotation supportive.',               seed:113, session:'NY' },
  { sym:'GER40',   cls:'INDICES',   name:'DAX 40',            price:18347.5, chg:-0.18, base:18347.5, bias:'BEAR',    conf:42, thesis:'Failed breakout, bearish engulfing.',                   seed:127, session:'Frankfurt' },
  // Commodities
  { sym:'WTI',     cls:'COMMODITY', name:'Crude Oil WTI',     price:78.45,   chg:-1.20, base:78.45,   bias:'BEAR',    conf:67, thesis:'Inventory build + demand wobble.',                      seed:31,  session:'NY' },
  { sym:'BRENT',   cls:'COMMODITY', name:'Brent Crude',       price:82.18,   chg:-1.05, base:82.18,   bias:'BEAR',    conf:64, thesis:'Tracking WTI; spread stable.',                          seed:131, session:'London' },
  { sym:'NATGAS',  cls:'COMMODITY', name:'Natural Gas',       price:2.15,    chg:+2.40, base:2.15,    bias:'BULL',    conf:55, thesis:'Cold front + storage draw narrative.',                  seed:137, session:'NY' },
  // Crypto
  { sym:'BTC/USD', cls:'CRYPTO',    name:'Bitcoin · USD',     price:67842.0, chg:-0.88, base:67842.0, bias:'BEAR',    conf:61, thesis:'Rejected from 68.4k supply, weak hands exiting.',       seed:17,  session:'24h' },
  { sym:'ETH/USD', cls:'CRYPTO',    name:'Ethereum · USD',    price:3478.20, chg:-1.12, base:3478.20, bias:'BEAR',    conf:57, thesis:'Underperforming BTC; ratio breaking down.',             seed:139, session:'24h' },
  { sym:'SOL/USD', cls:'CRYPTO',    name:'Solana · USD',      price:178.40,  chg:+2.84, base:178.40,  bias:'BULL',    conf:69, thesis:'Strong relative strength + DEX volume spike.',          seed:149, session:'24h' },
  { sym:'ADA/USD', cls:'CRYPTO',    name:'Cardano · USD',     price:0.4640,  chg:-0.42, base:0.4640,  bias:'NEUTRAL', conf:32, thesis:'Drifting; no clear catalyst.',                          seed:151, session:'24h' },
];

const PAIR_CLASSES = [
  { id:'FX',        label:'Forex',       icon:'$',  color:'#2962FF' },
  { id:'METALS',    label:'Metals',      icon:'Au', color:'#FFB547' },
  { id:'INDICES',   label:'Indices',     icon:'≡',  color:'#06B6D4' },
  { id:'COMMODITY', label:'Commodities', icon:'◈',  color:'#EF4444' },
  { id:'CRYPTO',    label:'Crypto',      icon:'₿',  color:'#F7931A' },
];

const POSITIONS_V2 = [
  { id:'10377275', pair:'EUR/USD', side:'BUY',  lots:0.50, entry:1.08210, current:1.08472, sl:1.08020, tp:1.08820, pnl:+131.00, pnlPct:+0.24, aiTag:'ON TARGET', aiNote:'1.0882 TP 62% reached. Trailing stop suggested.' },
  { id:'10377276', pair:'XAU/USD', side:'SELL', lots:0.10, entry:2352.80, current:2348.12, sl:2362.00, tp:2335.00, pnl:+46.80, pnlPct:+0.20, aiTag:'ON TARGET', aiNote:'Momentum slowing; consider partial.' },
  { id:'10377301', pair:'GBP/JPY', side:'BUY',  lots:0.20, entry:197.90,  current:198.47,  sl:197.20,  tp:199.60,  pnl:+76.40,  pnlPct:+0.29, aiTag:'AT RISK', aiNote:'UK CPI at 09:30 — high vol event within 38m.' },
];

/* ========== MAIN WORKSPACE ========== */
function TradingWorkspaceV2({ onOpenCopilot }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const active = PAIRS[activeIdx];
  const [showSetup, setShowSetup] = React.useState(true);
  const [showCone, setShowCone] = React.useState(true);
  const [showNews, setShowNews] = React.useState(true);
  const [canvasActive, setCanvasActive] = React.useState(true);
  const [canvasReplayKey, setCanvasReplayKey] = React.useState(0);

  return (
    <div className="workspace-v2">
      {/* Site chrome — links back to marketing site */}
      <SiteChromeNav/>

      {/* Compact top bar */}
      <TopBarV2 onAsk={onOpenCopilot}/>

      {/* Thin sidebar */}
      <SidebarV2/>

      {/* Left focus rail — vertical pair list */}
      <FocusRail pairs={PAIRS} active={activeIdx} onSelect={setActiveIdx} onAsk={onOpenCopilot}/>

      {/* Center column: telemetry + chart + positions strip */}
      <div className="v2-center">
        <TelemetryRibbon pair={active} onAsk={onOpenCopilot}/>
        <ChartCanvas
          pair={active}
          showSetup={showSetup && canvasActive}
          showCone={showCone && canvasActive}
          showNews={showNews}
          canvasActive={canvasActive}
          canvasReplayKey={canvasReplayKey}
          onAsk={onOpenCopilot}
        />
        <ChartOverlayControls
          showSetup={showSetup} setShowSetup={setShowSetup}
          showCone={showCone} setShowCone={setShowCone}
          showNews={showNews} setShowNews={setShowNews}
          canvasActive={canvasActive}
          onCanvasToggle={() => setCanvasActive(v => !v)}
          onCanvasReplay={() => setCanvasReplayKey(k => k + 1)}
        />
        <PositionsStrip positions={POSITIONS_V2} onAsk={onOpenCopilot}/>
      </div>

      {/* Right column: compose-trade panel */}
      <ComposePanel pair={active} onAsk={onOpenCopilot}/>

      {/* Bottom thinking bar */}
      <ThinkingBar onAsk={onOpenCopilot}/>
    </div>
  );
}

/* ========== TOP BAR (slim, no workspace tabs) ========== */
function SiteChromeNav() {
  const links = [
    { label: 'Home', href: 'index.html' },
    { label: 'AI Copilot', href: 'ai.html' },
    { label: 'Trading Platforms', href: 'platform.html', current: true },
    { label: 'Markets', href: 'markets.html' },
    { label: 'Pricing', href: 'pricing.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' },
  ];
  return (
    <div className="v2-site-chrome">
      <a href="index.html" className="v2-site-logo">
        <span className="v2-site-logo-mark">J</span>
        <span className="v2-site-logo-text">JAFX</span>
      </a>
      {links.map(l => (
        <a key={l.label} href={l.href} className={`v2-site-link ${l.current ? 'current' : ''}`}>{l.label}</a>
      ))}
      <span className="v2-site-spacer"/>
      <span className="v2-site-meta"><span className="dot"/> LIVE</span>

      {/* Risk budget */}
      <div className="v2-site-cluster">
        <span className="v2-site-cluster-label">RISK</span>
        <div className="v2-site-risk-bar"><div style={{ width:'34%' }}/></div>
        <span className="v2-site-cluster-num">34%</span>
        <span className="v2-site-cluster-sub">$82 / $240</span>
      </div>

      {/* Equity */}
      <div className="v2-site-cluster">
        <span className="v2-site-cluster-label">EQUITY</span>
        <span className="v2-site-cluster-eq">$24,182.67</span>
        <span className="v2-site-cluster-delta">+$182.47</span>
      </div>

      <button className="v2-site-deposit">Deposit</button>
      <button className="v2-site-bell" title="Notifications">
        <Icon name="bell" size={13}/>
        <span className="v2-site-bell-dot"/>
      </button>
    </div>
  );
}
window.SiteChromeNav = SiteChromeNav;

function TopBarV2({ onAsk }) {
  return (
    <div className="v2-topbar">
      <div style={{ display:'flex', alignItems:'center', gap:10, paddingRight:18, borderRight:'1px solid var(--trader-line)' }}>
        <div style={{ width:28, height:28, borderRadius:6, background:'linear-gradient(135deg, #E8ECEF, #A8B0B8)', color:'#000', display:'grid', placeItems:'center', fontWeight:700, fontFamily:'var(--font-display)' }}>J</div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--text-0)', letterSpacing:'-0.01em' }}>JAFX <span style={{ color:'var(--text-3)', fontWeight:300 }}>Terminal</span></div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.12em' }}>AI · FX / METALS / CRYPTO</div>
        </div>
      </div>

      {/* Command palette */}
      <div onClick={onAsk} style={{
        flex:1, maxWidth:520, margin:'0 18px',
        display:'flex', alignItems:'center', gap:10,
        padding:'7px 12px', borderRadius:7,
        background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)',
        cursor:'pointer', color:'var(--text-2)', fontSize:12.5
      }}>
        <Icon name="sparkles" size={13}/>
        <span style={{ flex:1 }}>Ask, or tell me what to trade — "short DXY on the NFP print"</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)', padding:'2px 6px', background:'var(--trader-panel-3)', borderRadius:3 }}>⌘K</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.14em' }}>LATENCY <span className="num" style={{ color:'var(--text-1)', letterSpacing:0 }}>14ms</span></span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.14em', borderLeft:'1px solid var(--trader-line)', paddingLeft:10 }}>FREE MARGIN <span className="num" style={{ color:'var(--text-1)', letterSpacing:0 }}>$22,814</span></span>
      </div>
    </div>
  );
}

/* ========== SIDEBAR (tiny) ========== */
function SidebarV2() {
  const items = ['sparkles','chart','watchlist','portfolio','history','news'];
  return (
    <div className="v2-sidebar">
      {items.map((ic, i) => (
        <button key={ic} className={`v2-sidebar-btn ${i === 1 ? 'active' : ''}`}>
          <Icon name={ic} size={15}/>
        </button>
      ))}
      <div style={{ flex:1 }}/>
      <button className="v2-sidebar-btn"><Icon name="settings" size={15}/></button>
      <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg, #FFB547, #C93838)', display:'grid', placeItems:'center', fontSize:10, fontWeight:600, color:'#000', margin:'8px auto' }}>MR</div>
    </div>
  );
}

/* ========== LEFT FOCUS RAIL — G1 accordion (asset class groups + heatmap rows) ========== */
function FocusRail({ pairs, active, onSelect, onAsk }) {
  // Default: classes containing the active pair are open
  const activeCls = pairs[active]?.cls;
  const [open, setOpen] = React.useState(() => {
    const o = {};
    PAIR_CLASSES.forEach(c => { o[c.id] = (c.id === activeCls) || c.id === 'FX' || c.id === 'METALS'; });
    return o;
  });
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  return (
    <div className="v2-rail">
      {/* Header */}
      <div style={{ padding:'12px 14px 10px', display:'flex', alignItems:'center', gap:6, borderBottom:'1px solid var(--trader-line)' }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--buy)', boxShadow:'0 0 6px var(--buy)' }}/>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.16em', color:'var(--text-2)' }}>FOCUS · {pairs.length}</span>
        <button style={{ marginLeft:'auto', width:22, height:22, borderRadius:4, background:'transparent', border:'1px solid var(--trader-line)', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}>
          <Icon name="plus" size={10}/>
        </button>
      </div>

      {/* AI-ranked subheader */}
      <div style={{ padding:'8px 10px', borderBottom:'1px solid var(--trader-line)' }}>
        <div style={{ padding:'6px 8px', background:'var(--ai-bg)', border:'1px solid var(--ai-border)', borderRadius:5, display:'flex', alignItems:'center', gap:6, fontSize:10.5, lineHeight:1.3 }}>
          <span className="ai-avatar" style={{ width:14, height:14, fontSize:7, flex:'0 0 14px' }}>AI</span>
          <div style={{ color:'var(--text-1)' }}>
            Grouped by class · ranked by setup. <button onClick={onAsk} style={{ background:'transparent', border:'none', color:'var(--ai)', padding:0, cursor:'pointer', textDecoration:'underline' }}>Explain</button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding:'8px 10px', borderBottom:'1px solid var(--trader-line)' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'6px 9px',
          background:'var(--trader-panel-2)',
          border:'1px solid var(--trader-line)', borderRadius:5,
          fontSize:11, color:'var(--text-3)',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Search symbols…</span>
          <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:8.5, color:'var(--text-3)', padding:'1px 4px', border:'1px solid var(--trader-line)', borderRadius:2 }}>⌘K</span>
        </div>
      </div>

      {/* Accordion */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {PAIR_CLASSES.map(C => {
          const rows = pairs.map((p,i)=>({...p, _idx:i})).filter(p => p.cls === C.id);
          if (!rows.length) return null;
          const isOpen = open[C.id];
          const bullCount = rows.filter(r => r.bias === 'BULL').length;
          const bearCount = rows.filter(r => r.bias === 'BEAR').length;
          const neuCount = rows.length - bullCount - bearCount;
          return (
            <div key={C.id}>
              <div onClick={()=>toggle(C.id)} style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'9px 12px',
                background:'var(--trader-panel-2)',
                borderBottom:'1px solid var(--trader-line)',
                cursor:'pointer',
                userSelect:'none',
              }}>
                <span style={{ color:'var(--text-2)', fontSize:8, transition:'transform 140ms', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', display:'inline-block' }}>▶</span>
                <span style={{
                  width:16, height:16, borderRadius:4,
                  background:`${C.color}22`, color:C.color,
                  display:'grid', placeItems:'center',
                  fontFamily:'var(--font-mono)', fontSize:9, fontWeight:700,
                  flex:'0 0 16px',
                }}>{C.icon}</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:12, fontWeight:500, color:'var(--text-0)' }}>{C.label}</span>
                {/* mini bull/neutral/bear ratio bar */}
                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ display:'flex', height:3, width:32, borderRadius:2, overflow:'hidden', background:'var(--trader-panel-3)' }}>
                    {bullCount > 0 && <div style={{ width:`${(bullCount/rows.length)*100}%`, background:'var(--buy)' }}/>}
                    {neuCount > 0 && <div style={{ width:`${(neuCount/rows.length)*100}%`, background:'var(--action)' }}/>}
                    {bearCount > 0 && <div style={{ width:`${(bearCount/rows.length)*100}%`, background:'var(--sell)' }}/>}
                  </div>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-2)', minWidth:14, textAlign:'right' }}>{rows.length}</span>
                </div>
              </div>
              {isOpen && rows.map(p => (
                <HeatmapRow key={p.sym} p={p} active={active === p._idx} onClick={()=>onSelect(p._idx)}/>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding:'8px 14px', borderTop:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:8, fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.1em', color:'var(--text-3)' }}>
        <span>UPDATED 14s</span>
        <span style={{ marginLeft:'auto' }}>SORT ↓ AI</span>
      </div>
    </div>
  );
}

/* Heatmap row — V1 DNA: bias bar (thickness=conf) · watermark sparkline · BIAS pill · AI score chip */
function HeatmapRow({ p, active, onClick }) {
  const c = p.bias === 'BULL' ? 'var(--buy)' : p.bias === 'BEAR' ? 'var(--sell)' : 'var(--action)';
  const barW = 3 + (p.conf / 100) * 5;
  const fmt = (v) => v >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : (p.sym.includes('JPY') ? v.toFixed(3) : (p.cls === 'METALS' || p.cls === 'COMMODITY' || p.cls === 'INDICES') ? v.toFixed(2) : v.toFixed(5));
  return (
    <div onClick={onClick} style={{
      position:'relative', display:'grid',
      gridTemplateColumns:`${barW}px 1fr auto auto`,
      alignItems:'center', gap:8,
      padding:'7px 12px 7px 0',
      background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
      borderBottom:'1px solid var(--trader-line)',
      cursor:'pointer', height:40,
    }}>
      <div style={{ background:c, height:'100%', boxShadow:`0 0 10px ${c}` }}/>
      <div style={{ position:'relative', minWidth:0 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:11.5, fontWeight:500, color:'var(--text-0)' }}>{p.sym}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:1 }}>
          <span className="num" style={{ fontSize:10.5, color:'var(--text-1)' }}>{fmt(p.price)}</span>
          <span style={{ fontSize:9, color: p.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%</span>
        </div>
      </div>
      <span style={{ position:'relative', fontFamily:'var(--font-mono)', fontSize:7.5, letterSpacing:'0.12em', color:c, padding:'1.5px 4px', border:`1px solid ${c}`, borderRadius:3 }}>
        {p.bias}
      </span>
      <div style={{ position:'relative', display:'flex', alignItems:'center', gap:3, padding:'2px 6px', background:'var(--ai-bg)', border:'1px solid var(--ai-border)', borderRadius:3, minWidth:38, justifyContent:'flex-end' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:7, color:'var(--text-3)', letterSpacing:'0.08em' }}>AI</span>
        <span className="num" style={{ fontSize:10, fontWeight:600, color:c }}>{p.conf}</span>
      </div>
    </div>
  );
}

function RowSparkBg({ seed, bias }) {
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
  const c = bias === 'BULL' ? 'var(--buy)' : bias === 'BEAR' ? 'var(--sell)' : 'var(--action)';
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 280} ${p.y * 40}`).join(' ');
  return (
    <svg width="100%" height="100%" viewBox="0 0 280 40" preserveAspectRatio="none" style={{ display:'block' }}>
      <path d={path} fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
    </svg>
  );
}

function Spark({ seed = 1, bias = 'BULL', height = 28, width = 180 }) {
  const pts = React.useMemo(() => {
    let s = seed * 9941;
    const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = 32;
    const arr = [];
    let y = 0.5;
    const drift = bias === 'BULL' ? 0.015 : bias === 'BEAR' ? -0.015 : 0;
    for (let i = 0; i < n; i++) {
      y += drift + (rng() - 0.5) * 0.08;
      y = Math.max(0.1, Math.min(0.9, y));
      arr.push({ x: i / (n-1), y });
    }
    return arr;
  }, [seed, bias]);

  const color = bias === 'BULL' ? 'var(--buy)' : bias === 'BEAR' ? 'var(--sell)' : 'var(--action)';
  const path = pts.map((p,i) => `${i===0?'M':'L'} ${p.x * width} ${p.y * height}`).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display:'block' }}>
      <defs>
        <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${seed})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

/* ========== TELEMETRY RIBBON ========== */
function TelemetryRibbon({ pair, onAsk }) {
  const items = [
    { k:'REGIME', v:'RISK-ON', c:'var(--buy)', hint:'DXY ↓, equities bid' },
    { k:'SESSION', v:'London', c:'var(--text-0)', hint:'Tokyo closed · NY +3h' },
    { k:'VOLATILITY', v:'NORMAL', c:'var(--text-0)', hint:'VIX 14.2 · ATR avg' },
    { k:'NEWS RISK', v:'ELEVATED', c:'var(--action)', hint:'UK CPI in 38m' },
    { k:'AI PULSE', v:'3 setups', c:'var(--text-0)', hint:'avg conf 65' },
  ];
  return (
    <div className="v2-telemetry">
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0 14px', borderRight:'1px solid var(--trader-line)', height:'100%' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:500, color:'var(--text-0)', letterSpacing:'-0.01em' }}>{pair.sym}</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.1em' }}>{pair.name.toUpperCase()}</div>
        </div>
      </div>

      {items.map((it, i) => (
        <div key={it.k} style={{ padding:'0 18px', borderRight: i < items.length -1 ? '1px solid var(--trader-line)' : 'none', display:'flex', flexDirection:'column', justifyContent:'center', minWidth: 110 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.14em' }}>{it.k}</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
            <span className="num" style={{ fontSize:13, color: it.c }}>{it.v}</span>
            <span style={{ fontSize:10, color:'var(--text-3)' }}>{it.hint}</span>
          </div>
        </div>
      ))}

      <div style={{ marginLeft:'auto', paddingRight:14, display:'flex', alignItems:'center', gap:8 }}>
        <button onClick={onAsk} className="v2-chip"><Icon name="sparkles" size={11}/> Explain regime</button>
        <div style={{ display:'flex', gap:2, padding:2, borderRadius:5, background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)' }}>
          {['1m','5m','15m','1H','4H','1D'].map(tf => (
            <button key={tf} className={`v2-tf ${tf === '1H' ? 'active' : ''}`}>{tf}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========== CHART CANVAS (with AI overlays) ========== */
function ChartCanvas({ pair, showSetup, showCone, showNews, canvasActive, canvasReplayKey, onAsk }) {
  const wrapRef = React.useRef();
  const [size, setSize] = React.useState({ w: 900, h: 460 });
  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="v2-chart-wrap">
      {size.w > 100 && (
        <AiCandles
          key={canvasReplayKey}
          width={size.w} height={size.h}
          seed={pair.seed} pair={pair.sym} basePrice={pair.base}
          showSetup={showSetup} showCone={showCone} showNews={showNews}
          bias={pair.bias}
        />
      )}

      {/* Proactive Nudge banner — top, drops in over chart */}
      <ProactiveNudgeBanner onAct={onAsk} onAsk={onAsk}/>

      {/* AI Read ribbon pinned top-left, pushed below the nudge banner */}
      <div style={{ position:'absolute', left:14, top:90, maxWidth: 380, padding:'10px 12px', background:'rgba(7,8,10,0.88)', backdropFilter:'blur(10px)', border:'1px solid var(--ai-border)', borderRadius:8, display:'flex', gap:10 }}>
        <span className="ai-avatar" style={{ width:22, height:22, fontSize:9, flex:'0 0 22px' }}>AI</span>
        <div style={{ flex:1, fontSize:12, color:'var(--text-0)', lineHeight:1.5 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.16em', color:'var(--ai-2)', marginBottom:2 }}>LIVE READ · 1H · REFRESHED 14s AGO</div>
          {pair.sym === 'EUR/USD' && 'Higher-low sequence intact. 1.0836 trendline defended 3× overnight. DXY breaking 104.20 supports the long thesis. RSI 54 — room to run. Bias: BULL.'}
          {pair.sym === 'XAU/USD' && 'Reclaimed 2345 pivot with real yields falling. Seasonality positive. Stop below 2335 safety. Targeting 2362 supply.'}
          {pair.sym === 'GBP/JPY' && 'Range-bound into UK CPI in 38m. Sitting on 198.20 demand. Wait for the print.'}
          {pair.sym === 'BTC/USD' && 'Rejected 68.4k supply. Weak-hand exits on the 15m. First support 67.2k. Bias: BEAR.'}
          {pair.sym === 'USD/JPY' && 'Pinned below 155 by intervention risk. MoF verbals this morning. Bias: BEAR.'}
          <button onClick={onAsk} style={{ background:'transparent', border:'none', color:'var(--ai)', fontSize:11, cursor:'pointer', textDecoration:'underline', marginLeft:6, padding:0 }}>Deep dive →</button>
        </div>
      </div>
    </div>
  );
}

/* AI Candles — same candles + overlay layers */
function AiCandles({ width, height, seed, pair, basePrice, showSetup, showCone, showNews, bias }) {
  const rng = React.useMemo(() => { let s = seed * 12345; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }, [seed]);

  const inferred = basePrice ?? 1.085;
  const scale = Math.max(0.001, Math.abs(inferred) * 0.0015);
  const decimals = inferred >= 1000 ? 2 : inferred >= 100 ? 3 : 4;

  const { candles, minP, maxP } = React.useMemo(() => {
    const n = 80;
    let p = inferred;
    const arr = [];
    for (let i = 0; i < n; i++) {
      const o = p;
      const drift = (Math.sin(i/7 + seed) + Math.sin(i/13 + seed*2)*0.5) * scale * 0.4;
      const vol = scale * 0.6 + rng() * scale * 1.4;
      const c = o + drift + (rng() - 0.5) * vol;
      const h = Math.max(o, c) + rng() * vol * 0.6;
      const l = Math.min(o, c) - rng() * vol * 0.6;
      arr.push({ o, h, l, c });
      p = c;
    }
    const lows = arr.map(c => c.l), highs = arr.map(c => c.h);
    return { candles: arr, minP: Math.min(...lows), maxP: Math.max(...highs) };
  }, [seed, inferred, scale]);

  const padR = 62, padT = 12, padB = 26;
  const cw = width - padR;
  const ch = height - padT - padB;
  const n = candles.length;
  const bw = cw / n;
  const py = (pr) => padT + (1 - (pr - minP) / (maxP - minP)) * ch;
  const px = (i) => i * bw + bw/2;

  const last = candles[n-1].c;
  const first = candles[0].o;
  const change = ((last - first) / first * 100);

  // AI setup zone — highlighted range (e.g. supply/demand)
  const setupLow = minP + (maxP - minP) * (bias === 'BEAR' ? 0.65 : 0.18);
  const setupHigh = minP + (maxP - minP) * (bias === 'BEAR' ? 0.82 : 0.32);
  const setupLabel = bias === 'BEAR' ? 'AI · SUPPLY ZONE' : 'AI · DEMAND ZONE';

  // Entry / SL / TP (AI-suggested)
  const aiEntry = bias === 'BEAR' ? setupHigh - (setupHigh-setupLow)*0.25 : setupLow + (setupHigh-setupLow)*0.75;
  const aiSL = bias === 'BEAR' ? setupHigh + scale*4 : setupLow - scale*4;
  const aiTP = bias === 'BEAR' ? last - scale*20 : last + scale*20;

  // Predicted cone — right of last candle
  const conePts = React.useMemo(() => {
    const steps = 18;
    const out = [];
    let center = last;
    for (let i = 1; i <= steps; i++) {
      const drift = (bias === 'BULL' ? 1 : bias === 'BEAR' ? -1 : 0) * scale * 0.35 * i * 0.6;
      const width = scale * 0.9 * Math.sqrt(i);
      out.push({ i, y: center + drift, up: center + drift + width, lo: center + drift - width });
    }
    return out;
  }, [last, scale, bias]);

  // News flags
  const newsEvents = [
    { idx: 18, label:'FOMC minutes', impact:'HIGH' },
    { idx: 42, label:'ECB speaker', impact:'MED' },
    { idx: 68, label:'Retail sales', impact:'MED' },
  ];

  const rungs = [];
  for (let i = 0; i <= 5; i++) { const p = minP + (maxP-minP) * (i/5); rungs.push({ p, y: py(p) }); }

  return (
    <svg width={width} height={height} style={{ display:'block' }}>
      <defs>
        <linearGradient id="cone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(232,236,239,0.18)"/>
          <stop offset="1" stopColor="rgba(232,236,239,0.02)"/>
        </linearGradient>
        <pattern id="zone-pat" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="rgba(232,236,239,0.04)"/>
          <path d="M0,8 L8,0" stroke="rgba(232,236,239,0.12)" strokeWidth="0.5"/>
        </pattern>
      </defs>

      {/* grid */}
      {rungs.map((r,i) => <line key={i} x1={0} y1={r.y} x2={width-padR} y2={r.y} stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 5"/>)}

      {/* AI SETUP ZONE */}
      {showSetup && (
        <g className="ai-overlay-draw">
          <rect x={0} y={py(setupHigh)} width={width - padR} height={py(setupLow) - py(setupHigh)} fill="url(#zone-pat)"/>
          <line x1={0} y1={py(setupHigh)} x2={width-padR} y2={py(setupHigh)} stroke="var(--ai)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
          <line x1={0} y1={py(setupLow)} x2={width-padR} y2={py(setupLow)} stroke="var(--ai)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
          <g transform={`translate(8, ${py(setupHigh) - 7})`}>
            <rect x="0" y="0" width={setupLabel.length * 5.8 + 12} height="16" rx="3" fill="var(--trader-panel-2)" stroke="var(--ai-border)"/>
            <text x="6" y="11" fill="var(--ai)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.1em">{setupLabel}</text>
          </g>
        </g>
      )}

      {/* Candles */}
      {candles.map((k, i) => {
        const x = px(i);
        const up = k.c >= k.o;
        const color = up ? 'var(--buy)' : 'var(--sell)';
        const yH = py(k.h), yL = py(k.l), yO = py(k.o), yC = py(k.c);
        const bt = Math.min(yO, yC), bb = Math.max(yO, yC);
        return (
          <g key={i}>
            <line x1={x} y1={yH} x2={x} y2={yL} stroke={color} strokeWidth="1"/>
            <rect x={x - bw*0.35} y={bt} width={bw*0.7} height={Math.max(1, bb-bt)} fill={color} opacity={up ? 1 : 0.95}/>
          </g>
        );
      })}

      {/* PREDICTED CONE — after last candle */}
      {showCone && (
        <g className="ai-overlay-draw" style={{ animationDelay: '0.18s' }}>
          <path
            d={`M ${px(n-1)} ${py(last)} ` + conePts.map(p => `L ${px(n-1) + p.i * bw} ${py(p.up)}`).join(' ') + ` ` + [...conePts].reverse().map(p => `L ${px(n-1) + p.i * bw} ${py(p.lo)}`).join(' ') + ' Z'}
            fill="url(#cone-grad)" stroke="none"
          />
          <path
            d={`M ${px(n-1)} ${py(last)} ` + conePts.map(p => `L ${px(n-1) + p.i * bw} ${py(p.y)}`).join(' ')}
            fill="none" stroke="var(--ai)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7"
          />
          <g transform={`translate(${px(n-1) + conePts[conePts.length-1].i * bw - 50}, ${py(conePts[conePts.length-1].y) - 18})`}>
            <rect width="100" height="14" rx="2" fill="var(--trader-panel-2)" stroke="var(--ai-border)"/>
            <text x="5" y="10" fill="var(--ai)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.08em">AI PATH · 68% CONF</text>
          </g>
        </g>
      )}

      {/* AI Entry/SL/TP lines */}
      <g>
        <line x1={0} y1={py(aiEntry)} x2={width-padR} y2={py(aiEntry)} stroke="var(--text-0)" strokeWidth="1" strokeDasharray="5 3" opacity="0.45"/>
        <g transform={`translate(${width-padR-62}, ${py(aiEntry)-8})`}>
          <rect width="60" height="16" rx="2" fill="var(--trader-panel-2)" stroke="var(--trader-line-strong)"/>
          <text x="5" y="11" fill="var(--text-0)" fontSize="9" fontFamily="var(--font-mono)">ENTRY {aiEntry.toFixed(decimals)}</text>
        </g>

        <line x1={0} y1={py(aiSL)} x2={width-padR} y2={py(aiSL)} stroke="var(--sell)" strokeWidth="1" strokeDasharray="5 3" opacity="0.55"/>
        <g transform={`translate(${width-padR-62}, ${py(aiSL)-8})`}>
          <rect width="60" height="16" rx="2" fill="rgba(255,77,77,0.12)" stroke="var(--sell)"/>
          <text x="5" y="11" fill="var(--sell)" fontSize="9" fontFamily="var(--font-mono)">SL {aiSL.toFixed(decimals)}</text>
        </g>

        <line x1={0} y1={py(aiTP)} x2={width-padR} y2={py(aiTP)} stroke="var(--buy)" strokeWidth="1" strokeDasharray="5 3" opacity="0.55"/>
        <g transform={`translate(${width-padR-62}, ${py(aiTP)-8})`}>
          <rect width="60" height="16" rx="2" fill="rgba(0,229,153,0.12)" stroke="var(--buy)"/>
          <text x="5" y="11" fill="var(--buy)" fontSize="9" fontFamily="var(--font-mono)">TP {aiTP.toFixed(decimals)}</text>
        </g>
      </g>

      {/* NEWS flags */}
      {showNews && newsEvents.map((ev, i) => (
        <g key={i} transform={`translate(${px(ev.idx)}, 0)`}>
          <line x1={0} y1={padT} x2={0} y2={height-padB} stroke="var(--action)" strokeWidth="1" strokeDasharray="1 4" opacity="0.35"/>
          <g transform={`translate(-40, ${height-padB+4})`}>
            <rect width="80" height="16" rx="2" fill="rgba(255,181,71,0.12)" stroke="rgba(255,181,71,0.5)"/>
            <circle cx="8" cy="8" r="3" fill="var(--action)"/>
            <text x="15" y="11" fill="var(--action)" fontSize="9" fontFamily="var(--font-mono)">{ev.label}</text>
          </g>
        </g>
      ))}

      {/* last price line + pill */}
      <line x1={0} y1={py(last)} x2={width-padR} y2={py(last)} stroke={change >= 0 ? 'var(--buy)' : 'var(--sell)'} strokeWidth="1" strokeDasharray="2 3" opacity="0.5"/>

      {/* price axis labels */}
      {rungs.map((r,i) => <text key={i} x={width - padR + 6} y={r.y + 3} fill="var(--text-3)" fontSize="9.5" fontFamily="var(--font-mono)">{r.p.toFixed(decimals)}</text>)}

      {/* last price pill */}
      <g transform={`translate(${width - padR + 2}, ${py(last) - 9})`}>
        <rect width="56" height="18" rx="2" fill={change >= 0 ? 'var(--buy)' : 'var(--sell)'}/>
        <text x="5" y="13" fill="#000" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{last.toFixed(decimals)}</text>
      </g>

      {/* bottom axis */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const x = t * (width - padR);
        const labels = ['09:00','11:00','13:00','15:00','17:00'];
        return <text key={i} x={x} y={height - 6} fill="var(--text-3)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}>{labels[i]}</text>;
      })}
    </svg>
  );
}

/* ========== CHART OVERLAY CONTROLS ========== */
function ChartOverlayControls({ showSetup, setShowSetup, showCone, setShowCone, showNews, setShowNews, canvasActive, onCanvasToggle, onCanvasReplay }) {
  return (
    <div className="v2-overlay-ctrls">
      <CanvasButton active={canvasActive} onToggle={onCanvasToggle} onReplay={onCanvasReplay}/>
      <div style={{ width:1, height:16, background:'var(--trader-line)', margin:'0 4px' }}/>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.14em', color:'var(--text-3)' }}>LAYERS</span>
      <OverlayToggle on={showSetup} setOn={setShowSetup} color="var(--ai)" label="SETUP ZONE"/>
      <OverlayToggle on={showCone} setOn={setShowCone} color="var(--ai)" label="PREDICTED PATH"/>
      <OverlayToggle on={showNews} setOn={setShowNews} color="var(--action)" label="NEWS FLAGS"/>
      <div style={{ flex:1 }}/>
      <button className="v2-chip"><Icon name="plus" size={10}/> Annotation</button>
      <button className="v2-chip"><Icon name="drag" size={10}/> Draw</button>
      <button className="v2-chip"><Icon name="chart" size={10}/> Indicators <span style={{ color:'var(--text-3)' }}>3</span></button>
    </div>
  );
}

function OverlayToggle({ on, setOn, color, label }) {
  return (
    <button
      onClick={()=>setOn(!on)}
      style={{
        display:'inline-flex', alignItems:'center', gap:6,
        padding:'4px 9px', borderRadius:4,
        background: on ? 'rgba(232,236,239,0.06)' : 'transparent',
        border: on ? '1px solid var(--ai-border)' : '1px solid var(--trader-line)',
        color: on ? 'var(--text-0)' : 'var(--text-3)',
        fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.1em',
        cursor:'pointer'
      }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: on ? color : 'var(--text-3)', boxShadow: on ? `0 0 6px ${color}` : 'none' }}/>
      {label}
    </button>
  );
}

/* ========== POSITIONS STRIP (bottom, compact cards) ========== */
function PositionsStrip({ positions, onAsk }) {
  const totalPnl = positions.reduce((s,p) => s + p.pnl, 0);
  return (
    <div className="v2-positions">
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', borderBottom:'1px solid var(--trader-line)' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-2)', letterSpacing:'0.14em' }}>OPEN · {positions.length}</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color: totalPnl >= 0 ? 'var(--buy)' : 'var(--sell)' }}>
          {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
        </span>
        <div style={{ width:1, height:14, background:'var(--trader-line)' }}/>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)' }}>Margin <span style={{ color:'var(--text-0)' }}>$1,368</span></span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)' }}>Free <span style={{ color:'var(--text-0)' }}>$22,814</span></span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)' }}>ML <span style={{ color:'var(--text-0)' }}>1,768%</span></span>
        <button onClick={onAsk} className="v2-chip" style={{ marginLeft:'auto' }}>
          <Icon name="sparkles" size={11}/> AI manage all
        </button>
      </div>
      <div style={{ display:'flex', gap:10, padding:10, overflowX:'auto' }}>
        {positions.map(p => <PositionCardV2 key={p.id} position={p} onAsk={onAsk}/>)}
        <button className="v2-add-pos" onClick={onAsk}>
          <Icon name="plus" size={14}/>
          <span>New trade</span>
        </button>
      </div>
    </div>
  );
}

function PositionCardV2({ position, onAsk }) {
  const p = position;
  const dec = p.pair.includes('JPY') ? 3 : p.pair.includes('XAU') ? 2 : 5;
  const isBuy = p.side === 'BUY';
  const coachAnchor = React.useRef();
  // visual progress — where current sits between SL and TP
  const range = Math.abs(p.tp - p.sl);
  const progress = Math.max(0, Math.min(1, Math.abs(p.current - p.sl) / range));
  const tagColor = p.aiTag === 'ON TARGET' ? 'var(--buy)' : p.aiTag === 'AT RISK' ? 'var(--action)' : 'var(--sell)';

  return (
    <div className="v2-pos-card">
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ padding:'2px 6px', borderRadius:3, fontSize:9.5, fontFamily:'var(--font-mono)', background: isBuy ? 'rgba(0,229,153,0.15)' : 'rgba(255,77,77,0.15)', color: isBuy ? 'var(--buy)' : 'var(--sell)', letterSpacing:'0.08em' }}>{p.side}</span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:12, fontWeight:500, color:'var(--text-0)' }}>{p.pair}</span>
        <span className="num" style={{ fontSize:10, color:'var(--text-3)' }}>{p.lots.toFixed(2)} lots</span>
        <span style={{ marginLeft:'auto', padding:'1px 6px', borderRadius:3, fontSize:8.5, fontFamily:'var(--font-mono)', letterSpacing:'0.1em', color: tagColor, border: `1px solid ${tagColor}`, background:'rgba(0,0,0,0.2)' }}>{p.aiTag}</span>
      </div>

      <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:8 }}>
        <span className="num" style={{ fontSize:20, fontWeight:500, color: p.pnl >= 0 ? 'var(--buy)' : 'var(--sell)' }}>
          {p.pnl >= 0 ? '+' : ''}${Math.abs(p.pnl).toFixed(2)}
        </span>
        <span className="num" style={{ fontSize:10, color: p.pnl >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{p.pnl >= 0 ? '+' : ''}{p.pnlPct.toFixed(2)}%</span>
      </div>

      {/* SL → Entry → Current → TP progress bar */}
      <div style={{ position:'relative', marginTop:10, padding:'0 2px' }}>
        <div style={{ position:'relative', height:3, background:'var(--trader-panel-3)', borderRadius:2 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width: `${progress*100}%`, background: isBuy ? 'var(--buy)' : 'var(--sell)', borderRadius:2 }}/>
          {/* entry marker */}
          <div style={{ position:'absolute', left: `${Math.abs(p.entry - p.sl)/range*100}%`, top:-3, width:2, height:9, background:'var(--text-0)', borderRadius:1, transform:'translateX(-1px)' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontFamily:'var(--font-mono)', fontSize:8.5, color:'var(--text-3)' }}>
          <span style={{ color:'var(--sell)' }}>SL {p.sl.toFixed(dec)}</span>
          <span style={{ color:'var(--text-1)' }}>@ {p.current.toFixed(dec)}</span>
          <span style={{ color:'var(--buy)' }}>TP {p.tp.toFixed(dec)}</span>
        </div>
      </div>

      <div style={{ marginTop:10, display:'flex', gap:8, alignItems:'flex-start', padding:8, background:'var(--ai-bg)', border:'1px solid var(--ai-border)', borderRadius:5 }}>
        <span className="ai-avatar" style={{ width:14, height:14, fontSize:7, flex:'0 0 14px', marginTop:1 }}>AI</span>
        <div style={{ flex:1, fontSize:10.5, color:'var(--text-1)', lineHeight:1.4 }}>{p.aiNote}</div>
      </div>

      <div style={{ display:'flex', gap:4, marginTop:8, alignItems:'center' }}>
        <LivePositionCoach position={p} anchor={coachAnchor}/>
        <div style={{ flex:1 }}/>
        <button className="v2-pos-btn" style={{ flex:'0 0 auto', padding:'5px 8px' }}>Trail</button>
        <button className="v2-pos-btn" style={{ flex:'0 0 auto', padding:'5px 8px' }}>50%</button>
        <button className="v2-pos-btn danger" style={{ flex:'0 0 auto', padding:'5px 8px' }}>Close</button>
      </div>
    </div>
  );
}

/* ========== COMPOSE-TRADE PANEL ========== */
function ComposePanel({ pair, onAsk }) {
  const [side, setSide] = React.useState(pair.bias === 'BEAR' ? 'SELL' : 'BUY');
  const [orderType, setOrderType] = React.useState('Market'); // Market | Limit | Stop | Grid | Bracket
  const [unit, setUnit] = React.useState('LOTS'); // LOTS | $ | %
  const [lots, setLots] = React.useState(0.01);
  const [showSLTP, setShowSLTP] = React.useState(false);
  const [showSummary, setShowSummary] = React.useState(true);
  const [showSignals, setShowSignals] = React.useState(false);

  const dec = pair.base >= 1000 ? 2 : pair.base >= 100 ? 3 : 5;
  const spread = pair.base * 0.00008;
  const ask = pair.base + spread/2;
  const bid = pair.base - spread/2;
  const spreadPips = (pair.base >= 100 ? spread * 100 : spread * 10000);
  const equity = 24182;
  const aiSuggestedLots = 0.60;
  const stopPips = 20;
  const orderValueUsd = (lots * (pair.base >= 100 ? 100 : 100000) * pair.base / (pair.base >= 100 ? 1 : 1000)).toFixed(2);
  // simpler: notional ≈ lots * contract * price; for display we just want a believable $ for 0.01 lots
  const notional = (lots * 100000 * pair.base).toFixed(0);
  const orderValDisplay = '$' + (lots * (pair.base >= 1000 ? 100 : 100000) * 0.0001 * 1085).toFixed(2);
  // use a clean fake: 0.01 lots EUR/USD ≈ $10.85
  const cleanOrderVal = (lots * 1085).toFixed(2);
  const marginRequired = (lots * 1085 / 30).toFixed(2);

  const QUICK_SIZES = [0.01, 0.02, 0.05, 0.10, 0.25];

  return (
    <div className="v2-compose">
      {/* Header */}
      <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:8 }}>
        <span className="ai-avatar" style={{ width:18, height:18, fontSize:8 }}>AI</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.16em', color:'var(--text-2)' }}>ORDER TICKET</span>
        <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-0)', fontWeight:600 }}>{pair.sym}</span>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 14px 14px' }}>

        {/* BUY / SELL price tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
          <button onClick={()=>setSide('BUY')} className={`v2-side ${side === 'BUY' ? 'buy' : ''}`} style={{ padding:'10px 12px', textAlign:'left' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.16em', opacity: side === 'BUY' ? 0.85 : 0.55, fontWeight:700 }}>BUY</div>
            <div className="num" style={{ fontSize:17, marginTop:2, fontWeight:600, lineHeight:1.1 }}>{ask.toFixed(dec)}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, marginTop:1, opacity: side === 'BUY' ? 0.7 : 0.45 }}>ask</div>
          </button>
          <button onClick={()=>setSide('SELL')} className={`v2-side ${side === 'SELL' ? 'sell' : ''}`} style={{ padding:'10px 12px', textAlign:'left' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.16em', opacity: side === 'SELL' ? 0.85 : 0.55, fontWeight:700 }}>SELL</div>
            <div className="num" style={{ fontSize:17, marginTop:2, fontWeight:600, lineHeight:1.1 }}>{bid.toFixed(dec)}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, marginTop:1, opacity: side === 'SELL' ? 0.7 : 0.45 }}>bid</div>
          </button>
        </div>

        {/* Order type — primary row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:4, marginBottom:4 }}>
          {['Market','Limit','Stop'].map(t => (
            <button key={t} onClick={()=>setOrderType(t)} className={`v2-otype ${orderType === t ? 'on' : ''}`}>{t}</button>
          ))}
        </div>
        {/* Order type — secondary (advanced) */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginBottom:8 }}>
          {['Grid','Bracket'].map(t => (
            <button key={t} onClick={()=>setOrderType(t)} className={`v2-otype ${orderType === t ? 'on' : ''}`}>{t}</button>
          ))}
        </div>

        {/* Exec hint line */}
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-2)', marginBottom:12 }}>
          <span className="live-dot" style={{ width:6, height:6 }}/>
          <span>{orderType === 'Market' ? 'Executes immediately at current market price' : orderType === 'Limit' ? 'Triggers when price reaches your level' : orderType === 'Stop' ? 'Triggers a market order on breakout' : orderType === 'Grid' ? 'Places a ladder of staggered orders' : 'Entry + SL + TP placed atomically'}</span>
        </div>

        {/* ORDER VALUE — header with unit toggle */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:6 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-3)' }}>ORDER VALUE</span>
          <div style={{ marginLeft:'auto', display:'flex', background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:4, padding:1 }}>
            {['LOTS','$','%'].map(u => (
              <button key={u} onClick={()=>setUnit(u)} className={`v2-unit ${unit === u ? 'on' : ''}`}>{u}</button>
            ))}
          </div>
        </div>

        {/* Big stepper */}
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:6, marginBottom:8 }}>
          <button onClick={()=>setLots(Math.max(0.01, +(lots-0.01).toFixed(2)))} className="v2-step" style={{ width:26, height:26 }}>−</button>
          <input
            value={unit === 'LOTS' ? lots.toFixed(2) : unit === '$' ? cleanOrderVal : ((lots*1085/equity)*100).toFixed(2)}
            onChange={e=>{const v=parseFloat(e.target.value); if (!isNaN(v) && unit === 'LOTS') setLots(Math.max(0.01, v))}}
            className="num v2-lot-input"
            style={{ fontSize:18, textAlign:'center' }}
          />
          <button onClick={()=>setLots(+(lots+0.01).toFixed(2))} className="v2-step" style={{ width:26, height:26 }}>+</button>
        </div>

        {/* Slider */}
        <div style={{ position:'relative', marginBottom:8 }}>
          <input
            type="range"
            min={0.01} max={0.25} step={0.01}
            value={lots}
            onChange={e => setLots(parseFloat(e.target.value))}
            className="v2-size-slider"
          />
          <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', marginTop:2 }}>
            <span>0.01</span><span>0.25</span>
          </div>
        </div>

        {/* Quick size chips */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:4, marginBottom:10 }}>
          {QUICK_SIZES.map(s => (
            <button key={s} onClick={()=>setLots(s)} className={`v2-chip ${Math.abs(lots - s) < 0.001 ? 'on' : ''}`}>{s.toFixed(2)}</button>
          ))}
        </div>

        {/* AI sizing helper */}
        <div className="v2-ai-hint">
          <Icon name="sparkles" size={11}/>
          <div style={{ flex:1, lineHeight:1.4 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--buy)', marginRight:6 }}>AI</span>
            For 0.5% risk on your ${equity.toLocaleString()} equity and a {stopPips}-pip stop, size is{' '}
            <button onClick={()=>setLots(aiSuggestedLots)} className="v2-ai-link">{aiSuggestedLots.toFixed(2)} lots</button>
          </div>
        </div>

        {/* Add SL / TP collapsible */}
        <button onClick={()=>setShowSLTP(s=>!s)} className="v2-sltp-toggle">
          <span style={{ fontSize:14, lineHeight:1, color:'var(--text-2)' }}>{showSLTP ? '−' : '+'}</span>
          <span style={{ flex:1, textAlign:'left' }}>Add Stop Loss / Take Profit</span>
          <span className="v2-ai-pill"><span style={{ width:5, height:5, borderRadius:'50%', background:'var(--buy)' }}/> AI SUGGEST</span>
        </button>
        {showSLTP && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:8, marginBottom:4 }}>
            <div style={{ padding:'8px 10px', background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:5 }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:8.5, color:'var(--sell)', letterSpacing:'0.1em' }}>STOP LOSS</div>
              <div className="num" style={{ fontSize:13, color:'var(--text-0)', marginTop:2 }}>{(side === 'BUY' ? pair.base * 0.998 : pair.base * 1.002).toFixed(dec)}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', marginTop:1 }}>−${(lots*1085*0.02).toFixed(0)} · 20 pips</div>
            </div>
            <div style={{ padding:'8px 10px', background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:5 }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:8.5, color:'var(--buy)', letterSpacing:'0.1em' }}>TAKE PROFIT</div>
              <div className="num" style={{ fontSize:13, color:'var(--text-0)', marginTop:2 }}>{(side === 'BUY' ? pair.base * 1.004 : pair.base * 0.996).toFixed(dec)}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', marginTop:1 }}>+${(lots*1085*0.04).toFixed(0)} · 40 pips</div>
            </div>
          </div>
        )}

        {/* Big confirm */}
        <button style={{
          width:'100%', padding:'16px 0', borderRadius:6, marginTop:12,
          background: side === 'BUY' ? 'var(--buy)' : 'var(--sell)',
          color: side === 'BUY' ? '#000' : '#fff',
          border:'none', cursor:'pointer',
          display:'flex', flexDirection:'column', alignItems:'center', gap:2
        }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.22em', fontWeight:700 }}>{side}</span>
          <span className="num" style={{ fontSize:20, fontWeight:600, lineHeight:1 }}>{(side==='BUY' ? ask : bid).toFixed(dec)}</span>
        </button>

        {/* Order summary */}
        <div style={{ marginTop:14, border:'1px solid var(--trader-line)', borderRadius:6, overflow:'hidden' }}>
          <button onClick={()=>setShowSummary(s=>!s)} className="v2-summary-head">
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)' }}>ORDER SUMMARY</span>
            <span style={{ marginLeft:'auto', fontSize:11, color:'var(--buy)', textDecoration:'underline', textUnderlineOffset:2 }}>Explain risk</span>
          </button>
          {showSummary && (
            <div className="v2-summary-body">
              <SummaryRow label="Action"        value={<><span style={{ color: side === 'BUY' ? 'var(--buy)' : 'var(--sell)', fontWeight:600 }}>{side}</span> {lots.toFixed(2)} lots of {pair.sym}</>}/>
              <SummaryRow label="Order Type"    value={orderType}/>
              <SummaryRow label="At Price"      value={<span className="num">{(side==='BUY' ? ask : bid).toFixed(dec)}</span>}/>
              <SummaryRow label="Spread"        value={<span className="num">{spreadPips.toFixed(1)} pts</span>}/>
              <SummaryRow label="Order Value"   value={<span className="num">${cleanOrderVal}</span>}/>
              <SummaryRow label="Margin Required" value={<span className="num">${marginRequired}</span>}/>
              <SummaryRow label="Pip Value"     value={<span className="num">${(lots * 10).toFixed(2)}</span>}/>
              <SummaryRow label="Overnight Swap" value={<span className="num">{side === 'BUY' ? '−$0.03' : '+$0.01'}</span>} last/>
            </div>
          )}
        </div>

        {/* Correlated signals collapsible */}
        <div style={{ marginTop:10, border:'1px solid var(--trader-line)', borderRadius:6, overflow:'hidden' }}>
          <button onClick={()=>setShowSignals(s=>!s)} className="v2-summary-head">
            <Icon name="sparkles" size={11}/>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)', marginLeft:6 }}>CORRELATED SIGNALS</span>
            <span style={{ marginLeft:'auto', fontSize:14, color:'var(--text-3)', lineHeight:1 }}>{showSignals ? '−' : '+'}</span>
          </button>
          {showSignals && (
            <div style={{ padding:'4px 12px 8px' }}>
              {[
                { k:'DXY', v:'↓ 0.34%', note:'Supports the EUR long' },
                { k:'Real yields', v:'−2.1 bps', note:'Dollar-negative' },
                { k:'ECB OIS', v:'−3 bps cuts', note:'Less dovish than last week' },
                { k:'Vol (1D ATR)', v:'82 pips', note:'In line with avg' },
              ].map(r => (
                <div key={r.k} style={{ display:'flex', alignItems:'center', padding:'6px 0', borderBottom:'1px solid var(--trader-line)', fontSize:11 }}>
                  <span style={{ color:'var(--text-2)', flex:'0 0 90px' }}>{r.k}</span>
                  <span className="num" style={{ color:'var(--text-0)', flex:'0 0 80px' }}>{r.v}</span>
                  <span style={{ color:'var(--text-3)', fontSize:10, flex:1 }}>{r.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tertiary actions */}
        <div style={{ display:'flex', gap:6, marginTop:10 }}>
          <button className="v2-mini-btn">Save idea</button>
          <button className="v2-mini-btn">Paper trade</button>
          <button className="v2-mini-btn" onClick={onAsk}>Ask AI</button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, last }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'7px 12px', borderBottom: last ? 'none' : '1px solid var(--trader-line)', fontSize:11 }}>
      <span style={{ color:'var(--text-2)', flex:1, display:'flex', alignItems:'center', gap:4 }}>
        {label}
        <span style={{ width:11, height:11, borderRadius:'50%', border:'1px solid var(--trader-line-strong)', display:'inline-grid', placeItems:'center', fontSize:7, color:'var(--text-3)', cursor:'help' }}>?</span>
      </span>
      <span style={{ color:'var(--text-0)' }}>{value}</span>
    </div>
  );
}

/* ========== AI THINKING BAR ========== */
function ThinkingBar({ onAsk }) {
  const [phraseIdx, setPhraseIdx] = React.useState(0);
  const phrases = [
    'Watching DXY — testing 104.20 support for breakdown confirmation.',
    'UK CPI print in 38m. Historical vol: ±42 pips on EUR/GBP.',
    'EUR/USD 1H holding above trendline — setup still intact.',
    'Gold real-yield correlation at −0.82. Watching TIPS for confirmation.',
    'Your daily risk budget is 34% used. 2 setups remaining before limit.',
  ];
  React.useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i+1) % phrases.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="v2-thinking">
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 12px', borderRight:'1px solid var(--trader-line)', height:'100%' }}>
        <div className="ai-pulse"/>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.14em', color:'var(--ai-2)' }}>AI · THINKING</span>
      </div>
      <div style={{ flex:1, padding:'0 14px', display:'flex', alignItems:'center', overflow:'hidden', position:'relative' }}>
        <span key={phraseIdx} style={{ fontSize:12, color:'var(--text-0)', animation:'fadeSlide 0.5s ease' }}>
          {phrases[phraseIdx]}
        </span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'0 14px', borderLeft:'1px solid var(--trader-line)', height:'100%', fontFamily:'var(--font-mono)', fontSize:10 }}>
        <span style={{ color:'var(--text-2)' }}>GPT-5 <span style={{ color:'var(--ai)' }}>DEEP</span></span>
        <span style={{ color:'var(--text-3)' }}>14ms</span>
        <span style={{ color:'var(--buy)', display:'flex', alignItems:'center', gap:4 }}><span className="live-dot"/>LON-03</span>
        <button onClick={onAsk} className="v2-chip" style={{ padding:'3px 8px' }}><Icon name="sparkles" size={10}/> Open Copilot</button>
      </div>
    </div>
  );
}

Object.assign(window, { TradingWorkspaceV2 });
