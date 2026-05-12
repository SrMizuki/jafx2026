const { useState: useStateT, useEffect: useEffectT } = React;

function Tweaks({ state, setters }) {
  const [active, setActive] = useStateT(false);
  const [open, setOpen] = useStateT(true);
  useEffectT(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setActive(true);
      if (e.data?.type === '__deactivate_edit_mode') setActive(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);
  const commit = (patch) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };
  if (!active) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 320, zIndex: 100,
      background: 'var(--bg-1)', border: '1px solid var(--accent)',
      borderRadius: 10, overflow: 'hidden', fontFamily: 'var(--font-body)',
      boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px var(--accent-glow)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--line)', gap: 10, cursor: 'pointer' }} onClick={() => setOpen(o=>!o)}>
        <span className="live-dot"></span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.14em' }}>TWEAKS</span>
        <span style={{ flex: 1 }}></span>
        <span style={{ color: 'var(--text-2)' }}>{open ? '−' : '+'}</span>
      </div>
      {open && <div style={{ padding: 16 }}>
        <Row label="Hero layout">
          <Seg options={[['neural','Neural'],['terminal','Terminal'],['split','Split']]} value={state.heroVariant} onChange={v=>{setters.setHero(v); commit({heroVariant:v});}}/>
        </Row>
        <Row label="3D background">
          <Seg options={[['candles','Candles'],['flow','Flow'],['mesh','Mesh'],['particles','Motes'],['orderbook','Depth']]} value={state.meshVariation} onChange={v=>{setters.setMesh(v); commit({meshVariation:v});}}/>
        </Row>
        <Row label="Accent color">
          <div style={{ display: 'flex', gap: 6 }}>
            {[['#00E6A0','Green CTA']].map(([c,n]) => (
              <button key={c} onClick={()=>{setters.setAccent(c); commit({accent:c});}} title={n}
                style={{ width: 28, height: 28, borderRadius: 4, background: c, border: state.accent === c ? '2px solid var(--text-0)' : '1px solid var(--line-strong)', cursor: 'pointer' }}/>
            ))}
          </div>
        </Row>
        <Row label="Density">
          <Seg options={[['comfortable','Comfortable'],['compact','Compact']]} value={state.density} onChange={v=>{setters.setDensity(v); commit({density:v});}}/>
        </Row>
        <Row label="Theme">
          <Seg options={[['dark','Dark'],['light','Light']]} value={document.documentElement.getAttribute('data-theme')||'dark'} onChange={v=>{
            document.documentElement.setAttribute('data-theme', v);
            try { localStorage.setItem('jafx-theme', v); } catch(e){}
            commit({theme: v});
          }}/>
        </Row>
      </div>}
    </div>
  );
}
function Row({ label, children }){ return (
  <div style={{ marginBottom: 14 }}>
    <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.14em', marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
    {children}
  </div>
);}
function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 4, padding: 2 }}>
      {options.map(([v,l]) => (
        <button key={v} onClick={()=>onChange(v)} style={{
          background: value === v ? 'var(--accent)' : 'transparent',
          color: value === v ? '#000' : 'var(--text-1)',
          border: 'none', padding: '5px 10px', fontFamily: 'var(--font-mono)', fontSize: 10,
          cursor: 'pointer', borderRadius: 3, letterSpacing: '0.06em'
        }}>{l}</button>
      ))}
    </div>
  );
}
Object.assign(window, { Tweaks });
