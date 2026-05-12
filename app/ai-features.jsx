/* =======================================================
   app/ai-features.jsx
   The four AI tools that were marketed but missing from v2:
     • ProactiveNudgeBanner   — top-of-chart drop-in alert
     • LivePositionCoach      — popover anchored to position card
     • CanvasButton           — invokes "AI draws levels" overlay
     • ThreadMemoryView       — drawer mode showing remembered facts
   ======================================================= */

/* -----------------------------------------------------------
   1) PROACTIVE NUDGE BANNER
   Sits above the chart. Drops in, animates a progress bar
   counting down, and offers two actions.
----------------------------------------------------------- */
function ProactiveNudgeBanner({ onAct, onAsk }) {
  // Cycles through a small queue of nudges so the trader feels alive.
  const queue = React.useMemo(() => ([
    {
      kind: 'NEWS',
      icon: 'bell',
      tone: 'warn',
      title: 'EUR/USD — high-impact news in 11 min',
      body: 'US CPI 13:30 GMT. Your open EUR/USD long has 62% to TP and ATR-implied move > current TP distance.',
      primary: 'Trim 50%',
      secondary: 'Hold & alert',
    },
    {
      kind: 'RISK',
      icon: 'shield',
      tone: 'sell',
      title: 'Daily risk budget at 78%',
      body: 'You\'ve used $187 of your $240 daily risk. Two more 0.5R losses would breach. I can lock new orders until tomorrow.',
      primary: 'Lock new entries',
      secondary: 'Override',
    },
    {
      kind: 'OPP',
      icon: 'sparkles',
      tone: 'ai',
      title: 'GBP/JPY — A+ setup forming',
      body: 'Same pattern as your last 3 wins (avg +1.8R). Confidence 87%. Pre-built ticket: 0.20 lots, SL 198.10, TP 199.85.',
      primary: 'Open ticket',
      secondary: 'Show me why',
    },
    {
      kind: 'COACH',
      icon: 'eye',
      tone: 'amber',
      title: 'You\'re holding XAU/USD past target',
      body: 'TP hit 4 minutes ago. Last 5 trades held past TP gave back avg 0.4R. Want me to close at market?',
      primary: 'Close at market',
      secondary: 'Trail stop',
    },
  ]), []);

  const [idx, setIdx] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Auto-advance every ~14s
  React.useEffect(() => {
    if (dismissed) return;
    setProgress(0);
    const start = Date.now();
    const dur = 14000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / dur);
      setProgress(p);
      if (p >= 1) {
        setIdx(i => (i + 1) % queue.length);
      }
    }, 80);
    return () => clearInterval(tick);
  }, [idx, dismissed, queue.length]);

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        title="Re-enable proactive nudges"
        style={{
          position:'absolute', top:14, right:14, zIndex: 9,
          padding:'5px 10px', borderRadius:4,
          background:'rgba(7,8,10,0.88)', backdropFilter:'blur(10px)',
          border:'1px solid var(--trader-line)', color:'var(--text-2)',
          fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.14em',
          cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
        }}
      >
        <Icon name="bell" size={11}/> NUDGES OFF
      </button>
    );
  }

  const n = queue[idx];
  const toneColor = n.tone === 'warn'  ? 'var(--action)'
                  : n.tone === 'sell'  ? 'var(--sell)'
                  : n.tone === 'amber' ? 'var(--action)'
                  :                      'var(--ai)';

  return (
    <div
      key={idx}
      style={{
        position:'absolute', left:14, right:14, top:14, zIndex: 8,
        background:'rgba(7,8,10,0.92)', backdropFilter:'blur(14px)',
        border:`1px solid ${toneColor}`,
        borderLeft:`3px solid ${toneColor}`,
        borderRadius:8,
        boxShadow:`0 8px 32px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`,
        animation:'nudgeIn 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        overflow:'hidden',
      }}
    >
      {/* progress bar (auto-advance) */}
      <div style={{
        position:'absolute', left:0, top:0, height:1.5,
        width:`${progress*100}%`, background: toneColor, opacity:0.5,
        transition:'width 80ms linear',
      }}/>

      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'11px 14px' }}>
        <div style={{
          width:30, height:30, borderRadius:6, flexShrink:0,
          background:`color-mix(in oklab, ${toneColor} 14%, transparent)`,
          display:'grid', placeItems:'center', color: toneColor,
          border:`1px solid color-mix(in oklab, ${toneColor} 32%, transparent)`,
        }}>
          <Icon name={n.icon} size={14}/>
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.16em', color: toneColor }}>
              AI · PROACTIVE · {n.kind}
            </span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)' }}>
              {idx+1}/{queue.length}
            </span>
          </div>
          <div style={{ fontSize:13, color:'var(--text-0)', fontWeight:500, marginBottom:3, fontFamily:'var(--font-display)' }}>
            {n.title}
          </div>
          <div style={{ fontSize:11.5, color:'var(--text-1)', lineHeight:1.5 }}>
            {n.body}
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          <button
            onClick={onAct}
            style={{
              padding:'7px 12px', borderRadius:5,
              background: toneColor, color: n.tone === 'sell' ? '#fff' : '#000',
              border:'none',
              fontFamily:'var(--font-body)', fontSize:11.5, fontWeight:500,
              cursor:'pointer', whiteSpace:'nowrap',
            }}
          >{n.primary}</button>
          <button
            onClick={onAsk}
            style={{
              padding:'7px 11px', borderRadius:5,
              background:'transparent', color:'var(--text-1)',
              border:'1px solid var(--trader-line-strong)',
              fontSize:11.5, cursor:'pointer', whiteSpace:'nowrap',
            }}
          >{n.secondary}</button>
          <button
            onClick={() => setIdx((idx+1) % queue.length)}
            title="Next"
            style={{
              width:26, height:26, borderRadius:4,
              background:'transparent', border:'1px solid var(--trader-line)',
              color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center',
            }}
          ><Icon name="chevron-right" size={11}/></button>
          <button
            onClick={() => setDismissed(true)}
            title="Dismiss"
            style={{
              width:26, height:26, borderRadius:4,
              background:'transparent', border:'1px solid var(--trader-line)',
              color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center',
            }}
          ><Icon name="x" size={11}/></button>
        </div>
      </div>
    </div>
  );
}
window.ProactiveNudgeBanner = ProactiveNudgeBanner;

/* -----------------------------------------------------------
   2) LIVE POSITION COACH
   A small "Coach" badge on a position card. Click to open a
   popover with streaming AI commentary about THIS position.
----------------------------------------------------------- */
function LivePositionCoach({ position, anchor }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!open || !anchor?.current) return;
    const r = anchor.current.getBoundingClientRect();
    setPos({ top: r.top - 8, left: r.left + r.width / 2 });
  }, [open, anchor]);

  // Generate streaming narration tied to this position
  const lines = React.useMemo(() => {
    const isBuy = position.side === 'BUY';
    const winning = position.pnl > 0;
    return [
      { t: 0,    text: `Watching ${position.pair} ${position.side.toLowerCase()} since entry @ ${position.entry}.`, tag: 'OBS' },
      { t: 1400, text: winning
                       ? `You're ${position.pnlPct >= 0 ? '+' : ''}${position.pnlPct.toFixed(2)}% — momentum still ${isBuy ? 'with' : 'against'} the move.`
                       : `Drawdown ${position.pnlPct.toFixed(2)}%. ${isBuy ? 'Bid' : 'Offer'} thinning at this level.`, tag: 'READ' },
      { t: 3200, text: `ATR-14 says next 30m range is ±${(Math.abs(position.entry) * 0.0009).toFixed(position.pair.includes('JPY') ? 3 : 4)}. TP within range.`, tag: 'STAT' },
      { t: 5000, text: position.aiTag === 'ON TARGET'
                       ? `Setup playing out as drawn. I'd trail your stop to entry +5 pips when you hit 80% to TP.`
                       : `${position.aiNote}`, tag: 'COACH' },
      { t: 7000, text: `Will alert you on: TP fill, 1R retrace, news within 15m, or volatility regime change.`, tag: 'WATCH' },
    ];
  }, [position]);

  const [visibleCount, setVisibleCount] = React.useState(0);
  React.useEffect(() => {
    if (!open) { setVisibleCount(0); return; }
    setVisibleCount(0);
    const timers = lines.map((l, i) => setTimeout(() => setVisibleCount(i + 1), l.t));
    return () => timers.forEach(clearTimeout);
  }, [open, lines]);

  return (
    <>
      <button
        ref={anchor}
        onClick={() => setOpen(o => !o)}
        title="Open Live Position Coach"
        style={{
          padding:'4px 8px', borderRadius:4,
          background: open ? 'var(--ai-bg)' : 'transparent',
          border:`1px solid ${open ? 'var(--ai)' : 'var(--ai-border)'}`,
          color: open ? 'var(--ai)' : 'var(--ai-2)',
          fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em',
          cursor:'pointer', display:'inline-flex', alignItems:'center', gap:5,
        }}
      >
        <span style={{
          width:5, height:5, borderRadius:'50%', background:'var(--ai)',
          boxShadow:'0 0 6px var(--ai)', animation:'aiPulse 1.6s ease-in-out infinite',
        }}/>
        COACH
      </button>

      {open && ReactDOM.createPortal(
        <>
          {/* scrim — clicking outside closes */}
          <div
            onClick={() => setOpen(false)}
            style={{ position:'fixed', inset:0, zIndex: 80 }}
          />
          {/* popover */}
          <div
            style={{
              position:'fixed',
              left: Math.max(14, Math.min(window.innerWidth - 374, pos.left - 180)),
              top: pos.top,
              transform:'translateY(-100%)',
              width: 360,
              background:'rgba(13,15,18,0.97)', backdropFilter:'blur(18px)',
              border:'1px solid var(--ai-border)',
              borderRadius:8,
              boxShadow:'0 24px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,153,0.06)',
              zIndex: 81,
              animation:'coachIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              overflow:'hidden',
            }}
          >
            {/* header */}
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'11px 14px',
              borderBottom:'1px solid var(--trader-line)',
              background:'linear-gradient(to bottom, rgba(0,229,153,0.06), transparent)',
            }}>
              <span className="ai-avatar" style={{ width:24, height:24, fontSize:9, flex:'0 0 24px' }}>AI</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:12.5, color:'var(--text-0)', fontWeight:500 }}>
                  Live Coach · {position.pair}
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', letterSpacing:'0.12em', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--buy)', boxShadow:'0 0 6px var(--buy)' }}/>
                  STREAMING · UPDATES EVERY 3s
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ width:24, height:24, borderRadius:4, background:'transparent', border:'1px solid var(--trader-line)', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}
              ><Icon name="x" size={11}/></button>
            </div>

            {/* commentary stream */}
            <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:9, maxHeight:300, overflowY:'auto' }}>
              {lines.slice(0, visibleCount).map((l, i) => (
                <div key={i} style={{ display:'flex', gap:8, animation:'coachLineIn 320ms ease' }}>
                  <span style={{
                    flex:'0 0 44px',
                    fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.12em',
                    color: l.tag === 'COACH' ? 'var(--ai)'
                         : l.tag === 'STAT'  ? 'var(--action)'
                         : 'var(--text-3)',
                    paddingTop:1,
                  }}>{l.tag}</span>
                  <span style={{ flex:1, fontSize:11.5, color:'var(--text-1)', lineHeight:1.5 }}>{l.text}</span>
                </div>
              ))}
              {visibleCount < lines.length && (
                <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--ai)' }}>
                  <span style={{ flex:'0 0 44px' }}/>
                  <span className="coach-typing">
                    <span/><span/><span/>
                  </span>
                </div>
              )}
            </div>

            {/* action row */}
            <div style={{
              borderTop:'1px solid var(--trader-line)',
              padding:'8px 10px',
              display:'flex', gap:6, background:'var(--trader-panel-2)',
            }}>
              <button className="v2-pos-btn" style={{ flex:1 }}>Trail stop to entry</button>
              <button className="v2-pos-btn" style={{ flex:1 }}>Take 50%</button>
              <button className="v2-pos-btn danger" style={{ flex:1 }}>Close at market</button>
            </div>
          </div>
        </>, document.body)}
    </>
  );
}
window.LivePositionCoach = LivePositionCoach;

/* -----------------------------------------------------------
   3) AI CANVAS BUTTON
   Pulsing button on the chart toolbar that, when clicked,
   pretends to "draw" annotations onto the chart. Triggers
   an animated overlay on the chart. The overlay itself is
   already there (showSetup/showCone) — this just replays
   them with a draw-in animation + brief coachmark.
----------------------------------------------------------- */
function CanvasButton({ active, onToggle, onReplay }) {
  const [pulsing, setPulsing] = React.useState(false);
  const handle = () => {
    onToggle();
    if (!active) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 1400);
      onReplay && onReplay();
    }
  };
  return (
    <button
      onClick={handle}
      title="AI Canvas — draws levels, setup zones & predicted cone"
      style={{
        padding:'5px 11px',
        borderRadius:4,
        background: active ? 'var(--ai-bg)' : 'transparent',
        border:`1px solid ${active ? 'var(--ai)' : 'var(--ai-border)'}`,
        color: active ? 'var(--ai)' : 'var(--ai-2)',
        fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em',
        cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
        position:'relative',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 9 L5 6 L7 8 L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="2" cy="9" r="1.2" fill="currentColor"/>
        <circle cx="10" cy="3" r="1.2" fill="currentColor"/>
      </svg>
      AI CANVAS
      {pulsing && (
        <span style={{
          position:'absolute', inset:-3, borderRadius:6,
          border:'1px solid var(--ai)',
          animation:'canvasPulse 700ms ease-out 2',
          pointerEvents:'none',
        }}/>
      )}
    </button>
  );
}
window.CanvasButton = CanvasButton;

/* -----------------------------------------------------------
   4) THREAD MEMORY VIEW
   A view that goes inside the Copilot drawer (mode='memory').
   Two columns: persistent facts the AI remembers, and a list
   of past threads it can recall.
----------------------------------------------------------- */
function CopilotMemory() {
  const facts = [
    { cat: 'STYLE',     k: 'Trades London open, hates revenge trades after a loss.', src: '47 trades · last 30d' },
    { cat: 'RISK',      k: 'Self-set max risk: 2% account, 0.5% per trade.', src: 'set 2024-03-12' },
    { cat: 'PAIRS',     k: 'Best on EUR/USD & XAU/USD. Avoid AUD/USD (−$184 last 30d).', src: 'journal' },
    { cat: 'PSYCH',     k: 'Tends to hold winners 0.4R past TP. Discussed twice this month.', src: 'reviews' },
    { cat: 'PREF',      k: 'Likes pre-built tickets > raw signals. Wants reasoning, not just numbers.', src: 'composer logs' },
    { cat: 'NEWS',      k: 'Avoids NFP weeks since Mar 2024 (−$612 cumulative).', src: 'pattern detected' },
  ];
  const threads = [
    { ts: '2 min ago',  title: 'Should I close EUR/USD?',                  preview: 'Held 22m, +24 pips, 62% to TP…' },
    { ts: '14 min ago', title: 'Size 0.5% risk on XAU/USD',                preview: 'On $24,182 equity with 26-pip stop = 0.46 lots…' },
    { ts: '42 min ago', title: 'Hedge my USD exposure',                    preview: 'Long EUR/USD + short USD/JPY = $312 net…' },
    { ts: 'Yesterday',  title: 'Why did GBP/JPY stop me out?',             preview: 'BOJ verbals at 02:14 GMT — outside your usual…' },
    { ts: 'Yesterday',  title: 'Grade my Tuesday',                         preview: '4 trades, 3 winners, +1.6R on the day. Best…' },
    { ts: '2 days ago', title: 'Setup criteria for momentum trades',       preview: 'Your win-rate spikes to 72% when you wait for…' },
    { ts: '3 days ago', title: 'Backtest: trail vs flat TP',               preview: 'Trail-from-1R outperforms flat by 0.3R on…' },
    { ts: '5 days ago', title: 'News I should ignore',                     preview: 'These five releases moved your pairs <0.2 ATR…' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, maxWidth: 580, margin:'0 auto' }}>
      {/* Intro */}
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <span className="ai-avatar" style={{ width:28, height:28, fontSize:10, flex:'0 0 28px' }}>AI</span>
        <div style={{ flex:1, fontSize:12.5, color:'var(--text-1)', lineHeight:1.55 }}>
          I remember <span style={{ color:'var(--text-0)', fontWeight:500 }}>everything we've discussed</span>. New threads start with this context — you never have to re-explain yourself.
        </div>
      </div>

      {/* What I remember */}
      <div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.16em', color:'var(--text-2)', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
          <span>WHAT I REMEMBER</span>
          <span style={{ flex:1, height:1, background:'var(--trader-line)' }}/>
          <button style={{ background:'transparent', border:'none', color:'var(--text-3)', fontSize:10, cursor:'pointer', fontFamily:'var(--font-mono)', letterSpacing:'0.1em' }}>EDIT</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {facts.map((f, i) => (
            <div key={i} style={{
              padding:'10px 12px',
              background:'var(--trader-panel-2)',
              border:'1px solid var(--trader-line)',
              borderRadius:6,
              display:'grid', gridTemplateColumns:'52px 1fr auto', gap:10, alignItems:'center',
            }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.12em', color:'var(--ai-2)' }}>
                {f.cat}
              </span>
              <span style={{ fontSize:12, color:'var(--text-0)', lineHeight:1.45 }}>{f.k}</span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-3)', whiteSpace:'nowrap' }}>{f.src}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Past threads */}
      <div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:9.5, letterSpacing:'0.16em', color:'var(--text-2)', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
          <span>RECENT THREADS</span>
          <span style={{ flex:1, height:1, background:'var(--trader-line)' }}/>
          <span style={{ color:'var(--text-3)', fontSize:9.5 }}>{threads.length}</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          {threads.map((t, i) => (
            <button key={i} style={{
              all:'unset',
              padding:'10px 12px',
              background: i % 2 ? 'transparent' : 'var(--trader-panel-2)',
              borderRadius:5,
              cursor:'pointer',
              display:'grid', gridTemplateColumns:'1fr auto', gap:6,
            }}
            onMouseEnter={(e)=>e.currentTarget.style.background='var(--trader-panel-3)'}
            onMouseLeave={(e)=>e.currentTarget.style.background = i % 2 ? 'transparent' : 'var(--trader-panel-2)'}
            >
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, color:'var(--text-0)', fontWeight:500, marginBottom:2 }}>{t.title}</div>
                <div style={{ fontSize:11, color:'var(--text-2)', lineHeight:1.4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.preview}</div>
              </div>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--text-3)', whiteSpace:'nowrap', alignSelf:'start' }}>{t.ts}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
window.CopilotMemory = CopilotMemory;
