import React, { useState } from 'react';
import './reservationModal.css';

const ReservationModal = ({ item, onClose, onReserve, date, time }) => {
  const isBar = item.startsWith('Bar');
  const [guestCount, setGuestCount] = useState(isBar ? 1 : null);

  const handleReserve = () => {
    if (!guestCount) return;
    onReserve({
      item,
      guests: guestCount,
      time,
      date
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{item}</h2>
        {!isBar && (
          <>
            <p>How many guests?</p>
            <div className="guest-options">
              {[6, 5, 4, 3, 2].map((num) => (
                <button
                  key={num}
                  className={guestCount === num ? 'active' : ''}
                  onClick={() => setGuestCount(num)}
                >
                  {num} people
                </button>
              ))}
            </div>
          </>
        )}
        {isBar && <p>1 person</p>}

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="reserve-btn" onClick={handleReserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
