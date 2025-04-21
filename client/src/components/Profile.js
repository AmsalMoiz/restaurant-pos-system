import React, { useState } from 'react';
import './profile.css'; // Reuse the same CSS for consistency
import Navbar from './Navbar'; // Use guest Navbar

const ProfileCreateAccount = ({ onOpenSignupModal }) => {
  // For tab navigation (still show tabs, but all empty)
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <>
      <Navbar onOpenSignupModal={onOpenSignupModal} />
      <div className="profile-wrapper">
        {/* Content container */}
        <div className="profile-content">
          {/* Tabs navigation */}
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

          {/* Profile tab content */}
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
                <button
                  style={{
                    background: "#E7CD78",
                    color: "#222",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "1.08em",
                    padding: "12px 24px",
                    cursor: "pointer",
                    marginTop: "18px",
                    boxShadow: "0 0 12px rgba(231,205,120,0.16)",
                  }}
                  onClick={onOpenSignupModal}
                >
                  Create Account now!
                </button>
              </div>
            </div>
          )}

          {/* Reservations tab content */}
          {activeTab === 'reservations' && (
            <div style={{ marginTop: "2rem", textAlign: "center", color: "#aaa" }}>
              <p>No reservations to display. Create an account to manage your reservations!</p>
            </div>
          )}

          {/* Order history tab content */}
          {activeTab === 'orders' && (
            <div style={{ marginTop: "2rem", textAlign: "center", color: "#aaa" }}>
              <p>No order history to display. Create an account to view your orders!</p>
            </div>
          )}
        </div>

        {/* Background image on the right */}
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
