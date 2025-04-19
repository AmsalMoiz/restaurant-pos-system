import React, { useState } from 'react';
import './modal.css';

const EditProfileModal = ({ user, onClose }) => {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();
    // Save logic here (API or localStorage)
    localStorage.setItem('user', JSON.stringify(form));
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSave}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} required />
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit" className="modal-save">Save</button>
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
