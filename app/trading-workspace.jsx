/* === TRADING WORKSPACE — classic web-trader layout with AI woven in === */

function TradingWorkspace({ onOpenCopilot }) {
  const [active, setActive] = React.useState(0);
  const [side, setSide] = React.useState('SELL');
  const [orderType, setOrderType] = React.useState('Market');
  const [lots, setLots] = React.useState(0.01);
  const [attachSLTP, setAttachSLTP] = React.useState(false);
  const [bottomTab, setBottomTab] = React.useState('positions');
  const [showCopilotHint, setShowCopilotHint] = React.useState(true);

  const ws = WORKSPACES[active];
  // Plausible price for the selected pair
  const priceMap = {
    'EUR/USD': 1.08472, 'XAU/USD': 2348.12, 'BTC/USD': 67842.00, 'GBP/JPY': 198.47
  };
  const basePrice = priceMap[ws.sym] || 1.08472;

  return (
    <div className="trader-shell">
      <TopBar workspaces={WORKSPACES} activeWs={active} setActiveWs={setActive} onAsk={onOpenCopilot}/>
      <Sidebar active="charts" onNav={(id) => id === 'chat' && onOpenCopilot()}/>

      {/* Main: single chart column — order ticket lives in AI Trader V2 */}
      <div className="main" style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto 1fr auto', minWidth: 0, overflow: 'hidden' }}>

        {/* Pair tabs row */}
        <div style={{ gridColumn: '1 / -1', display:'flex', alignItems:'center', borderBottom:'1px solid var(--trader-line)', background:'var(--trader-panel)', paddingLeft: 8 }}>
          {WORKSPACES.map((w, i) => (
            <div key={w.sym} onClick={()=>setActive(i)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 14px', cursor:'pointer',
                borderRight: '1px solid var(--trader-line)',
                background: active === i ? 'var(--trader-panel-2)' : 'transparent',
                borderTop: active === i ? '2px solid var(--buy)' : '2px solid transparent',
                marginTop: active === i ? '-1px' : 0,
                position: 'relative',
              }}>
              <span style={{ width:14, height:14, borderRadius:3, background: i===0?'#2962FF':i===1?'#1E7DCC':i===2?'#FFB547':'#F7931A', display:'grid', placeItems:'center', color:'#fff', fontSize:8, fontWeight:700 }}>
                {w.sym.includes('EUR')?'€':w.sym.includes('GBP')?'£':w.sym.includes('XAU')?'Au':w.sym.includes('BTC')?'₿':''}
              </span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:500, color:'var(--text-0)' }}>{w.sym}</span>
              <span className="num" style={{ fontSize:11.5, color: w.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>{w.price}</span>
              <span className="num" style={{ fontSize:10, color: w.chg >= 0 ? 'var(--buy)' : 'var(--sell)' }}>
                {w.chg >= 0 ? '+' : ''}{w.chg}%
              </span>
              <Icon name="x" size={11} stroke={1.8}/>
            </div>
          ))}
          <button style={{ width:36, height:40, background:'transparent', border:'none', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}>
            <Icon name="plus" size={14}/>
          </button>
          <div style={{ marginLeft:'auto', padding:'0 12px', display:'flex', alignItems:'center', gap:8, fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-2)' }}>
            <span className="live-dot"/> Market open · Closes in <span style={{ color:'var(--text-0)' }}>6h 14m</span>
          </div>
        </div>

        {/* Chart toolbar */}
        <div style={{ gridColumn: '1 / -1', display:'flex', alignItems:'center', padding:'8px 12px', borderBottom:'1px solid var(--trader-line)', background:'var(--trader-panel)', gap:14, minWidth: 0, overflow: 'hidden' }}>
          <button className="chart-tool"><Icon name="chart" size={13}/> Indicators <span style={{ color:'var(--text-3)', marginLeft:2, fontSize:10 }}>3</span></button>
          <button className="chart-tool"><Icon name="drag" size={13}/> Draw</button>
          <div style={{ display:'flex', gap:2, background:'var(--trader-panel-2)', borderRadius:5, padding:2 }}>
            {['1m','5m','15m','1H','4H','1D','1W'].map(tf => (
              <button key={tf} className={`tf ${tf === '1H' ? 'active' : ''}`}>{tf}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:2, background:'var(--trader-panel-2)', borderRadius:5, padding:2, marginLeft: 4 }}>
            {[1,2,4].map(n => (
              <button key={n} className={`tf ${n === 1 ? 'active' : ''}`} title={`${n}-chart layout`}>
                <Icon name={n === 1 ? 'chart' : 'grid'} size={11}/>
              </button>
            ))}
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
            <span className="num" style={{ fontSize:11, color:'var(--text-2)' }}>OHLC</span>
            <span className="num" style={{ fontSize:11 }}>O <span style={{color:'var(--text-0)'}}>1.08210</span></span>
            <span className="num" style={{ fontSize:11 }}>H <span style={{color:'var(--text-0)'}}>1.08540</span></span>
            <span className="num" style={{ fontSize:11 }}>L <span style={{color:'var(--text-0)'}}>1.08095</span></span>
            <span className="num" style={{ fontSize:11 }}>C <span className="buy">1.08472</span></span>
            <span className="num" style={{ fontSize:11, color:'var(--text-2)' }}>Vol 14,382</span>
            <button
              onClick={onOpenCopilot}
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:5,
                background: 'var(--ai-bg)', border:'1px solid var(--ai-border)', color:'var(--ai)',
                fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase',
                cursor:'pointer' }}>
              <Icon name="sparkles" size={11}/> Ask AI
            </button>
            <button
              onClick={() => { window.location.hash = 'v2'; }}
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:5,
                background: 'var(--buy)', border:'1px solid var(--buy)', color:'#000',
                fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase',
                fontWeight:600, cursor:'pointer' }}>
              Place trade →
            </button>
          </div>
        </div>

        {/* Main chart */}
        <div style={{ gridColumn: '1 / -1', position:'relative', background:'var(--trader-panel)', borderBottom:'1px solid var(--trader-line)', overflow:'hidden' }}>
          <BigChart pair={ws.sym} basePrice={basePrice} seed={active === 0 ? 7 : active === 1 ? 13 : active === 2 ? 11 : 17}/>

          {/* AI commentary ribbon — ambient narration about the current chart */}
          <div style={{
            position:'absolute', left:16, top:16,
            display:'flex', gap:10,
            padding:'8px 12px 8px 10px',
            background:'rgba(11,13,16,0.85)', backdropFilter:'blur(8px)',
            border:'1px solid var(--ai-border)', borderRadius:8,
            maxWidth: 440, alignItems:'flex-start'
          }}>
            <div className="ai-avatar" style={{ width:22, height:22, fontSize:9, marginTop:1 }}>AI</div>
            <div style={{ fontSize:12, color:'var(--text-0)', lineHeight:1.5 }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--ai-2)', letterSpacing:'0.14em', marginRight:6 }}>LIVE READ ·</span>
              Higher-low sequence on 1H — last three pullbacks held above the 1.0836 trendline. RSI 54, neutral. DXY breaking down. Slight long bias.
              <button onClick={onOpenCopilot} style={{ marginLeft:6, background:'transparent', border:'none', color:'var(--ai)', fontSize:11, cursor:'pointer', textDecoration:'underline' }}>Deep dive →</button>
            </div>
          </div>

          {/* Open position marker on chart */}
          <div style={{ position:'absolute', right:76, top:'54%', display:'flex', alignItems:'center', gap:4, fontFamily:'var(--font-mono)', fontSize:10 }}>
            <span style={{ padding:'2px 5px', background:'var(--trader-panel-3)', border:'1px solid var(--trader-line)', borderRadius:3, color:'var(--text-1)' }}>#10377275</span>
            <span style={{ padding:'2px 5px', background:'var(--buy)', color:'#000', borderRadius:3, fontWeight:600 }}>BUY 0.50</span>
            <span className="buy" style={{ padding:'2px 5px' }}>+$131.00</span>
            <button style={{ width:16, height:16, borderRadius:2, background:'transparent', border:'1px solid var(--trader-line-strong)', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}><Icon name="x" size={9}/></button>
          </div>

          {/* Analyze with AI floating pill (bottom-right over chart) */}
          {showCopilotHint && (
            <div style={{ position:'absolute', right:16, bottom:16, display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => setShowCopilotHint(false)} style={{ width:24, height:24, borderRadius:4, background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', color:'var(--text-2)', cursor:'pointer', display:'grid', placeItems:'center' }}>
                <Icon name="x" size={11}/>
              </button>
              <button onClick={onOpenCopilot} className="ai-card" style={{
                display:'inline-flex', alignItems:'center', gap:8, padding:'9px 14px',
                fontSize:12, cursor:'pointer', color:'var(--text-0)'
              }}>
                <Icon name="sparkles" size={13}/>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--ai-2)', letterSpacing:'0.1em' }}>⌘K</span>
                <span>Ask Copilot about this chart</span>
              </button>
            </div>
          )}
        </div>

        {/* Order ticket lives in AI Trader (V2) — see footer view switcher */}

        {/* ==== BOTTOM TABS (positions / orders / history) ==== */}
        <div style={{ gridColumn:'1 / -1', display:'flex', flexDirection:'column', background:'var(--trader-panel)', minHeight:260, maxHeight:280, borderTop:'1px solid var(--trader-line-strong)' }}>
          <BottomPanel tab={bottomTab} setTab={setBottomTab} onAskAi={onOpenCopilot}/>
        </div>
      </div>

      <StatusBar/>
    </div>
  );
}

/* Order ticket — mirrors the HW layout with AI suggestions baked in */
function OrderTicket({ side, setSide, orderType, setOrderType, lots, setLots, attachSLTP, setAttachSLTP, basePrice, pair, onAskAi }) {
  const isBuy = side === 'BUY';
  const spread = 0.00008;
  const displayPrice = isBuy ? (basePrice + spread/2) : (basePrice - spread/2);
  const quickLots = [0.01, 0.02, 0.05, 0.10, 0.25];
  const decimals = basePrice >= 1000 ? 2 : basePrice >= 100 ? 3 : 5;

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0, overflow:'hidden' }}>
      {/* BUY / SELL toggle */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, padding:12, paddingBottom:8 }}>
        <button onClick={()=>setSide('BUY')} style={{
          padding:'14px 0 12px', borderRadius:6,
          background: isBuy ? 'var(--buy)' : 'var(--trader-panel-2)',
          color: isBuy ? '#000' : 'var(--text-1)',
          border: isBuy ? '1px solid var(--buy)' : '1px solid var(--trader-line)',
          cursor:'pointer', textAlign:'left', paddingLeft:14,
        }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em', fontWeight: 600, opacity: isBuy ? 0.8 : 1 }}>BUY</div>
          <div className="num" style={{ fontSize:15, fontWeight:600, marginTop:2 }}>{(basePrice + spread/2).toFixed(decimals)}</div>
          <div style={{ fontSize:9, marginTop:1, opacity: isBuy ? 0.7 : 0.5, fontFamily:'var(--font-mono)' }}>ask</div>
        </button>
        <button onClick={()=>setSide('SELL')} style={{
          padding:'14px 0 12px', borderRadius:6,
          background: !isBuy ? 'var(--sell)' : 'var(--trader-panel-2)',
          color: !isBuy ? '#fff' : 'var(--text-1)',
          border: !isBuy ? '1px solid var(--sell)' : '1px solid var(--trader-line)',
          cursor:'pointer', textAlign:'left', paddingLeft:14,
        }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em', fontWeight: 600, opacity: !isBuy ? 0.9 : 1 }}>SELL</div>
          <div className="num" style={{ fontSize:15, fontWeight:600, marginTop:2 }}>{(basePrice - spread/2).toFixed(decimals)}</div>
          <div style={{ fontSize:9, marginTop:1, opacity: !isBuy ? 0.8 : 0.5, fontFamily:'var(--font-mono)' }}>bid</div>
        </button>
      </div>

      {/* Order type row */}
      <div style={{ padding:'0 12px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, marginBottom:6 }}>
        {['Market','Limit','Stop'].map(t => (
          <button key={t} onClick={()=>setOrderType(t)}
            style={{
              padding:'7px 0', borderRadius:5, cursor:'pointer',
              background: orderType === t ? 'var(--trader-panel-3)' : 'transparent',
              border: '1px solid ' + (orderType === t ? 'var(--trader-line-strong)' : 'var(--trader-line)'),
              color: orderType === t ? 'var(--text-0)' : 'var(--text-2)',
              fontSize:11, fontFamily:'var(--font-mono)', letterSpacing:'0.04em'
            }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ padding:'0 12px 10px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
        {['Grid','Bracket'].map(t => (
          <button key={t} onClick={()=>setOrderType(t)}
            style={{
              padding:'7px 0', borderRadius:5, cursor:'pointer',
              background: orderType === t ? 'var(--trader-panel-3)' : 'transparent',
              border: '1px solid ' + (orderType === t ? 'var(--trader-line-strong)' : 'var(--trader-line)'),
              color: orderType === t ? 'var(--text-0)' : 'var(--text-2)',
              fontSize:11, fontFamily:'var(--font-mono)', letterSpacing:'0.04em'
            }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding:'4px 14px 10px', fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--buy)', display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--buy)' }}/>
        Executes immediately at current market price
      </div>

      {/* Lot size */}
      <div style={{ padding:'0 14px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', marginBottom:6 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)' }}>ORDER VALUE</span>
          <span style={{ marginLeft:'auto', display:'flex', gap:2, background:'var(--trader-panel-2)', borderRadius:4, padding:2 }}>
            <button className="sml" style={{ background:'var(--buy)', color:'#000' }}>LOTS</button>
            <button className="sml">$</button>
            <button className="sml">%</button>
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)', borderRadius:6, padding:'6px 10px' }}>
          <button onClick={()=>setLots(Math.max(0.01, +(lots-0.01).toFixed(2)))} style={{ width:22, height:22, borderRadius:4, background:'var(--trader-panel-3)', border:'none', color:'var(--text-1)', cursor:'pointer', display:'grid', placeItems:'center' }}>–</button>
          <input
            value={lots.toFixed(2)}
            onChange={e=>{ const v = parseFloat(e.target.value); if (!isNaN(v)) setLots(Math.max(0.01, v)); }}
            className="num"
            style={{ flex:1, textAlign:'center', background:'transparent', border:'none', color:'var(--text-0)', fontSize:17, fontWeight:500, outline:'none' }}
          />
          <button onClick={()=>setLots(+(lots+0.01).toFixed(2))} style={{ width:22, height:22, borderRadius:4, background:'var(--trader-panel-3)', border:'none', color:'var(--text-1)', cursor:'pointer', display:'grid', placeItems:'center' }}>+</button>
        </div>
        {/* slider */}
        <div style={{ position:'relative', height:4, background:'var(--trader-panel-3)', borderRadius:2, marginTop:10 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width: `${Math.min(lots/0.25, 1)*100}%`, background:'var(--buy)', borderRadius:2 }}/>
          <div style={{ position:'absolute', left: `calc(${Math.min(lots/0.25, 1)*100}% - 8px)`, top:-6, width:16, height:16, borderRadius:'50%', background:'var(--buy)', border:'2px solid var(--trader-panel)' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-3)' }}>
          <span>0.01</span><span>0.25</span>
        </div>
        <div style={{ display:'flex', gap:4, marginTop:8 }}>
          {quickLots.map(l => (
            <button key={l} onClick={()=>setLots(l)} style={{
              flex:1, padding:'6px 0', borderRadius:4, cursor:'pointer',
              background: Math.abs(lots - l) < 0.001 ? 'var(--buy)' : 'transparent',
              border:'1px solid ' + (Math.abs(lots - l) < 0.001 ? 'var(--buy)' : 'var(--trader-line)'),
              color: Math.abs(lots - l) < 0.001 ? '#000' : 'var(--text-1)',
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight: Math.abs(lots - l) < 0.001 ? 600 : 400
            }}>{l.toFixed(2)}</button>
          ))}
        </div>
      </div>

      {/* AI risk suggestion chip */}
      <div style={{ margin:'0 14px 10px', padding:'9px 12px', background:'var(--ai-bg)', border:'1px solid var(--ai-border)', borderRadius:6, display:'flex', alignItems:'flex-start', gap:9 }}>
        <Icon name="sparkles" size={13} stroke={1.6}/>
        <div style={{ flex:1, fontSize:11.5, lineHeight:1.45, color:'var(--text-0)' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--ai-2)' }}>AI ·</span> For 0.5% risk on your $24,182 equity and a 20-pip stop, size is <button style={{ background:'transparent', border:'none', color:'var(--ai)', fontFamily:'var(--font-mono)', fontSize:11.5, cursor:'pointer', padding:0, textDecoration:'underline' }}>0.60 lots</button>
        </div>
      </div>

      {/* SL / TP toggle */}
      <div style={{ padding:'0 14px 10px' }}>
        <button
          onClick={()=>setAttachSLTP(!attachSLTP)}
          style={{
            width:'100%', padding:'9px 12px', borderRadius:6,
            background:'var(--trader-panel-2)', border:'1px solid var(--trader-line)',
            color:'var(--text-1)', fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', gap:8
          }}>
          <Icon name={attachSLTP ? 'check' : 'plus'} size={12}/>
          <span>Add Stop Loss / Take Profit</span>
          <span className="ai-marker" style={{ padding:'1px 5px', fontSize:8, marginLeft:'auto' }}>AI SUGGEST</span>
        </button>
        {attachSLTP && (
          <div style={{ marginTop:8, display:'grid', gap:6 }}>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--sell)', width:22 }}>SL</span>
              <input className="field num" defaultValue={(basePrice * 0.998).toFixed(decimals)} style={{ padding:'6px 10px', fontSize:12 }}/>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)' }}>−20p</span>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--buy)', width:22 }}>TP</span>
              <input className="field num" defaultValue={(basePrice * 1.004).toFixed(decimals)} style={{ padding:'6px 10px', fontSize:12 }}/>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-3)' }}>+40p</span>
            </div>
          </div>
        )}
      </div>

      {/* Execute button */}
      <div style={{ padding:'6px 14px 10px' }}>
        <button style={{
          width:'100%', padding:'16px 0', borderRadius:6,
          background: isBuy ? 'var(--buy)' : 'var(--sell)',
          color: isBuy ? '#000' : '#fff',
          border:'none', cursor:'pointer',
        }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.2em', fontWeight:700, marginBottom:4 }}>{side}</div>
          <div className="num" style={{ fontSize:19, fontWeight:600 }}>{displayPrice.toFixed(decimals)}</div>
        </button>
      </div>

      {/* Order summary */}
      <div style={{ margin:'4px 14px 14px', border:'1px solid var(--trader-line)', borderRadius:6, overflow:'hidden', flex: '0 0 auto' }}>
        <div style={{ padding:'8px 12px', background:'var(--trader-panel-2)', borderBottom:'1px solid var(--trader-line)', fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)', display:'flex' }}>
          ORDER SUMMARY
          <span style={{ marginLeft:'auto', color:'var(--ai)', cursor:'pointer', textTransform:'none', letterSpacing: 0, fontSize: 10 }} onClick={onAskAi}>Explain risk</span>
        </div>
        {[
          ['Action', <span><span className={isBuy?'buy':'sell'}>{side}</span> <span style={{color:'var(--text-0)'}}>{lots.toFixed(2)} lots of {pair}</span></span>],
          ['Order Type', orderType],
          ['At Price', displayPrice.toFixed(decimals)],
          ['Spread', '0.8 pts'],
          ['Order Value', `$${(lots * basePrice * 1000).toFixed(2)}`],
          ['Margin Required', `$${(lots * basePrice * 1000 / 500).toFixed(2)}`],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 12px', fontSize:11.5, borderBottom: i < arr.length - 1 ? '1px solid var(--trader-line)' : 'none' }}>
            <span style={{ color:'var(--text-2)', display:'flex', alignItems:'center', gap:5 }}>
              {k}
              <span style={{ width:12, height:12, borderRadius:'50%', border:'1px solid var(--trader-line)', color:'var(--text-3)', fontSize:8, display:'grid', placeItems:'center' }}>?</span>
            </span>
            <span className="num" style={{ color:'var(--text-0)' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* BottomPanel — positions/orders/history tabs + account strip */
function BottomPanel({ tab, setTab, onAskAi }) {
  return (
    <>
      {/* Tab strip + account info strip (like HW screenshot) */}
      <div style={{ display:'flex', alignItems:'center', borderBottom:'1px solid var(--trader-line)', background:'var(--trader-panel)' }}>
        {[
          { id:'positions', label:'Positions', count:3 },
          { id:'orders', label:'Orders', count:2 },
          { id:'history', label:'History', count:null },
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:'11px 18px', background:'transparent',
            border:'none',
            borderBottom: tab === t.id ? '2px solid var(--buy)' : '2px solid transparent',
            color: tab === t.id ? 'var(--text-0)' : 'var(--text-2)',
            fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', gap:8
          }}>
            {t.label}
            {t.count != null && <span className="num" style={{ fontSize:10, padding:'1px 6px', borderRadius:999, background:'var(--trader-panel-3)', color: tab === t.id ? 'var(--text-0)' : 'var(--text-2)' }}>{t.count}</span>}
          </button>
        ))}
        {/* Account strip */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:18, padding:'0 14px', fontFamily:'var(--font-mono)', fontSize:10.5 }}>
          {[
            ['Balance', '$24,000.20', 'var(--text-0)'],
            ['Equity', '$24,182.67', 'var(--text-0)'],
            ['P&L', '+$182.47 (0.76%)', 'var(--buy)'],
            ['Margin', '$1,368.34', 'var(--text-0)'],
            ['Free Margin', '$22,814.33', 'var(--text-0)'],
            ['Margin Level', '1,768%', 'var(--text-0)'],
            ['Leverage', '1:500', 'var(--text-0)'],
          ].map(([k, v, c]) => (
            <div key={k} style={{ display:'flex', flexDirection:'column', gap:1 }}>
              <span style={{ fontSize:8.5, color:'var(--text-3)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{k}</span>
              <span style={{ color: c }}>{v}</span>
            </div>
          ))}
          <button onClick={onAskAi} className="ai-marker" style={{ padding:'4px 9px', marginLeft:4, cursor:'pointer' }}>
            <Icon name="sparkles" size={10}/> Manage AI
          </button>
        </div>
      </div>

      {/* Positions table */}
      <div style={{ flex:1, overflow:'auto', minHeight:0 }}>
        {tab === 'positions' && <PositionsTable onAskAi={onAskAi}/>}
        {tab === 'orders' && <OrdersTable/>}
        {tab === 'history' && <HistoryTable/>}
      </div>
    </>
  );
}

function PositionsTable({ onAskAi }) {
  const rows = [
    { id:'10377275', pair:'EUR/USD', side:'BUY', volume:0.50, value:'$54,236', openTime:'Apr 17 07:54', openPrice:1.08210, current:1.08472, sl:'+Set', tp:'+Set', swap:'$0.00', comm:'-$2.50', pnl: 131.00, pnlPct: 0.24, ai:'Momentum fading; approaching resistance.' },
    { id:'10377276', pair:'XAU/USD', side:'SELL', volume:0.10, value:'$23,481', openTime:'Apr 17 07:54', openPrice:2352.80, current:2348.12, sl:'2362.00', tp:'2335.00', swap:'+$0.00', comm:'-$3.80', pnl: 46.80, pnlPct: 0.20, ai:'TP 58% reached. Suggest trailing stop.' },
    { id:'10377301', pair:'GBP/JPY', side:'BUY', volume:0.20, value:'$39,694', openTime:'Apr 17 10:12', openPrice:197.90, current:198.47, sl:'197.20', tp:'199.60', swap:'-$0.80', comm:'-$1.20', pnl: 76.40, pnlPct: 0.29, ai:'Breaking out — UK CPI 9:30 a risk.' },
  ];
  const headers = ['ID','Symbol','Type','Volume','Value','Open Time','Open Price','Current','S/L','T/P','Swap','Commission','Profit / P&L','AI','',''];
  const decimalsFor = (pair) => pair.includes('JPY') ? 3 : pair.includes('XAU') ? 2 : 5;
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-mono)', fontSize:11 }}>
      <thead>
        <tr style={{ background:'var(--trader-panel-2)' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign:'left', padding:'7px 10px', fontSize:10, fontWeight:400, letterSpacing:'0.08em', color:'var(--text-2)', borderBottom:'1px solid var(--trader-line)', whiteSpace:'nowrap', textTransform:'uppercase' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} style={{ borderBottom:'1px solid var(--trader-line)' }}>
            <td style={{ padding:'8px 10px', color:'var(--text-2)' }}>#{r.id}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-0)', fontFamily:'var(--font-display)' }}>{r.pair}</td>
            <td style={{ padding:'8px 10px' }}>
              <span style={{ padding:'2px 7px', borderRadius:3, fontSize:10, background: r.side==='BUY'?'rgba(0,229,153,0.12)':'rgba(255,77,77,0.12)', color: r.side==='BUY'?'var(--buy)':'var(--sell)' }}>{r.side}</span>
            </td>
            <td style={{ padding:'8px 10px', color:'var(--text-0)' }}>{r.volume.toFixed(2)}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-1)' }}>{r.value}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-2)' }}>{r.openTime}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-0)' }}>{r.openPrice.toFixed(decimalsFor(r.pair))}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-0)' }} className="flash-up">{r.current.toFixed(decimalsFor(r.pair))}</td>
            <td style={{ padding:'8px 10px', color: r.sl.includes('+Set') ? 'var(--text-3)' : 'var(--sell)' }}>{r.sl}</td>
            <td style={{ padding:'8px 10px', color: r.tp.includes('+Set') ? 'var(--text-3)' : 'var(--buy)' }}>{r.tp}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-1)' }}>{r.swap}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-1)' }}>{r.comm}</td>
            <td style={{ padding:'8px 10px' }}>
              <span className={r.pnl >= 0 ? 'buy' : 'sell'} style={{ fontWeight:500 }}>{r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}</span>
              <span style={{ fontSize:9, color:'var(--text-3)', marginLeft:4 }}>({r.pnlPct.toFixed(2)}%)</span>
            </td>
            <td style={{ padding:'8px 10px', maxWidth:240 }}>
              <div onClick={onAskAi} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', color:'var(--text-0)', fontSize:11, fontFamily:'var(--font-body)' }}>
                <span className="ai-avatar" style={{ width:16, height:16, fontSize:7 }}>AI</span>
                <span style={{ opacity:0.85 }}>{r.ai}</span>
              </div>
            </td>
            <td style={{ padding:'8px 6px' }}>
              <button style={{ padding:'4px 10px', borderRadius:3, background:'transparent', border:'1px solid var(--trader-line-strong)', color:'var(--text-1)', fontSize:10, cursor:'pointer' }}>Edit</button>
            </td>
            <td style={{ padding:'8px 10px 8px 0' }}>
              <button style={{ padding:'4px 10px', borderRadius:3, background:'transparent', border:'1px solid rgba(255,77,77,0.4)', color:'var(--sell)', fontSize:10, cursor:'pointer' }}>Close</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrdersTable() {
  const rows = [
    { id:'o-1048', pair:'USD/JPY', type:'BUY LIMIT', price:148.20, lots:0.50, placed:'Apr 17 09:22' },
    { id:'o-1050', pair:'AUD/USD', type:'SELL STOP', price:0.65800, lots:0.30, placed:'Apr 17 11:04' },
  ];
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-mono)', fontSize:11 }}>
      <thead>
        <tr style={{ background:'var(--trader-panel-2)' }}>
          {['ID','Symbol','Type','Volume','At Price','Placed','Status','',''].map((h,i)=>(
            <th key={i} style={{ textAlign:'left', padding:'7px 10px', fontSize:10, color:'var(--text-2)', borderBottom:'1px solid var(--trader-line)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} style={{ borderBottom:'1px solid var(--trader-line)' }}>
            <td style={{ padding:'8px 10px', color:'var(--text-2)' }}>#{r.id}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-0)', fontFamily:'var(--font-display)' }}>{r.pair}</td>
            <td style={{ padding:'8px 10px' }}>
              <span style={{ padding:'2px 7px', borderRadius:3, fontSize:10, background:'var(--trader-panel-3)', color:'var(--text-1)' }}>{r.type}</span>
            </td>
            <td style={{ padding:'8px 10px' }}>{r.lots.toFixed(2)}</td>
            <td style={{ padding:'8px 10px' }}>{r.price.toFixed(r.pair.includes('JPY')?3:5)}</td>
            <td style={{ padding:'8px 10px', color:'var(--text-2)' }}>{r.placed}</td>
            <td style={{ padding:'8px 10px' }}><span style={{ color:'var(--action)' }}>● working</span></td>
            <td><button style={{ padding:'4px 10px', borderRadius:3, background:'transparent', border:'1px solid var(--trader-line-strong)', color:'var(--text-1)', fontSize:10, cursor:'pointer' }}>Edit</button></td>
            <td><button style={{ padding:'4px 10px', borderRadius:3, background:'transparent', border:'1px solid rgba(255,77,77,0.4)', color:'var(--sell)', fontSize:10, cursor:'pointer' }}>Cancel</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HistoryTable() {
  const rows = [
    { date:'Apr 17 06:14', pair:'EUR/USD', side:'BUY', lots:0.20, open:1.0815, close:1.0842, pnl:+54.00 },
    { date:'Apr 17 05:40', pair:'XAU/USD', side:'SELL', lots:0.05, open:2357.10, close:2351.40, pnl:+28.50 },
    { date:'Apr 16 22:02', pair:'GBP/USD', side:'BUY', lots:0.30, open:1.2640, close:1.2622, pnl:-54.00 },
    { date:'Apr 16 18:30', pair:'BTC/USD', side:'BUY', lots:0.02, open:67210, close:67855, pnl:+129.00 },
  ];
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-mono)', fontSize:11 }}>
      <thead>
        <tr style={{ background:'var(--trader-panel-2)' }}>
          {['Date','Symbol','Side','Volume','Open','Close','P&L','Share'].map((h,i)=>(
            <th key={i} style={{ textAlign:'left', padding:'7px 10px', fontSize:10, color:'var(--text-2)', borderBottom:'1px solid var(--trader-line)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom:'1px solid var(--trader-line)' }}>
            <td style={{ padding:'7px 10px', color:'var(--text-2)' }}>{r.date}</td>
            <td style={{ padding:'7px 10px', color:'var(--text-0)', fontFamily:'var(--font-display)' }}>{r.pair}</td>
            <td style={{ padding:'7px 10px' }}><span className={r.side==='BUY'?'buy':'sell'}>{r.side}</span></td>
            <td style={{ padding:'7px 10px' }}>{r.lots.toFixed(2)}</td>
            <td style={{ padding:'7px 10px' }}>{r.open}</td>
            <td style={{ padding:'7px 10px' }}>{r.close}</td>
            <td style={{ padding:'7px 10px' }}><span className={r.pnl>=0?'buy':'sell'}>{r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}</span></td>
            <td><button style={{ padding:'3px 8px', borderRadius:3, background:'transparent', border:'1px solid var(--trader-line)', color:'var(--text-2)', fontSize:10, cursor:'pointer' }}>↗</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Bigger chart with realistic trader-style candles */
function BigChart({ pair = 'EUR/USD', basePrice = 1.0847, seed = 7 }) {
  const ref = React.useRef();
  const [size, setSize] = React.useState({ w: 800, h: 380 });
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position:'absolute', inset:0 }}>
      {size.w > 100 && (
        <Candles
          width={size.w} height={size.h}
          seed={seed} pair={pair} timeframe="1H"
          basePrice={basePrice}
          annotations={[]}
        />
      )}
    </div>
  );
}

Object.assign(window, { TradingWorkspace, OrderTicket, BottomPanel, PositionsTable, OrdersTable, HistoryTable, BigChart });
