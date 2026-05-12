/* Reusable trader cards: AI message, trade idea, position, chart card, right rail */

function AiMessage({ children, time = 'just now', streaming = false }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
      <div className="ai-avatar">AI</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-0)', fontWeight: 500 }}>Copilot</span>
          <span className="ai-marker" style={{padding:'1px 6px', fontSize:8}}>AI</span>
          <span className="num" style={{ fontSize: 10, color: 'var(--text-3)' }}>{time}</span>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-0)' }}>
          {children}
          {streaming && <span className="caret"/>}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ children }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--trader-panel-3)', color: 'var(--text-1)', display:'grid', placeItems:'center', fontSize: 9, fontFamily:'var(--font-mono)', flexShrink:0, fontWeight: 600 }}>MR</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500, marginBottom:6 }}>You</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-0)' }}>{children}</div>
      </div>
    </div>
  );
}

/* Trade idea / Order ticket card (AI-suggested) */
function TradeIdeaCard({ pair, side, entry, stop, target, lots, riskUsd, rewardUsd, rr, confidence, reasoning, chartSeed = 2 }) {
  const isBuy = side === 'BUY';
  return (
    <div className="ai-card raise" style={{ marginBottom: 12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom:'1px solid var(--trader-line)' }}>
        <span className="ai-marker">AI · TRADE IDEA</span>
        <span className="num" style={{ fontSize:12, color:'var(--text-2)', marginLeft:'auto' }}>conf. <span style={{ color:'var(--ai)' }}>{confidence}%</span></span>
        <button style={{ width:26, height:26, borderRadius:5, background:'transparent', border:'1px solid var(--trader-line)', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}><Icon name="pin" size={13}/></button>
        <button style={{ width:26, height:26, borderRadius:5, background:'transparent', border:'none', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}><Icon name="x" size={13}/></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0 }}>
        {/* Left: chart + key levels */}
        <div style={{ padding: 0, borderRight: '1px solid var(--trader-line)' }}>
          <div style={{ padding: '12px 16px 6px', display:'flex', alignItems:'center', gap:10 }}>
            <div>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:500, letterSpacing:'-0.02em' }}>{pair}</span>
                <span className={`num ${isBuy ? 'buy' : 'sell'}`} style={{ fontSize:12, fontWeight:600, padding:'2px 7px', borderRadius:3, background: isBuy ? 'rgba(0,229,153,0.1)' : 'rgba(255,77,77,0.1)'}}>{side}</span>
              </div>
              <div className="num" style={{ fontSize:11, color:'var(--text-2)', marginTop:2 }}>H1 · 2h ago</div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <div className="num" style={{ fontSize:11, color:'var(--text-2)' }}>R:R</div>
              <div className="num" style={{ fontSize:17, color:'var(--text-0)' }}>1:{rr}</div>
            </div>
          </div>
          <Candles
            width={360} height={180} seed={chartSeed} pair={pair} timeframe="1H"
            annotations={[
              { price: entry, label: `ENTRY ${entry.toFixed(4)}`, color: 'var(--ai)', idx: 60 },
              { price: stop, label: `SL ${stop.toFixed(4)}`, color: 'var(--sell)', idx: 68 },
              { price: target, label: `TP ${target.toFixed(4)}`, color: 'var(--buy)', idx: 75 },
            ]}
          />
        </div>

        {/* Right: reasoning + ticket */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)', marginBottom:8 }}>REASONING</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-1)', lineHeight:1.55, marginBottom: 12 }}>
            {reasoning}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
            {[
              ['Entry', entry.toFixed(4)],
              ['Stop', stop.toFixed(4)],
              ['Target', target.toFixed(4)],
              ['Size', `${lots} lots`],
              ['Risk', `$${riskUsd}`],
              ['Reward', `$${rewardUsd}`],
            ].map(([k, v]) => (
              <div key={k} style={{ background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:5, padding:'7px 10px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.12em', color:'var(--text-2)', textTransform:'uppercase' }}>{k}</div>
                <div className="num" style={{ fontSize:13, color: k === 'Stop' || k === 'Risk' ? 'var(--sell)' : k === 'Target' || k === 'Reward' ? 'var(--buy)' : 'var(--text-0)', marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button style={{ flex:1, padding:'10px', borderRadius:5, background: isBuy ? 'var(--buy)' : 'var(--sell)', color: isBuy ? '#000' : '#fff', border:'none', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', fontWeight:600 }}>
              Execute {side} · {lots}
            </button>
            <button style={{ padding:'10px 14px', borderRadius:5, background:'transparent', border:'1px solid var(--trader-line-strong)', color:'var(--text-0)', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer' }}>
              Modify
            </button>
            <button style={{ padding:'10px 12px', borderRadius:5, background:'transparent', border:'1px solid var(--trader-line)', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon name="x" size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Signal strip */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 16px', borderTop:'1px solid var(--trader-line)', background:'var(--trader-panel-2)', fontSize:11, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>
        <span style={{ color:'var(--ai)' }}>◆ RSI 38 oversold</span>
        <span>◆ 4H trend up</span>
        <span>◆ DXY rolling over</span>
        <span style={{ marginLeft:'auto', color:'var(--text-3)' }}>Similar setups historically: <span style={{ color:'var(--buy)' }}>64% win rate · +1.8R avg</span></span>
      </div>
    </div>
  );
}

/* Open position card with live AI narration */
function PositionCard({ pair, side, entry, current, sl, tp, lots, pnl, pnlPct, narration, chartSeed = 5 }) {
  const isBuy = side === 'BUY';
  const isProfit = pnl >= 0;
  return (
    <div className="panel raise" style={{ marginBottom: 12, borderColor: 'var(--ai-border)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderBottom:'1px solid var(--trader-line)' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 8px', background:'rgba(0,229,153,0.08)', color:'var(--buy)', borderRadius:3, border:'1px solid rgba(0,229,153,0.22)' }}>● OPEN POSITION</span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:500, letterSpacing:'-0.02em' }}>{pair}</span>
        <span className={`num ${isBuy ? 'buy' : 'sell'}`} style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:3, background: isBuy ? 'rgba(0,229,153,0.1)' : 'rgba(255,77,77,0.1)'}}>{side} {lots}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
          <span className="num" style={{ fontSize:11, color:'var(--text-2)' }}>P&L</span>
          <span className={`num ${isProfit ? 'buy' : 'sell'}`} style={{ fontSize:15, fontWeight:600 }}>{isProfit ? '+' : ''}${pnl.toFixed(2)}</span>
          <span className={`num ${isProfit ? 'buy' : 'sell'}`} style={{ fontSize:11 }}>({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:0 }}>
        <div style={{ borderRight:'1px solid var(--trader-line)' }}>
          <Candles width={420} height={200} seed={chartSeed} pair={pair} timeframe="15M"
            annotations={[
              { price: entry, label: `ENTRY ${entry.toFixed(4)}`, color: 'var(--text-1)', idx: 42 },
              { price: tp, label: `TP ${tp.toFixed(4)}`, color: 'var(--buy)', idx: 72 },
              { price: sl, label: `SL ${sl.toFixed(4)}`, color: 'var(--sell)', idx: 58 },
            ]}
          />
        </div>
        <div style={{ padding:'14px 16px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <div className="ai-avatar">AI</div>
            <div style={{ fontSize:11, color:'var(--text-2)', fontFamily:'var(--font-mono)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Live commentary · 15s refresh</div>
          </div>
          <div style={{ fontSize:12.5, color:'var(--text-0)', lineHeight:1.55, marginBottom:14, minHeight:68 }}>
            {narration}<span className="caret"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
            <KV k="Entry" v={entry.toFixed(4)}/>
            <KV k="Current" v={current.toFixed(4)} flash="up"/>
            <KV k="Stop" v={sl.toFixed(4)} color="var(--sell)"/>
            <KV k="Target" v={tp.toFixed(4)} color="var(--buy)"/>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button className="chip" style={{ flex:1, justifyContent:'center', borderColor:'var(--ai-border)', color:'var(--ai)' }}>
              <Icon name="sparkles" size={11}/> Trail stop
            </button>
            <button className="chip" style={{ flex:1, justifyContent:'center' }}>Close half</button>
            <button style={{ padding:'6px 12px', borderRadius:999, background:'transparent', border:'1px solid rgba(255,77,77,0.4)', color:'var(--sell)', fontSize:12, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v, color = 'var(--text-0)', flash }) {
  return (
    <div style={{ background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:5, padding:'7px 10px' }} className={flash === 'up' ? 'flash-up' : ''}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.12em', color:'var(--text-2)', textTransform:'uppercase' }}>{k}</div>
      <div className="num" style={{ fontSize:13, color, marginTop:2 }}>{v}</div>
    </div>
  );
}

/* AI-spawned chart card (mid-conversation) */
function ChartCard({ pair, timeframe = '4H', note, seed = 3, annotations = [], pinned = false }) {
  return (
    <div className="ai-card raise" style={{ marginBottom: 12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:'1px solid var(--trader-line)' }}>
        <span className="ai-marker">AI · CHART</span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:500 }}>{pair}</span>
        <span className="num" style={{ fontSize:11, color:'var(--text-2)' }}>{timeframe}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
          {pinned && <span style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--ai)' }}>◆ PINNED</span>}
          <button style={{ width:24, height:24, borderRadius:5, background:'transparent', border:'none', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}><Icon name="pin" size={12}/></button>
          <button style={{ width:24, height:24, borderRadius:5, background:'transparent', border:'none', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}><Icon name="x" size={12}/></button>
        </div>
      </div>
      <Candles width={620} height={220} seed={seed} pair={pair} timeframe={timeframe} annotations={annotations}/>
      {note && (
        <div style={{ padding:'10px 14px', borderTop:'1px solid var(--trader-line)', fontSize:12, color:'var(--text-1)', fontStyle:'italic', background:'var(--trader-panel-2)' }}>
          {note}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AiMessage, UserMessage, TradeIdeaCard, PositionCard, KV, ChartCard });
