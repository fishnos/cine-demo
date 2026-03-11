import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import VideoFeedPlaceholder from './VideoFeedPlaceholder';
import ThreeJSPlaceholder from './ThreeJSPlaceholder';

const Dashboard = () => {
  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 350px) 1fr',
        gridTemplateRows: '1fr',
        height: '100vh',
        width: '100vw',
        padding: '24px',
        gap: '24px'
      }}
    >
      <Sidebar />
      <div
        className="main-content"
        style={{
          display: 'grid',
          gridTemplateRows: '1fr 1fr',
          gap: '24px',
          height: '100%'
        }}
      >
        <VideoFeedPlaceholder />
        <ThreeJSPlaceholder />
      </div>
    </motion.div>
  );
};

export default Dashboard;
