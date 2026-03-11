export function VideoFeed() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'rgba(0,0,0,0.5)', overflow: 'hidden',
    }}>
      {/* Subtle scan lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)',
      }} />

      {/* Corner brackets */}
      {[
        { top: 10, left: 10, borderTop: '1.5px solid rgba(249,115,22,0.5)', borderLeft: '1.5px solid rgba(249,115,22,0.5)' },
        { top: 10, right: 10, borderTop: '1.5px solid rgba(249,115,22,0.5)', borderRight: '1.5px solid rgba(249,115,22,0.5)' },
        { bottom: 10, left: 10, borderBottom: '1.5px solid rgba(249,115,22,0.5)', borderLeft: '1.5px solid rgba(249,115,22,0.5)' },
        { bottom: 10, right: 10, borderBottom: '1.5px solid rgba(249,115,22,0.5)', borderRight: '1.5px solid rgba(249,115,22,0.5)' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...s }} />
      ))}

      {/* LIVE badge */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 7,
        background: 'rgba(8,8,16,0.7)',
        border: '1px solid rgba(249,115,22,0.3)',
        padding: '4px 10px', borderRadius: 99,
      }}>
        <span style={{ position: 'relative', display: 'flex', width: 6, height: 6 }}>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'var(--orange)', opacity: 0.7,
            animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
          }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)', position: 'relative' }} />
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--orange)', letterSpacing: '0.12em' }}>LIVE</span>
      </div>

      {/* Center placeholder */}
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.08)', letterSpacing: '0.25em' }}>NO SIGNAL</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.04)', letterSpacing: '0.1em' }}>awaiting camera feed</p>
      </div>
    </div>
  )
}
