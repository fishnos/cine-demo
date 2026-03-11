import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let nextId = 10

const Toggle = ({ enabled, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
    <div
      onClick={() => onChange(!enabled)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: enabled ? 'var(--violet)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${enabled ? 'rgba(139,92,246,0.6)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', padding: 2,
        cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <motion.div
        animate={{ x: enabled ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', flexShrink: 0 }}
      />
    </div>
  </div>
)

const Slider = ({ label, value, min, max, step, onChange, unit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))} />
  </div>
)

const WaypointCard = ({ wp, index, onChange, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.18 }}
    style={{
      background: 'rgba(139,92,246,0.08)',
      border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 12px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: 'var(--violet)', fontWeight: 600, letterSpacing: '0.06em' }}>
        WP {index + 1}
      </span>
      <button
        onClick={() => onRemove(wp.id)}
        style={{ fontSize: 15, color: 'var(--text-3)', lineHeight: 1, padding: '0 2px' }}
      >
        ×
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
      {['x', 'y', 'z'].map(axis => (
        <div key={axis} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fonateCe: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{axis}</span>
          <input
            type="number"
            value={wp[axis]}
            onChange={e => onChange(wp.id, axis, Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      ))}
    </div>
  </motion.div>
)

export function MissionSidebar({ mlpEnabled, onMlpChange, speedLimit, onSpeedChange, altCeiling, onAltChange }) {
  const [waypoints, setWaypoints] = useState([
    { id: 1, x: 0,  y: 0,   z: 0  },
    { id: 2, x: 20, y: 10,  z: 15 },
    { id: 3, x: 45, y: -5,  z: 20 },
    { id: 4, x: 70, y: 15,  z: 12 },
  ])

  const addWaypoint = () => {
    const last = waypoints[waypoints.length - 1] ?? { x: 0, y: 0, z: 0 }
    setWaypoints(prev => [...prev, { id: nextId++, x: last.x + 15, y: last.y, z: last.z }])
  }

  const removeWaypoint = id => setWaypoints(prev => prev.filter(w => w.id !== id))
  const updateWaypoint = (id, axis, val) =>
    setWaypoints(prev => prev.map(w => w.id === id ? { ...w, [axis]: val } : w))

  return (
    <motion.aside
      className="glass-panel"
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, delay: 0.1 }}
      style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', flexShrink: 0 }}
    >
      <div>
        <h2 style={{
          fontSize: 16, fontWeight: 700, letterSpacing: '0.04em',
          background: 'var(--plasma-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 2,
        }}>Mission</h2>
        <p style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>HSR-2026 · CINE DEMO</p>
      </div>

      <div className="divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p className="section-label">Flight Controls</p>
        <Toggle label="MLP Correction" enabled={mlpEnabled} onChange={onMlpChange} />
        <Slider label="SPEED LIMIT" value={speedLimit} min={1} max={20} step={0.5} onChange={onSpeedChange} unit=" m/s" />
        <Slider label="ALT CEILING"  value={altCeiling} min={5} max={100} step={1}  onChange={onAltChange}   unit=" m"   />
      </div>

      <div className="divider" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="section-label">Waypoints</p>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{waypoints.length} pts</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7, paddingRight: 2 }}>
          <AnimatePresence>
            {waypoints.map((wp, i) => (
              <WaypointCard key={wp.id} wp={wp} index={i} onChange={updateWaypoint} onRemove={removeWaypoint} />
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={addWaypoint}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8,
            background: 'rgba(139,92,246,0.10)',
            border: '1px solid rgba(139,92,246,0.30)',
            color: 'var(--violet)',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.10)'}
        >
          + ADD WAYPOINT
        </button>
      </div>
    </motion.aside>
  )
}
