import React, { useState } from 'react';
import './profile.css';

function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(' ');
  const initials = words.map(w => w[0]?.toUpperCase()).filter(Boolean);
  return initials.slice(0, 2).join('');
}

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Guest User',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, NY 12345',
    email: 'guest@example.com',
  };

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const initials = getInitials(user.name);

  return (
    <div className="profile-wrapper">
      <div className="profile-left">
        <div className="profile-initials-circle">{initials}</div>
        <div className="profile-info-section">
          <h2 className="profile-title">Profile</h2>
          <div className="profile-details-list">
            <div><span>Name:</span>{user.name}</div>
            <div><span>Email:</span>{user.email}</div>
            <div><span>Phone:</span>{user.phone}</div>
            <div><span>Address:</span>{user.address}</div>
          </div>
          <div className="profile-actions">
            <button onClick={() => setShowEdit(true)}>Edit Profile</button>
            <button className="delete" onClick={() => setShowDelete(true)}>Delete Account</button>
          </div>
          {showEdit && (
            <div style={{marginTop: 18, color: '#ffd700'}}>Edit Profile modal goes here...</div>
          )}
          {showDelete && (
            <div style={{marginTop: 18, color: '#ff5c5c'}}>Delete Account modal goes here...</div>
          )}
        </div>
      </div>
      <div className="profile-right">
        <img
          src={`${process.env.PUBLIC_URL}/images/profilesidepic.jpg`}
          alt="Profile background"
          className="profile-side-img"
        />
      </div>
    </div>
  );
};

export default Profile;
