import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/MenuTest';
import Cart from './components/Cart'; 
import UserLogin from './components/UserLogin';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const handleUserLogin = (userData) => {
    console.log('User logged in:', userData);
    // Set user state, redirect, etc.
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/users/login" element={<UserLogin onLogin={handleUserLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
