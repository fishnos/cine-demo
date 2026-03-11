import { motion, AnimatePresence } from 'framer-motion'
import { VideoFeed } from './VideoFeed'

const VizPlaceholder = () => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 10, position: 'relative',
  }}>
    {/* Corner brackets */}
    {[
      { top: 12, left: 12, borderTop: '2px solid rgba(168,85,247,0.4)', borderLeft: '2px solid rgba(168,85,247,0.4)' },
      { top: 12, right: 12, borderTop: '2px solid rgba(168,85,247,0.4)', borderRight: '2px solid rgba(168,85,247,0.4)' },
      { bottom: 12, left: 12, borderBottom: '2px solid rgba(168,85,247,0.4)', borderLeft: '2px solid rgba(168,85,247,0.4)' },
      { bottom: 12, right: 12, borderBottom: '2px solid rgba(168,85,247,0.4)', borderRight: '2px solid rgba(168,85,247,0.4)' },
    ].map((s, i) => (
      <div key={i} style={{ position: 'absolute', width: 18, height: 18, ...s }} />
    ))}

    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20,
    }}>
      ◈
    </div>
    <p style={{ fontSize: 12, color: 'var(--text-3)', letterSpacing: '0.15em' }}>3D VISUALIZATION</p>
    <p style={{ fontSize: 10, color: 'var(--text-3)', opacity: 0.6 }}>Three.js · Coming soon</p>
  </div>
)

const TABS = ['LIVE', 'SPLIT', '3D VIZ']

export function ViewportTabs({ activeTab, onTabChange, telemetry, mlpEnabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 3, padding: 3, flexShrink: 0,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: 10,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.18s ease',
                background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
                border: active ? '1px solid rgba(249,115,22,0.3)' : '1px solid transparent',
                color: active ? 'var(--orange)' : 'var(--text-3)',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Viewport */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="glass-panel"
          style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}
        >
          {activeTab === 'LIVE' && (
            <VideoFeed />
          )}

          {activeTab === 'SPLIT' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                <VideoFeed />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <VizPlaceholder />
              </div>
            </div>
          )}

          {activeTab === '3D VIZ' && (
            <VizPlaceholder />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
