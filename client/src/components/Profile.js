import React, { useState, useEffect } from 'react';
import './profile.css';
import EditProfileModal from './EditProfileModal';
import DeleteAccountModal from './DeleteAccountModal';
import OrderHistory from './OrderHistory';
import ReservationManager from './ReservationManager';
import NavbarCustomer from './NavbarCustomer';

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
        street: '',
        city: '',
        state: '',
        zip: ''
      };
      
      const address =
        user.address ||
        [user.street, user.city, user.state, user.zip].filter(Boolean).join(', ');
            

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const initials = getInitials(user.name);

  return (
    <>
      <NavbarCustomer />
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
                <div className="profile-initials-circle">{initials}</div>
                <h2 className="profile-title">My Profile</h2>
              </div>
              <div className="profile-details-list">
                <div><span>Name:</span>{user.name}</div>
                <div><span>Email:</span>{user.email}</div>
                <div><span>Phone:</span>{user.phone}</div>
                <div><span>Address:</span> {address}</div>
                </div>
              <div className="profile-actions">
                <button onClick={() => setShowEdit(true)}>Edit Profile</button>
                <button className="delete" onClick={() => setShowDelete(true)}>Delete Account</button>
              </div>
            </div>
          )}

          {/* Reservations tab content */}
          {activeTab === 'reservations' && (
            <ReservationManager userId={user.email} />
          )}

          {/* Order history tab content */}
          {activeTab === 'orders' && (
            <OrderHistory userId={user.email} />
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

      {/* Modals */}
      {showEdit && (
        <EditProfileModal user={user} onClose={() => setShowEdit(false)} />
      )}
      {showDelete && (
        <DeleteAccountModal user={user} onClose={() => setShowDelete(false)} />
      )}
    </>
  );
};

export default Profile;
