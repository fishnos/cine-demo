import { motion } from 'framer-motion'

export function MissionFooter({ waypoints, currentWaypointIdx, missionProgress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      style={{
        background: 'rgba(8,8,16,0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        padding: '0 28px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        Mission
      </span>

      {/* Timeline */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Background track */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'rgba(255,255,255,0.06)', borderRadius: 1,
        }} />

        {/* Filled track */}
        <motion.div
          animate={{ width: `${missionProgress * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: 0, height: 2,
            background: 'var(--plasma-h)', borderRadius: 1,
            boxShadow: '0 0 8px rgba(249,115,22,0.5)',
          }}
        />

        {/* Waypoint nodes */}
        {waypoints.map((wp, i) => {
          const pct = i / (waypoints.length - 1)
          const done = i < currentWaypointIdx
          const active = i === currentWaypointIdx

          return (
            <div
              key={wp.id}
              style={{
                position: 'absolute',
                left: `${pct * 100}%`,
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              }}
            >
              {/* Label above */}
              <span style={{
                fontSize: 9, whiteSpace: 'nowrap', marginBottom: 2,
                color: done ? 'var(--orange)' : active ? 'var(--white)' : 'var(--text-3)',
                letterSpacing: '0.06em',
                transition: 'color 0.3s',
              }}>
                {wp.label}
              </span>

              {/* Node dot */}
              <motion.div
                animate={{
                  scale: active ? 1.3 : 1,
                  boxShadow: active
                    ? '0 0 0 3px rgba(249,115,22,0.25), 0 0 12px rgba(249,115,22,0.4)'
                    : done
                    ? '0 0 0 2px rgba(249,115,22,0.3)'
                    : 'none',
                }}
                transition={{ duration: 0.25 }}
                style={{
                  width: active ? 10 : 8,
                  height: active ? 10 : 8,
                  borderRadius: '50%',
                  background: done || active ? 'var(--orange)' : 'rgba(255,255,255,0.15)',
                  border: done || active ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  transition: 'background 0.3s, width 0.2s, height 0.2s',
                  position: 'relative', zIndex: 1,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Progress % */}
      <span style={{
        fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
        background: 'var(--plasma-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {Math.round(missionProgress * 100)}%
      </span>
    </motion.div>
  )
}
