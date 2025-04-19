import React, { useState } from 'react';
import './modal.css';

function formatPhone(digits) {
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
}

const EditProfileModal = ({ user, onClose }) => {
  // Extract digits from user.phone (in case it's formatted)
  const initialDigits = (user.phone || '').replace(/\D/g, '').slice(0, 10);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: initialDigits,
    address: user.address,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'phone') {
      let digits = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digits });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = e => {
    e.preventDefault();
    // Save logic here (API or localStorage)
    // Store in E.164 format: +1XXXXXXXXXX
    const updatedUser = {
      ...form,
      phone: '+1' + form.phone
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
          <div className="phone-input-wrapper">
            <span className="phone-prefix">+1</span>
            <input
              type="tel"
              name="phone"
              placeholder="(555) 123-4567"
              maxLength={14}
              onChange={handleChange}
              value={formatPhone(form.phone)}
              style={{ paddingLeft: '50px' }}
              autoComplete="tel"
              required
            />
          </div>
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
