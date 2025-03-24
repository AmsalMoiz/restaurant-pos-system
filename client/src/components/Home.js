import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="home-background"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${process.env.PUBLIC_URL}/images/restomainpic.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <nav className="navbar">
        <div className="logo">Sweet Heaven</div>
        <div className="nav-links">
          <a href="#">View Menu</a>
          <a href="#">Book Table</a>
          <a href="#">Place Order</a>
        </div>
      </nav>

      <div className="hero-content">
        <p className="subtitle">Intimate dining restaurant</p>
        <h1 className="main-title">Sweet Heaven</h1>

        <div className="hours-section">
          <h3>Working Hours</h3>
          <div className="hours-grid">
            <div><strong>Sunday:</strong> 5:00 PM – 9:00 PM</div>
            <div><strong>Monday:</strong> 5:00 PM – 10:00 PM</div>
            <div><strong>Tuesday:</strong> 5:00 PM – 10:00 PM</div>
            <div><strong>Wednesday:</strong> 5:00 PM – 10:00 PM</div>
            <div><strong>Thursday:</strong> 5:00 PM – 10:00 PM</div>
            <div><strong>Friday:</strong> 5:00 PM – 12:00 AM</div>
            <div><strong>Saturday:</strong> 5:00 PM – 12:00 AM</div>
          </div>
          <p className="note">Reservations are limited to 2 hours • No parties over 6</p>
        </div>

        <Link to="/login" className="back-link">Back to Login</Link>
      </div>
    </div>
  );
};

export default Home;
