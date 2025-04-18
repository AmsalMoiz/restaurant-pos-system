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
      let digits = value.replace(/\D/g, '');
      digits = digits.substring(0, 10);

      let formatted = '';
      if (digits.length > 0) formatted = '+1 ';
      if (digits.length > 0) formatted += `(${digits.slice(0, 3)}`;
      if (digits.length >= 3) formatted += `) ${digits.slice(3, 6)}`;
      if (digits.length >= 6) formatted += `-${digits.slice(6, 10)}`;

      setFormData(prev => ({ ...prev, phone: formatted }));
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
      address: fullAddress
    };

    onSignup(payload); // merged address only sent, not individual parts
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create an Account</h2>
        {errorMessage && <p className="error-message-modal">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />

          <input
            type="tel"
            name="phone"
            placeholder="+1 (___) ___-____"
            value={formData.phone}
            onChange={handleChange}
          />

          <input type="text" name="street" placeholder="Street Address" onChange={handleChange} />
          <input type="text" name="city" placeholder="City" onChange={handleChange} />

          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            {US_STATES.map((state, i) => (
              <option key={i} value={state}>{state}</option>
            ))}
          </select>

          <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} />

          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

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
