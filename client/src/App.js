import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/MenuTest';
import Cart from './components/Cart'; 
import UserLogin from './components/UserLogin';
import DashAdmin from './components/DashAdmin';
import DashManager from './components/DashManager';
import DashWaiter from './components/DashWaiter';
import DashCook from './components/DashCook'; 
import BookTable from './components/BookTable';
import Checkout from './components/Checkout';

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
        <Route path="/admin-dashboard" element={<DashAdmin />} />
        <Route path="/manager-dashboard" element={<DashManager />} />
        <Route path="/waiter-dashboard" element={<DashWaiter />} />
        <Route path="/cook-dashboard" element={<DashCook />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
    </Router>
  );
}

export default App;
