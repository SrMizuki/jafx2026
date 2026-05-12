const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

/* ---------- AI FEATURES SHOWCASE ---------- */
function AiFeatures() {
  const features = [
    { id: 'copilot', label: 'Copilot', title: 'A trade co-pilot that reads the market in real time', desc: 'Ask anything in plain English. Get instant chart analysis, setup validation, and risk-sized entries — backed by live order-flow and 14 years of tick data.' },
    { id: 'signals', label: 'Signals', title: 'Auto-generated setups, ranked by probability', desc: 'Our models scan 70+ pairs every second. Each suggested setup comes with entry, stop, target, and a confidence score — plus the reasoning behind it.' },
    { id: 'risk', label: 'Risk Engine', title: 'Position sizing that respects your account, not your ego', desc: 'Tell the engine your max daily loss. It caps every trade, blocks revenge trades, and nudges you toward consistency. Works with any strategy.' },
    { id: 'brief', label: 'Market Brief', title: 'Macro, news and sentiment, synthesized every hour', desc: 'One concise briefing. Central bank calendar, positioning shifts, unusual flow, and tone-adjusted news from 200+ sources. Readable in 90 seconds.' },
    { id: 'coach', label: 'Coach', title: 'Personal coaching based on your actual trade history', desc: 'The coach studies your last 500 trades and finds the exact behaviors costing you money. Weekly reviews. Concrete drills. No fluff.' },
    { id: 'journal', label: 'Journal', title: 'Auto-journaling that turns losses into lessons', desc: 'Every fill is tagged, screenshotted, and explained. Search your journal like a database. Find the pattern that works — and the one that doesn’t.' },
  ];
  const [active, setActive] = useStateS('copilot');
  const cur = features.find(f => f.id === active);
  return (
    <Section eyebrow="AI, end-to-end" title="Eight models. One trader. You." intro="JAFX doesn't bolt AI onto an old broker stack. We built a broker around it. Every feature below runs in milliseconds, on your data, inside our regulated terminal.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
          {features.map((f, i) => (
            <button key={f.id} onClick={() => setActive(f.id)}
              style={{
                background: active === f.id ? 'var(--bg-2)' : 'transparent',
                border: 'none', borderBottom: i < features.length - 1 ? '1px solid var(--line)' : 'none',
                padding: '22px 24px', textAlign: 'left', cursor: 'pointer', color: 'inherit',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', width: 28 }}>0{i+1}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: active === f.id ? 'var(--text-0)' : 'var(--text-1)' }}>
                {f.label}
              </span>
              <span style={{ flex: 1 }}></span>
              {active === f.id && <span style={{ color: 'var(--accent)' }}>→</span>}
            </button>
          ))}
        </div>
        <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '40px 44px', background: 'var(--bg-1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle at top right, var(--accent-glow), transparent 60%)', pointerEvents: 'none' }}></div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: 16 }}>FEATURE · {cur.label.toUpperCase()}</div>
          <h3 className="display" style={{ fontSize: 40, margin: 0, maxWidth: 560 }}>{cur.title}</h3>
          <p style={{ color: 'var(--text-1)', fontSize: 16, lineHeight: 1.6, marginTop: 20, maxWidth: 560 }}>{cur.desc}</p>
          <FeaturePreview id={active} />
        </div>
      </div>
    </Section>
  );
}

function FeaturePreview({ id }) {
  if (id === 'copilot') return <CopilotPreview/>;
  if (id === 'signals') return <SignalsPreview/>;
  if (id === 'risk') return <RiskPreview/>;
  if (id === 'brief') return <BriefPreview/>;
  if (id === 'coach') return <CoachPreview/>;
  if (id === 'journal') return <JournalPreview/>;
  return null;
}

function CopilotPreview() {
  const messages = [
    { role: 'user', text: 'Is EUR/USD a buy right now?' },
    { role: 'ai', text: 'Mixed. 4H is in consolidation between 1.0832 and 1.0865. Bias turns bullish on a close above 1.0868 with DXY < 104.1. If you must enter, wait for the retest.' },
    { role: 'user', text: 'Size me 0.3% on a long above 1.0868.' },
    { role: 'ai', text: 'Long 1.08680 · SL 1.08420 (26 pips) · TP 1.09200 · 0.43 lots · Risk $30.00 on $10k · 2.0R' },
  ];
  return (
    <div style={{ marginTop: 28, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-0)', padding: 20 }}>
      {messages.map((m, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
          <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: '50%',
            background: m.role === 'ai' ? 'var(--accent)' : 'var(--bg-3)',
            color: m.role === 'ai' ? '#000' : 'var(--text-1)',
            display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>
            {m.role === 'ai' ? 'AI' : 'Y'}
          </div>
          <div style={{ fontSize: 13, color: m.role === 'ai' ? 'var(--text-0)' : 'var(--text-1)', lineHeight: 1.5, fontFamily: m.role === 'ai' && m.text.includes('Long') ? 'var(--font-mono)' : 'var(--font-body)' }}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function SignalsPreview() {
  const sigs = [
    { p: 'GBP/JPY', dir: 'LONG', conf: 87, r: '2.4R', time: '09:14' },
    { p: 'XAU/USD', dir: 'SHORT', conf: 74, r: '1.8R', time: '09:02' },
    { p: 'AUD/USD', dir: 'LONG', conf: 68, r: '1.5R', time: '08:47' },
  ];
  return (
    <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sigs.map((s, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 60px 1fr 80px 60px', gap: 16, alignItems: 'center', padding: '14px 18px', background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 6 }}>
          <span className="mono" style={{ fontSize: 13, color: 'var(--text-0)' }}>{s.p}</span>
          <span className="mono" style={{ fontSize: 11, color: s.dir === 'LONG' ? 'var(--accent)' : 'var(--red)' }}>{s.dir}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${s.conf}%`, height: '100%', background: 'var(--accent)' }}></div>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>{s.conf}%</span>
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-1)' }}>{s.r}</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{s.time}</span>
        </div>
      ))}
    </div>
  );
}

function RiskPreview() {
  return (
    <div style={{ marginTop: 28, background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 8, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>DAILY LOSS LIMIT</div>
          <div className="mono" style={{ fontSize: 22, color: 'var(--text-0)' }}>$42.10 <span style={{ color: 'var(--text-3)', fontSize: 14 }}>/ $200.00</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>REMAINING</div>
          <div className="mono" style={{ fontSize: 22, color: 'var(--accent)' }}>78.9%</div>
        </div>
      </div>
      <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ width: '21%', height: '100%', background: 'linear-gradient(to right, var(--accent), var(--action))' }}></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[['Open trades','2'],['Correlated risk','OK'],['Streak protect','3L cap']].map(([a,b]) => (
          <div key={a}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.08em' }}>{a.toUpperCase()}</div>
            <div style={{ fontSize: 14, color: 'var(--text-0)', marginTop: 4 }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefPreview() {
  const items = [
    ['07:00', 'FOMC minutes lean hawkish; DXY bid above 104.3 key'],
    ['05:30', 'BoJ sources: no October hike, JPY crosses extend'],
    ['03:45', 'Oil +1.8% on Middle East headlines — CAD outperforms'],
  ];
  return (
    <div style={{ marginTop: 28, background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 8, padding: 20 }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 14 }}>TODAY · 08:00 GMT BRIEFING</div>
      {items.map((it,i) => (
        <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)', width: 44, flexShrink: 0 }}>{it[0]}</span>
          <span style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{it[1]}</span>
        </div>
      ))}
    </div>
  );
}

function CoachPreview() {
  const pts = [
    ['You hold losers 3.2x longer than winners on Mondays', 'Set a 15-min time stop'],
    ['Your best setups: London open + trend-day', '84% win rate, 2.1R avg'],
    ['Overtrading after 2L streak', 'Auto-lock enabled by Risk Engine'],
  ];
  return (
    <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {pts.map((p,i) => (
        <div key={i} style={{ background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 6, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(0,229,153,0.1)', display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
            <span className="mono" style={{ fontSize: 11 }}>0{i+1}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--text-0)' }}>{p[0]}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 4, letterSpacing: '0.05em' }}>→ {p[1]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function JournalPreview() {
  const rows = [
    ['EUR/USD','LONG','+42.1','2.1R','A+','Trend day'],
    ['GBP/JPY','SHORT','-12.0','-0.6R','B','Counter-trend'],
    ['XAU/USD','LONG','+86.4','3.4R','A+','Breakout retest'],
  ];
  return (
    <div style={{ marginTop: 28, background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '90px 60px 80px 60px 50px 1fr', padding: '10px 18px', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)' }} className="mono">
        {['PAIR','SIDE','P/L','R','GRADE','SETUP'].map(h => <span key={h} style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>{h}</span>)}
      </div>
      {rows.map((r,i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 60px 80px 60px 50px 1fr', padding: '12px 18px', borderTop: i ? '1px solid var(--line)' : 'none', alignItems: 'center' }} className="mono">
          <span style={{ fontSize: 12, color: 'var(--text-0)' }}>{r[0]}</span>
          <span style={{ fontSize: 11, color: r[1] === 'LONG' ? 'var(--accent)' : 'var(--red)' }}>{r[1]}</span>
          <span style={{ fontSize: 12, color: r[2].startsWith('+') ? 'var(--accent)' : 'var(--red)' }}>{r[2]}</span>
          <span style={{ fontSize: 11, color: 'var(--text-1)' }}>{r[3]}</span>
          <span style={{ fontSize: 11, color: 'var(--accent)' }}>{r[4]}</span>
          <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-body)' }}>{r[5]}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { AiFeatures });
