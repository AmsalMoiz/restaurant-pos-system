import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profileCreateAccount.css'; // You'll need to create this CSS file

const ProfileCreateAccount = ({ onOpenSignupModal }) => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = localStorage.getItem("user");
  
  // If user is logged in, redirect to the regular profile page
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <div className="profile-create-account">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p className="profile-subtitle">Create an account to manage your profile and reservations</p>
        </div>
        
        <div className="profile-content">
          <div className="profile-icon">
            <div className="icon-circle">
              <span className="user-icon">?</span>
            </div>
          </div>
          
          <h2>You don't have an account yet</h2>
          <p>Create an account to access your profile, view your reservation history, and save your preferences at Sweet Heaven.</p>
          
          <button 
            className="create-account-btn"
            onClick={onOpenSignupModal}
            style={{
              marginTop: "25px",
              background: "#E7CD78",
              color: "#222",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1.1em",
              padding: "12px 24px",
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(231,205,120,0.16)",
            }}
          >
            Create Account Now!
          </button>
        </div>
        
        <div className="profile-footer">
          <p>Already have an account? <span className="login-link" onClick={onOpenSignupModal}>Log in</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreateAccount;
