import React from 'react';
import { motion } from 'framer-motion';

const VideoFeedPlaceholder = () => {
  return (
    <motion.div
      className="glass-panel"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '6px 12px',
          borderRadius: '20px',
          backdropFilter: 'blur(5px)'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3333', boxShadow: '0 0 8px #ff3333' }}></div>
        <span style={{ fontWeight: 600, fontSize: '12px', letterSpacing: '1px' }}>LIVE FEED</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 500 }}>
        [ Macbook Camera Feed Placeholder ]
      </p>
    </motion.div>
  );
};

export default VideoFeedPlaceholder;
