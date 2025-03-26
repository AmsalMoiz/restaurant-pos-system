// File: Home.js

import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
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

          <Link to="/login" className="back-link">
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
