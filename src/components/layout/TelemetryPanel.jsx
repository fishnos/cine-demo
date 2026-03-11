import { motion } from 'framer-motion'

const MetricCard = ({ label, value, unit, color }) => (
  <div style={{
    padding: '10px 12px', borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    <span style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{unit}</span>
    </div>
  </div>
)

const AttitudeBar = ({ label, value, min, max, color }) => {
  const pct = Math.max(0, Math.min(100, ((Number(value) - min) / (max - min)) * 100))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{value}°</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.08 }}
          style={{ height: '100%', background: color, borderRadius: 2 }}
        />
      </div>
    </div>
  )
}

const EventDot = ({ type }) => {
  const c = type === 'success' ? 'var(--orange)' : type === 'warning' ? 'var(--yellow)' : 'var(--purple)'
  return <span style={{ width: 5, height: 5, borderRadius: '50%', background: c, flexShrink: 0, marginTop: 4 }} />
}

export function TelemetryPanel({ telemetry }) {
  const { speed, altitude, battery, gpsSats, signalStrength, attitude, events } = telemetry
  const batColor = Number(battery) > 50 ? '#4ade80' : Number(battery) > 20 ? 'var(--yellow)' : 'var(--orange)'

  return (
    <motion.aside
      className="glass-panel"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, delay: 0.15 }}
      style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', flexShrink: 0 }}
    >
      <div>
        <h2 style={{
          fontSize: 16, fontWeight: 700,
          background: 'var(--plasma-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 2,
        }}>Telemetry</h2>
        <p style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>LIVE · 60 FPS</p>
      </div>

      <div className="divider" />

      {/* 2×2 metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricCard label="ALT"    value={altitude}       unit="m"   color="var(--purple)" />
        <MetricCard label="SPD"    value={speed}          unit="m/s" color="var(--orange)" />
        <MetricCard label="BAT"    value={battery}        unit="%"   color={batColor} />
        <MetricCard label="GPS"    value={gpsSats}        unit="sat" color="var(--yellow)" />
      </div>
      <MetricCard label="SIGNAL" value={signalStrength} unit="dBm" color="var(--white)" />

      <div className="divider" />

      {/* Attitude */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p className="section-label">Attitude</p>
        <AttitudeBar label="ROLL"  value={attitude.roll}  min={-30} max={30}  color="var(--purple)" />
        <AttitudeBar label="PITCH" value={attitude.pitch} min={-30} max={30}  color="var(--orange)" />
        <AttitudeBar label="YAW"   value={attitude.yaw}   min={0}   max={360} color="var(--yellow)" />
      </div>

      <div className="divider" />

      {/* Activity feed */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 8 }}>
        <p className="section-label">Activity</p>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {events.map(e => (
            <div key={e.id} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <EventDot type={e.type} />
              <div>
                <p style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.3 }}>{e.text}</p>
                <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
