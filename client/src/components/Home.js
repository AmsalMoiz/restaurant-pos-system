import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-wrapper">
      <header className="navbar">
        <div className="logo">Sweet Heaven</div>
        <nav className="nav-links">
          <a href="#">View Menu</a>
          <a href="#">Book Table</a>
          <a href="#">Place Order</a>
        </nav>
      </header>

      <main className="home-content">
        <h1>Welcome to Sweet Heaven</h1>
        <Link to="/login" className="back-link">Back to Login</Link>
      </main>
    </div>
  );
}

export default Home;
