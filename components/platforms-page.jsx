/* global React, Nav, Footer, CtaBand, LiveTicker, TerminalUI, BrowserFrame, PhoneFrame, JafxMobileScreen, MT5Desktop, MT5MobileScreen, NeuralBg, DeviceShowcaseEffects, JafxAiOrbs */

/* ============================================================
   PLATFORMS PAGE — JAFX Web Trader + MT5 (Win/Mac/iOS/Android)
   ============================================================ */

const PLATFORMS = [
  { id: 'web',     name: 'JAFX Web Trader', iconSrc: 'assets/i-webtrader.svg' },
  { id: 'mt5-win', name: 'MT5 for Windows', iconSrc: 'assets/i-windows.svg' },
  { id: 'mt5-mac', name: 'MT5 for macOS',   iconSrc: 'assets/i-apple.svg' },
  { id: 'mt5-ios', name: 'MT5 for iOS',     iconSrc: 'assets/i-appstore.svg' },
  { id: 'mt5-and', name: 'MT5 for Android', iconSrc: 'assets/i-playstore.svg' },
];

function PlatformsHero() {
  return (
    <section className="zone zone-execution" style={{ padding: 'clamp(80px, 12vw, 140px) 0 clamp(60px, 8vw, 100px)', position: 'relative', overflow: 'visible' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <NeuralBg/>
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="mono" data-reveal style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 24, textAlign: 'center' }}>
          <span className="live-dot"/>&nbsp;&nbsp;TRADING PLATFORMS
        </div>
        <h1 className="display" data-reveal style={{ fontSize: 'clamp(56px, 9vw, 128px)', margin: 0, textAlign: 'center', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
          One account.<br/>
          <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>Five platforms.</span>
        </h1>
        <p data-reveal style={{ color: 'var(--text-1)', fontSize: 'clamp(16px, 1.4vw, 20px)', lineHeight: 1.55, maxWidth: 720, margin: '32px auto 0', textAlign: 'center' }}>
          Trade JAFX from anywhere. The AI-native web terminal in your browser, MT5 on every desktop and mobile OS — all wired into the same execution engine, the same liquidity, the same balance.
        </p>
        <div data-reveal-stagger className="platform-hero-pills-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 48, marginInline: 'auto' }}>
          {PLATFORMS.map(p => (
            <span key={p.id} className="platform-hero-pill-stagger">
              <a href={`#${p.id}`} className="mono platform-hero-pill">
                <span className="platform-hero-pill__inner">
                  <span className="platform-hero-pill-icon" aria-hidden="true">
                    <img src={p.iconSrc} alt="" width="22" height="22" loading="lazy" decoding="async" />
                  </span>
                  <span>{p.name}</span>
                </span>
              </a>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   01 · JAFX WEB TRADER (the hero feature)
   ============================================================ */
function WebTraderSection() {
  const AiOrbs = typeof window !== 'undefined' ? window.JafxAiOrbs : null;
  return (
    <section id="web" style={{ padding: 'clamp(80px, 10vw, 140px) 0', borderTop: '1px solid var(--line)', position: 'relative' }}>
      <div className="wrap">
        <div className="platform-section-split platform-section-split--web">
          <div data-reveal>
            <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 9, opacity: 0.6 }}>01 · FLAGSHIP</span>
              <span style={{ width: 24, height: 1, background: 'var(--accent)' }}/>
              <span>JAFX WEB TRADER</span>
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', margin: 0, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              The terminal we<br/>
              <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>built ourselves.</em>
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 18, lineHeight: 1.55, marginTop: 24, maxWidth: 540 }}>
              An AI-native web terminal designed for how traders actually think. TradingView-class charts, the Copilot in the sidebar, a live position coach narrating every open trade — all in your browser. No download, no install.
            </p>
          </div>
          <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <LaunchTerminalCta>Launch terminal <span className="btn-arrow" aria-hidden="true">→</span></LaunchTerminalCta>
            <a href="ai.html" className="btn btn-ghost web-trader-hero-btn web-trader-hero-btn--copilot">
              <span className="web-trader-hero-btn__label">Meet the Copilot</span>
              {AiOrbs ? (
                <span className="web-trader-hero-btn__orbs" aria-hidden="true">
                  <AiOrbs />
                </span>
              ) : null}
            </a>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginTop: 12 }}>● NO INSTALL · WORKS IN ANY BROWSER · MOBILE OPTIMIZED</div>
          </div>
        </div>

        {/* Browser preview — capped width so the terminal mock doesn’t span the full wrap on large screens */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 980, marginInline: 'auto' }} data-reveal>
          <DeviceShowcaseEffects borderRadius={14} maxTilt={5} glowBottom={-48}>
            <BrowserFrame url="app.jafx.com/trader" height="auto">
              <div className="terminal-preview-shell">
                <div className="terminal-preview-inner">
                  <TerminalUI/>
                </div>
              </div>
            </BrowserFrame>
          </DeviceShowcaseEffects>

          <div className="web-trader-phone" style={{
            position: 'absolute',
            right: -20,
            bottom: -60,
            zIndex: 5,
          }}>
            <DeviceShowcaseEffects
              borderRadius={28}
              baseTransform="rotate(2deg)"
              maxTilt={5}
              glowBottom={-36}
              glowBlur={24}
            >
              <PhoneFrame width={240} height={500} os="ios">
                <JafxMobileScreen/>
              </PhoneFrame>
            </DeviceShowcaseEffects>
          </div>
        </div>

        {/* feature row */}
        <div className="platform-web-features">
          {[
            ['Browser-native', 'No install. Sub-second cold start. Auto-syncs across devices.'],
            ['AI in the sidebar', 'Copilot reads your screen, drafts orders, narrates positions.'],
            ['TV-class charts', 'Multi-chart, 38 timeframes, 100+ indicators, drawing toolkit.'],
            ['Mobile-tuned', 'Same engine. Touch-first layout for phones and tablets.'],
          ].map(([t, d], i) => (
            <div key={t} className="platform-web-features__cell" style={{ padding: 28, background: 'var(--bg-1)' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>● {String(i + 1).padStart(2, '0')}</div>
              <div className="display" style={{ fontSize: 22, marginTop: 12 }}>{t}</div>
              <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Generic MT5 platform section
   ============================================================ */
function MT5Section({ id, idx, name, eyebrow, headline, accent, copy, requirements, ctaPrimary, ctaSecondary, mock, align = 'left', bg }) {
  return (
    <section id={id} style={{ padding: 'clamp(80px, 10vw, 130px) 0', borderTop: '1px solid var(--line)', background: bg, position: 'relative' }}>
      <div className="wrap">
        <div className={'platform-section-split platform-section-split--mt5 platform-section-split--mt5-' + (align === 'right' ? 'right' : 'left')}>
          <div className="platform-mt5-copy" style={{ order: align === 'right' ? 2 : 0 }} data-reveal>
            <div className="mono" style={{ fontSize: 10, color: accent, letterSpacing: '0.18em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 9, opacity: 0.6 }}>{idx}</span>
              <span style={{ width: 24, height: 1, background: accent }}/>
              <span>{eyebrow}</span>
            </div>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 4.8vw, 64px)', margin: 0, lineHeight: 0.98, letterSpacing: '-0.01em' }}>
              {headline}
            </h2>
            <p style={{ color: 'var(--text-1)', fontSize: 16, lineHeight: 1.6, marginTop: 22, maxWidth: 480 }}>
              {copy}
            </p>
            {/* requirements */}
            <div className="platform-mt5-specs">
              {requirements.map(([k, v], i) => (
                <div key={k} className="platform-mt5-specs__cell">
                  <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>{k.toUpperCase()}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--text-0)', marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <a href="#" className="btn btn-primary">{ctaPrimary} ↓</a>
              <a href="#" className="btn btn-ghost">{ctaSecondary}</a>
            </div>
          </div>
          <div className="platform-mt5-mock" style={{ order: align === 'right' ? 1 : 2, display: 'flex', justifyContent: 'center' }} data-reveal>
            {mock}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Comparison matrix
   ============================================================ */
function PlatformCompare() {
  const platforms = ['Web Trader', 'MT5 Win', 'MT5 Mac', 'MT5 iOS', 'MT5 Android'];
  const rows = [
    ['One-click execution',         [true, true, true, true, true]],
    ['Full charting (100+ indi.)',  [true, true, true, true, true]],
    ['JAFX Copilot AI',             [true, false, false, false, false]],
    ['AI Order Ticket',             [true, false, false, false, false]],
    ['Live position narration',     [true, false, false, false, false]],
    ['Expert Advisors (EAs)',       [false, true, true, false, false]],
    ['Strategy Tester',             [false, true, true, false, false]],
    ['Push notifications',          [true, true, true, true, true]],
    ['No install',                  [true, false, false, false, false]],
    ['Touch-first UI',              [true, false, false, true, true]],
  ];

  return (
    <section style={{ padding: 'clamp(80px, 10vw, 130px) 0', borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: 56 }} data-reveal>
          <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em' }}>● COMPARE</div>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', margin: '20px auto 0', maxWidth: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Which one is for <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>you</em>?
          </h2>
        </div>
        <div className="platform-compare-scroll" data-reveal>
          <div className="platform-compare-matrix" style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)' }}>
          <div className="platform-compare-matrix__row platform-compare-matrix__row--head">
            <div className="mono platform-compare-matrix__corner" style={{ padding: '18px 20px' }} />
            {platforms.map((p, i) => (
              <div key={p} className="platform-compare-matrix__cell platform-compare-matrix__cell--head" style={{ padding: '18px 12px', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 10, color: i === 0 ? 'var(--accent)' : 'var(--text-1)', letterSpacing: '0.1em', lineHeight: 1.3 }}>{p.toUpperCase()}</div>
                {i === 0 && <div className="mono" style={{ fontSize: 8, color: 'var(--accent)', marginTop: 4 }}>● FLAGSHIP</div>}
              </div>
            ))}
          </div>
          {rows.map(([label, vals], rowIdx) => (
            <div key={label} className="platform-compare-matrix__row" data-row-border={rowIdx > 0 ? '1' : undefined}>
              <div className="platform-compare-matrix__label" style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-0)' }}>{label}</div>
              {vals.map((v, i) => (
                <div key={i} className="platform-compare-matrix__cell" style={{ padding: '14px 12px', textAlign: 'center' }}>
                  {v ? (
                    <span className="mono" style={{ fontSize: 14, color: i === 0 && label.includes('AI') ? 'var(--accent)' : i === 0 ? 'var(--accent)' : 'var(--text-1)' }}>●</span>
                  ) : (
                    <span className="mono" style={{ fontSize: 14, color: 'var(--text-3)', opacity: 0.4 }}>—</span>
                  )}
                </div>
              ))}
            </div>
          ))}
          </div>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 13, marginTop: 24 }} className="mono">
          ALL PLATFORMS · SAME ACCOUNT · SAME BALANCE · SAME LIQUIDITY POOL
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
function PlatformsPage() {
  return (
    <>
      <Nav current="platform"/>
      <LiveTicker/>
      <PlatformsHero/>
      <WebTraderSection/>

      <MT5Section
        id="mt5-win"
        idx="02"
        eyebrow="MT5 FOR WINDOWS"
        accent="var(--accent)"
        headline={<>The full MT5 suite.<br/><em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>For your Windows rig.</em></>}
        copy="Everything traders expect from MetaTrader 5 — Expert Advisors, Strategy Tester, custom indicators, MQL5 — wired straight into JAFX liquidity. The choice for algo traders and EA users."
        requirements={[
          ['Compatible', 'Windows 10 / 11'],
          ['Size', '~7 MB · MSI installer'],
          ['Requires', '512 MB RAM, 2 GHz'],
          ['Updated', 'Build 4520 · 2 days ago'],
        ]}
        ctaPrimary="Download for Windows"
        ctaSecondary="Setup guide"
        mock={<MT5Desktop/>}
        align="left"
      />

      <MT5Section
        id="mt5-mac"
        idx="03"
        eyebrow="MT5 FOR MACOS"
        accent="#c9c9d1"
        headline={<>Native on Apple<br/><em style={{ color: '#c9c9d1', fontStyle: 'italic', fontWeight: 300 }}>Silicon.</em></>}
        copy="A universal binary built for M1, M2, and M3. No Wine, no virtualization, no rosetta. Full MT5 feature parity with the Windows build, native menus, native shortcuts."
        requirements={[
          ['Compatible', 'macOS 12 Monterey+'],
          ['Size', '~84 MB · DMG'],
          ['Architecture', 'Universal · ARM64+x86'],
          ['Updated', 'Build 4520 · 2 days ago'],
        ]}
        ctaPrimary="Download for Mac"
        ctaSecondary="Setup guide"
        mock={<MT5Desktop/>}
        align="right"
        bg="var(--bg-1)"
      />

      <MT5Section
        id="mt5-ios"
        idx="04"
        eyebrow="MT5 FOR IOS"
        accent="var(--accent)"
        headline={<>Trade from your<br/><em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>pocket.</em></>}
        copy="Native iPhone and iPad app from MetaQuotes. Real-time quotes, full charting, one-tap orders, push alerts for margin, fills, and price levels. Face ID for execution."
        requirements={[
          ['Compatible', 'iOS 14.0+'],
          ['Size', '~92 MB'],
          ['Devices', 'iPhone, iPad'],
          ['Rating', '4.6 · App Store'],
        ]}
        ctaPrimary="Get on App Store"
        ctaSecondary="Pairing guide"
        mock={
          <PhoneFrame width={300} height={620} os="ios">
            <MT5MobileScreen os="ios"/>
          </PhoneFrame>
        }
        align="left"
      />

      <MT5Section
        id="mt5-and"
        idx="05"
        eyebrow="MT5 FOR ANDROID"
        accent="#7fd97a"
        headline={<>Fast on every<br/><em style={{ color: '#7fd97a', fontStyle: 'italic', fontWeight: 300 }}>Android.</em></>}
        copy="The MetaQuotes Android build — 30+ indicators, 24 analytical objects, 9 timeframes. Available on Google Play and as a sideload APK. Full feature parity with iOS."
        requirements={[
          ['Compatible', 'Android 7.0+'],
          ['Size', '~38 MB'],
          ['Form factors', 'Phone & tablet'],
          ['Rating', '4.4 · Google Play'],
        ]}
        ctaPrimary="Get on Google Play"
        ctaSecondary="Direct APK"
        mock={
          <PhoneFrame width={300} height={620} os="android">
            <MT5MobileScreen os="android"/>
          </PhoneFrame>
        }
        align="right"
        bg="var(--bg-1)"
      />

      <PlatformCompare/>
      <CtaBand zone="execution"/>
      <Footer/>
    </>
  );
}

window.PlatformsPage = PlatformsPage;
