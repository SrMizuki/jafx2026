/* Feature Showcase — flagship terminal capabilities, brought to life across the site.
   Sections: CanvasShowcase · TicketShowcase · PositionShowcase · NudgeShowcase · StackedShowcase
   Plus FeatureGrid and FeatureStrip for compact versions. */

const { useState: useStateF, useEffect: useEffectF, useRef: useRefF } = React;

/* ---------- shared helpers ---------- */
function FsEyebrow({ idx, children }) {
  return (
    <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: 'var(--text-3)' }}>0{idx} /</span> {children}
    </div>
  );
}
function FsLabel({ children, color = 'var(--text-3)' }) {
  return <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', color, textTransform: 'uppercase' }}>{children}</span>;
}
function FsChip({ children, color, filled }) {
  return (
    <span className="mono" style={{
      fontSize: 10, padding: '4px 8px', letterSpacing: '0.1em',
      border: `1px solid ${color || 'var(--line-strong)'}`,
      color: filled ? '#000' : (color || 'var(--text-1)'),
      background: filled ? (color || 'var(--accent)') : 'transparent',
      borderRadius: 3, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

/* ============================================================
   FEATURE GRID — a 5-up overview of all flagship capabilities
   ============================================================ */
function FeatureGrid({ title = "Six AI moments your broker should already do", eyebrow = "Why JAFX is different", intro = "Every trade on JAFX passes through six AI surfaces. Each is a full intelligence layer — not a button on a toolbar.", zone = "intel" }) {
  const items = [
    {
      id: 'workspace', k: '01', t: 'Copilot canvas',
      d: 'Ask, chart, size, fire — all inside one conversation. Cards stack on the canvas as you go.',
      glyph: <GlyphCanvas/>,
    },
    {
      id: 'ticket', k: '02', t: 'AI order ticket',
      d: 'The copilot drafts the order. You review its reasoning, risk and post-fill impact. ⌘+Enter executes.',
      glyph: <GlyphTicket/>,
    },
    {
      id: 'position', k: '03', t: 'Live narration',
      d: 'Every open position is watched and explained. Trails, exits and news risk, spoken in plain English.',
      glyph: <GlyphPosition/>,
    },
    {
      id: 'nudge', k: '04', t: 'Proactive nudges',
      d: 'The AI taps you on the shoulder when something matters. Ignored if it\'s noise, timely when it\'s not.',
      glyph: <GlyphNudge/>,
    },
    {
      id: 'stacked', k: '05', t: 'Stacked thread',
      d: 'Conversation-first workspace for research. Pin cards to keep them. Nothing scrolls away that matters.',
      glyph: <GlyphStacked/>,
    },
    {
      id: 'journal', k: '06', t: 'Auto journal',
      d: 'Every fill, exit, and decision logged automatically. Weekly review writes itself — strengths, leaks, edge.',
      glyph: <GlyphJournal/>,
    },
  ];
  return (
    <Section eyebrow={eyebrow} title={title} intro={intro} zone={zone}>
      <div className="grid-4" data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)' }}>
        {items.map((it, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
          <a key={it.id} href={`trader.html#${it.id}`} style={{
            padding: '32px 24px 28px',
            borderRight: col < 2 ? '1px solid var(--line)' : 'none',
            borderBottom: row < 1 ? '1px solid var(--line)' : 'none',
            display: 'flex', flexDirection: 'column', minHeight: 280,
            position: 'relative',
            overflow: 'hidden',
            transition: 'background .22s ease, transform .22s ease, box-shadow .22s ease',
          }} onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent)';
            const glyph = e.currentTarget.querySelector('.moment-glyph');
            if (glyph) glyph.style.transform = 'scale(1.06)';
            const shine = e.currentTarget.querySelector('.moment-shine');
            if (shine) {
              shine.style.opacity = '0.34';
              shine.style.transform = 'translateX(320%) skewX(-18deg)';
            }
          }} onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            const glyph = e.currentTarget.querySelector('.moment-glyph');
            if (glyph) glyph.style.transform = 'scale(1)';
            const shine = e.currentTarget.querySelector('.moment-shine');
            if (shine) {
              shine.style.opacity = '0';
              shine.style.transform = 'translateX(-160%) skewX(-18deg)';
            }
          }}>
            <div
              className="moment-shine"
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
              }} />
            <div style={{ height: 120, marginBottom: 40 }}>
              <div className="moment-glyph" style={{ width: '100%', height: '100%', transition: 'transform .22s ease' }}>
                {it.glyph}
              </div>
            </div>
            <FsLabel color="var(--text-3)">MOMENT {it.k}</FsLabel>
            <div className="display" style={{ fontSize: 20, marginTop: 10, color: 'var(--text-0)' }}>{it.t}</div>
            <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.55, marginTop: 10, marginBottom: 0, flex: 1 }}>{it.d}</p>
            <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.14em', marginTop: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
              OPEN IN TERMINAL <span style={{ fontSize: 12 }}>→</span>
            </div>
          </a>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <a href="ai.html" className="btn btn-primary">See the full AI Copilot <span className="btn-arrow" aria-hidden="true">→</span></a>
      </div>
    </Section>
  );
}

/* Tiny abstract glyphs per feature — no emoji, no stock icons */
function GlyphCanvas() {
  return (
    <img
      src="assets/ai-moment-01.svg"
      alt="AI moment preview"
      width="100%"
      height="100%"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
function GlyphTicket() {
  return (
    <img
      src="assets/ai-moment-02.svg"
      alt="AI moment preview"
      width="100%"
      height="100%"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
function GlyphPosition() {
  return (
    <img
      src="assets/ai-moment-03.svg"
      alt="AI moment preview"
      width="100%"
      height="100%"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
function GlyphNudge() {
  return (
    <img
      src="assets/ai-moment-04.svg"
      alt="AI moment preview"
      width="100%"
      height="100%"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
function GlyphStacked() {
  return (
    <img
      src="assets/ai-moment-05.svg"
      alt="AI moment preview"
      width="100%"
      height="100%"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
function GlyphJournal() {
  return (
    <img
      src="assets/ai-moment-06.svg"
      alt="AI moment preview"
      width="100%"
      height="100%"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}

/* ============================================================
   01 · COPILOT CANVAS SHOWCASE
   ============================================================ */
function CanvasShowcase({ align = 'left' }) {
  const [tab, setTab] = useStateF(0);
  const threads = [
    [
      { r: 'you', t: "Is EUR/USD a buy here? What's your setup?" },
      { r: 'ai', t: "Yes — clean long on the 1H. Support at 1.0821 held 3× overnight with a bullish engulfing on the last retest. DXY rolling below its 4H 50-EMA. I've drawn the trade below." },
      { r: 'card', kind: 'trade' },
      { r: 'you', t: "Show me DXY alongside" },
      { r: 'ai', t: "Trendline break confirmed below 104.20. Targeting 103.40 over the next 3–5 sessions.", streaming: true },
      { r: 'card', kind: 'chart' },
    ],
    [
      { r: 'you', t: "What's my cleanest setup right now?" },
      { r: 'ai', t: "GBP/JPY long — 87% historical hit-rate on this exact setup. Entry 198.60, stop 197.90, target 200.10." },
      { r: 'card', kind: 'trade' },
      { r: 'you', t: "Size me 0.5% risk" },
      { r: 'ai', t: "0.32 lots. $127 at risk for $254 target. Bracket ready to fire.", streaming: true },
    ],
  ];
  const cur = threads[tab];

  return (
    <section style={{ padding: 'clamp(64px, 9vw, 112px) 0', borderTop: '1px solid var(--line)', position: 'relative' }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: align === 'left' ? '1fr 1.3fr' : '1.3fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ order: align === 'right' ? 2 : 0 }}>
            <FsEyebrow idx="1">COPILOT CANVAS</FsEyebrow>
            <h2 className="display" style={{ fontSize: 'clamp(38px, 4.4vw, 56px)', margin: 0, letterSpacing: '-0.03em' }}>
              A conversation that <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>charts itself</em>.
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, marginTop: 24, maxWidth: 480 }}>
              Ask in plain English. The copilot answers with charts, setups and risk-sized orders — stacked on a living canvas you can re-read, pin and re-run.
            </p>
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 36, maxWidth: 480 }}>
              {[
                ['Inline cards', 'Charts, trade ideas and size calcs appear in the thread, not a side panel.'],
                ['Auto-saved', 'Every canvas is kept. Re-open a setup from last Tuesday; it\'s exactly as you left it.'],
                ['Pin to keep', 'One click turns a card into a permanent reference. Everything else can scroll away.'],
                ['Suggestion chips', 'The AI offers the next three moves. Click, no typing.'],
              ].map(([k, v]) => (
                <div key={k}>
                  <FsLabel color="var(--accent)">● {k.toUpperCase()}</FsLabel>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5, marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <a href="trader.html#workspace" className="btn btn-primary">Open canvas <span className="btn-arrow" aria-hidden="true">→</span></a>
              <a href="ai.html" className="btn btn-ghost">Try the demo</a>
            </div>
          </div>

          <div style={{ order: align === 'right' ? 1 : 2 }}>
            <MockCanvas tab={tab} setTab={setTab} messages={cur}/>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockCanvas({ tab, setTab, messages }) {
  return (
    <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-0)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7)' }}>
      {/* canvas header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)' }}>
        <FsLabel color="var(--accent)">● CANVAS</FsLabel>
        <span style={{ fontSize: 12, color: 'var(--text-0)' }}>EUR/USD · pre-London</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>· 3 cards · auto-saved</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['EUR setup', 'GBP/JPY long', '+ New'].map((t, i) => (
            <button key={t} onClick={() => t.startsWith('+') ? null : setTab(i)} style={{
              padding: '4px 10px', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
              border: '1px solid var(--line)', borderRadius: 3, cursor: 'pointer',
              background: (tab === i && !t.startsWith('+')) ? 'var(--bg-3)' : 'transparent',
              color: t.startsWith('+') ? 'var(--text-2)' : (tab === i ? 'var(--text-0)' : 'var(--text-2)'),
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 24px', minHeight: 420, maxHeight: 520, overflowY: 'auto' }}>
        {messages.map((m, i) => {
          if (m.r === 'card' && m.kind === 'trade') return <MockTradeCard key={i}/>;
          if (m.r === 'card' && m.kind === 'chart') return <MockChartCard key={i}/>;
          return <MockBubble key={i} who={m.r} text={m.t} streaming={m.streaming}/>;
        })}
      </div>

      {/* composer */}
      <div style={{ padding: 12, borderTop: '1px solid var(--line)', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {['Size it at 0.5% risk', 'What if DXY holds?', 'Set bracket at 2R', 'Similar setups last 6mo'].map(s => (
            <span key={s} className="mono" style={{ fontSize: 10, padding: '4px 9px', border: '1px solid var(--line)', color: 'var(--text-2)', borderRadius: 3 }}>{s}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 6 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>●</span>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--text-2)' }}>Ask the canvas, or paste a pair…</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>⌘ K</span>
        </div>
      </div>
    </div>
  );
}

function MockBubble({ who, text, streaming }) {
  const isAi = who === 'ai';
  return (
    <div style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
      <div style={{
        width: 22, height: 22, flexShrink: 0, borderRadius: '50%',
        background: isAi ? 'var(--accent)' : 'var(--bg-3)',
        color: isAi ? '#000' : 'var(--text-1)',
        display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700,
      }}>{isAi ? 'AI' : 'Y'}</div>
      <div style={{ fontSize: 13, color: isAi ? 'var(--text-0)' : 'var(--text-1)', lineHeight: 1.55, paddingTop: 3 }}>
        {text}
        {streaming && <span style={{ display: 'inline-block', width: 6, height: 12, background: 'var(--accent)', marginLeft: 4, verticalAlign: 'middle', animation: 'pulse-dot 0.9s infinite' }}/>}
      </div>
    </div>
  );
}

function MockTradeCard() {
  return (
    <div style={{ marginLeft: 32, margin: '10px 0 10px 32px', border: '1px solid var(--line-strong)', borderLeft: '3px solid var(--accent)', borderRadius: 6, background: 'var(--bg-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <FsChip color="var(--accent)" filled>BUY</FsChip>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text-0)' }}>EUR/USD · 1H</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', marginLeft: 'auto' }}>CONF 78% · 2.0R</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <MiniChartBars/>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
          {[
            ['ENTRY', '1.08680', 'var(--text-0)'],
            ['STOP', '1.08420', 'var(--red)'],
            ['TARGET', '1.09200', 'var(--accent)'],
            ['SIZE', '0.50 lots', 'var(--text-0)'],
          ].map(([k, v, c]) => (
            <div key={k}>
              <FsLabel>{k}</FsLabel>
              <div className="mono" style={{ fontSize: 13, color: c, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '8px 14px', borderTop: '1px solid var(--line)' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', padding: '4px 8px', border: '1px solid var(--accent)', borderRadius: 3 }}>Apply to ticket</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)', padding: '4px 8px', border: '1px solid var(--line)', borderRadius: 3 }}>Pin</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)', padding: '4px 8px', border: '1px solid var(--line)', borderRadius: 3 }}>Tighten stop</span>
      </div>
    </div>
  );
}

function MockChartCard() {
  return (
    <div style={{ margin: '10px 0 10px 32px', border: '1px solid var(--line-strong)', borderRadius: 6, background: 'var(--bg-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <FsChip color="var(--brand)">CHART</FsChip>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text-0)' }}>DXY · 4H</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)', marginLeft: 'auto' }}>TRENDLINE BREAK</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <MiniChartLine/>
      </div>
    </div>
  );
}

function MiniChartBars() {
  // Generate a seeded candle series
  const data = [];
  let p = 100;
  for (let i = 0; i < 40; i++) {
    const o = p;
    const c = p + (Math.sin(i * 0.7) * 3 + Math.cos(i * 0.3) * 2 + (i > 30 ? 1 : 0));
    const h = Math.max(o, c) + 1.5;
    const l = Math.min(o, c) - 1.5;
    data.push({ o, h, l, c });
    p = c;
  }
  const min = Math.min(...data.map(d => d.l)) - 1;
  const max = Math.max(...data.map(d => d.h)) + 1;
  const W = 520, H = 110;
  const xw = W / data.length;
  const y = (v) => H - ((v - min) / (max - min)) * H;

  const entryY = y(data[data.length - 5].c + 0.5);
  const slY = y(data[data.length - 5].c - 2.8);
  const tpY = y(data[data.length - 5].c + 3.2);

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%', height: 150, display: 'block' }}>
      {/* grid */}
      {[0.25, 0.5, 0.75].map(f => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)"/>)}
      {/* SL zone */}
      <rect x="0" y={entryY} width={W} height={slY - entryY} fill="var(--red)" opacity="0.06"/>
      {/* TP zone */}
      <rect x="0" y={tpY} width={W} height={entryY - tpY} fill="var(--accent)" opacity="0.06"/>
      {/* candles */}
      {data.map((d, i) => {
        const up = d.c >= d.o;
        const col = up ? 'var(--accent)' : 'var(--red)';
        return (
          <g key={i}>
            <line x1={i * xw + xw / 2} x2={i * xw + xw / 2} y1={y(d.h)} y2={y(d.l)} stroke={col} strokeWidth="1"/>
            <rect x={i * xw + 1.5} y={Math.min(y(d.o), y(d.c))} width={xw - 3} height={Math.max(1, Math.abs(y(d.o) - y(d.c)))} fill={col}/>
          </g>
        );
      })}
      {/* level lines */}
      <line x1="0" x2={W} y1={entryY} y2={entryY} stroke="var(--text-0)" strokeDasharray="3,3" strokeWidth="1"/>
      <line x1="0" x2={W} y1={slY} y2={slY} stroke="var(--red)" strokeDasharray="3,3" strokeWidth="1"/>
      <line x1="0" x2={W} y1={tpY} y2={tpY} stroke="var(--accent)" strokeDasharray="3,3" strokeWidth="1"/>
      <text x={W - 6} y={entryY - 3} fontSize="9" fill="var(--text-0)" fontFamily="var(--font-mono)" textAnchor="end">ENTRY 1.0868</text>
      <text x={W - 6} y={slY - 3} fontSize="9" fill="var(--red)" fontFamily="var(--font-mono)" textAnchor="end">SL 1.0842</text>
      <text x={W - 6} y={tpY - 3} fontSize="9" fill="var(--accent)" fontFamily="var(--font-mono)" textAnchor="end">TP 1.0920</text>
    </svg>
  );
}

function MiniChartLine() {
  const data = [];
  for (let i = 0; i < 60; i++) data.push(10 + Math.sin(i * 0.12) * 2 - i * 0.04 + Math.cos(i * 0.4) * 0.7);
  const W = 520, H = 90;
  const min = Math.min(...data) - 0.5;
  const max = Math.max(...data) + 0.5;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * W},${H - ((d - min) / (max - min)) * H}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 110, display: 'block' }}>
      <defs>
        <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#gradLine)"/>
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="0" x2={W} y1={H - ((12 - min) / (max - min)) * H} y2={H - ((12 - min) / (max - min)) * H} stroke="var(--action)" strokeDasharray="4,3"/>
      <text x={W - 6} y={H - ((12 - min) / (max - min)) * H - 3} fontSize="9" fill="var(--action)" fontFamily="var(--font-mono)" textAnchor="end">104.20 · TL BREAK</text>
    </svg>
  );
}

/* ============================================================
   02 · AI ORDER TICKET SHOWCASE
   ============================================================ */
function TicketShowcase({ align = 'right' }) {
  return (
    <section style={{ padding: 'clamp(64px, 9vw, 112px) 0', borderTop: '1px solid var(--line)', background: 'var(--bg-1)', position: 'relative' }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: align === 'left' ? '1fr 1.3fr' : '1.3fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ order: align === 'right' ? 2 : 0 }}>
            <FsEyebrow idx="2">AI ORDER TICKET</FsEyebrow>
            <h2 className="display" style={{ fontSize: 'clamp(38px, 4.4vw, 56px)', margin: 0 }}>
              The order is drafted.<br/>
              <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>You review, not write.</em>
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, marginTop: 24, maxWidth: 480 }}>
              Say <span className="mono" style={{ color: 'var(--accent)' }}>"short EURUSD at 1.0920, 2R bracket"</span>. The AI writes the ticket with entry, stop, target, size, and the four reasons behind each level. Fire it with one keystroke.
            </p>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
              {[
                ['Why these levels', '4 sentences — structural, volatility, liquidity, sizing — one per row.'],
                ['Risk preview, after fill', 'Free margin, margin level, risk on book, max drawdown — recomputed live.'],
                ['Correlation check', 'Warns if a fill doubles your net exposure or fights another open trade.'],
                ['Keyboard-native', '⌘+Enter executes. Tab cycles fields. Nothing on this screen needs a mouse.'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                  <FsLabel color="var(--accent)">● {k.toUpperCase()}</FsLabel>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <a href="trader.html#ticket" className="btn btn-primary">Open the ticket <span className="btn-arrow" aria-hidden="true">→</span></a>
              <a href="platform.html" className="btn btn-ghost">Execution engine</a>
            </div>
          </div>

          <div style={{ order: align === 'right' ? 1 : 2 }}>
            <MockTicket/>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockTicket() {
  return (
    <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-0)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7)' }}>
      {/* header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FsChip color="var(--accent)" filled>REVIEW · AI-SUGGESTED ORDER</FsChip>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>⌘ + ENTER TO EXECUTE</span>
      </div>

      {/* User prompt */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 6 }}>YOU</div>
        <div style={{ fontSize: 13, color: 'var(--text-1)' }}>"Short EURUSD at the 1.0920 swing, 2R bracket."</div>
      </div>

      {/* Draft order */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <FsChip color="var(--red)" filled>SELL</FsChip>
          <span className="mono" style={{ fontSize: 14, color: 'var(--text-0)' }}>EUR/USD</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>sell-limit · 4H</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 'auto' }}>CONF 71% · 2.0R</span>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            ['ENTRY', '1.09200', 'var(--text-0)'],
            ['STOP', '1.09460', 'var(--red)'],
            ['TARGET', '1.08680', 'var(--accent)'],
            ['SIZE', '0.38 LOTS', 'var(--text-0)'],
          ].map(([k, v, c]) => (
            <div key={k} style={{ padding: 10, background: 'var(--bg-2)', borderRadius: 4 }}>
              <FsLabel>{k}</FsLabel>
              <div className="mono" style={{ fontSize: 15, color: c, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why these levels */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <FsLabel color="var(--brand)">◆ WHY THESE LEVELS</FsLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
          {[
            ['ENTRY · 1.0920', 'Prior 4H swing high. Last 3 taps rejected.'],
            ['STOP · 1.0946', 'Above structural peak + 1.2× ATR noise buffer.'],
            ['TARGET · 1.0868', 'Overnight low × VWAP confluence. Clean 2R.'],
            ['SIZE · 0.38 LOTS', '0.5% of $24.2k equity / 26-pip stop.'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-1)', lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk preview */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)' }}>
        <FsLabel color="var(--action)">◆ RISK PREVIEW · AFTER FILL</FsLabel>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 10 }}>
          {[
            ['Free margin', '$22,738', 'var(--text-0)'],
            ['Margin level', '1,721%', 'var(--accent)'],
            ['Risk on book', '$327 (1.35%)', 'var(--text-0)'],
            ['Max drawdown', '-$430 (-1.78%)', 'var(--action)'],
          ].map(([k, v, c]) => (
            <div key={k}>
              <FsLabel>{k}</FsLabel>
              <div className="mono" style={{ fontSize: 13, color: c, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>Correlation w/ EUR/USD long: <span style={{ color: 'var(--action)' }}>-1.00</span></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <FsChip>Tighten stop</FsChip>
          <FsChip>Scale in</FsChip>
          <span className="mono" style={{ fontSize: 11, padding: '6px 14px', background: 'var(--accent)', color: '#000', borderRadius: 4, letterSpacing: '0.1em', fontWeight: 600 }}>EXECUTE ⌘↵</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   03 · LIVE POSITION SHOWCASE — rotating AI narration
   ============================================================ */
function PositionShowcase({ align = 'left' }) {
  const narrations = [
    "XAU/USD is approaching the overnight VWAP at 2,349.50. Momentum on 15m is fading — last 3 candles each printed lower highs. You're up $46.80, about 58% of the way to TP.",
    "Now testing 2,349.50. Volume's thin — classic lunch chop. A push above 2,351 likely triggers stops up to 2,355; a rejection sends us to TP within 30–45min. Your stop is 55 pips away, unthreatened.",
    "Rejected. Two bearish engulfing on 5m since my last update. Price now 2,347.40, target 2,335 still 123 pips away. I'd recommend trailing your stop to 2,354. Want me to do it?",
  ];
  const [idx, setIdx] = useStateF(0);
  useEffectF(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % narrations.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: 'clamp(64px, 9vw, 112px) 0', borderTop: '1px solid var(--line)', position: 'relative' }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: align === 'left' ? '1fr 1.3fr' : '1.3fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ order: align === 'right' ? 2 : 0 }}>
            <FsEyebrow idx="3">LIVE POSITION · AI-NARRATED</FsEyebrow>
            <h2 className="display" style={{ fontSize: 'clamp(38px, 4.4vw, 56px)', margin: 0 }}>
              Your positions have <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>a voice</em>.
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, marginTop: 24, maxWidth: 480 }}>
              Every open trade is watched. The AI talks you through the tape in real time — what's happening, what's at stake, and the one adjustment it would make right now.
            </p>
            <div style={{ marginTop: 36 }}>
              {[
                ['Continuous read', 'Updated as the tape moves. Not a report — a running commentary.'],
                ['One-tap actions', 'Trail, partial, close, or move stop-to-breakeven from the bubble.'],
                ['News-aware', 'Flags central bank speakers, economic prints and correlated pair shocks.'],
                ['Exit discipline', 'Suggests partials at R-multiples you\'ve historically failed to take.'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-2)', border: '1px solid var(--accent)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 10, fontFamily: 'var(--font-mono)' }}>●</div>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text-0)' }}>{k}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5, marginTop: 3 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <a href="trader.html#position" className="btn btn-primary">See live positions <span className="btn-arrow" aria-hidden="true">→</span></a>
            </div>
          </div>

          <div style={{ order: align === 'right' ? 1 : 2 }}>
            <MockPositions narration={narrations[idx]} narrationIdx={idx}/>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockPositions({ narration, narrationIdx }) {
  const positions = [
    { pair: 'XAU/USD', side: 'SELL', lots: 0.10, entry: 2352.80, cur: 2348.12, sl: 2362.00, tp: 2335.00, pnl: 46.80, primary: true },
    { pair: 'EUR/USD', side: 'BUY', lots: 0.50, entry: 1.08210, cur: 1.08472, sl: 1.08020, tp: 1.08820, pnl: 131.00 },
    { pair: 'GBP/JPY', side: 'BUY', lots: 0.20, entry: 197.90, cur: 198.47, sl: 197.20, tp: 199.60, pnl: 76.40 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {positions.map((p, i) => (
        <PositionCardMock key={p.pair} p={p} narration={p.primary ? narration : null} narrationIdx={narrationIdx}/>
      ))}
    </div>
  );
}

function PositionCardMock({ p, narration, narrationIdx }) {
  // compute progress from SL to TP
  const range = p.side === 'BUY' ? (p.tp - p.sl) : (p.sl - p.tp);
  const progress = p.side === 'BUY' ? (p.cur - p.sl) / range : (p.sl - p.cur) / range;
  const entryP = p.side === 'BUY' ? (p.entry - p.sl) / range : (p.sl - p.entry) / range;

  return (
    <div style={{
      border: '1px solid var(--line-strong)', borderLeft: `3px solid ${p.side === 'BUY' ? 'var(--accent)' : 'var(--red)'}`,
      borderRadius: 8, background: 'var(--bg-0)', overflow: 'hidden',
      boxShadow: p.primary ? '0 20px 40px -20px var(--accent-glow)' : 'none',
    }}>
      {/* header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr auto auto', gap: 14, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
        <FsChip color={p.side === 'BUY' ? 'var(--accent)' : 'var(--red)'} filled>{p.side}</FsChip>
        <span className="mono" style={{ fontSize: 13, color: 'var(--text-0)' }}>{p.pair}</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>{p.lots} lots · entry {p.entry.toFixed(p.pair.includes('JPY') || p.pair.includes('XAU') ? 2 : 5)}</span>
        <span className="mono" style={{ fontSize: 13, color: p.pnl >= 0 ? 'var(--accent)' : 'var(--red)' }}>
          {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
        </span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{Math.round(progress * 100)}% to TP</span>
      </div>

      {/* progress bar SL → cur → TP */}
      <div style={{ padding: '10px 16px', background: 'var(--bg-1)' }}>
        <div style={{ position: 'relative', height: 6, background: 'var(--bg-3)', borderRadius: 3 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 3, background: `linear-gradient(to right, ${p.side === 'BUY' ? 'var(--red)' : 'var(--accent)'} 0%, ${p.side === 'BUY' ? 'var(--red)' : 'var(--accent)'} ${entryP * 100}%, var(--bg-3) ${entryP * 100}%, var(--bg-3) 100%)` }}/>
          <div style={{ position: 'absolute', top: -3, left: `calc(${entryP * 100}% - 6px)`, width: 12, height: 12, borderRadius: '50%', background: 'var(--text-0)', border: '2px solid var(--bg-0)' }}/>
          <div style={{ position: 'absolute', top: -4, left: `calc(${Math.max(0, Math.min(100, progress * 100))}% - 1px)`, width: 2, height: 14, background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--red)' }}>SL · {p.sl.toFixed(p.pair.includes('JPY') || p.pair.includes('XAU') ? 2 : 5)}</span>
          <span className="mono" style={{ fontSize: 9, color: 'var(--text-2)' }}>ENTRY</span>
          <span className="mono" style={{ fontSize: 9, color: 'var(--text-0)' }}>NOW · {p.cur.toFixed(p.pair.includes('JPY') || p.pair.includes('XAU') ? 2 : 5)}</span>
          <span className="mono" style={{ fontSize: 9, color: 'var(--accent)' }}>TP · {p.tp.toFixed(p.pair.includes('JPY') || p.pair.includes('XAU') ? 2 : 5)}</span>
        </div>
      </div>

      {/* AI narration — only the primary one gets the live narration */}
      {narration && (
        <div key={narrationIdx} style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', background: 'linear-gradient(90deg, var(--accent-glow) 0%, transparent 40%)', display: 'flex', gap: 10, animation: 'pulse-dot 4s ease-in-out' }}>
          <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>AI</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-0)', lineHeight: 1.55, fontStyle: 'italic' }}>
            "{narration}"
          </div>
        </div>
      )}

      {/* actions */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 6 }}>
        {['Trail stop', 'Partial 50%', 'Close', 'B/E'].map(a => (
          <span key={a} className="mono" style={{ fontSize: 10, padding: '4px 8px', border: '1px solid var(--line)', color: 'var(--text-2)', borderRadius: 3 }}>{a}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   04 · PROACTIVE NUDGE SHOWCASE
   ============================================================ */
function NudgeShowcase({ align = 'right' }) {
  const [visibleCount, setVisibleCount] = useStateF(1);
  useEffectF(() => {
    const t = setInterval(() => setVisibleCount(v => v >= 4 ? 4 : v + 1), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: 'clamp(64px, 9vw, 112px) 0', borderTop: '1px solid var(--line)', background: 'var(--bg-1)', position: 'relative' }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: align === 'left' ? '1fr 1.3fr' : '1.3fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ order: align === 'right' ? 2 : 0 }}>
            <FsEyebrow idx="4">PROACTIVE NUDGES</FsEyebrow>
            <h2 className="display" style={{ fontSize: 'clamp(38px, 4.4vw, 56px)', margin: 0 }}>
              The AI speaks up <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>when it matters</em>.
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, marginTop: 24, maxWidth: 480 }}>
              A 38-minute window to ECB. Your pair crosses yesterday's high. Your USD exposure just crept past the cap you set. The copilot taps you on the shoulder — with the fix, not just the fact.
            </p>

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 36 }}>
              {[
                ['Calibrated', 'Quiet by default. Fires on your rules, your positions, your risk cap.', 'var(--accent)'],
                ['Actionable', 'Every nudge includes the one action. Execute without leaving.', 'var(--action)'],
                ['Learnable', 'Dismiss it 3× and it adjusts its threshold. Keeps only the signal.', 'var(--brand)'],
                ['Auditable', 'Every nudge is logged with its rationale. Replay tomorrow morning.', 'var(--action)'],
              ].map(([k, v, c]) => (
                <div key={k} style={{ padding: 14, background: 'var(--bg-2)', borderRadius: 6, borderLeft: `2px solid ${c}` }}>
                  <FsLabel color={c}>● {k.toUpperCase()}</FsLabel>
                  <div style={{ fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.5, marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <a href="trader.html#nudge" className="btn btn-primary">See the inbox <span className="btn-arrow" aria-hidden="true">→</span></a>
            </div>
          </div>

          <div style={{ order: align === 'right' ? 1 : 2 }}>
            <MockNudgeInbox count={visibleCount}/>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockNudgeInbox({ count }) {
  const nudges = [
    { color: 'var(--action)', kind: 'EVENT', time: '2m ago',
      title: 'ECB Lagarde speech in 38 minutes',
      body: "You're 0.5 lots long EUR/USD. Median move on her opener is ±17 pips. Tightening the stop to 1.0835 would reduce risk by $95.",
      actions: ['Tighten stop', 'Show history'] },
    { color: 'var(--accent)', kind: 'AI',     time: '12m ago',
      title: '3 watchlist symbols broke daily ranges',
      body: "GBP/JPY, XAU/USD and NAS100 took out yesterday's high in the last 30 minutes. GBP/JPY has the cleanest continuation setup.",
      actions: ['Show all 3', 'Chart GBP/JPY'] },
    { color: 'var(--buy, #00E599)', kind: 'PnL',    time: '24m ago',
      title: 'XAU/USD short approaching TP',
      body: "58% to 2,335. Rejected twice at VWAP. Trail to 2,354 to lock in +$20 and ride the rest.",
      actions: ['Trail to 2,354', 'Close half'] },
    { color: 'var(--red)', kind: 'RISK',   time: '41m ago',
      title: 'USD exposure above cap',
      body: "Net -2.4 lots, cap is -2.0. Closing half the EUR/USD long brings you to -1.9.",
      actions: ['Close 0.25', 'Adjust cap'] },
  ];

  return (
    <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, background: 'var(--bg-0)', overflow: 'hidden', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)' }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--action)', boxShadow: '0 0 10px var(--action)' }}/>
        <span style={{ fontSize: 13, color: 'var(--text-0)' }}>Proactive inbox</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--action)', padding: '2px 6px', border: '1px solid var(--action)', borderRadius: 3, marginLeft: 6 }}>{count} NEW</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['All', 'AI', 'Alerts', 'Events'].map((f, i) => (
            <span key={f} className="mono" style={{ fontSize: 9, padding: '3px 7px', border: '1px solid var(--line)', color: i === 1 ? 'var(--accent)' : 'var(--text-2)', borderColor: i === 1 ? 'var(--accent)' : 'var(--line)', borderRadius: 3 }}>{f}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 440 }}>
        {nudges.slice(0, count).map((n, i) => (
          <div key={i} style={{
            border: '1px solid var(--line-strong)', borderLeft: `3px solid ${n.color}`,
            borderRadius: 6, background: 'var(--bg-1)', padding: '12px 14px',
            animation: 'fadeIn 0.4s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <FsLabel color={n.color}>{n.kind}</FsLabel>
              <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500 }}>{n.title}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>{n.time}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-1)', lineHeight: 1.55 }}>{n.body}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {n.actions.map((a, j) => (
                <span key={j} className="mono" style={{
                  fontSize: 10, padding: '4px 9px', border: `1px solid ${j === 0 ? n.color : 'var(--line)'}`,
                  color: j === 0 ? n.color : 'var(--text-2)', borderRadius: 3,
                }}>{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   05 · STACKED THREAD SHOWCASE
   ============================================================ */
function StackedShowcase({ align = 'left' }) {
  return (
    <section style={{ padding: 'clamp(64px, 9vw, 112px) 0', borderTop: '1px solid var(--line)', position: 'relative' }}>
      <div className="wrap">
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: align === 'left' ? '1fr 1.3fr' : '1.3fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ order: align === 'right' ? 2 : 0 }}>
            <FsEyebrow idx="5">STACKED THREAD</FsEyebrow>
            <h2 className="display" style={{ fontSize: 'clamp(38px, 4.4vw, 56px)', margin: 0 }}>
              Research that <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>stays put</em>.
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 17, lineHeight: 1.55, marginTop: 24, maxWidth: 480 }}>
              Sometimes you're not trading — you're thinking. The stacked thread is a single-column workspace where the conversation <em>is</em> the app. Pin charts, keep receipts, build up a thesis.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 36 }}>
              {[
                ['Pin cards, keep them', 'Annotated charts and ranked setups stay exactly where you put them.'],
                ['Backtest from a prompt', '"Show NFP reactions on EUR/USD, last 12 months" — spins up a mini-backtest inline.'],
                ['Alert on a phrase', '"Ping me when DXY loses 104." Done. No separate alert tool.'],
                ['Export a thesis', 'Any thread exports as a shareable PDF — annotated charts, reasoning and all.'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid var(--line)' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', width: 18, marginTop: 2 }}>◆</div>
                  <div>
                    <span style={{ fontSize: 13.5, color: 'var(--text-0)' }}>{k}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 8 }}>— {v}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <a href="trader.html#stacked" className="btn btn-primary">Open stacked thread <span className="btn-arrow" aria-hidden="true">→</span></a>
            </div>
          </div>

          <div style={{ order: align === 'right' ? 1 : 2 }}>
            <MockStacked/>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockStacked() {
  return (
    <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-0)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7)' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FsLabel color="var(--accent)">● STACKED THREAD</FsLabel>
        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>One continuous conversation · Pin cards to keep them</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>2 pinned · 7 messages</span>
      </div>
      <div style={{ padding: '22px 24px', minHeight: 460, maxHeight: 540, overflowY: 'auto' }}>
        <MockBubble who="you" text="Show me EURUSD on 4H with the last 3 NFP releases marked"/>
        <MockBubble who="ai" text="Here you go. I've marked the NFP prints and drawn the reaction candles."/>

        {/* pinned chart card */}
        <div style={{ margin: '10px 0 10px 32px', border: '1px solid var(--line-strong)', borderRadius: 6, background: 'var(--bg-1)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, right: 10, padding: '2px 8px', background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', borderRadius: 3 }}>◆ PINNED</div>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FsChip color="var(--brand)">CHART</FsChip>
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-0)' }}>EUR/USD · 4H</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--action)', marginLeft: 'auto' }}>3 NFP PRINTS</span>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <MiniStackedChart/>
          </div>
        </div>

        <MockBubble who="you" text="What's the pattern?"/>
        <MockBubble who="ai" streaming text="In all three cases EUR/USD dropped within the first 5 minutes (median -28 pips) and then recovered 70% of the drop within 4 hours. The pattern held whether the print beat or missed — it's a liquidity sweep, not a direction bet."/>
      </div>
      <div style={{ padding: 12, borderTop: '1px solid var(--line)', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Show next NFP date', 'Build a backtest', 'Alert me 10m before', 'Export this thread'].map(s => (
            <span key={s} className="mono" style={{ fontSize: 10, padding: '5px 9px', border: '1px solid var(--line)', color: 'var(--text-2)', borderRadius: 3 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStackedChart() {
  const data = [];
  for (let i = 0; i < 90; i++) data.push(20 + Math.sin(i * 0.2) * 4 + Math.cos(i * 0.07) * 3 + (i / 30));
  const W = 520, H = 110;
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * W},${H - ((d - min) / (max - min)) * H}`).join(' ');
  const marks = [22, 48, 74];
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%', height: 150, display: 'block' }}>
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.3"/>
      {marks.map((m, i) => {
        const x = (m / (data.length - 1)) * W;
        const y = H - ((data[m] - min) / (max - min)) * H;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1="0" y2={H} stroke="var(--action)" strokeDasharray="3,3" strokeWidth="0.8" opacity="0.7"/>
            <circle cx={x} cy={y} r="3" fill="var(--action)"/>
            <text x={x + 5} y={12} fontSize="9" fill="var(--action)" fontFamily="var(--font-mono)">NFP {['May', 'Apr', 'Mar'][i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   COMPACT FEATURE STRIP — for pricing/about pages
   ============================================================ */
function FeatureStrip({ eyebrow = "Included in every tier", title = "Five AI surfaces. Zero upsell." }) {
  const items = [
    ['Canvas', 'Conversation → charts → orders, one thread.', 'workspace'],
    ['Ticket', 'AI drafts the order; you review and execute.', 'ticket'],
    ['Live narration', 'Every position explained in real time.', 'position'],
    ['Nudges', 'Timely, actionable, learnable.', 'nudge'],
    ['Stacked thread', 'Research mode with pinned cards.', 'stacked'],
  ];
  return (
    <Section eyebrow={eyebrow} title={title}>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
        {items.map(([k, v, id], i) => (
          <a key={k} href={`trader.html#${id}`} style={{
            padding: '24px 20px', borderRight: i < 4 ? '1px solid var(--line)' : 'none',
            background: 'var(--bg-1)',
          }}>
            <FsLabel color="var(--accent)">● 0{i + 1}</FsLabel>
            <div className="display" style={{ fontSize: 18, marginTop: 10, color: 'var(--text-0)' }}>{k}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5, marginTop: 8 }}>{v}</div>
          </a>
        ))}
      </div>
    </Section>
  );
}

Object.assign(window, {
  FeatureGrid, FeatureStrip,
  CanvasShowcase, TicketShowcase, PositionShowcase, NudgeShowcase, StackedShowcase,
});
