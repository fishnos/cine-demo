import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [mlpEnabled, setMlpEnabled] = useState(true);
  const [controlMode, setControlMode] = useState('minvo');

  return (
    <motion.div
      className="glass-panel"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      style={{
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        overflowY: 'auto'
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          <span style={{ background: 'linear-gradient(90deg, var(--plasma-gradient-1), var(--plasma-gradient-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Flight Control
          </span>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>CINE Drone Dashboard</p>
      </motion.div>

      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>MLP Correction</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={mlpEnabled}
              onChange={() => setMlpEnabled(!mlpEnabled)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>Control Point Mode</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setControlMode('minvo')}
              style={{
                flex: 1,
                background: controlMode === 'minvo' ? 'rgba(138, 43, 226, 0.2)' : undefined,
                borderColor: controlMode === 'minvo' ? 'rgba(138, 43, 226, 0.5)' : undefined,
                color: controlMode === 'minvo' ? 'var(--plasma-gradient-1)' : undefined
              }}
            >
              Minvo
            </button>
            <button
              onClick={() => setControlMode('bspline')}
              style={{
                flex: 1,
                background: controlMode === 'bspline' ? 'rgba(255, 140, 0, 0.2)' : undefined,
                borderColor: controlMode === 'bspline' ? 'rgba(255, 140, 0, 0.5)' : undefined,
                color: controlMode === 'bspline' ? '#e27300' : undefined
              }}
            >
              B-Spline
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>Waypoints</span>
          <button style={{ padding: '6px 12px', fontSize: '12px' }}>+ Add</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((wp, i) => (
            <motion.div
              key={wp}
              whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                transition: 'background-color 0.2s ease'
              }}
            >
              <span style={{ fontWeight: 500 }}>Waypoint {i + 1}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>[10, {i * 5}, 5]</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
