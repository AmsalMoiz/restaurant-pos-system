import React from 'react';
import './modal.css';

const DeleteAccountModal = ({ user, onClose }) => {
  const handleDelete = () => {
    // Delete logic here (API or localStorage)
    localStorage.removeItem('user');
    onClose();
    window.location.href = '/login';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Delete Account</h2>
        <p>Are you sure you want to delete your account, <strong>{user.name}</strong>? This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="modal-delete" onClick={handleDelete}>Delete</button>
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
