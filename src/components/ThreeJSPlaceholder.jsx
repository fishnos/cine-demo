import React from 'react';
import { motion } from 'framer-motion';

const ThreeJSPlaceholder = () => {
  return (
    <motion.div
      className="glass-panel"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '6px 12px',
          borderRadius: '20px',
          backdropFilter: 'blur(5px)'
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '12px', letterSpacing: '1px' }}>3D VISUALIZATION</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 500, textAlign: 'center', lineHeight: '1.6' }}>
        [ Three.js Canvas Placeholder ]<br/>
        <span style={{ fontSize: '14px', fontWeight: 400 }}>Raw B-spline, MLP correction, drone position</span>
      </p>
    </motion.div>
  );
};

export default ThreeJSPlaceholder;
