import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Add from '../Add/Add'; // Assuming Add component is in Add.js
import Dashboard from '../Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Add />} />
        <Route path="/admin510" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
