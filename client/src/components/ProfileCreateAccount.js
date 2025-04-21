import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Navbar from './Navbar';
import UserSignupModal from './UserSignupModal';

const ProfileCreateAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Modal state
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle successful signup
  const handleSignup = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setShowSignupModal(false);
    setErrorMessage('');
    navigate('/customer-dashboard');
  };

  return (
    <>
      <Navbar onOpenSignupModal={() => setShowSignupModal(true)} />
      <div className="profile-wrapper">
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
              <div className="profile-empty-cta">
                <p style={{ color: "#888", margin: "1.5em 0 0.5em" }}>
                  Create an account to personalize your profile and view your reservations.
                </p>
                <button
                  onClick={() => setShowSignupModal(true)}
                  style={{
                    background: "#E7CD78",
                    color: "#222",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "1.08em",
                    padding: "12px 24px",
                    cursor: "pointer",
                    marginTop: "12px",
                    boxShadow: "0 0 12px rgba(231,205,120,0.16)",
                  }}
                >
                  Create Account now!
                </button>
              </div>
            </div>
          )}

          {/* Reservations tab content */}
          {activeTab === 'reservations' && (
            <div style={{ marginTop: "2rem", textAlign: "center", color: "#aaa" }}>
              <p>No reservations to display.</p>
              <p>Create an account to manage your reservations!</p>
            </div>
          )}

          {/* Order history tab content */}
          {activeTab === 'orders' && (
            <div style={{ marginTop: "2rem", textAlign: "center", color: "#aaa" }}>
              <p>No order history to display.</p>
              <p>Create an account to view your orders!</p>
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

      {/* Signup Modal */}
      {showSignupModal && (
        <UserSignupModal
          onSignup={handleSignup}
          onClose={() => setShowSignupModal(false)}
          showSignupModal={showSignupModal}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
};

export default ProfileCreateAccount;
