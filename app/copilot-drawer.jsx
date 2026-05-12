/* Copilot drawer — slides over the trader workspace */

function CopilotDrawer({ open, onClose }) {
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState('chat'); // chat | ideas | review
  const threadRef = React.useRef();

  React.useEffect(() => {
    if (open) threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [open, mode]);

  // ESC to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition:'opacity 200ms ease', zIndex: 70,
        }}
      />
      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width: 'min(640px, 100vw)',
        background:'var(--trader-bg)', borderLeft:'1px solid var(--trader-line-strong)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: 71, display:'flex', flexDirection:'column',
        boxShadow:'-24px 0 60px rgba(0,0,0,0.4)'
      }}>
        {/* Drawer header */}
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:10, background:'var(--trader-panel)' }}>
          <div className="ai-avatar" style={{ width:28, height:28, fontSize:10 }}>AI</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:500, color:'var(--text-0)' }}>Copilot</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-2)', display:'flex', alignItems:'center', gap:6 }}>
              <span className="live-dot"/> connected · reads your positions, balance, charts
            </div>
          </div>
          <div style={{ display:'flex', gap:2, background:'var(--trader-panel-2)', borderRadius:5, padding:2 }}>
            {[
              { id:'chat', label:'Chat' },
              { id:'ideas', label:'Ideas' },
              { id:'review', label:'Review' },
              { id:'memory', label:'Memory' },
            ].map(t => (
              <button key={t.id} onClick={()=>setMode(t.id)} style={{
                padding:'5px 10px', borderRadius:4, fontSize:11, fontFamily:'var(--font-mono)',
                background: mode === t.id ? 'var(--trader-panel-3)' : 'transparent',
                border:'none', color: mode === t.id ? 'var(--text-0)' : 'var(--text-2)',
                cursor:'pointer'
              }}>{t.label}</button>
            ))}
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:5, background:'transparent', border:'1px solid var(--trader-line)', color:'var(--text-1)', cursor:'pointer', display:'grid', placeItems:'center' }}>
            <Icon name="x" size={13}/>
          </button>
        </div>

        {/* Thread */}
        <div ref={threadRef} style={{ flex:1, overflowY:'auto', padding:'20px 22px' }}>
          {mode === 'chat' && <CopilotChat/>}
          {mode === 'ideas' && <CopilotIdeas/>}
          {mode === 'review' && <CopilotReview/>}
          {mode === 'memory' && <CopilotMemory/>}
        </div>

        {/* Composer */}
        <Composer
          value={input} onChange={setInput}
          onSend={() => setInput('')}
          suggestions={mode === 'chat'
            ? ["Should I close EUR/USD?", "What's my biggest risk?", "Size XAU/USD for 0.5% risk", "Hedge my USD exposure"]
            : mode === 'ideas'
            ? ["More setups like this", "Low-risk only", "Majors only", "News-driven plays"]
            : mode === 'memory'
            ? ["Forget my last loss", "Update my risk preference", "What did we discuss about NFP?"]
            : ["Grade last week's trades", "What's my best pair?", "Analyze my losses"]
          }
        />
      </div>
    </>
  );
}

function CopilotChat() {
  return (
    <div style={{ maxWidth: 580, margin:'0 auto' }}>
      <UserMessage>Is EUR/USD a buy here? What's your setup?</UserMessage>
      <AiMessage time="2m ago">
        Yes — a clean long presents itself on the 1H. Price tested 1.0821 support twice overnight and rejected with a bullish engulfing on the last retest. DXY is rolling over below its 4H 50-EMA and ECB speakers are dovish. I've drawn the setup below.
      </AiMessage>

      <TradeIdeaCard
        pair="EUR/USD" side="BUY"
        entry={1.08680} stop={1.08420} target={1.09200}
        lots={0.50} riskUsd={130} rewardUsd={260} rr="2.0" confidence={78}
        reasoning="1H double-bottom at 1.0821 with bullish engulfing; RSI divergence on 4H; DXY breaking 104.20; ECB Lagarde dovish at 09:00."
        chartSeed={7}
      />

      <UserMessage>Size it for 0.5% risk</UserMessage>
      <AiMessage time="now" streaming>
        On $24,182 equity with a 26-pip stop, 0.5% risk = 0.46 lots. I'd round to 0.50 lots — that's $130 at risk, $260 potential. Ticket on the right is pre-filled. Confirm to send.
      </AiMessage>
    </div>
  );
}

function CopilotIdeas() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em', color:'var(--text-2)', textTransform:'uppercase', display:'flex', alignItems:'center', gap:8 }}>
        <span>3 setups matching your style</span>
        <span style={{ flex:1, height:1, background:'var(--trader-line)' }}/>
        <span style={{ color:'var(--text-3)' }}>refreshed 4m ago</span>
      </div>
      <TradeIdeaCard pair="EUR/USD" side="BUY" entry={1.08680} stop={1.08420} target={1.09200} lots={0.50} riskUsd={130} rewardUsd={260} rr="2.0" confidence={78} reasoning="1H double-bottom + DXY breakdown." chartSeed={7}/>
      <TradeIdeaCard pair="XAU/USD" side="BUY" entry={2346.40} stop={2338.00} target={2362.00} lots={0.08} riskUsd={67} rewardUsd={125} rr="1.9" confidence={65} reasoning="Reclaim of 2345 pivot; real yields falling." chartSeed={11}/>
      <TradeIdeaCard pair="USD/JPY" side="SELL" entry={154.20} stop={154.80} target={152.80} lots={0.20} riskUsd={120} rewardUsd={280} rr="2.3" confidence={71} reasoning="MoF intervention risk + BOJ hawkish commentary." chartSeed={13}/>
    </div>
  );
}

function CopilotReview() {
  const stats = [
    ['Win rate', '68%', '+4pts'],
    ['Avg R:R', '1.6', '—'],
    ['Best pair', 'EUR/USD', '+$412'],
    ['Worst pair', 'AUD/USD', '−$184'],
    ['Best hour', '08-10 GMT', '+2.1R'],
    ['Held too long', '3 trades', 'avg −0.4R'],
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <AiMessage time="just now">
        Here's your week so far. You've been disciplined on entries — 68% win rate is your best since February — but you're giving back on exits. Three trades this week you held past the AI-suggested target and gave back an average of 0.4R. Want me to draft a trailing-stop rule?
      </AiMessage>
      <div className="ai-card" style={{ padding:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {stats.map(([k, v, d]) => (
          <div key={k} style={{ display:'flex', flexDirection:'column', gap:2, padding:'8px 0', borderBottom:'1px solid var(--trader-line)' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.12em', color:'var(--text-3)' }}>{k.toUpperCase()}</span>
            <span className="num" style={{ fontSize:18, color:'var(--text-0)' }}>{v}</span>
            <span style={{ fontSize:10, color: d.startsWith('+') ? 'var(--buy)' : d.startsWith('−') ? 'var(--sell)' : 'var(--text-3)' }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { CopilotDrawer });
