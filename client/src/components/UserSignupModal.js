import React, { useState, useEffect } from 'react';
import './usersignupmodal.css';

const UserSignupModal = ({ onClose, onSignup, showSignupModal, errorMessage, setErrorMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: ''
  });
  //const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(formData);  // pass data back to parent
  };

  useEffect(() => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      password: ''
    });
    setErrorMessage("");
  }, [showSignupModal, setErrorMessage]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create an Account</h2>
        {errorMessage && <p className="error-message-modal">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="text" name="address" placeholder="Full Address" required onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone Number (optional)" onChange={handleChange} />
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
