import React, { useState, useEffect } from 'react';
import './usersignupmodal.css';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const UserSignupModal = ({ onClose, onSignup, showSignupModal, errorMessage, setErrorMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setFormData({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      password: ''
    });
    setErrorMessage('');
  }, [showSignupModal, setErrorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow digits, max 10
      let digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digits }));
    } else if (name === 'zip') {
      // Only allow digits, max 5
      let digits = value.replace(/\D/g, '').slice(0, 5);
      setFormData(prev => ({ ...prev, zip: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const { street, city, state, zip, ...rest } = formData;
    
    const fullAddress = `${street}, ${city}, ${state} ${zip}`.trim();
    const payload = {
      ...rest,
      address: fullAddress,
      phone: '+1' + formData.phone 
    };
    onSignup(payload); 
  };

  // Optional: Format for display as (123) 456-7890
  function formatPhone(digits) {
    if (!digits) return '';
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create an Account</h2>
        {errorMessage && <p className="error-message-modal">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <div className="phone-input-wrapper">
            <span className="phone-prefix">+1</span>
            <input
              type="tel"
              name="phone"
              placeholder="(555) 123-4567"
              maxLength={14}
              onChange={handleChange}
              value={formatPhone(formData.phone)}
              style={{ paddingLeft: '50px' }} 
              autoComplete="tel"
              required
            />
          </div>

          <input
            type="text"
            name="street"
            placeholder="Street Address"
            onChange={handleChange}
            value={formData.street}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            value={formData.city}
          />

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {US_STATES.map((state, i) => (
              <option key={i} value={state}>{state}</option>
            ))}
          </select>

          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            onChange={handleChange}
            value={formData.zip}
            maxLength={5}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            value={formData.password}
          />

          <div className="modal-buttons">
            <button type="submit">Create Account</button>
            <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignupModal;
