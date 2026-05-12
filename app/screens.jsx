/* Screens — compose each named state the brief asked for */

const WORKSPACES = [
  { sym: 'EUR/USD', price: '1.08472', chg: 0.24 },
  { sym: 'XAU/USD', price: '2,348.12', chg: 0.67 },
  { sym: 'BTC/USD', price: '67,842', chg: -0.88 },
  { sym: 'GBP/JPY', price: '198.47', chg: 0.31 },
];

const POSITIONS = [
  { pair: 'EUR/USD', side: 'BUY', lots: 0.50, entry: 1.08210, current: 1.08472, sl: 1.08020, tp: 1.08820, pnl: 131.00, pnlPct: 0.24 },
  { pair: 'XAU/USD', side: 'SELL', lots: 0.10, entry: 2352.80, current: 2348.12, sl: 2362.00, tp: 2335.00, pnl: 46.80, pnlPct: 0.20 },
  { pair: 'GBP/JPY', side: 'BUY', lots: 0.20, entry: 197.90, current: 198.47, sl: 197.20, tp: 199.60, pnl: 76.40, pnlPct: 0.29 },
];

/* ========= ACTIVE WORKSPACE ========= */
function ActiveWorkspace() {
  const [active, setActive] = React.useState(0);
  const [input, setInput] = React.useState('');
  const threadRef = React.useRef();

  React.useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' }); }, []);

  return (
    <div className="trader-shell">
      <TopBar workspaces={WORKSPACES} activeWs={active} setActiveWs={setActive}/>
      <Sidebar active="chat"/>
      <div className="main" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Center: conversation + card canvas */}
        <div style={{ display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
          <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:12 }}>
            <span className="ai-marker">CANVAS</span>
            <span style={{ fontSize:13, color:'var(--text-0)' }}>EUR/USD · pre-London session</span>
            <span style={{ fontSize:11, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>· 3 cards · auto-saved</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
              <button className="chip"><Icon name="grid" size={11}/> Layout</button>
              <button className="chip"><Icon name="plus" size={11}/> New canvas</button>
            </div>
          </div>

          <div ref={threadRef} style={{ flex:1, overflowY:'auto', padding:'24px 32px 12px', maxWidth:'100%' }}>
            <div style={{ maxWidth: 820, margin:'0 auto' }}>
              <UserMessage>Is EUR/USD a buy here? What's your setup?</UserMessage>
              <AiMessage time="2m ago">
                Yes — a clean long presents itself on the 1H. Price tested 1.0821 support twice overnight and rejected with a bullish engulfing on the last retest. DXY is rolling over below its 4H 50-EMA and ECB speakers are dovish. I've drawn it out below with entry, stop and target. Historical analogue: 64% hit-rate on this setup over the last 18 months.
              </AiMessage>

              <TradeIdeaCard
                pair="EUR/USD" side="BUY"
                entry={1.08680} stop={1.08420} target={1.09200}
                lots={0.50} riskUsd={130} rewardUsd={260} rr="2.0" confidence={78}
                reasoning="1H double-bottom at 1.0821 with bullish engulfing; RSI divergence on 4H; DXY breaking 104.20; ECB Lagarde dovish at 09:00. Stop beyond the structural low, target the prior 4H swing high."
                chartSeed={7}
              />

              <UserMessage>Show me DXY alongside</UserMessage>
              <AiMessage time="1m ago" streaming>
                Here's DXY on the same 4H. You can see the break of the rising trendline that's been in place since March — that's the macro tailwind behind the EUR/USD setup.
              </AiMessage>

              <ChartCard pair="DXY" timeframe="4H" seed={9}
                note="AI note: trendline break confirmed with a close below 104.20. Targeting 103.40 over the next 3–5 sessions."
                annotations={[{ price: 1.08800, label: 'TRENDLINE BREAK', color: 'var(--ai)', idx: 55 }]}
              />

              <div style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0 16px', color:'var(--text-2)', fontSize:11, fontFamily:'var(--font-mono)' }}>
                <span style={{ flex:1, height:1, background:'var(--trader-line)' }}/>
                <span>ABOVE · CANVAS · BELOW · THREAD</span>
                <span style={{ flex:1, height:1, background:'var(--trader-line)' }}/>
              </div>
            </div>
          </div>

          <Composer
            value={input} onChange={setInput}
            onSend={(v) => { setInput(''); }}
            suggestions={["Size it at 0.5% risk", "What if DXY holds?", "Set bracket at 2R", "Similar setups last 6 months"]}
          />
        </div>

        {/* Right rail */}
        <RightRail positions={POSITIONS}/>
      </div>
      <StatusBar/>
    </div>
  );
}

/* ========= AI ORDER TICKET (focused) ========= */
function OrderTicketScreen() {
  const [active, setActive] = React.useState(0);
  return (
    <div className="trader-shell">
      <TopBar workspaces={WORKSPACES} activeWs={active} setActiveWs={setActive}/>
      <Sidebar active="chat"/>
      <div className="main" style={{ gridTemplateColumns: '1fr 380px' }}>
        <div style={{ display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
          <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:12 }}>
            <span className="ai-marker">REVIEW · AI-SUGGESTED ORDER</span>
            <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>⌘ + ENTER to execute</span>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'32px 40px' }}>
            <div style={{ maxWidth: 860, margin:'0 auto' }}>
              <UserMessage>Short EURUSD at the 1.0920 swing, 2R bracket</UserMessage>
              <AiMessage time="just now">
                Drafted the short. Entry is a sell-limit at the prior swing high, stop is above the 4H structural peak, target is a clean 2R to the overnight low. At your configured 0.5% risk per trade that sizes to 0.38 lots. Review, modify, or fire.
              </AiMessage>

              <TradeIdeaCard
                pair="EUR/USD" side="SELL"
                entry={1.09200} stop={1.09460} target={1.08680}
                lots={0.38} riskUsd={99} rewardUsd={198} rr="2.0" confidence={71}
                reasoning="Sell-limit at the prior 4H swing high (1.0920) — resistance held twice yesterday. Stop above the 1.0946 structural peak. Target the overnight low, a clean 2R. RSI 4H shows bearish divergence; DXY found support at the 103.80 level it's tested 3× this quarter."
                chartSeed={11}
              />

              {/* Reasoning deep-dive */}
              <div className="ai-card" style={{ marginBottom: 12 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--trader-line)' }}>
                  <span className="ai-marker">WHY THESE LEVELS</span>
                </div>
                <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[
                    ['ENTRY · 1.0920', 'Prior 4H swing high. Last 3 taps rejected with sell-side pressure.'],
                    ['STOP · 1.0946', 'Above structural peak + 1.2× ATR buffer for noise.'],
                    ['TARGET · 1.0868', 'Overnight low & VWAP confluence. Clean 2R at this stop.'],
                    ['SIZE · 0.38 LOTS', '0.5% of equity ($121) / 26-pip stop = 0.38 standard.'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--ai)', letterSpacing:'0.1em', marginBottom:4 }}>{k}</div>
                      <div style={{ fontSize:12, color:'var(--text-1)', lineHeight:1.5 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:'10px 16px', borderTop:'1px solid var(--trader-line)', background:'var(--trader-panel-2)', fontSize:11, fontFamily:'var(--font-mono)', color:'var(--text-2)', display:'flex', gap:16 }}>
                  <span>◆ Correlation with your EUR/USD long: <span style={{ color:'var(--action)' }}>-1.00</span></span>
                  <span>◆ Net EUR exposure after fill: <span style={{ color:'var(--text-0)' }}>+0.12</span></span>
                  <span style={{ marginLeft:'auto' }}>◆ Margin impact: <span style={{ color:'var(--text-0)' }}>$76</span></span>
                </div>
              </div>

              {/* Risk preview */}
              <div className="panel" style={{ marginBottom: 40 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--trader-line)', display:'flex' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em', color:'var(--text-2)' }}>RISK PREVIEW · AFTER FILL</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0 }}>
                  {[
                    ['Free margin', '$22,738', 'var(--text-0)'],
                    ['Margin level', '1,721%', 'var(--buy)'],
                    ['Risk on book', '$327 (1.35%)', 'var(--text-0)'],
                    ['Max drawdown', '-$430 (-1.78%)', 'var(--action)'],
                  ].map(([k, v, c], i) => (
                    <div key={k} style={{ padding:'14px 16px', borderRight: i < 3 ? '1px solid var(--trader-line)' : 'none' }}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.14em', color:'var(--text-2)', marginBottom:4 }}>{k}</div>
                      <div className="num" style={{ fontSize:16, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Composer value="" onChange={()=>{}} onSend={()=>{}} suggestions={["Tighten stop to 1.0940", "Scale in over 2 entries", "Make it 1R instead"]}/>
        </div>
        <RightRail positions={POSITIONS}/>
      </div>
      <StatusBar/>
    </div>
  );
}

/* ========= POSITION WITH LIVE AI COMMENTARY ========= */
function LivePositionScreen() {
  const [active, setActive] = React.useState(2);
  const narrations = [
    "XAU/USD is approaching the overnight VWAP at 2,349.50. Momentum on 15m is fading — last 3 candles each printed lower highs. You're up $46.80, about 58% of the way to TP. If price breaks 2,350 I'd expect a short-covering pop and I'll flag a trail.",
    "Now testing 2,349.50. Volume's thin — classic lunch chop. Risk is balanced: a push above 2,351 likely triggers stops up to 2,355, a rejection sends us to TP within 30–45min. Your 2,362 stop is 55 pips away, unthreatened.",
    "Rejected. Two bearish engulfing on 5m since my last update. Price now 2,347.40, target 2,335 still 123 pips away. I'd recommend trailing your stop to 2,354 (break-even + fees). Want me to do it?",
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % narrations.length), 7000);
    return () => clearInterval(t);
  }, []);

  const gbpPos = { pair: 'GBP/JPY', side: 'BUY', lots: 0.20, entry: 197.90, current: 198.47, sl: 197.20, tp: 199.60, pnl: 76.40, pnlPct: 0.29 };
  const eurPos = { pair: 'EUR/USD', side: 'BUY', lots: 0.50, entry: 1.08210, current: 1.08472, sl: 1.08020, tp: 1.08820, pnl: 131.00, pnlPct: 0.24 };

  return (
    <div className="trader-shell">
      <TopBar workspaces={WORKSPACES} activeWs={active} setActiveWs={setActive}/>
      <Sidebar active="portfolio"/>
      <div className="main" style={{ gridTemplateColumns: '1fr 380px' }}>
        <div style={{ display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
          <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:12 }}>
            <span className="ai-marker">LIVE POSITIONS · AI-NARRATED</span>
            <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>3 open · $254.20 unrealized</span>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'24px 32px' }}>
            <div style={{ maxWidth: 820, margin:'0 auto' }}>
              <PositionCard
                pair="XAU/USD" side="SELL"
                entry={2352.80} current={2348.12} sl={2362.00} tp={2335.00}
                lots={0.10} pnl={46.80} pnlPct={0.20}
                narration={narrations[idx]}
                chartSeed={13}
              />
              <PositionCard
                pair="EUR/USD" side="BUY"
                entry={1.08210} current={1.08472} sl={1.08020} tp={1.08820}
                lots={0.50} pnl={131.00} pnlPct={0.24}
                narration="Steady grind higher, exactly as planned. You're 50% to TP. ECB Lagarde speech in 38 minutes — historically this pair moves ±15 pips on her remarks. Your stop has 45 pips of buffer, so I wouldn't touch it."
                chartSeed={7}
              />
              <PositionCard
                pair="GBP/JPY" side="BUY"
                entry={197.90} current={198.47} sl={197.20} tp={199.60}
                lots={0.20} pnl={76.40} pnlPct={0.29}
                narration="Breaking out of the 4H range. Momentum is strong but RSI is pushing 74 — I'd consider trailing the stop to 198.10 to lock in about $40. UK CPI in 96 minutes is the big risk."
                chartSeed={17}
              />
            </div>
          </div>
          <Composer value="" onChange={()=>{}} onSend={()=>{}} suggestions={["Trail all my stops", "What's my biggest risk?", "Close XAU half", "Plan for CPI"]}/>
        </div>
        <RightRail positions={POSITIONS}/>
      </div>
      <StatusBar/>
    </div>
  );
}

/* ========= PROACTIVE ALERT / NUDGE STATE ========= */
function NudgeScreen() {
  const [active, setActive] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <div className="trader-shell">
      <TopBar workspaces={WORKSPACES} activeWs={active} setActiveWs={setActive}/>
      <Sidebar active="chat"/>
      <div className="main" style={{ gridTemplateColumns: '1fr 380px' }}>
        <div style={{ display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden', position:'relative' }}>
          {/* Notifications panel */}
          <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:12 }}>
            <Icon name="bell" size={14}/>
            <span style={{ fontSize:13, color:'var(--text-0)' }}>Proactive inbox</span>
            <span style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--action)' }}>4 NEW</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
              <button className="chip">All</button>
              <button className="chip" style={{ background:'var(--ai-bg)', borderColor:'var(--ai-border)', color:'var(--ai)' }}>AI nudges</button>
              <button className="chip">Alerts</button>
              <button className="chip">Events</button>
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'24px 32px' }}>
            <div style={{ maxWidth: 780, margin:'0 auto' }}>
              {[
                { time:'2m ago', color:'var(--action)', icon:'alert',
                  title:'Your EUR/USD long + ECB speech in 38 minutes',
                  body:"Historically EUR/USD moves ±17 pips on Lagarde's opener. You're 0.5 lots long with 45 pips of stop buffer — comfortable, but a tighter stop at 1.0835 would reduce risk by $95 without much hit-rate cost.",
                  actions:['Tighten stop to 1.0835', 'Show history', 'Dismiss'] },
                { time:'12m ago', color:'var(--ai)', icon:'sparkles',
                  title:'3 of your watchlist broke daily ranges',
                  body:"GBP/JPY, XAU/USD and NAS100 all took out yesterday's high in the last 30 minutes — a regime signal you usually act on. GBP/JPY has the cleanest continuation setup.",
                  actions:['Show all 3', 'Chart GBP/JPY', 'Dismiss'] },
                { time:'24m ago', color:'var(--buy)', icon:'check',
                  title:'XAU/USD short approaching TP',
                  body:"You're 58% of the way to your 2,335 target. Rejected twice at VWAP. I suggest trailing the stop to 2,354 to lock in +$20 and riding the rest.",
                  actions:['Trail to 2,354', 'Close half', 'Leave it'] },
                { time:'41m ago', color:'var(--sell)', icon:'alert',
                  title:'USD exposure is -2.4 lots — above your cap',
                  body:"Your configured cap is -2.0 net USD lots. Current -2.4 leaves you exposed if DXY spikes. Closing half of the EUR/USD long brings you back to -1.9.",
                  actions:['Close 0.25 EUR/USD', 'Adjust cap', 'Dismiss'] },
              ].map((n, i) => (
                <div key={i} className="ai-card" style={{ marginBottom:10, borderLeftColor: n.color }}>
                  <div style={{ padding:'14px 16px', display:'flex', gap:12 }}>
                    <div style={{ width:28, height:28, borderRadius:6, background:'var(--trader-panel-2)', border:`1px solid ${n.color}`, color: n.color, display:'grid', placeItems:'center', flexShrink:0 }}>
                      <Icon name={n.icon} size={14}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
                        <span style={{ fontSize:13, fontWeight:500, color:'var(--text-0)' }}>{n.title}</span>
                        <span className="num" style={{ fontSize:10, color:'var(--text-3)', marginLeft:'auto' }}>{n.time}</span>
                      </div>
                      <div style={{ fontSize:12.5, color:'var(--text-1)', lineHeight:1.55 }}>{n.body}</div>
                      <div style={{ display:'flex', gap:6, marginTop:10 }}>
                        {n.actions.map((a, j) => (
                          <button key={j} className="chip" style={j === 0 ? { borderColor: n.color, color: n.color, background: 'transparent' } : {}}>{a}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live toast */}
          {!dismissed && (
            <Nudge
              title="ECB Lagarde speech in 38 minutes"
              body="You're long 0.5 EUR/USD. Median move on her opener is ±17 pips. Want me to tighten your stop?"
              actions={['Tighten stop', 'Show history']}
              onDismiss={() => setDismissed(true)}
            />
          )}
        </div>
        <RightRail positions={POSITIONS}/>
      </div>
      <StatusBar/>
    </div>
  );
}

/* ========= ALTERNATE LAYOUTS ========= */

// Variation 2: stacked column (conversation IS the app, cards flow inline newest-first)
function StackedWorkspace() {
  const [active, setActive] = React.useState(0);
  return (
    <div className="trader-shell">
      <TopBar workspaces={WORKSPACES} activeWs={active} setActiveWs={setActive}/>
      <Sidebar active="chat"/>
      <div className="main" style={{ gridTemplateColumns: '1fr 340px' }}>
        <div style={{ display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
          <div style={{ padding:'12px 20px', borderBottom:'1px solid var(--trader-line)', display:'flex', alignItems:'center', gap:12 }}>
            <span className="ai-marker">STACKED THREAD</span>
            <span style={{ fontSize:11, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>One continuous conversation. Pin cards to keep them.</span>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'24px 32px' }}>
            <div style={{ maxWidth: 720, margin:'0 auto' }}>
              <UserMessage>Show me EURUSD on 4H with the last 3 NFP releases marked</UserMessage>
              <AiMessage time="3m ago">Here you go. I've marked the NFP prints and drawn the reaction candles.</AiMessage>
              <ChartCard pair="EUR/USD" timeframe="4H" seed={5} pinned
                annotations={[
                  { price: 1.08600, label: 'NFP May', color: 'var(--action)', idx: 20 },
                  { price: 1.08900, label: 'NFP Apr', color: 'var(--action)', idx: 45 },
                  { price: 1.08700, label: 'NFP Mar', color: 'var(--action)', idx: 68 },
                ]}
              />
              <UserMessage>What's the pattern?</UserMessage>
              <AiMessage time="2m ago" streaming>
                In all three cases EUR/USD dropped within the first 5 minutes (median -28 pips) and then recovered 70% of the drop within 4 hours. The pattern held whether the print beat or missed — it's a liquidity sweep, not a direction bet. If you trade it, the edge is in the reversal, not the initial move.
              </AiMessage>
            </div>
          </div>
          <Composer value="" onChange={()=>{}} onSend={()=>{}} suggestions={["Show next NFP date", "Build a backtest", "Alert me 10m before"]}/>
        </div>
        <RightRail positions={POSITIONS}/>
      </div>
      <StatusBar/>
    </div>
  );
}

Object.assign(window, { ActiveWorkspace, OrderTicketScreen, LivePositionScreen, NudgeScreen, StackedWorkspace });
