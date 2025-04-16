// File: Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
      <Navbar />

      {/* SECTION 1 – Restaurant Info & Hours */}
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
        <div className="hero-content">
          <p className="subtitle">Intimate dining restaurant</p>
          <h1 className="main-title">Sweet Heaven</h1>

          <div className="hours-section">
            <div className="hours-grid">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day, idx) => (
                <div className="hours-column" key={idx}>
                  <div className="day">{day}</div>
                  <div className="time">
                    {[
                      "5:00 PM – 9:00 PM",
                      "5:00 PM – 10:00 PM",
                      "5:00 PM – 10:00 PM",
                      "5:00 PM – 10:00 PM",
                      "5:00 PM – 10:00 PM",
                      "5:00 PM – 12:00 AM",
                      "5:00 PM – 12:00 AM",
                    ][idx]}
                  </div>
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

      {/* SECTION 2 – Taste the Mood + Menu Teaser */}
      <div className="menu-preview-section">
  <div className="menu-preview-overlay">
    <div className="menu-preview-content">
      <div className="menu-text">
        <p className="menu-subtitle">Taste the mood</p>
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-description">
          Reserve now at Sweet Heaven — an indulgent dessert and cocktail experience inspired by timeless international flavors.
          Delight in artisanal sweets, signature libations, and impeccable service in a setting of understated elegance.
        </p>
        <div className="menu-buttons">
          <Link to="/reservation" className="menu-btn outlined">Book your table</Link>
          <Link to="/menu" className="menu-btn filled">View Menu</Link>
        </div>
      </div>

      <div className="menu-image">
        <img src="/images/tiramisuNoir.jpg" alt="Our Dish" />
      </div>
    </div>
  </div>
</div>
    </>
  );
};

export default Home;
