import React, { useState } from 'react';
import './modal.css';

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

function formatPhone(digits) {
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
}

function parseAddress(address = '') {
  // Simple parser for "street, city, state zip"
  const [street = '', city = '', stateZip = ''] = address.split(',').map(s => s.trim());
  const [state = '', zip = ''] = stateZip.split(' ').map(s => s.trim());
  return { street, city, state, zip };
}

const EditProfileModal = ({ user, onClose }) => {
  const { street, city, state, zip } = parseAddress(user.address);
  const initialDigits = (user.phone || '').replace(/\D/g, '').slice(0, 10);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: initialDigits,
    street,
    city,
    state,
    zip,
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'phone') {
      let digits = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digits });
    } else if (name === 'zip') {
      let digits = value.replace(/\D/g, '').slice(0, 5);
      setForm({ ...form, zip: digits });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (form.password || form.confirmPassword) {
      if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = e => {
    e.preventDefault();
    if (!validate()) return;
    const fullAddress = `${form.street}, ${form.city}, ${form.state} ${form.zip}`.trim();
    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
      phone: '+1' + form.phone,
      address: fullAddress,
    };
    // Only update password if changed
    if (form.password) {
      updatedUser.password = form.password;
    }
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-form-leftlabels">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSave} autoComplete="off">
          <div className="modal-form-row">
            <label htmlFor="edit-name">Name</label>
            <input id="edit-name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-email">Email</label>
            <input id="edit-email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-phone">Phone</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">+1</span>
              <input
                id="edit-phone"
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
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-street">Street Address</label>
            <input id="edit-street" name="street" value={form.street} onChange={handleChange} />
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-city">City</label>
            <input id="edit-city" name="city" value={form.city} onChange={handleChange} />
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-state">State</label>
            <select id="edit-state" name="state" value={form.state} onChange={handleChange}>
              <option value="">Select State</option>
              {US_STATES.map((state, i) => (
                <option key={i} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-zip">ZIP Code</label>
            <input
              id="edit-zip"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              maxLength={5}
              inputMode="numeric"
              placeholder="ZIP Code"
              required
            />
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-password">Change Password</label>
            <input
              id="edit-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New password"
              autoComplete="new-password"
            />
            {errors.password && <div className="modal-error">{errors.password}</div>}
          </div>
          <div className="modal-form-row">
            <label htmlFor="edit-confirm-password">Confirm Password</label>
            <input
              id="edit-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <div className="modal-error">{errors.confirmPassword}</div>}
          </div>
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
