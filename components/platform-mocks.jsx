/* global React */
const { useState: useStateM, useEffect: useEffectM } = React;

/* ============================================================
   Device frames + MT5 chart mocks
   ============================================================ */

/* Generic candle series generator */
function genCandles(seed, n) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const out = [];
  let p = 1.085 + rand() * 0.005;
  for (let i = 0; i < n; i++) {
    const o = p;
    const c = o + (rand() - 0.45) * 0.0012;
    const h = Math.max(o, c) + rand() * 0.0006;
    const l = Math.min(o, c) - rand() * 0.0006;
    out.push({ o, h, l, c });
    p = c;
  }
  return out;
}

function CandleSVG({ width, height, seed = 7, density = 60, padding = 16, accent = 'var(--accent)', red = 'var(--red)', showAxis = true }) {
  const candles = genCandles(seed, density);
  const lo = Math.min(...candles.map(k => k.l));
  const hi = Math.max(...candles.map(k => k.h));
  const range = hi - lo || 1;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const cw = w / density;
  const y = (v) => padding + (1 - (v - lo) / range) * h;
  const x = (i) => padding + i * cw + cw / 2;

  // moving avg
  const ma = candles.map((_, i) => {
    const start = Math.max(0, i - 8);
    const slice = candles.slice(start, i + 1);
    return slice.reduce((s, k) => s + k.c, 0) / slice.length;
  });
  const maPath = ma.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {/* grid */}
      {showAxis && [0.25, 0.5, 0.75].map(g => (
        <line key={g} x1={padding} y1={padding + h * g} x2={width - padding} y2={padding + h * g} stroke="currentColor" strokeOpacity="0.06" strokeDasharray="2 4"/>
      ))}
      {/* candles */}
      {candles.map((k, i) => {
        const up = k.c >= k.o;
        const color = up ? accent : red;
        const yOpen = y(k.o);
        const yClose = y(k.c);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(1, Math.abs(yClose - yOpen));
        const bodyW = Math.max(1.5, cw * 0.6);
        return (
          <g key={i} fill={color} stroke={color}>
            <line x1={x(i)} y1={y(k.h)} x2={x(i)} y2={y(k.l)} strokeWidth="1"/>
            <rect x={x(i) - bodyW / 2} y={top} width={bodyW} height={bodyH}/>
          </g>
        );
      })}
      {/* MA */}
      <path d={maPath} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1"/>
    </svg>
  );
}

/* ============================================================
   Tilt + under-glow + gloss shine (same language as HeroTerminal)
   ============================================================ */
function DeviceShowcaseEffects({
  children,
  borderRadius = 12,
  baseTransform = '',
  maxTilt = 6,
  glowBottom = -55,
  glowBlur = 30,
  glowOpacity = 0.72,
  perspectivePx = 1100,
  style: outerStyle,
}) {
  const [tilt, setTilt] = useStateM({ x: 0, y: 0 });
  const [cursor, setCursor] = useStateM({ x: 0, y: 0 });

  useEffectM(() => {
    const max = maxTilt;
    const handleMouseMove = (e) => {
      const px = e.clientX / window.innerWidth;
      const py = e.clientY / window.innerHeight;
      const nx = (px - 0.5) * 2;
      const ny = (py - 0.5) * 2;
      const rx = (0.5 - py) * (max * 2);
      const ry = (px - 0.5) * (max * 2);
      setTilt({ x: rx, y: ry });
      setCursor({ x: nx, y: ny });
    };
    const reset = () => {
      setTilt({ x: 0, y: 0 });
      setCursor({ x: 0, y: 0 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', reset);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', reset);
    };
  }, [maxTilt]);

  const transform = baseTransform
    ? `${baseTransform} rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`
    : `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`;

  return (
    <div style={{ position: 'relative', perspective: `${perspectivePx}px`, transformStyle: 'preserve-3d', ...outerStyle }}>
      <div style={{
        transform,
        transformOrigin: 'center center',
        transition: 'transform .14s ease-out',
        willChange: 'transform',
        position: 'relative',
        pointerEvents: 'auto',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: glowBottom,
          width: '100%',
          aspectRatio: '20 / 2',
          borderRadius: '100%',
          background: 'rgba(0, 230, 160, 0.34)',
          filter: `blur(${glowBlur}px)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
          zIndex: -1,
        }} />
        {children}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-20% -45%',
            background: 'linear-gradient(110deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))',
            transform: `translateX(${(-cursor.x * 30).toFixed(2)}%)`,
            transition: 'transform .12s ease-out',
            mixBlendMode: 'screen',
          }} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Web Trader mock (compact, used for hero)
   Renders the actual TerminalUI shrunk inside a browser frame
   ============================================================ */
function BrowserFrame({ children, url = 'app.jafx.com/trader', height = 'auto' }) {
  return (
    <div style={{
      border: '1px solid var(--line-strong)',
      borderRadius: 14,
      overflow: 'hidden',
      background: 'var(--bg-0)',
      boxShadow: '0 60px 120px -40px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,229,153,0.10), inset 0 1px 0 rgba(255,255,255,0.03)',
    }}>
      {/* chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--line)'
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: 999, background: c, opacity: 0.85 }}/>
          ))}
        </div>
        <div className="mono" style={{
          flex: 1, textAlign: 'center',
          fontSize: 11, color: 'var(--text-2)',
          padding: '4px 12px',
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 6,
          maxWidth: 380, marginInline: 'auto',
          letterSpacing: '0.04em'
        }}>
          <span style={{ color: 'var(--accent)' }}>●</span>&nbsp;&nbsp;{url}
        </div>
        <div style={{ width: 50 }}/>
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

/* ============================================================
   Phone frame — used for web trader mobile + iOS MT5 + Android MT5
   ============================================================ */
function PhoneFrame({ children, width = 280, height = 580, os = 'ios', accent }) {
  const radius = os === 'ios' ? 28 : 22;
  const innerRadius = os === 'ios' ? 20 : 16;
  return (
    <div style={{
      width, height,
      background: '#0b0d10',
      border: '1px solid var(--line-strong)',
      borderRadius: radius,
      padding: 8,
      position: 'relative',
      boxShadow: '0 60px 120px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset',
      flexShrink: 0,
    }}>
      {/* notch / dynamic island */}
      {os === 'ios' && (
        <div style={{
          position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
          width: 90, height: 26, borderRadius: 999,
          background: '#000', zIndex: 10,
        }}/>
      )}
      {os === 'android' && (
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: 999,
          background: '#000', border: '1px solid #1a1c1f', zIndex: 10,
        }}/>
      )}
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--bg-0)',
        borderRadius: innerRadius,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Phone status bar
   ============================================================ */
function PhoneStatus({ time = '9:41', os = 'ios' }) {
  return (
    <div style={{
      height: os === 'ios' ? 44 : 30,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: os === 'ios' ? '0 24px 8px' : '0 16px 6px',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      color: 'var(--text-0)', fontWeight: 600,
    }}>
      <span>{time}</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', gap: 1, alignItems: 'flex-end' }}>
          {[3,5,7,9].map(h => <span key={h} style={{ width: 3, height: h, background: 'var(--text-0)', borderRadius: 1 }}/>)}
        </span>
        <span style={{ width: 14, height: 9, border: '1px solid var(--text-0)', borderRadius: 2, position: 'relative', padding: 1 }}>
          <span style={{ display: 'block', width: '70%', height: '100%', background: 'var(--accent)', borderRadius: 1 }}/>
        </span>
      </span>
    </div>
  );
}

/* ============================================================
   JAFX Web Trader — mobile screen
   ============================================================ */
function JafxMobileScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' }}>
      <PhoneStatus os="ios"/>
      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 12px' }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.16em' }}>JAFX</div>
        <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', color: '#000', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>AI</div>
      </div>
      {/* big pair */}
      <div style={{ padding: '8px 18px 12px' }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>EUR/USD</div>
        <div className="display" style={{ fontSize: 36, color: 'var(--text-0)', marginTop: 4, lineHeight: 1, letterSpacing: '-0.02em' }}>1.08472</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', marginTop: 6 }}>▲ 0.24% · 78% conf · BULL</div>
      </div>
      {/* chart */}
      <div style={{ flex: 1, color: 'var(--accent)', minHeight: 0 }}>
        <CandleSVG width={300} height={200} seed={11} density={36} padding={6}/>
      </div>
      {/* AI line */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 4 }}>● AI READ</div>
        <div style={{ fontSize: 11, color: 'var(--text-1)', lineHeight: 1.4 }}>1H base · DXY rolling. Long above 1.0836. Setup ready to fire.</div>
      </div>
      {/* buy / sell */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 12 }}>
        <div style={{ padding: '14px 0', borderRadius: 8, background: 'rgba(220,76,69,0.12)', border: '1px solid rgba(220,76,69,0.3)', textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: '0.12em' }}>SELL</div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--text-0)', marginTop: 4 }}>1.08470</div>
        </div>
        <div style={{ padding: '14px 0', borderRadius: 8, background: 'rgba(0,229,153,0.14)', border: '1px solid var(--accent)', textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em' }}>BUY</div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--text-0)', marginTop: 4 }}>1.08474</div>
        </div>
      </div>
      {/* tab bar */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--line)', padding: '6px 0 10px', background: 'var(--bg-1)' }}>
        {['Trade','Watch','Copilot','Account'].map((t,i) => (
          <div key={t} style={{ flex: 1, textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 8.5, color: i === 0 ? 'var(--accent)' : 'var(--text-3)', letterSpacing: '0.1em' }}>{t.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MT5 chart screen — used in desktop + mobile mockups
   ============================================================ */
function MT5ChartView({ symbol = 'EURUSD', price = '1.08472', change = '+0.24%', positive = true, dense = 80 }) {
  const up = 'var(--accent)';
  const down = 'var(--red)';
  return (
    <div style={{ background: 'var(--bg-0)', color: 'var(--text-0)', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-mono)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '4px 8px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', fontSize: 10 }}>
        <span style={{ color: 'var(--text-0)', fontWeight: 600, letterSpacing: '0.04em' }}>{symbol},M15</span>
        <span style={{ marginLeft: 12, color: positive ? up : down }}>{price}</span>
        <span style={{ marginLeft: 8, color: positive ? up : down, fontSize: 9 }}>{change}</span>
        <div style={{ flex: 1 }}/>
        <span style={{ color: 'var(--text-3)', fontSize: 9 }}>M1 M5 M15 H1 H4 D1 W1</span>
      </div>
      <div style={{ flex: 1, position: 'relative', minHeight: 0, color: positive ? up : down }}>
        <CandleSVG width={500} height={260} seed={dense} density={dense} padding={8} accent="var(--accent)" red="var(--red)"/>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, background: 'var(--bg-0)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '8px 6px', fontSize: 8.5, color: 'var(--text-3)', textAlign: 'right' }}>
          <span>1.08620</span><span>1.08540</span><span style={{ color: 'var(--accent)' }}>1.08472</span><span>1.08400</span><span>1.08320</span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 40, bottom: 0, height: 16, background: 'var(--bg-0)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: 8.5, color: 'var(--text-3)' }}>
          <span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MT5 Desktop mock — browser-style title bar (traffic lights + pill)
   ============================================================ */
function MT5Desktop() {
  const titleBar = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: 'var(--bg-2)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: 999, background: c, opacity: 0.85 }}/>
        ))}
      </div>
      <div className="mono" style={{
        flex: 1, textAlign: 'center',
        fontSize: 11, color: 'var(--text-2)',
        padding: '4px 12px',
        background: 'var(--bg-1)',
        border: '1px solid var(--line)',
        borderRadius: 6,
        maxWidth: 380, marginInline: 'auto',
        letterSpacing: '0.04em',
      }}>
        <span style={{ color: 'var(--accent)' }}>●</span>&nbsp;&nbsp;MetaTrader 5 — JAFX-Live · 142,830.45 USD
      </div>
      <div style={{ width: 50 }}/>
    </div>
  );

  return (
    <div style={{
      border: '1px solid var(--line-strong)',
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--bg-0)',
      boxShadow: '0 60px 120px -40px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,229,153,0.10), inset 0 1px 0 rgba(255,255,255,0.03)',
      fontFamily: 'var(--font-mono)',
    }}>
      {titleBar}
      <div style={{ display: 'flex', gap: 14, padding: '4px 12px', background: 'var(--bg-1)', borderBottom: '1px solid var(--line)', fontSize: 10.5, color: 'var(--text-0)' }}>
        {['File','View','Insert','Charts','Tools','Window','Help'].map(t => <span key={t}>{t}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: 'var(--bg-0)', borderBottom: '1px solid var(--line)' }}>
        {Array.from({length: 16}).map((_,i) => (
          <span key={i} style={{ width: 16, height: 16, background: 'var(--bg-3)', borderRadius: 2, display: 'inline-block' }}/>
        ))}
        <div style={{ flex: 1 }}/>
        {['M1','M5','M15','M30','H1','H4','D1','W1','MN'].map(t => (
          <span key={t} style={{ padding: '2px 6px', fontSize: 9.5, color: 'var(--text-0)', background: t === 'M15' ? 'var(--bg-3)' : 'transparent', borderRadius: 2 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 200px', minHeight: 360 }}>
        <div style={{ borderRight: '1px solid var(--line)', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '4px 8px', background: 'var(--bg-2)', fontSize: 9.5, color: 'var(--text-0)', letterSpacing: '0.04em' }}>Market Watch: 14:32:18</div>
          <div style={{ flex: 1, fontSize: 10, color: 'var(--text-0)' }}>
            {[
              ['EURUSD', '1.08469', '1.08472', true],
              ['GBPUSD', '1.26337', '1.26341', true],
              ['USDJPY', '156.842', '156.846', false],
              ['XAUUSD', '2348.10', '2348.14', true],
              ['BTCUSD', '67841.0', '67847.5', false],
              ['AUDUSD', '0.66482', '0.66485', true],
              ['USDCAD', '1.36742', '1.36746', false],
              ['NZDUSD', '0.61227', '0.61231', true],
              ['EURGBP', '0.85847', '0.85850', true],
              ['USDCHF', '0.90134', '0.90137', false],
            ].map(([s, b, a, bull]) => {
              const col = bull ? 'var(--accent)' : 'var(--red)';
              return (
                <div key={s} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', padding: '3px 8px', borderBottom: '1px solid var(--line)' }}>
                  <span>{s}</span>
                  <span style={{ color: col, textAlign: 'right' }}>{b}</span>
                  <span style={{ color: col, textAlign: 'right' }}>{a}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: 'var(--bg-0)' }}>
          <MT5ChartView/>
        </div>
        <div style={{ borderLeft: '1px solid var(--line)', background: 'var(--bg-0)', fontSize: 10, color: 'var(--text-0)' }}>
          <div style={{ padding: '4px 8px', background: 'var(--bg-2)', letterSpacing: '0.04em' }}>Navigator</div>
          {[
            ['📁', 'Accounts'],
            ['  ', '142830 — JAFX-Live'],
            ['📁', 'Indicators'],
            ['  ', 'Bollinger Bands'],
            ['  ', 'MACD'],
            ['  ', 'RSI'],
            ['📁', 'Expert Advisors'],
            ['  ', 'JAFX-Copilot.ex5'],
            ['  ', 'TrendRider v3'],
            ['📁', 'Scripts'],
            ['📁', 'Services'],
          ].map(([i, t], k) => (
            <div key={k} style={{ padding: '3px 10px' }}>
              <span style={{ marginRight: 6 }}>{i}</span>{t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-0)', fontSize: 10, color: 'var(--text-0)' }}>
        <div style={{ display: 'flex', gap: 0, background: 'var(--bg-2)', borderBottom: '1px solid var(--line)' }}>
          {['Trade','Exposure','History','News','Mailbox','Experts','Journal'].map((t,i) => (
            <span key={t} style={{ padding: '4px 10px', borderRight: '1px solid var(--line)', background: i === 0 ? 'var(--bg-0)' : 'transparent', fontSize: 10 }}>{t}</span>
          ))}
        </div>
        <div style={{ padding: '6px 10px', display: 'grid', gridTemplateColumns: '60px 70px 80px 60px 70px 70px 70px 1fr 80px', gap: 4 }}>
          {['Order','Symbol','Type','Vol','Price','S/L','T/P','Comment','Profit'].map((h, i) => (
            <span key={h} style={{ color: 'var(--text-3)', textAlign: i === 8 ? 'right' : 'left' }}>{h}</span>
          ))}
        </div>
        <div style={{ padding: '4px 10px', display: 'grid', gridTemplateColumns: '60px 70px 80px 60px 70px 70px 70px 1fr 80px', gap: 4, borderTop: '1px solid var(--line)' }}>
          <span>284701</span><span>EURUSD</span><span style={{ color: 'var(--accent)' }}>buy</span><span>0.50</span><span>1.08412</span><span>1.08200</span><span>1.08920</span><span style={{ color: 'var(--text-3)' }}>AI-suggested · 2R bracket</span><span style={{ color: 'var(--accent)', textAlign: 'right' }}>+30.00</span>
        </div>
        <div style={{ padding: '4px 10px', display: 'grid', gridTemplateColumns: '60px 70px 80px 60px 70px 70px 70px 1fr 80px', gap: 4, borderTop: '1px solid var(--line)' }}>
          <span>284692</span><span>XAUUSD</span><span style={{ color: 'var(--accent)' }}>buy</span><span>0.10</span><span>2342.40</span><span>2336.00</span><span>2362.00</span><span style={{ color: 'var(--text-3)' }}>copilot · trend continuation</span><span style={{ color: 'var(--accent)', textAlign: 'right' }}>+57.20</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MT5 Mobile screen (iOS / Android)
   ============================================================ */
function MT5MobileScreen({ os = 'ios' }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)', color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>
      <div style={{ height: os === 'ios' ? 44 : 30, padding: os === 'ios' ? '0 24px 8px' : '0 16px 6px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 5 }}>
          <span style={{ display: 'inline-flex', gap: 1, alignItems: 'flex-end' }}>
            {[3,5,7,9].map(h => <span key={h} style={{ width: 3, height: h, background: 'var(--text-0)', borderRadius: 1 }}/>)}
          </span>
          <span style={{ width: 14, height: 9, border: '1px solid var(--text-0)', borderRadius: 2, padding: 1 }}>
            <span style={{ display: 'block', width: '70%', height: '100%', background: 'var(--accent)', borderRadius: 1 }}/>
          </span>
        </span>
      </div>
      <div style={{ padding: '4px 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-0)' }}>EURUSD,M15</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>⚙</span>
      </div>
      <div style={{ padding: '4px 14px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 22, color: 'var(--red)', fontWeight: 600 }}>1.08469</span>
          <span style={{ fontSize: 22, color: 'var(--accent)', fontWeight: 600 }}>1.08472</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>
          <span>BID</span><span>SPREAD 0.3</span><span>ASK</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <MT5ChartView/>
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid var(--line)', padding: os === 'ios' ? '8px 0 14px' : '6px 0 10px', background: 'var(--bg-2)' }}>
        {[['Quotes','◧'],['Charts','▦'],['Trade','⇅'],['History','⏱'],['Settings','⚙']].map(([t, ic], i) => (
          <div key={t} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: i === 1 ? 'var(--accent)' : 'var(--text-3)' }}>{ic}</div>
            <div style={{ fontSize: 8.5, color: i === 1 ? 'var(--accent)' : 'var(--text-3)', letterSpacing: '0.06em', marginTop: 2 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  BrowserFrame, PhoneFrame, PhoneStatus, JafxMobileScreen,
  MT5Desktop, MT5MobileScreen, MT5ChartView, CandleSVG,
  DeviceShowcaseEffects,
});
