const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP, useRef: useRefP } = React;

/* ---------- PLATFORM PREVIEW ---------- */
function PlatformPreview() {
  return (
    <Section eyebrow="Terminal" title="Your entire market, one pane." intro="A modern web terminal with the depth of MT5 and the polish of TradingView — plus an AI that reads the tape, drafts the trade, and narrates every open position.">
      <div className="terminal-preview-shell" style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-0)', boxShadow: '0 60px 120px -40px rgba(0,0,0,0.8)' }}>
        <div className="terminal-preview-inner">
          <TerminalUI/>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <a href="trader.html" className="btn btn-primary">Launch full terminal <span className="btn-arrow" aria-hidden="true">→</span></a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 48 }}>
        {[
          ['MT5', 'Full MetaTrader 5 suite with EA support, copy trading, and 38 timeframes.'],
          ['Web Terminal', 'Browser-native with TradingView charts, DOM ladder, and AI sidebar.'],
          ['Mobile', 'iOS + Android. One-tap orders, push alerts, voice co-pilot.'],
          ['API / FIX', 'REST + WebSocket + FIX 4.4 for algorithmic and institutional flow.'],
        ].map(([t,d]) => (
          <div key={t} style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>● PLATFORM</div>
            <div className="display" style={{ fontSize: 22, marginTop: 10 }}>{t}</div>
            <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- TERMINAL UI (v2-style homepage preview) ---------- */
const TERMINAL_PAIRS = [
  { sym:'EUR/USD', price:1.08472, chg:+0.24, bias:'BULL',    conf:78, thesis:'1H double-bottom + DXY breakdown.', seed:7 },
  { sym:'XAU/USD', price:2348.12, chg:+0.67, bias:'BULL',    conf:65, thesis:'Reclaim of 2345 pivot; real yields falling.', seed:11 },
  { sym:'GBP/JPY', price:198.47,  chg:+0.31, bias:'NEUTRAL', conf:52, thesis:'Coiling ahead of UK CPI · 09:30.',   seed:13 },
  { sym:'BTC/USD', price:67842.00,chg:-0.88, bias:'BEAR',    conf:61, thesis:'Rejected 68.4k supply; weak hands exiting.', seed:17 },
];

const TERMINAL_NARRATIONS = [
  'EUR/USD · DXY breaking its 4H trendline. My bias just flipped to long above 1.0836. Setup is ready.',
  'XAU/USD · Real yields rolling over. Gold reclaimed the 2345 pivot 4 candles ago — cleanest long on the board.',
  'GBP/JPY · Volume collapsed in the last 30m. Sit out until UK CPI prints at 09:30 · 18m.',
  'Risk check · Your net USD short is -2.1 lots, at your cap. No new shorts without closing size.',
];

function TerminalUI() {
  const [sel, setSel] = useStateP(0);
  const [narr, setNarr] = useStateP(0);
  useEffectP(() => {
    const t = setInterval(() => setNarr(n => (n + 1) % TERMINAL_NARRATIONS.length), 4200);
    return () => clearInterval(t);
  }, []);
  const active = TERMINAL_PAIRS[sel];
  const fmt = (v) => active.sym.includes('JPY') ? v.toFixed(2) : (active.sym === 'XAU/USD' ? v.toFixed(2) : active.sym === 'BTC/USD' ? v.toFixed(1) : v.toFixed(5));

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Slim top bar */}
      <TerminalTopBar/>

      {/* Telemetry ribbon */}
      <TerminalTelemetry pair={active}/>

      {/* Main 3-col body — compact mockup */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 216px', borderTop: '1px solid var(--line)' }}>
        {/* Focus rail */}
        <div style={{ borderRight: '1px solid var(--line)', background: 'var(--bg-0)' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.16em' }}>FOCUS RAIL</div>
            <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)' }}>AI-RANKED</div>
          </div>
          {TERMINAL_PAIRS.map((p, i) => <TerminalFocusCard key={p.sym} p={p} active={sel === i} onClick={() => setSel(i)}/>)}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}>
            <span className="mono" style={{ fontSize: 9, padding: '2px 5px', border: '1px dashed var(--line-strong)', borderRadius: 3 }}>+</span>
            <span className="mono" style={{ fontSize: 9, letterSpacing: '0.08em' }}>ASK AI TO FIND PAIRS…</span>
          </div>
        </div>

        {/* Chart canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-0)', letterSpacing: '0.02em' }}>{active.sym}</span>
            <span className="mono" style={{ fontSize: 17, color: 'var(--text-0)' }}>{fmt(active.price)}</span>
            <span className="mono" style={{ fontSize: 10, color: active.chg >= 0 ? 'var(--accent)' : 'var(--red)' }}>
              {active.chg >= 0 ? '▲' : '▼'} {Math.abs(active.chg).toFixed(2)}%
            </span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em', marginLeft: 6 }}>· LONDON</span>
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', gap: 3 }}>
              {['1m','5m','15m','1h','4h','1D'].map((t, i) => (
                <button key={t} style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-mono)', background: i === 2 ? 'var(--bg-3)' : 'transparent', border: '1px solid var(--line)', color: i === 2 ? 'var(--text-0)' : 'var(--text-2)', borderRadius: 3, cursor: 'pointer', letterSpacing: '0.06em' }}>{t}</button>
              ))}
            </div>
          </div>
          <div
            className="terminal-chart-area"
            style={{
              width: '100%',
              aspectRatio: '4 / 3',
              maxHeight: 'min(52vh, 520px)',
              minHeight: 200,
              padding: 0,
              position: 'relative',
              background: 'var(--bg-0)',
            }}
          >
            <TerminalChart pair={active}/>
          </div>
          {/* Thinking bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'linear-gradient(90deg, var(--accent-glow) 0%, transparent 50%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)', animation: 'pulse-dot 1.2s infinite' }}/>
              <span className="mono" style={{ fontSize: 8, color: 'var(--accent)', letterSpacing: '0.16em' }}>AI · THINKING</span>
            </div>
            <div key={narr} style={{ fontSize: 11.5, color: 'var(--text-0)', fontStyle: 'italic', lineHeight: 1.45, animation: 'fadeIn 0.4s' }}>
              "{TERMINAL_NARRATIONS[narr]}"
            </div>
          </div>
        </div>

        {/* Compose panel */}
        <TerminalComposePanel pair={active}/>
      </div>
    </div>
  );
}

function TerminalTopBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12, borderRight: '1px solid var(--line)' }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #E8ECEF, #A8B0B8)', color: '#000', display: 'grid', placeItems: 'center', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 11 }}>J</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-0)', letterSpacing: '-0.01em' }}>JAFX <span style={{ color: 'var(--text-3)', fontWeight: 300 }}>Terminal</span></div>
          <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.12em' }}>AI · FX / METALS / CRYPTO</div>
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 5, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--text-2)' }}>
        <span style={{ color: 'var(--accent)' }}>●</span>
        <span style={{ fontSize: 11 }}>Ask anything…</span>
        <span className="mono" style={{ fontSize: 8, color: 'var(--text-3)', marginLeft: 'auto', padding: '2px 5px', border: '1px solid var(--line)', borderRadius: 3 }}>⌘ K</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div>
          <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.12em' }}>EQUITY</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-0)' }}>$24,182.67</div>
        </div>
        <div style={{ padding: '5px 10px', background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', borderRadius: 3, fontWeight: 600 }}>DEPOSIT</div>
      </div>
    </div>
  );
}

function TerminalTelemetry({ pair }) {
  const items = [
    ['Regime', 'RISK-ON', 'var(--accent)'],
    ['Session', 'LONDON · 2h 14m left', 'var(--text-0)'],
    ['Risk budget', '0.8% / 2.0%', 'var(--accent)'],
    ['Open P&L', '+$254.20', 'var(--accent)'],
    ['AI pulse', pair.bias + ' · ' + pair.conf + '%', pair.bias === 'BULL' ? 'var(--accent)' : pair.bias === 'BEAR' ? 'var(--red)' : 'var(--action)'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: 'var(--bg-1)' }}>
      {items.map(([k, v, c], i) => (
        <div key={k} style={{ padding: '8px 10px', borderRight: i < 4 ? '1px solid var(--line)' : 'none' }}>
          <div className="mono" style={{ fontSize: 7, color: 'var(--text-3)', letterSpacing: '0.16em', marginBottom: 3 }}>{k.toUpperCase()}</div>
          <div className="mono" style={{ fontSize: 11, color: c }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function TerminalFocusCard({ p, active, onClick }) {
  const biasCol = p.bias === 'BULL' ? 'var(--accent)' : p.bias === 'BEAR' ? 'var(--red)' : 'var(--action)';
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '10px 12px', border: 'none', borderBottom: '1px solid var(--line)',
      background: active ? 'var(--bg-2)' : 'transparent',
      textAlign: 'left', cursor: 'pointer', color: 'inherit', position: 'relative',
      borderLeft: active ? `2px solid ${biasCol}` : '2px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-0)', letterSpacing: '0.02em' }}>{p.sym}</span>
        <span className="mono" style={{ fontSize: 7, padding: '2px 4px', background: biasCol, color: '#000', borderRadius: 2, letterSpacing: '0.1em', fontWeight: 600 }}>{p.bias}</span>
        <span className="mono" style={{ fontSize: 9, color: p.chg >= 0 ? 'var(--accent)' : 'var(--red)', marginLeft: 'auto' }}>{p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%</span>
      </div>
      <div className="mono" style={{ fontSize: 9, color: 'var(--text-2)', marginBottom: 5 }}>{p.sym.includes('JPY') || p.sym === 'XAU/USD' ? p.price.toFixed(2) : p.sym === 'BTC/USD' ? p.price.toFixed(1) : p.price.toFixed(5)}</div>
      <div style={{ height: 18, marginBottom: 5 }}>
        <Sparkline data={genSpark(26, p.seed)} w={172} h={18}/>
      </div>
      <div style={{ fontSize: 9.5, color: 'var(--text-2)', lineHeight: 1.35, marginBottom: 6, fontStyle: 'italic' }}>&ldquo;{p.thesis}&rdquo;</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="mono" style={{ fontSize: 7, color: 'var(--text-3)', letterSpacing: '0.1em' }}>CONF</span>
        <div style={{ flex: 1, height: 2, background: 'var(--bg-3)', borderRadius: 1.5, overflow: 'hidden' }}>
          <div style={{ width: `${p.conf}%`, height: '100%', background: biasCol }}/>
        </div>
        <span className="mono" style={{ fontSize: 8, color: biasCol }}>{p.conf}%</span>
      </div>
    </button>
  );
}

function TerminalChart({ pair }) {
  // Generate candles scaled to pair's price range
  const data = useMemoP(() => {
    const arr = [];
    let seed = pair.seed;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let p = pair.price * 0.9965;
    const volatility = pair.sym.includes('JPY') ? 0.12 : pair.sym === 'XAU/USD' ? 1.1 : pair.sym === 'BTC/USD' ? 40 : 0.00045;
    for (let i = 0; i < 64; i++) {
      const o = p;
      const drift = (pair.chg / 100) * pair.price / 64;
      const c = p + (rnd() - 0.5) * volatility * 2 + drift;
      const h = Math.max(o, c) + rnd() * volatility;
      const l = Math.min(o, c) - rnd() * volatility;
      arr.push({ o, h, l, c });
      p = c;
    }
    return arr;
  }, [pair.seed, pair.sym]);

  /* 4:3 plot — less panoramic than the old wide chart */
  const W = 640, H = 480;
  const scaleW = 52;
  const min = Math.min(...data.map(d => d.l)) - (data[0].o * 0.0005);
  const max = Math.max(...data.map(d => d.h)) + (data[0].o * 0.0005);
  const xw = W / data.length;
  const y = (v) => H - ((v - min) / (max - min)) * H;

  // Entry / SL / TP suggestions
  const latest = data[data.length - 1].c;
  const isLong = pair.bias === 'BULL';
  const stopMul = pair.sym.includes('JPY') ? 0.5 : pair.sym === 'XAU/USD' ? 8 : pair.sym === 'BTC/USD' ? 350 : 0.0022;
  const entry = latest;
  const sl = isLong ? entry - stopMul : entry + stopMul;
  const tp = isLong ? entry + stopMul * 2 : entry - stopMul * 2;

  // Predicted cone — last 15 candles extrapolated
  const coneStartX = 45 * xw;
  const conePts = [];
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const x = coneStartX + t * (W - coneStartX);
    const dir = isLong ? 1 : -1;
    const mid = y(latest + dir * stopMul * 1.4 * t);
    const spread = 18 + t * 48;
    conePts.push({ x, upper: mid - spread, lower: mid + spread });
  }

  const fmt = (v) => pair.sym.includes('JPY') || pair.sym === 'XAU/USD' ? v.toFixed(2) : pair.sym === 'BTC/USD' ? v.toFixed(1) : v.toFixed(5);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', minHeight: 0, alignItems: 'stretch' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ flex: 1, minWidth: 0, height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="coneGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={isLong ? 'var(--accent)' : 'var(--red)'} stopOpacity="0.28"/>
            <stop offset="100%" stopColor={isLong ? 'var(--accent)' : 'var(--red)'} stopOpacity="0.03"/>
          </linearGradient>
        </defs>

        {[0.2, 0.4, 0.6, 0.8].map(f => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)"/>)}
        {[0.25, 0.5, 0.75].map(f => <line key={f} x1={W * f} x2={W * f} y1={0} y2={H} stroke="var(--line)"/>)}

        <rect x="0" y={isLong ? y(tp) : y(entry)} width={W} height={Math.abs(y(tp) - y(entry))} fill="var(--accent)" opacity="0.06"/>
        <rect x="0" y={isLong ? y(entry) : y(sl)} width={W} height={Math.abs(y(sl) - y(entry))} fill="var(--red)" opacity="0.05"/>

        {data.map((d, i) => {
          const up = d.c >= d.o;
          const col = up ? 'var(--accent)' : 'var(--red)';
          return (
            <g key={i}>
              <line x1={i * xw + xw / 2} x2={i * xw + xw / 2} y1={y(d.h)} y2={y(d.l)} stroke={col} strokeWidth="1"/>
              <rect x={i * xw + 1} y={Math.min(y(d.o), y(d.c))} width={Math.max(1, xw - 2)} height={Math.max(1, Math.abs(y(d.o) - y(d.c)))} fill={col}/>
            </g>
          );
        })}

        <g style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }}>
          <path d={`M ${conePts.map(p => `${p.x},${p.upper}`).join(' L ')} L ${conePts.slice().reverse().map(p => `${p.x},${p.lower}`).join(' L ')} Z`} fill="url(#coneGrad)"/>
        </g>

        <line x1="0" x2={W} y1={y(entry)} y2={y(entry)} stroke="var(--text-0)" strokeDasharray="4,3" strokeWidth="1"/>
        <line x1="0" x2={W} y1={y(sl)} y2={y(sl)} stroke="var(--red)" strokeDasharray="4,3" strokeWidth="1"/>
        <line x1="0" x2={W} y1={y(tp)} y2={y(tp)} stroke="var(--accent)" strokeDasharray="4,3" strokeWidth="1"/>

        <g transform={`translate(${W - 186}, 16)`}>
          <rect x="0" y="0" width="176" height="50" fill="var(--bg-1)" stroke="var(--accent)" rx="5"/>
          <rect x="0" y="0" width="2" height="50" fill="var(--accent)"/>
          <text x="10" y="14" fontSize="7" fill="var(--accent)" fontFamily="var(--font-mono)" letterSpacing="1">● AI DETECTION</text>
          <text x="10" y="30" fontSize="9" fill="var(--text-0)" fontFamily="var(--font-body)">{pair.bias === 'BULL' ? 'Liquidity sweep +' : pair.bias === 'BEAR' ? 'Supply tap +' : 'Compression at'} {fmt(entry - stopMul * 0.3)}.</text>
          <text x="10" y="44" fontSize="9" fill="var(--text-1)" fontFamily="var(--font-body)">Bias flipped {pair.bias === 'BULL' ? 'long' : pair.bias === 'BEAR' ? 'short' : 'neutral'}. Setup ready.</text>
        </g>

        <g transform={`translate(${52 * xw}, 0)`}>
          <line x1="0" x2="0" y1="0" y2={H} stroke="var(--action)" strokeDasharray="3,3" strokeWidth="0.8" opacity="0.6"/>
          <rect x="-2" y={H - 22} width="4" height="10" fill="var(--action)"/>
          <text x="6" y={H - 14} fontSize="9" fill="var(--action)" fontFamily="var(--font-mono)" letterSpacing="0.8">UK CPI · 09:30</text>
        </g>
      </svg>
      <svg
        viewBox={`0 0 ${scaleW} ${H}`}
        style={{ width: scaleW, flexShrink: 0, height: '100%', display: 'block', borderLeft: '1px solid var(--line)', background: 'var(--bg-0)' }}
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" width={scaleW} height={H} fill="var(--bg-0)"/>
        <rect x="2" y={y(entry) - 7} width="48" height="14" fill="var(--text-0)" rx="2"/>
        <text x="26" y={y(entry) + 3} fontSize="8.5" fill="#000" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">{fmt(entry)}</text>
        <rect x="2" y={y(sl) - 7} width="48" height="14" fill="var(--red)" rx="2"/>
        <text x="26" y={y(sl) + 3} fontSize="8.5" fill="#fff" fontFamily="var(--font-mono)" textAnchor="middle">SL {fmt(sl)}</text>
        <rect x="2" y={y(tp) - 7} width="48" height="14" fill="var(--accent)" rx="2"/>
        <text x="26" y={y(tp) + 3} fontSize="8.5" fill="#000" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">TP {fmt(tp)}</text>
      </svg>
    </div>
  );
}

function TerminalComposePanel({ pair }) {
  const biasCol = pair.bias === 'BULL' ? 'var(--accent)' : pair.bias === 'BEAR' ? 'var(--red)' : 'var(--action)';
  const isLong = pair.bias === 'BULL';
  const stopMul = pair.sym.includes('JPY') ? 0.5 : pair.sym === 'XAU/USD' ? 8 : pair.sym === 'BTC/USD' ? 350 : 0.0022;
  const entry = pair.price;
  const sl = isLong ? entry - stopMul : entry + stopMul;
  const tp = isLong ? entry + stopMul * 2 : entry - stopMul * 2;
  const fmt = (v) => pair.sym.includes('JPY') || pair.sym === 'XAU/USD' ? v.toFixed(2) : pair.sym === 'BTC/USD' ? v.toFixed(1) : v.toFixed(5);

  return (
    <div style={{ borderLeft: '1px solid var(--line)', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: biasCol, display: 'grid', placeItems: 'center' }}><span style={{ color: '#000', fontFamily: 'var(--font-mono)', fontSize: 6, fontWeight: 700 }}>AI</span></span>
        <div className="mono" style={{ fontSize: 9, color: 'var(--text-2)', letterSpacing: '0.1em' }}>COMPOSE TRADE</div>
        <span className="live-dot" style={{ marginLeft: 'auto' }}/>
      </div>

      <div style={{ padding: 12, flex: 1 }}>
        {/* AI thesis */}
        <div style={{ padding: 10, background: 'var(--bg-1)', border: `1px solid ${biasCol}`, borderRadius: 5, marginBottom: 10 }}>
          <div className="mono" style={{ fontSize: 8, color: biasCol, letterSpacing: '0.14em', marginBottom: 5 }}>{pair.bias} · CONF {pair.conf}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-0)', lineHeight: 1.45, fontStyle: 'italic' }}>&ldquo;{pair.thesis}&rdquo;</div>
        </div>

        {/* Visual risk diagram */}
        <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.14em', marginBottom: 6 }}>RISK DIAGRAM</div>
        <div style={{ position: 'relative', height: 48, marginBottom: 10, background: 'var(--bg-2)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
            <div style={{ flex: 1, background: 'var(--red)', opacity: 0.15 }}/>
            <div style={{ flex: 2, background: 'var(--accent)', opacity: 0.15 }}/>
          </div>
          <div style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: 2, background: 'var(--text-0)' }}/>
          <div style={{ position: 'absolute', left: 5, top: 3, fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--red)' }}>-1R</div>
          <div style={{ position: 'absolute', left: 'calc(33.3% + 5px)', top: 3, fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-0)' }}>ENTRY</div>
          <div style={{ position: 'absolute', right: 5, top: 3, fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent)' }}>+2R</div>
          <div style={{ position: 'absolute', left: 5, bottom: 3, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--red)' }}>-$94</div>
          <div style={{ position: 'absolute', right: 5, bottom: 3, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)' }}>+$188</div>
        </div>

        {/* Levels grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
          {[
            ['ENTRY', fmt(entry), 'var(--text-0)'],
            ['SIZE', '0.43 lots', 'var(--text-0)'],
            ['STOP', fmt(sl), 'var(--red)'],
            ['TARGET', fmt(tp), 'var(--accent)'],
          ].map(([k, v, c]) => (
            <div key={k} style={{ padding: '6px 8px', background: 'var(--bg-1)', borderRadius: 3 }}>
              <div className="mono" style={{ fontSize: 7, color: 'var(--text-3)', letterSpacing: '0.12em' }}>{k}</div>
              <div className="mono" style={{ fontSize: 11, color: c, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Execute */}
        <div style={{ padding: '8px 10px', background: biasCol, color: '#000', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', borderRadius: 3, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {isLong ? 'BUY' : pair.bias === 'BEAR' ? 'SELL' : 'WAIT'} {pair.sym} <span style={{ fontSize: 8, opacity: 0.7 }}>⌘ ↵</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- TRUST STRIP ---------- */
function TrustStrip() {
  return (
    <section style={{ padding: '56px 0', borderTop: '1px solid var(--line)', background: 'var(--bg-1)' }}>
      <div className="wrap grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}><span style={{ color: 'var(--accent)' }}>●</span>&nbsp;&nbsp;Regulation & trust</div>
          <div className="display" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.05 }}>Your money, protected by design.</div>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {[
            ['FSCA', 'FSP 51243', 'Regulated by the Financial Sector Conduct Authority of South Africa'],
            ['SEGREGATED', 'Tier-1 banks', 'Client funds held separately from JAFX operating accounts'],
            ['NEG. BALANCE', 'Protected', 'Retail clients cannot lose more than their deposited balance'],
            ['INSURED', '$1M cover', 'Excess-of-regulation insurance on every retail account'],
          ].map(([a,b,c]) => (
            <div key={a} style={{ padding: 28, borderRight: '1px solid var(--line)', minHeight: 160 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.14em' }}>{a}</div>
              <div className="display" style={{ fontSize: 22, marginTop: 10 }}>{b}</div>
              <p style={{ color: 'var(--text-2)', fontSize: 12, lineHeight: 1.5, marginTop: 12 }}>{c}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const quotes = [
    { q: "The copilot caught a setup I'd have missed at 3am. Risk sized automatically. It's weird how good this feels after using MT4 for eight years.", a: 'Dineo M.', r: 'Swing trader · Johannesburg', pnl: '+18.4%', month: 'Mar 2026' },
    { q: "First broker that treats retail like adults. Coaching mode told me I revenge-traded Mondays. Fixed it. P&L up 40% in a quarter.", a: 'Ahmed K.', r: 'Day trader · Dubai', pnl: '+40.1%', month: 'Q1 2026' },
    { q: "I'm a beginner. The copilot explains every setup in plain English. Feels like trading with a mentor, except it works at 2am.", a: 'Sofia R.', r: 'New trader · São Paulo', pnl: '+6.2%', month: '30 days' },
    { q: "API + AI risk engine means I can run four algos without blowing up. The execution is tight. This is what we've wanted for years.", a: 'James L.', r: 'Algo / prop · London', pnl: '+22.8%', month: 'YTD' },
  ];
  return (
    <Section eyebrow="Traders on JAFX" title="Built with, not for.">
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
        {quotes.map((t, i) => (
          <div key={i} style={{
            padding: 'clamp(24px, 4vw, 44px) clamp(20px, 3vw, 40px)',
            borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
            borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
            background: 'var(--bg-1)',
          }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 18 }}>
              {t.pnl} &nbsp;·&nbsp; {t.month}
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.35, margin: 0, color: 'var(--text-0)', letterSpacing: '-0.01em' }}>
              "{t.q}"
            </p>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-0)' }}>{t.a}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, letterSpacing: '0.05em' }}>{t.r}</div>
              </div>
              <Sparkline data={genSpark(18, i*5+3)} w={90} h={28}/>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CTA BAND ---------- */
function CtaBand({ zone = 'execution' }) {
  return (
    <section className={`zone zone-${zone}`} style={{ position: 'relative', padding: 'clamp(72px, 12vw, 120px) 0', borderTop: '1px solid var(--line)', overflow: 'hidden' }}>
      <div className="wrap" style={{ position: 'relative', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--za)', letterSpacing: '0.2em', marginBottom: 24 }}>● NO CREDIT CARD · 60 SECOND SIGNUP</div>
        <h2 className="display" style={{ fontSize: 'clamp(38px, 7vw, 96px)', margin: 0, maxWidth: 1100, marginInline: 'auto', lineHeight: 0.95 }}>
          The best time to trade smarter<br/>was yesterday.
        </h2>
        <div className="cta-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          <a href="trader.html" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 13 }}>Launch terminal <span className="btn-arrow" aria-hidden="true">→</span></a>
          <a href="ai.html" className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: 13 }}>Try AI demo</a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PlatformPreview, TerminalUI, TrustStrip, Testimonials, CtaBand });
