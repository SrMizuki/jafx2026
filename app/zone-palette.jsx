/* Zone palette — explores a 5-zone color system to move JAFX past dual-color */

const ZONES = [
  {
    id: 'execution',
    name: 'Execution',
    purpose: 'Trade · Order · Live data',
    where: 'Web Trader · AI Trader (V2) · positions · execution buttons',
    accent: '#00E599',
    accentDim: '#00B37A',
    glow: 'rgba(0,229,153,0.22)',
    wash1: 'rgba(0,229,153,0.18)',
    wash2: 'rgba(0,229,153,0.04)',
    eyebrow: '01 · LIVE',
    headline: 'Trades placed in the moment.',
    sub: 'Sub-15ms execution, AI-aware order tickets, signal in green.',
    cta: 'Open the trader',
  },
  {
    id: 'intel',
    name: 'Intel',
    purpose: 'AI · Analysis · Copilot',
    where: 'AI Copilot · live reads · market analysis · proactive nudges',
    accent: '#5B8CFF',
    accentDim: '#3B6FE0',
    glow: 'rgba(91,140,255,0.22)',
    wash1: 'rgba(91,140,255,0.20)',
    wash2: 'rgba(127,90,240,0.06)',
    eyebrow: '02 · COPILOT',
    headline: 'Markets, read aloud.',
    sub: 'Continuous AI commentary on every chart you open. Ask anything.',
    cta: 'Meet Copilot',
  },
  {
    id: 'funding',
    name: 'Funding',
    purpose: 'Pricing · Accounts · Deposits',
    where: 'Pricing · scaling plan · deposits · referrals',
    accent: '#FFB547',
    accentDim: '#E08D1E',
    glow: 'rgba(255,181,71,0.24)',
    wash1: 'rgba(255,181,71,0.18)',
    wash2: 'rgba(255,122,107,0.06)',
    eyebrow: '03 · ACCOUNTS',
    headline: 'Capital that scales with you.',
    sub: 'Up to 1:500 leverage. Funded scaling tiers. Same-day rewards.',
    cta: 'See pricing',
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    purpose: 'Education · Academy · Docs',
    where: 'Academy · psychology course · blog · trading objectives',
    accent: '#B794F6',
    accentDim: '#8B5CF6',
    glow: 'rgba(183,148,246,0.22)',
    wash1: 'rgba(183,148,246,0.18)',
    wash2: 'rgba(91,140,255,0.06)',
    eyebrow: '04 · ACADEMY',
    headline: 'Learn the craft, not just the click.',
    sub: 'Technical, fundamental and psychology — guided lessons end to end.',
    cta: 'Start a lesson',
  },
  {
    id: 'momentum',
    name: 'Momentum',
    purpose: 'Premium · Community · Brand',
    where: 'Premium tier · community · awards · brand-emotional moments',
    accent: '#FF7A6B',
    accentDim: '#E05545',
    glow: 'rgba(255,122,107,0.24)',
    wash1: 'rgba(255,122,107,0.20)',
    wash2: 'rgba(255,181,71,0.06)',
    eyebrow: '05 · PREMIUM',
    headline: 'Top traders, separately rewarded.',
    sub: 'Tighter spreads, dedicated coaches, invite-only community.',
    cta: 'See Premium',
  },
];

/* ===== shared chrome inside artboards ===== */

function PageChrome({ children }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#050607', color: '#E8ECEF', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', gap:18 }}>
        <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, fontSize:15, letterSpacing:'-0.01em' }}>JAFX</span>
        <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>Home</span>
        <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>AI Copilot</span>
        <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>Platforms</span>
        <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>Markets</span>
        <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>Pricing</span>
        <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>About</span>
        <span style={{ marginLeft:'auto', fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'rgba(255,255,255,0.45)', letterSpacing:'0.1em' }}>LOG IN</span>
        <span style={{ padding:'7px 14px', background:'#00E599', color:'#000', borderRadius:5, fontSize:12, fontWeight:500 }}>Get started</span>
      </div>
      {children}
    </div>
  );
}

/* ===== ZONE BAND ARTBOARD =====
   A 1280×720 hero band painted in a single zone, demonstrating:
   - the gradient atmosphere
   - eyebrow / headline / subhead / sample CTA
   - the constant green CTA living happily inside any zone
*/
function ZoneBand({ zone }) {
  return (
    <PageChrome>
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        // Layered radial gradients = FTMO-style atmosphere, CSS-only
        background: `
          radial-gradient(900px 480px at 78% 18%, ${zone.wash1}, transparent 65%),
          radial-gradient(700px 380px at 12% 82%, ${zone.wash2}, transparent 60%),
          linear-gradient(180deg, #050607 0%, #050607 100%)
        `,
      }}>
        {/* faint grid for depth */}
        <div style={{
          position:'absolute', inset:0, opacity:0.18,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize:'48px 48px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 70%)',
        }}/>

        {/* off-canvas glow source */}
        <div style={{
          position:'absolute', right:-220, top:-160, width:520, height:520, borderRadius:'50%',
          background: `radial-gradient(closest-side, ${zone.glow}, transparent 70%)`,
          filter:'blur(20px)',
        }}/>

        <div style={{ position:'relative', maxWidth:980, padding:'80px 64px 64px', display:'flex', flexDirection:'column', gap:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ width:28, height:1, background: zone.accent }}/>
            <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:'0.18em', color: zone.accent }}>{zone.eyebrow}</span>
          </div>

          <h1 style={{
            fontFamily:'Space Grotesk, sans-serif',
            fontSize:64, lineHeight:1.02, letterSpacing:'-0.025em',
            margin:0, fontWeight:500, maxWidth: 720,
          }}>
            {zone.headline}
          </h1>

          <p style={{ fontSize:18, lineHeight:1.5, color:'rgba(255,255,255,0.7)', maxWidth: 540, margin: 0 }}>
            {zone.sub}
          </p>

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            {/* Constant green CTA — the thread that ties every zone together */}
            <button style={{
              padding:'12px 22px', borderRadius:6, border:'none',
              background:'#00E599', color:'#000',
              fontWeight:500, fontSize:14, cursor:'pointer',
              fontFamily:'inherit',
            }}>{zone.cta}</button>
            {/* Zone-tinted ghost — only used when secondary action is needed */}
            <button style={{
              padding:'12px 22px', borderRadius:6,
              background:'transparent', color: zone.accent,
              border: `1px solid ${zone.accent}`,
              fontWeight:500, fontSize:14, cursor:'pointer',
              fontFamily:'inherit',
            }}>Learn more</button>
          </div>

          {/* zone meta strip */}
          <div style={{ display:'flex', gap:20, marginTop:36, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <ZoneMeta label="ZONE"   value={zone.name}/>
            <ZoneMeta label="THEME"  value={zone.purpose}/>
            <ZoneMeta label="USED FOR" value={zone.where}/>
          </div>
        </div>

        {/* Floating swatch chip in corner */}
        <div style={{
          position:'absolute', right:32, bottom:32,
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 14px', borderRadius:8,
          background:'rgba(10,12,14,0.7)',
          backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ width:24, height:24, borderRadius:5, background: zone.accent }}/>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10.5 }}>
            <div style={{ color: zone.accent, fontWeight:600 }}>{zone.accent}</div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:9 }}>--zone-{zone.id}</div>
          </div>
        </div>
      </div>
    </PageChrome>
  );
}

function ZoneMeta({ label, value }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth: 0 }}>
      <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, letterSpacing:'0.16em', color:'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ fontSize:12, color:'rgba(255,255,255,0.85)' }}>{value}</span>
    </div>
  );
}

/* ===== TOKEN SHEET ARTBOARD =====
   Full design-system reference: shows all 5 zones at once with their swatches,
   tokens, and a sample dot/badge/bar so user can see the relative tonal weight.
*/
function TokenSheet() {
  return (
    <div style={{ height:'100%', background:'#050607', color:'#E8ECEF', fontFamily:'Inter, sans-serif', padding:'40px 48px', display:'flex', flexDirection:'column', gap:24, overflow:'hidden' }}>
      <div>
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10.5, color:'rgba(255,255,255,0.45)', letterSpacing:'0.18em', marginBottom:8 }}>DESIGN SYSTEM · ZONE TOKENS</div>
        <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:34, fontWeight:500, margin:0, letterSpacing:'-0.02em' }}>
          Five zones, one chrome.
        </h2>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', maxWidth:680, marginTop:8, lineHeight:1.55 }}>
          Each zone is a meaning, not a page. Buttons stay green everywhere — the atmosphere around them changes by section. Background washes are layered radial gradients with these accent colours at 18–22% opacity.
        </p>
      </div>

      <table style={{ borderCollapse:'collapse', width:'100%', fontSize:12.5, tableLayout:'fixed' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.12)' }}>
            <th style={th}>Zone</th>
            <th style={th}>Token</th>
            <th style={th}>Hex</th>
            <th style={th}>Theme</th>
            <th style={th}>Used for</th>
            <th style={{ ...th, textAlign:'right' }}>Sample</th>
          </tr>
        </thead>
        <tbody>
          {ZONES.map(z => (
            <tr key={z.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <td style={td}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:18, height:18, borderRadius:4, background: z.accent }}/>
                  <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:500 }}>{z.name}</span>
                </div>
              </td>
              <td style={{ ...td, fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'rgba(255,255,255,0.7)' }}>--zone-{z.id}</td>
              <td style={{ ...td, fontFamily:'JetBrains Mono, monospace', fontSize:11, color: z.accent }}>{z.accent}</td>
              <td style={{ ...td, color:'rgba(255,255,255,0.7)' }}>{z.purpose}</td>
              <td style={{ ...td, color:'rgba(255,255,255,0.55)', fontSize:11.5 }}>{z.where}</td>
              <td style={{ ...td, textAlign:'right' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:999, background:`${z.accent}22`, color: z.accent, fontSize:11, fontFamily:'JetBrains Mono, monospace' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background: z.accent }}/> sample
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop:'auto', display:'flex', gap:24, padding:'16px 0 0', borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>
        <RuleNote n="01" text="Green CTA is the constant. Never tinted to match the zone."/>
        <RuleNote n="02" text="One zone per section. Sections never compete for attention."/>
        <RuleNote n="03" text="Body text + chrome stay neutral so the zone wash can speak."/>
      </div>
    </div>
  );
}
const th = { textAlign:'left', padding:'14px 12px', fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.14em', color:'rgba(255,255,255,0.45)', fontWeight:500 };
const td = { padding:'14px 12px', verticalAlign:'middle' };

function RuleNote({ n, text }) {
  return (
    <div style={{ flex:1, display:'flex', gap:10 }}>
      <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'rgba(255,255,255,0.4)' }}>{n}</span>
      <span style={{ lineHeight:1.5 }}>{text}</span>
    </div>
  );
}

/* ===== STACKED PAGE ARTBOARD =====
   Imagines a single landing page that traverses 3 zones top-to-bottom.
   This is the "moment of truth" — proves the system holds when zones meet.
*/
function StackedPage() {
  const stack = [ZONES[1], ZONES[2], ZONES[3]]; // Intel → Funding → Knowledge
  return (
    <PageChrome>
      <div style={{ flex:1, overflow:'auto' }}>
        {stack.map((z, i) => (
          <div key={z.id} style={{
            position:'relative',
            padding:'56px 64px 64px',
            background: `
              radial-gradient(700px 380px at ${i % 2 === 0 ? '85%' : '15%'} 20%, ${z.wash1}, transparent 65%),
              radial-gradient(500px 280px at ${i % 2 === 0 ? '10%' : '90%'} 90%, ${z.wash2}, transparent 60%),
              #050607
            `,
            borderBottom:'1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <span style={{ width:24, height:1, background: z.accent }}/>
              <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10.5, letterSpacing:'0.18em', color: z.accent }}>{z.eyebrow}</span>
            </div>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:42, lineHeight:1.04, letterSpacing:'-0.02em', margin:0, fontWeight:500, maxWidth: 620 }}>
              {z.headline}
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', maxWidth: 480, marginTop:14, lineHeight:1.55 }}>
              {z.sub}
            </p>
            <div style={{ marginTop:22, display:'flex', gap:10 }}>
              <button style={{ padding:'10px 18px', borderRadius:5, border:'none', background:'#00E599', color:'#000', fontWeight:500, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                {z.cta}
              </button>
              <button style={{ padding:'10px 18px', borderRadius:5, background:'transparent', color: z.accent, border:`1px solid ${z.accent}`, fontWeight:500, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                Learn more
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageChrome>
  );
}

/* ===== PALETTE STRIP — compact reference card ===== */
function PaletteStrip() {
  return (
    <div style={{ height:'100%', background:'#050607', color:'#E8ECEF', fontFamily:'Inter, sans-serif', padding:'32px', display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color:'rgba(255,255,255,0.45)', letterSpacing:'0.18em', marginBottom:6 }}>QUICK SWATCH</div>
        <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:24, fontWeight:500, margin:0 }}>The 5 zones</h3>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14 }}>
        {ZONES.map(z => (
          <div key={z.id} style={{ display:'flex', alignItems:'stretch', gap:14, height:64 }}>
            <div style={{
              flex:'0 0 64px', height:64, borderRadius:8,
              background: `linear-gradient(135deg, ${z.accent} 0%, ${z.accentDim} 100%)`,
            }}/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:16, fontWeight:500 }}>{z.name}</span>
                <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10.5, color:'rgba(255,255,255,0.45)' }}>{z.accent}</span>
              </div>
              <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)', marginTop:3 }}>{z.purpose}</span>
            </div>
            <div style={{ width:120, height:64, borderRadius:6, background: `radial-gradient(ellipse at 50% 50%, ${z.wash1}, transparent 70%), #0A0C0E`, border:'1px solid rgba(255,255,255,0.06)', display:'grid', placeItems:'center' }}>
              <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9, color:'rgba(255,255,255,0.45)', letterSpacing:'0.14em' }}>WASH</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====== ROOT CANVAS ====== */

ReactDOM.createRoot(document.getElementById('root')).render(
  <DesignCanvas
    title="Zone palette — moving JAFX past dual-color"
    subtitle="Five semantic zones, FTMO-style sectional washes, one constant green CTA"
  >
    <DCSection id="overview" title="Overview" subtitle="Start here — the system in one glance">
      <DCArtboard id="palette-strip" label="The 5 zones at a glance" width={520} height={520}>
        <PaletteStrip/>
      </DCArtboard>
      <DCArtboard id="token-sheet" label="Tokens, themes & rules" width={1100} height={520}>
        <TokenSheet/>
      </DCArtboard>
    </DCSection>

    <DCSection id="zone-bands" title="Zone bands — hero treatment per zone" subtitle="Each is a 1280×720 hero showing the atmosphere, sample copy, and the constant green CTA living inside it">
      {ZONES.map(z => (
        <DCArtboard key={z.id} id={`band-${z.id}`} label={`${z.name} · ${z.purpose}`} width={1280} height={720}>
          <ZoneBand zone={z}/>
        </DCArtboard>
      ))}
    </DCSection>

    <DCSection id="stacked" title="Multi-zone landing page" subtitle="Three zones meeting on a single page — proves the system holds when sections butt up against each other">
      <DCArtboard id="stacked-intel-funding-knowledge" label="Intel → Funding → Knowledge" width={1280} height={1280}>
        <StackedPage/>
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);
