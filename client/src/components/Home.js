// File: Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
      <Navbar />

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

      {/* NEW SECTION */}
      <div className="menu-highlight-section">
        <div className="menu-text-content">
          <p className="menu-subtitle">Taste the mood</p>
          <h2 className="menu-highlight-title">Our Menu</h2>
          <p className="menu-highlight-description">
            Reserve now at <strong>Sweet Heaven</strong> — an indulgent dessert and cocktail experience inspired by timeless international flavors. Delight in artisanal sweets, signature libations, and impeccable service in a setting of understated elegance.
          </p>

          <div className="menu-buttons">
            <Link to="/book" className="menu-button outline">Book your table</Link>
            <Link to="/menu" className="menu-button filled">View Menu</Link>
          </div>
        </div>

        <div className="menu-image-container">
          <img src="/images/fancy_dessert_plate.jpg" alt="Our Signature Dish" className="menu-image" />
        </div>
      </div>
    </>
  );
};

export default Home;
