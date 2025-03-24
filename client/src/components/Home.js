import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="home-background"
      style={{
        backgroundImage: "url('/images/restomainpic.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      <nav className="navbar">
        <div className="logo">Sweet Heaven</div>
        <div className="nav-links">
          <Link to="/menu">View Menu</Link>
          <Link to="/book">Book Table</Link>
          <Link to="/order">Place Order</Link>
        </div>
      </nav>

      <div className="hero-content">
        <p className="subtitle">Intimate dining restaurant</p>
        <h1 className="main-title">Sweet Heaven</h1>

        <div className="hours-section">

          <div className="hours-grid">
  {[
    { day: 'Sunday', time: '5:00 PM – 9:00 PM' },
    { day: 'Monday', time: '5:00 PM – 10:00 PM' },
    { day: 'Tuesday', time: '5:00 PM – 10:00 PM' },
    { day: 'Wednesday', time: '5:00 PM – 10:00 PM' },
    { day: 'Thursday', time: '5:00 PM – 10:00 PM' },
    { day: 'Friday', time: '5:00 PM – 12:00 AM' },
    { day: 'Saturday', time: '5:00 PM – 12:00 AM' },
  ].map((entry, index) => (
    <div className="hours-column" key={index}>
      <div className="day">{entry.day}</div>
      <div className="time">{entry.time}</div>
      <div className="underline"></div>
    </div>
  ))}
</div>

          <p className="note">
            Reservations are limited to <span>2 hours</span> • No parties over <span>6</span>
          </p>
        </div>

        <Link to="/login" className="back-link">Back to Login</Link>
      </div>
    </div>
  );
};

export default Home;
