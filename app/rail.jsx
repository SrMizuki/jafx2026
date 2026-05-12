/* Right rail: positions, orders, account, exposure, calendar — "live context" */

function RightRail({ positions, onAskAi }) {
  const [tab, setTab] = React.useState('context');
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', borderLeft:'1px solid var(--trader-line)', background:'var(--trader-panel)' }}>
      <div style={{ display:'flex', borderBottom:'1px solid var(--trader-line)' }}>
        {['context', 'positions', 'orders'].map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1, padding:'11px 8px', background:'transparent',
            border:'none', borderBottom: tab === t ? '1px solid var(--text-0)' : '1px solid transparent',
            color: tab === t ? 'var(--text-0)' : 'var(--text-2)',
            fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase',
            cursor:'pointer'
          }}>{t}</button>
        ))}
      </div>

      <div style={{ overflowY:'auto', flex:1 }}>
        {tab === 'context' && <LiveContext positions={positions} onAskAi={onAskAi}/>}
        {tab === 'positions' && <PositionsList positions={positions}/>}
        {tab === 'orders' && <OrdersList/>}
      </div>
    </div>
  );
}

function LiveContext({ positions, onAskAi }) {
  return (
    <div>
      {/* Account */}
      <div style={{ padding:'16px 14px', borderBottom:'1px solid var(--trader-line)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)' }}>EQUITY</span>
          <span className="num buy" style={{ fontSize:10 }}>+$182.47 today</span>
        </div>
        <div className="num" style={{ fontSize:24, color:'var(--text-0)', fontWeight:500 }}>$24,182.67</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginTop:12 }}>
          {[
            ['Balance', '24,000.20'],
            ['Free margin', '22,814.33'],
            ['Margin level', '1,847%'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:8, letterSpacing:'0.12em', color:'var(--text-3)', textTransform:'uppercase' }}>{k}</div>
              <div className="num" style={{ fontSize:11, color:'var(--text-1)', marginTop:2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Open positions compact */}
      <SectionHead label={`OPEN POSITIONS · ${positions.length}`}/>
      {positions.map((p, i) => (
        <div key={i} style={{ padding:'10px 14px', borderBottom:'1px solid var(--trader-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:13 }}>{p.pair}</span>
            <span className={`num ${p.side === 'BUY' ? 'buy' : 'sell'}`} style={{ fontSize:9, padding:'1px 5px', borderRadius:2, background: p.side === 'BUY' ? 'rgba(0,229,153,0.1)' : 'rgba(255,77,77,0.1)', letterSpacing:'0.06em' }}>{p.side}</span>
            <span className="num" style={{ fontSize:10, color:'var(--text-2)', marginLeft:'auto' }}>{p.lots} lots</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontFamily:'var(--font-mono)' }}>
            <span style={{ color:'var(--text-2)' }}>{p.entry.toFixed(4)} → {p.current.toFixed(4)}</span>
            <span className={p.pnl >= 0 ? 'buy' : 'sell'}>{p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}</span>
          </div>
        </div>
      ))}

      {/* Currency exposure */}
      <SectionHead label="CURRENCY EXPOSURE"/>
      <div style={{ padding:'10px 14px' }}>
        {[
          ['USD', -2.4, -68200],
          ['EUR', 1.1, 31400],
          ['JPY', 0.9, 25700],
          ['GBP', 0.4, 11100],
        ].map(([c, lots, usd]) => {
          const pos = lots > 0;
          const abs = Math.min(Math.abs(lots), 3) / 3;
          return (
            <div key={c} style={{ marginBottom:10 }}>
              <div style={{ display:'grid', gridTemplateColumns:'48px 1fr auto', gap:8, alignItems:'center', fontSize:11, marginBottom:3 }}>
                <span style={{ fontFamily:'var(--font-mono)', color:'var(--text-1)' }}>{c}</span>
                <span className="num" style={{ color: pos ? 'var(--buy)' : 'var(--sell)', textAlign:'right' }}>{pos ? '+' : ''}{lots} lots</span>
                <span className="num" style={{ color:'var(--text-2)', minWidth:64, textAlign:'right' }}>${Math.abs(usd).toLocaleString()}</span>
              </div>
              <div style={{ height:3, background:'var(--trader-panel-2)', borderRadius:2, position:'relative' }}>
                <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'var(--trader-line-strong)' }}/>
                <div style={{ position:'absolute', top:0, bottom:0, left: pos ? '50%' : `${50 - abs*50}%`, width:`${abs*50}%`, background: pos ? 'var(--buy)' : 'var(--sell)', borderRadius:2 }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming events */}
      <SectionHead label="NEXT 24H · HIGH IMPACT"/>
      {[
        ['09:30', 'UK', 'CPI y/y', '2.4%', '2.1%', 'GBP', 'high'],
        ['14:30', 'US', 'NFP', '+185K', '+220K', 'USD', 'high'],
        ['tomorrow 13:45', 'EU', 'ECB rate', '4.25%', '4.25%', 'EUR', 'med'],
      ].map(([time, cc, ev, fcst, prev, cur, imp], i) => (
        <div key={i} style={{ padding:'10px 14px', borderBottom:'1px solid var(--trader-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <span style={{ width:3, height:12, background: imp === 'high' ? 'var(--sell)' : 'var(--action)', borderRadius:1 }}/>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-2)' }}>{time}</span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, padding:'1px 5px', borderRadius:2, background:'var(--trader-panel-3)', color:'var(--text-1)' }}>{cc}</span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)', marginLeft:'auto' }}>{cur}</span>
          </div>
          <div style={{ fontSize:12, color:'var(--text-0)' }}>{ev}</div>
          <div style={{ fontSize:10, fontFamily:'var(--font-mono)', color:'var(--text-2)', marginTop:2 }}>forecast {fcst} · prev {prev}</div>
        </div>
      ))}

      {/* Ask AI inline */}
      <div style={{ padding:14 }}>
        <button className="chip" style={{ width:'100%', justifyContent:'center', borderColor:'var(--ai-border)', color:'var(--ai)', padding:'10px' }} onClick={() => onAskAi && onAskAi("What's my risk if GBP CPI comes in hot?")}>
          <Icon name="sparkles" size={12}/> Ask AI about my exposure
        </button>
      </div>
    </div>
  );
}

function SectionHead({ label, action }) {
  return (
    <div style={{ padding:'10px 14px 6px', display:'flex', alignItems:'center', background:'var(--trader-panel-2)', borderBottom:'1px solid var(--trader-line)', borderTop:'1px solid var(--trader-line)' }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)' }}>{label}</span>
      {action && <span style={{ marginLeft:'auto', fontSize:10, color:'var(--ai)', cursor:'pointer' }}>{action}</span>}
    </div>
  );
}

function PositionsList({ positions }) {
  return (
    <div>
      {positions.map((p, i) => (
        <div key={i} style={{ padding:'12px 14px', borderBottom:'1px solid var(--trader-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:14 }}>{p.pair}</span>
            <span className={`num ${p.side === 'BUY' ? 'buy' : 'sell'}`} style={{ fontSize:10, padding:'2px 6px', borderRadius:3, background: p.side === 'BUY' ? 'rgba(0,229,153,0.1)' : 'rgba(255,77,77,0.1)' }}>{p.side} {p.lots}</span>
            <span className={`num ${p.pnl >= 0 ? 'buy' : 'sell'}`} style={{ marginLeft:'auto', fontSize:13, fontWeight:500 }}>{p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, fontSize:10, fontFamily:'var(--font-mono)', color:'var(--text-2)' }}>
            <span>E {p.entry.toFixed(4)}</span>
            <span>C {p.current.toFixed(4)}</span>
            <span style={{ color: 'var(--sell)' }}>SL {p.sl?.toFixed(4) || '—'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersList() {
  const ords = [
    { pair: 'USD/JPY', type: 'BUY LIMIT', price: 148.20, lots: 0.5, status: 'working' },
    { pair: 'AUD/USD', type: 'SELL STOP', price: 0.6580, lots: 0.3, status: 'working' },
  ];
  return (
    <div>
      {ords.map((o, i) => (
        <div key={i} style={{ padding:'12px 14px', borderBottom:'1px solid var(--trader-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:13 }}>{o.pair}</span>
            <span className="num" style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:'var(--trader-panel-3)', color:'var(--text-1)', letterSpacing:'0.06em' }}>{o.type}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontFamily:'var(--font-mono)', color:'var(--text-2)', marginTop:4 }}>
            <span>@ {o.price.toFixed(4)} · {o.lots} lots</span>
            <span style={{ color:'var(--action)' }}>● working</span>
          </div>
        </div>
      ))}
      <div style={{ padding:14, textAlign:'center', color:'var(--text-3)', fontSize:11 }}>
        No other working orders
      </div>
    </div>
  );
}

/* Composer — command bar at bottom of thread */
function Composer({ value, onChange, onSend, suggestions = [] }) {
  return (
    <div style={{ padding:'12px 16px 16px', borderTop:'1px solid var(--trader-line)', background:'var(--trader-panel)' }}>
      {suggestions.length > 0 && (
        <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
          {suggestions.map(s => (
            <button key={s} className="chip" onClick={() => onSend && onSend(s)}>{s}</button>
          ))}
        </div>
      )}
      <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--trader-panel-2)', border:'1px solid var(--trader-line-strong)', borderRadius:10, padding:'10px 14px' }}>
        <Icon name="sparkles" size={14}/>
        <input
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend && onSend(value)}
          placeholder="Ask the Copilot, or type a command — e.g. 'short EURUSD at 1.0920 with 2R'"
          style={{ flex:1, background:'transparent', border:'none', color:'var(--text-0)', fontFamily:'var(--font-body)', fontSize:13.5, outline:'none' }}
        />
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)', padding:'2px 6px', border:'1px solid var(--trader-line)', borderRadius:3 }}>DEEP</span>
        <button onClick={() => onSend && onSend(value)} style={{ width:30, height:30, borderRadius:6, background:'var(--ai)', color:'#000', border:'none', cursor:'pointer', display:'grid', placeItems:'center' }}>
          <Icon name="send" size={14} stroke={2}/>
        </button>
      </div>
    </div>
  );
}

/* Proactive nudge toast (ambient) */
function Nudge({ title, body, actions, onDismiss }) {
  return (
    <div className="ai-card toast" style={{ width: 360, padding: 0, right: 24, bottom: 48, position: 'fixed', zIndex: 40 }}>
      <div style={{ padding:'14px 16px', display:'flex', gap:10 }}>
        <div className="ai-avatar" style={{ width:28, height:28, fontSize:10 }}>AI</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:500, color:'var(--text-0)', marginBottom:3, display:'flex', alignItems:'center', gap:8 }}>
            {title}
            <span className="ai-marker" style={{ padding:'1px 5px', fontSize:8, marginLeft:'auto' }}>PROACTIVE</span>
          </div>
          <div style={{ fontSize:12.5, color:'var(--text-1)', lineHeight:1.5 }}>{body}</div>
          <div style={{ display:'flex', gap:6, marginTop:10 }}>
            {actions.map((a, i) => (
              <button key={i} className="chip" style={i === 0 ? { borderColor:'var(--ai-border)', color:'var(--ai)', background:'var(--ai-bg)' } : {}}>{a}</button>
            ))}
            <button onClick={onDismiss} style={{ marginLeft:'auto', width:24, height:24, borderRadius:4, background:'transparent', border:'none', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon name="x" size={12}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RightRail, SectionHead, PositionsList, OrdersList, Composer, Nudge });
