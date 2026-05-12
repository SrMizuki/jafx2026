/* Trader shared components: Icon, TopBar, Sidebar, StatusBar, Panel primitives */

const Icon = ({ name, size = 16, stroke = 1.5 }) => {
  const p = {
    search: 'M10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm4.5-1.5L20 20',
    bell: 'M6 16V10a6 6 0 0 1 12 0v6M4 16h16M10 20a2 2 0 0 0 4 0',
    deposit: 'M12 4v12M6 10l6 6 6-6M4 20h16',
    settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-1-3-2 0.5-1-1 0.5-2-3-1-1 2-1 0-1-2-3 1 0.5 2-1 1-2-0.5-1 3 2 1v1l-2 1 1 3 2-0.5 1 1-0.5 2 3 1 1-2 1 0 1 2 3-1-0.5-2 1-1 2 0.5 1-3-2-1v-1z',
    chart: 'M4 20V8M10 20V4M16 20v-6M22 20h-20',
    watchlist: 'M4 6h16M4 12h16M4 18h10',
    history: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
    portfolio: 'M12 2l10 5v10l-10 5-10-5V7z M12 2v20M2 7l10 5 10-5',
    wallet: 'M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14v2M17 13h.01',
    sparkles: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z M19 15l0.7 1.8L21.5 17.5l-1.8 0.7L19 20l-0.7-1.8L16.5 17.5l1.8-0.7z',
    send: 'M4 20l18-8L4 4v6l12 2-12 2v6z',
    chevron: 'M6 9l6 6 6-6',
    plus: 'M12 5v14M5 12h14',
    x: 'M6 6l12 12M6 18L18 6',
    dots: 'M6 12h.01M12 12h.01M18 12h.01',
    pin: 'M12 2l3 5 5 1-4 4 1 6-5-3-5 3 1-6-4-4 5-1z',
    check: 'M5 12l5 5L20 7',
    alert: 'M12 3l10 18H2L12 3zM12 10v4M12 18h.01',
    mic: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v4M8 22h8',
    news: 'M4 4h12v16H4z M18 8h2v12H6 M8 8h4v4H8z M8 14h4M8 17h4',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    play: 'M6 4l14 8-14 8V4z',
    drag: 'M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01',
    refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
    filter: 'M4 6h16l-6 8v6l-4-2v-4z',
    sun: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
    'chevron-right': 'M9 6l6 6-6 6',
    'chevron-left': 'M15 6l-6 6 6 6',
    shield: 'M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-0.5-8-3-8-8V7l8-4z',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    target: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
    book: 'M4 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4z M20 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8z',
  }[name] || '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={p}/>
    </svg>
  );
};

function TopBar({ current, setScreen, workspaces, activeWs, setActiveWs, onAsk }) {
  return (
    <div className="topbar">
      <a href="index.html" className="topbar-logo" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} title="Back to jafx.com">
        <div className="topbar-logo-mark">J</div>
        <div className="topbar-logo-text">JAFX <span className="dim">Terminal</span></div>
      </a>
      <div className="topbar-workspaces">
        {workspaces.map((w, i) => (
          <div key={w.sym} className={`ws-tab ${activeWs === i ? 'active' : ''}`} onClick={() => setActiveWs(i)}>
            <span className="sym">{w.sym}</span>
            <span className="num" style={{fontSize:11, color: w.chg>=0 ? 'var(--buy)' : 'var(--sell)'}}>{w.price}</span>
            <Icon name="x" size={11}/>
          </div>
        ))}
        <button className="sidebar-btn" style={{width:28, height:28}}><Icon name="plus" size={14}/></button>
      </div>
      <div className="topbar-search" onClick={onAsk}>
        <Icon name="sparkles" size={14} stroke={1.5}/>
        <span style={{ fontSize: 13 }}>Ask anything, trade anything…</span>
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" title="Notifications" style={{position:'relative'}}>
          <Icon name="bell" size={15}/>
          <span style={{position:'absolute', top:4, right:6, width:6, height:6, borderRadius:'50%', background:'var(--action)'}}/>
        </button>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-1)', padding:'0 10px', borderLeft:'1px solid var(--trader-line)', marginLeft:4, display:'flex', flexDirection:'column', gap:1, lineHeight:1.3 }}>
          <div style={{color:'var(--text-2)', fontSize:9, letterSpacing:'0.1em'}}>EQUITY</div>
          <div className="num" style={{color:'var(--text-0)', fontSize:12}}>$24,182.67</div>
        </div>
        <button className="topbar-btn primary">Deposit</button>
      </div>
    </div>
  );
}

function Sidebar({ active, onNav }) {
  const items = [
    { id: 'chat', icon: 'sparkles', label: 'Assistant' },
    { id: 'charts', icon: 'chart', label: 'Charts' },
    { id: 'watchlist', icon: 'watchlist', label: 'Watchlists' },
    { id: 'portfolio', icon: 'portfolio', label: 'Portfolio' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'news', icon: 'news', label: 'News & Calendar' },
  ];
  return (
    <div className="sidebar">
      {items.map(it => (
        <button key={it.id} className={`sidebar-btn ${active === it.id ? 'active' : ''}`} title={it.label} onClick={() => onNav && onNav(it.id)}>
          <Icon name={it.icon} size={17}/>
        </button>
      ))}
      <div className="sidebar-sep"/>
      <button className="sidebar-btn" title="Deposit"><Icon name="deposit" size={17}/></button>
      <button className="sidebar-btn" title="Settings"><Icon name="settings" size={17}/></button>
      <div className="sidebar-avatar">MR</div>
    </div>
  );
}

function StatusBar({ latency = 14, quotes = 'Tier-1' }) {
  return (
    <div className="statusbar">
      <span className="item ok"><span className="live-dot"/>&nbsp;CONNECTED</span>
      <span className="item">LATENCY <span style={{color:'var(--text-0)'}}>{latency}ms</span></span>
      <span className="item">QUOTES <span style={{color:'var(--text-0)'}}>{quotes}</span></span>
      <span className="item">SERVER <span style={{color:'var(--text-0)'}}>LON-03</span></span>
      <span className="item" style={{marginLeft:'auto'}}>AI <span style={{color:'var(--ai)'}}>GPT-5 (DEEP)</span></span>
      <span className="item">LAST SYNC <span style={{color:'var(--text-0)'}}>0.2s</span></span>
      <span className="item">v4.2.1</span>
    </div>
  );
}

/* Candlestick chart — svg-based, realistic */
function Candles({ width = 680, height = 360, seed = 1, pair = 'EUR/USD', timeframe = '1H', annotations = [], priceTrail = true, basePrice }) {
  // deterministic pseudo-random
  const rng = React.useMemo(() => {
    let s = seed * 12345;
    return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }, [seed]);

  // Infer scale from pair or explicit basePrice
  const inferred = basePrice ?? (
    /XAU|GOLD/i.test(pair) ? 2348 :
    /BTC/i.test(pair) ? 67800 :
    /JPY/i.test(pair) ? 198.4 :
    /DXY/i.test(pair) ? 104.2 :
    1.085
  );
  const scale = Math.max(0.001, Math.abs(inferred) * 0.0015);
  const decimals = inferred >= 1000 ? 2 : inferred >= 100 ? 3 : 4;

  const { candles, minP, maxP } = React.useMemo(() => {
    const n = 80;
    let p = inferred;
    const arr = [];
    for (let i = 0; i < n; i++) {
      const o = p;
      const drift = (Math.sin(i/7 + seed) + Math.sin(i/13 + seed*2)*0.5) * scale * 0.4;
      const vol = scale * 0.6 + rng() * scale * 1.4;
      const c = o + drift + (rng() - 0.5) * vol;
      const h = Math.max(o, c) + rng() * vol * 0.6;
      const l = Math.min(o, c) - rng() * vol * 0.6;
      arr.push({ o, h, l, c });
      p = c;
    }
    const allLows = arr.map(c=>c.l), allHighs = arr.map(c=>c.h);
    return { candles: arr, minP: Math.min(...allLows), maxP: Math.max(...allHighs) };
  }, [seed, inferred, scale]);

  const padL = 0, padR = 56, padT = 12, padB = 28;
  const cw = width - padL - padR;
  const ch = height - padT - padB;
  const cand = candles.length;
  const bw = cw / cand;
  const py = (p) => padT + (1 - (p - minP) / (maxP - minP)) * ch;

  const lastPrice = candles[candles.length - 1].c;
  const firstPrice = candles[0].o;
  const change = ((lastPrice - firstPrice) / firstPrice * 100);

  // price labels (5 rungs)
  const rungs = [];
  for (let i = 0; i <= 5; i++) {
    const p = minP + (maxP - minP) * (i / 5);
    rungs.push({ p, y: py(p) });
  }

  return (
    <div style={{ position: 'relative', width, height, background: 'var(--trader-panel)', fontFamily: 'var(--font-mono)' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        {/* grid */}
        {rungs.map((r, i) => (
          <line key={i} x1={0} y1={r.y} x2={width - padR} y2={r.y} stroke="var(--trader-line)" strokeWidth="1" strokeDasharray="2 4"/>
        ))}
        {/* candles */}
        {candles.map((k, i) => {
          const x = padL + i * bw + bw / 2;
          const up = k.c >= k.o;
          const color = up ? 'var(--buy)' : 'var(--sell)';
          const yH = py(k.h), yL = py(k.l);
          const yO = py(k.o), yC = py(k.c);
          const bt = Math.min(yO, yC), bb = Math.max(yO, yC);
          return (
            <g key={i}>
              <line x1={x} y1={yH} x2={x} y2={yL} stroke={color} strokeWidth="1"/>
              <rect x={x - bw*0.35} y={bt} width={bw*0.7} height={Math.max(1, bb - bt)} fill={color} opacity={up ? 1 : 0.9}/>
            </g>
          );
        })}
        {/* last price line */}
        <line x1={0} y1={py(lastPrice)} x2={width - padR} y2={py(lastPrice)} stroke={change >= 0 ? 'var(--buy)' : 'var(--sell)'} strokeWidth="1" strokeDasharray="2 3" opacity="0.6"/>
        {/* price labels */}
        {rungs.map((r, i) => (
          <text key={i} x={width - padR + 6} y={r.y + 3} fill="var(--text-2)" fontSize="10">{r.p.toFixed(decimals)}</text>
        ))}
        {/* last price pill */}
        <g transform={`translate(${width - padR}, ${py(lastPrice) - 9})`}>
          <rect x="0" y="0" width={padR - 2} height="18" rx="2" fill={change >= 0 ? 'var(--buy)' : 'var(--sell)'}/>
          <text x="4" y="13" fill="#000" fontSize="10" fontWeight="600">{lastPrice.toFixed(decimals)}</text>
        </g>
        {/* annotations */}
        {annotations.map((a, i) => {
          const x = padL + (a.idx ?? cand - 12) * bw + bw/2;
          const y = py(a.price);
          const color = a.color || 'var(--ai)';
          return (
            <g key={i}>
              <line x1={0} y1={y} x2={width - padR} y2={y} stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
              <circle cx={x} cy={y} r="4" fill={color} stroke="var(--trader-panel)" strokeWidth="2"/>
              <g transform={`translate(${x + 8}, ${y - 10})`}>
                <rect width={a.label.length * 6 + 14} height="18" rx="3" fill="var(--trader-panel-2)" stroke={color}/>
                <text x="7" y="12" fill={color} fontSize="10">{a.label}</text>
              </g>
            </g>
          );
        })}
      </svg>
      {/* axis time labels */}
      <div style={{ position:'absolute', left:0, right:padR, bottom:4, display:'flex', justifyContent:'space-between', padding:'0 4px', fontSize:10, color:'var(--text-2)' }}>
        <span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, TopBar, Sidebar, StatusBar, Candles });
