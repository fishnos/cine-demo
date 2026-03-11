import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AnimatePresence>
      <Dashboard />
    </AnimatePresence>
  );
}

export default App;
