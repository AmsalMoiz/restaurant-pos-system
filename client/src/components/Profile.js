import React, { useState, useEffect } from 'react';
import './profile.css';
import Navbar from './Navbar';

const ProfileCreateAccount = ({ onOpenSignupModal }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [reservations, setReservations] = useState([]);
  const [reservationFilter, setReservationFilter] = useState('upcoming');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (activeTab === 'reservations' && user?.customer_id) {
      fetch(`http://localhost:3001/api/customer/reservations/${user.customer_id}`)
        .then(res => res.json())
        .then(data => setReservations(data.reservations || []))
        .catch(err => console.error('Failed to load reservations:', err));
    }
  }, [activeTab, user?.customer_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${
      date.getDate().toString().padStart(2, '0')
    }/${date.getFullYear()}`;
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${suffix}`;
  };

  return (
    <>
      <Navbar onOpenSignupModal={onOpenSignupModal} />
      <div className="profile-wrapper">
        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              Reservations
            </button>
            <button 
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Order History
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="profile-info-tab">
              <div className="profile-header">
                <div className="profile-initials-circle">?</div>
                <h2 className="profile-title">My Profile</h2>
              </div>
              <div className="profile-details-list">
                <div><span>Name:</span> — </div>
                <div><span>Email:</span> — </div>
                <div><span>Phone:</span> — </div>
                <div><span>Address:</span> — </div>
              </div>
              <div className="profile-actions">
                <button onClick={onOpenSignupModal}>
                  Create Account now!
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="reservations-list">
              <div className="reservation-filter">
                <label htmlFor="filter" style={{ marginRight: '10px' }}>Show:</label>
                <select
                  id="filter"
                  value={reservationFilter}
                  onChange={(e) => setReservationFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              {reservations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No reservations found.</p>
              ) : (
                reservations
                  .filter(r => {
                    const today = new Date();
                    const resDate = new Date(r.date);
                    return reservationFilter === 'upcoming'
                      ? resDate >= today
                      : resDate < today;
                  })
                  .map((r, index) => (
                    <div className="reservation-card" key={index}>
                      <p><strong>📅 {formatDate(r.date)}</strong> @ {formatTime(r.time)}</p>
                      <p>Table: {r.table_name} | Guests: {r.num_guests}</p>
                      {r.special_requests && <p className="reservation-note">Note: {r.special_requests}</p>}
                    </div>
                  ))
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ marginTop: "2rem", textAlign: "center", color: "#aaa" }}>
              <p>No order history to display. Create an account to view your orders!</p>
            </div>
          )}
        </div>

        <div className="profile-right">
          <img
            src={`${process.env.PUBLIC_URL}/images/profilesidepic.jpg`}
            alt="Profile background"
            className="profile-side-img"
          />
        </div>
      </div>
    </>
  );
};

export default ProfileCreateAccount;
