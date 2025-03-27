import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <h1 className="navbar-logo" onClick={() => window.location.href = '/home'} style={{ cursor: 'pointer' }}>Sweet Heaven</h1>
      </div>
      <div className="navbar-right">
        <Link to="/menu">View Menu</Link>
        <Link to="/booktable">Book Table</Link>
        <Link to="/cart">Bag</Link>
      </div>
    </nav>
  );
};

export default Navbar;
