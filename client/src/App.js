import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/Menu';
import PlaceOrder from './components/PlaceOrder'; // ✅ Confirm file casing!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/placeorder" element={<PlaceOrder />} /> {/*  */}
      </Routes>
    </Router>
  );
}

export default App;
