const { useState: useStateH, useEffect: useEffectH, useRef: useRefH, useMemo: useMemoH } = React;

/* ---------- HERO ---------- */
function Hero({ variant = 'neural', meshVariation = 'candles' }) {
  if (variant === 'terminal') return <HeroTerminal meshVariation={meshVariation} />;
  if (variant === 'split') return <HeroSplit meshVariation={meshVariation} />;
  return <HeroNeural meshVariation={meshVariation} />;
}

/* ---------- Three.js mesh canvas — forex-themed hero background ---------- */
function MeshCanvas({ variation = 'candles', style = {} }) {
  const ref = useRefH(null);
  useEffectH(() => {
    if (!ref.current || !window.JAFXMesh) return;
    const inst = window.JAFXMesh.mount(ref.current, {
      variation,
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00E599',
    });
    return () => inst?.destroy();
  }, []);
  useEffectH(() => { window.JAFXMesh?.setVariation?.(variation); }, [variation]);
  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', opacity: 0.85, ...style,
    }}/>
  );
}

function HeroNeural({ meshVariation = 'candles' }) {
  return (
    <section style={{ position: 'relative', padding: '72px 0 120px', overflow: 'hidden', minHeight: 'min(820px, 92vh)' }}>
      <MeshCanvas variation={meshVariation} />
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="mono" data-reveal style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 28 }}>
          <span className="live-dot"></span>&nbsp;&nbsp;LIVE · REGULATED BY FSCA · FSP 51243
        </div>
        <h1 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(44px, 8vw, 112px)', margin: 0, maxWidth: 1100 }}>
          The forex broker<br />
          where <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontWeight: 300 }}>AI</span> does<br />
          the thinking.
        </h1>
        <p data-reveal data-reveal-delay="0.25" style={{ color: 'var(--text-1)', fontSize: 19, lineHeight: 1.55, maxWidth: 580, marginTop: 36 }}>
          A co-pilot that reads the market, sizes your risk, and journals every trade. You pull the trigger. JAFX handles the rest.
        </p>
        <div className="cta-row" data-reveal data-reveal-delay="0.35" style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
          <LaunchTerminalCta>Launch terminal <span className="btn-arrow" aria-hidden="true">→</span></LaunchTerminalCta>
          <a href="ai.html" className="btn btn-ghost">Try the AI demo</a>
        </div>
        <div className="grid-4" data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 'clamp(48px, 8vw, 96px)', borderTop: '1px solid var(--line)', paddingTop: 32 }}>
          {[
            ['0.0', 'pip', 'Raw spreads from'],
            ['14', 'ms', 'Median execution'],
            ['1:500', '', 'Max leverage (pro)'],
            ['$0', '', 'Min. deposit'],
          ].map(([n, suf, l]) => (
            <div key={l} style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20, paddingTop: 12, paddingBottom: 12 }}>
              <div className="display" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--text-0)' }}>{n}<span style={{ fontSize: '0.5em', color: 'var(--text-2)', marginLeft: 4 }}>{suf}</span></div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* floating terminal card — desktop only */}
      <div className="hero-floater" style={{ position: 'absolute', right: '-60px', top: '80px', width: 420, transform: 'rotate(-2deg)', opacity: 0.96, zIndex: 1, pointerEvents: 'none' }}>
        <MiniTerminal />
      </div>
    </section>
  );
}

function HeroTerminal({ meshVariation = 'candles' }) {
  const [tilt, setTilt] = useStateH({ x: 0, y: 0 });
  const [cursor, setCursor] = useStateH({ x: 0, y: 0 }); // -1..1 viewport normalized
  useEffectH(() => {
    const max = 7;
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
    const handleMouseLeaveWindow = () => {
      setTilt({ x: 0, y: 0 });
      setCursor({ x: 0, y: 0 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeaveWindow);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeaveWindow);
    };
  }, []);

  return (
    <section style={{ padding: '48px 0 96px', position: 'relative', overflow: 'hidden' }}>
      <MeshCanvas variation={meshVariation} style={{ opacity: 0.7 }} />
      {/* subtle vignette so text stays readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, var(--bg-0) 0%, transparent 60%)', pointerEvents: 'none' }}/>
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="mono" data-reveal style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 28 }}>
              <span className="live-dot"></span>&nbsp;&nbsp;AI-NATIVE BROKERAGE · EST. 2026
            </div>
            <h1 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(40px, 6vw, 88px)', margin: 0 }}>
              Trade with an<br />edge you can<br />actually <span style={{ color: 'var(--accent)' }}>measure.</span>
            </h1>
            <p data-reveal data-reveal-delay="0.22" style={{ color: 'var(--text-1)', fontSize: 18, lineHeight: 1.55, maxWidth: 520, marginTop: 32 }}>
              Every tick analyzed. Every trade reviewed. Every risk calculated. The first forex broker built around intelligence, not volume.
            </p>
            <div className="cta-row" data-reveal data-reveal-delay="0.32" style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <LaunchTerminalCta>Launch terminal <span className="btn-arrow" aria-hidden="true">→</span></LaunchTerminalCta>
              <a href="ai.html" className="btn btn-ghost">Watch 90s demo</a>
            </div>
          </div>
          <div
            data-reveal
            data-reveal-delay="0.18"
            style={{
              position: 'relative',
              perspective: '1100px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              style={{
                transform: `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`,
                transformOrigin: 'center center',
                transition: 'transform .14s ease-out',
                willChange: 'transform',
                pointerEvents: 'auto',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -55,
                  width: '100%',
                  aspectRatio: '20 / 2',
                  borderRadius: '100%',
                  background: 'rgba(0, 230, 160, 0.34)',
                  filter: 'blur(30px)',
                  opacity: 0.72,
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
              <MiniTerminal big />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '-20% -45%',
                    background: 'linear-gradient(110deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0))',
                    transform: `translateX(${(-cursor.x * 30).toFixed(2)}%)`,
                    transition: 'transform .12s ease-out',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSplit({ meshVariation = 'mesh' }) {
  return (
    <section style={{ padding: '0', position: 'relative', borderBottom: '1px solid var(--line)' }}>
      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 620 }}>
        <div style={{ padding: 'clamp(48px, 8vw, 120px) clamp(24px, 5vw, 64px)', borderRight: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
          <MeshCanvas variation={meshVariation} style={{ opacity: 0.55 }} />
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative' }}>
            <div className="mono" data-reveal style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-2)', marginBottom: 28 }}>
              001 / JAFX &nbsp;—&nbsp; REGULATED BY FSCA
            </div>
            <h1 className="display" data-reveal data-reveal-delay="0.1" style={{ fontSize: 'clamp(40px, 6vw, 84px)', margin: 0 }}>
              Forex,<br />reimagined<br />with <span style={{ color: 'var(--accent)' }}>AI</span>.
            </h1>
            <p data-reveal data-reveal-delay="0.22" style={{ color: 'var(--text-1)', fontSize: 18, lineHeight: 1.5, maxWidth: 440, marginTop: 28 }}>
              Purpose-built for retail traders who want an institutional-grade edge. No noise. No gimmicks. Just a better trader, faster.
            </p>
            <div className="cta-row" data-reveal data-reveal-delay="0.32" style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <LaunchTerminalCta>Launch terminal <span className="btn-arrow" aria-hidden="true">→</span></LaunchTerminalCta>
              <a href="ai.html" className="btn btn-ghost">Demo <span className="btn-arrow" aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-1)', padding: 'clamp(32px, 5vw, 64px)', position: 'relative' }}>
          <MiniTerminal big />
        </div>
      </div>
    </section>
  );
}

/* ---------- Mini trading terminal visual — rich variant ---------- */
function MiniTerminal({ big = false }) {
  const [tick, setTick] = useStateH(0);
  useEffectH(() => { const id = setInterval(() => setTick(t => t+1), 1500); return () => clearInterval(id); }, []);
  const chatScenarios = useMemoH(() => ([
    {
      q: 'Where is my best long entry if momentum pulls back?',
      thinkingLine: 'Scanning pullback structure now',
      a: 'Best entry zone is 1.0838-1.0842 on a retest. Invalidation below 1.0829. If filled, target 1.0890 for ~2.3R.',
    },
    {
      q: 'Should I enter now or wait for confirmation?',
      thinkingLine: 'Weighing breakout versus fakeout',
      a: 'Wait for a 5m close above 1.0851 plus hold. If price rejects there, skip. Current edge is better on confirmation than immediate market entry.',
    },
    {
      q: 'How should I size this trade on a $5k account?',
      thinkingLine: 'Sizing risk and pip value',
      a: 'At 0.5% risk ($25) and a 16-pip stop, size is about 0.15 lots. Keep max portfolio USD exposure under your configured cap.',
    },
    {
      q: 'What is the key risk in the next hour?',
      thinkingLine: 'Cross-checking news and volatility',
      a: 'Main risk is event-driven spread expansion. If volatility spikes, widen stop only with smaller size; otherwise wait for post-news reclaim.',
    },
  ]), []);
  const AiOrbs = typeof window !== 'undefined' ? window.JafxAiOrbs : null;
  const [chatIdx, setChatIdx] = useStateH(0);
  const [phase, setPhase] = useStateH('typing'); // typing -> ready -> thinking -> answering
  const [inputText, setInputText] = useStateH('');
  const [submittedQuestion, setSubmittedQuestion] = useStateH('');
  const [streamedAnswer, setStreamedAnswer] = useStateH('');
  const candles = useMemoH(() => genCandles(56, 11), []);
  const price = 1.0847 + Math.sin(tick * 0.35) * 0.0014;
  const bid = price - 0.00004;
  const ask = price + 0.00004;
  const W = big ? 640 : 420;
  const H = big ? 240 : 180;

  // chart geometry
  const allLow = Math.min(...candles.map(c => c.l));
  const allHigh = Math.max(...candles.map(c => c.h));
  const range = allHigh - allLow;
  const pad = range * 0.08;
  const lo = allLow - pad, hi = allHigh + pad;
  const yScale = v => ((hi - v) / (hi - lo)) * H;
  const xScale = i => (i + 0.5) * (W / candles.length);

  // EMA(20) line
  const ema = useMemoH(() => {
    const k = 2 / (20 + 1);
    const arr = [];
    candles.forEach((c, i) => {
      arr.push(i === 0 ? c.c : c.c * k + arr[i-1] * (1 - k));
    });
    return arr;
  }, [candles]);
  const emaPath = ema.map((v, i) => `${i ? 'L' : 'M'}${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(' ');

  // entry / SL / TP from copilot
  const entry = 1.0836;
  const sl = 1.0812;
  const tp = 1.0892;

  // session high/low ribbon
  const sessHi = allHigh - range * 0.08;
  const sessLo = allLow + range * 0.10;
  const activeChat = chatScenarios[chatIdx];

  useEffectH(() => {
    setPhase('typing');
    setInputText('');
    setSubmittedQuestion('');
    setStreamedAnswer('');
    let qPos = 0;
    const typeQuestion = setInterval(() => {
      qPos += 1;
      setInputText(activeChat.q.slice(0, qPos));
      if (qPos >= activeChat.q.length) {
        clearInterval(typeQuestion);
        setPhase('ready');
      }
    }, 18);
    return () => clearInterval(typeQuestion);
  }, [chatIdx]);

  useEffectH(() => {
    if (phase !== 'ready') return;
    const submitDelay = setTimeout(() => {
      setSubmittedQuestion(activeChat.q);
      setInputText('');
      setPhase('thinking');
    }, 920);
    return () => clearTimeout(submitDelay);
  }, [phase, activeChat.q]);

  useEffectH(() => {
    if (phase !== 'thinking') return;
    const thinkDelay = setTimeout(() => setPhase('answering'), 2200);
    return () => clearTimeout(thinkDelay);
  }, [phase]);

  useEffectH(() => {
    if (phase !== 'answering') return;
    let aPos = 0;
    const typeAnswer = setInterval(() => {
      aPos += 2;
      setStreamedAnswer(activeChat.a.slice(0, aPos));
      if (aPos >= activeChat.a.length) clearInterval(typeAnswer);
    }, 14);
    return () => clearInterval(typeAnswer);
  }, [phase, activeChat.a]);

  useEffectH(() => {
    const rotate = setInterval(() => {
      setChatIdx(prev => (prev + 1) % chatScenarios.length);
    }, 11800);
    return () => clearInterval(rotate);
  }, [chatScenarios.length]);

  return (
    <div className="mini-term" style={{
      background: 'linear-gradient(180deg, var(--bg-1), var(--bg-0))',
      border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 60px 120px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,229,153,0.10), inset 0 1px 0 rgba(255,255,255,0.03)',
      width: '100%',
    }}>
      {/* chrome */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--line)', gap: 12, background: 'var(--bg-2)' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5E57','#FFB13B','#28C840'].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:'50%',background:c, opacity:0.55}}/>)}
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>JAFX TERMINAL</div>
        <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', padding: '2px 6px', border: '1px solid var(--line)', borderRadius: 3 }}>v4.2</span>
        <div style={{ flex: 1 }}></div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', display:'flex', alignItems:'center', gap:5 }}>
          <span className="live-dot" style={{ width:6, height:6 }}></span>LIVE
        </span>
      </div>

      {/* price + bid/ask */}
      <div style={{ padding: '14px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>EUR/USD · M15</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--accent)', padding: '1px 5px', background: 'rgba(0,229,153,0.10)', border: '1px solid rgba(0,229,153,0.25)', borderRadius: 3 }}>AI BIAS · LONG</span>
          </div>
          <div className="mono" style={{ fontSize: big ? 34 : 28, color: 'var(--text-0)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>
            {price.toFixed(5).slice(0,-1)}<span style={{ color: 'var(--accent)' }}>{price.toFixed(5).slice(-1)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
          <div style={{ background: 'rgba(255,90,108,0.08)', padding: '6px 10px', borderRadius: 4, border: '1px solid rgba(255,90,108,0.20)' }}>
            <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing:'0.1em' }}>BID</div>
            <div className="mono" style={{ color: 'var(--red)', fontSize: 12, fontWeight: 500 }}>{bid.toFixed(5)}</div>
          </div>
          <div style={{ background: 'rgba(0,229,153,0.08)', padding: '6px 10px', borderRadius: 4, border: '1px solid rgba(0,229,153,0.25)' }}>
            <div className="mono" style={{ fontSize: 8, color: 'var(--text-3)', letterSpacing:'0.1em' }}>ASK</div>
            <div className="mono" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 500 }}>{ask.toFixed(5)}</div>
          </div>
        </div>
      </div>

      {/* chart */}
      <div style={{ position: 'relative'}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="emaGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#00E599" stopOpacity="0"/>
              <stop offset="50%" stopColor="#00E599" stopOpacity="1"/>
              <stop offset="100%" stopColor="#00E599" stopOpacity="0.7"/>
            </linearGradient>
            <linearGradient id="tpFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00E599" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#00E599" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="slFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FF5A6C" stopOpacity="0"/>
              <stop offset="100%" stopColor="#FF5A6C" stopOpacity="0.18"/>
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[0.25, 0.5, 0.75].map(p => (
            <line key={p} x1="0" x2={W} y1={H*p} y2={H*p} stroke="var(--line)" strokeDasharray="2 4" opacity="0.4"/>
          ))}

          {/* TP zone above entry */}
          <rect x="0" y={yScale(tp)} width={W} height={yScale(entry)-yScale(tp)} fill="url(#tpFill)"/>
          {/* SL zone below entry */}
          <rect x="0" y={yScale(entry)} width={W} height={yScale(sl)-yScale(entry)} fill="url(#slFill)"/>

          {/* candles */}
          {candles.map((c, i) => {
            const up = c.c >= c.o;
            const x = xScale(i);
            const cw = Math.max(2, (W / candles.length) * 0.62);
            const color = up ? '#00E599' : '#FF5A6C';
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={yScale(c.h)} y2={yScale(c.l)} stroke={color} strokeWidth="1" opacity="0.7"/>
                <rect x={x - cw/2} y={yScale(Math.max(c.o, c.c))} width={cw} height={Math.max(1, Math.abs(yScale(c.o) - yScale(c.c)))} fill={color} opacity={up ? 0.95 : 0.85}/>
              </g>
            );
          })}

          {/* EMA line */}
          <path d={emaPath} fill="none" stroke="url(#emaGrad)" strokeWidth="1.5"/>

          {/* level lines */}
          {[
            ['TP', tp, '#00E599'],
            ['ENTRY', entry, '#9AA3AD'],
            ['SL', sl, '#FF5A6C'],
          ].map(([label, v, col]) => (
            <g key={label}>
              <line x1="0" x2={W-46} y1={yScale(v)} y2={yScale(v)} stroke={col} strokeDasharray="3 3" strokeWidth="1" opacity="0.7"/>
              <rect x={W-44} y={yScale(v)-8} width="44" height="16" fill={col} opacity="0.92" rx="2"/>
              <text x={W-22} y={yScale(v)+3.5} fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#000" textAnchor="middle" fontWeight="600">{label}</text>
            </g>
          ))}

          {/* current price marker */}
          <line x1="0" x2={W} y1={yScale(price)} y2={yScale(price)} stroke="var(--accent)" strokeWidth="0.8" opacity="0.8"/>
          <circle cx={xScale(candles.length-1)} cy={yScale(price)} r="3" fill="var(--accent)">
            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>

        {/* AI annotation overlay */}
        <div style={{ position: 'absolute', top: 12, left: 18, background: 'rgba(11,13,18,0.92)', border: '1px solid rgba(0,229,153,0.25)', borderRadius: 6, padding: '6px 10px', backdropFilter: 'blur(4px)', maxWidth: '50%' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.12em', display:'flex', alignItems:'center', gap:5 }}>
            <span className="live-dot" style={{ width:5, height:5 }}></span>AI · LIVE READ
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-0)', marginTop: 4, lineHeight: 1.35 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>71% confidence</span> · breakout setup forming above 1.0836
          </div>
        </div>
      </div>

      {/* AI agent chat strip */}
      <div style={{ borderTop: '1px solid var(--line)' }}>
        <div style={{background: 'linear-gradient(to right, rgba(0, 230, 160, 0.09), transparent 75%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'flex-start' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', margin: 12, background: 'var(--action)', color: '#000', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>AI</div>
            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
              <div style={{ borderRadius: '0 0 8px 8px', background: 'linear-gradient(to top, rgba(5, 8, 10, 0.66), rgba(5, 8, 10, 0))', minHeight: 180, height: 180, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, minHeight: 0, padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6, overflow: 'hidden' }}>
                  {(phase === 'thinking' || phase === 'answering') && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: 1, transform: 'translateY(0)', transition: 'opacity .52s ease, transform .52s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                      <div className="mono mini-term-ai-question">
                        {submittedQuestion}
                      </div>
                    </div>
                  )}
                  {(phase === 'thinking' || phase === 'answering') && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', opacity: 1, transform: 'translateY(0)', transition: 'opacity .52s ease, transform .52s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                      <div
                        className={'mono mini-term-ai-bubble' + (phase === 'thinking' ? ' mini-term-ai-bubble--thinking' : '')}
                      >
                        {phase === 'thinking' ? (
                          <span className="mini-term-ai-thinking-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            {AiOrbs ? <AiOrbs className="mini-term-ai-orbs" /> : <span className="live-dot" style={{ width: 5, height: 5 }} />}
                            <span className="mini-term-ai-thinking-line">{activeChat.thinkingLine}</span>
                          </span>
                        ) : (
                          <span style={{ transition: 'opacity .4s ease' }}>
                            {streamedAnswer}
                            <span style={{ color: 'var(--action)', opacity: 0.85 }}>|</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px solid var(--line)', padding: '8px 10px', background: 'rgba(10, 12, 14, 0.85)' }}>
                  <div style={{ border: '1px solid var(--line-strong)', borderRadius: 8, background: 'rgba(255,255,255,0.03)', padding: '7px 8px', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--text-0)', flex: 1, minHeight: 14 }}>
                      {inputText}
                      {(phase === 'typing' || phase === 'ready') && <span style={{ color: 'var(--action)' }}>|</span>}
                    </div>
                    <button
                      style={{ width: 22, height: 22, borderRadius: 6, border: 'none', background: 'var(--action)', color: '#000', fontWeight: 700, cursor: 'default', fontSize: 11, transform: phase === 'ready' ? 'translateY(-1px)' : 'none', transition: 'transform .2s ease, opacity .2s ease', opacity: phase === 'typing' ? 0.75 : 1 }}
                    >↑</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Decorative neural background ---------- */
function NeuralBg() {
  const nodes = useMemoH(() => {
    const s = [];
    let seed = 17;
    const rnd = () => { seed = (seed*9301+49297)%233280; return seed/233280; };
    for (let i = 0; i < 48; i++) s.push({ x: rnd()*100, y: rnd()*100, r: 1 + rnd()*2 });
    return s;
  }, []);
  return (
    <>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)' }}></div>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35, pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00E599" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#00E599" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="85%" cy="40%" r="300" fill="url(#glow)"/>
        {nodes.map((n,i)=>(
          <circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r={n.r} fill="var(--accent)" opacity={0.4 + (i%3)*0.2}/>
        ))}
        {nodes.slice(0, 20).map((n,i)=>{
          const t = nodes[(i*3+7) % nodes.length];
          return <line key={'l'+i} x1={`${n.x}%`} y1={`${n.y}%`} x2={`${t.x}%`} y2={`${t.y}%`} stroke="var(--accent)" strokeWidth="0.5" opacity="0.1"/>;
        })}
      </svg>
    </>
  );
}

Object.assign(window, { Hero, MiniTerminal, NeuralBg });
