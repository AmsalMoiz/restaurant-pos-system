import React, { useState } from 'react';
import './reservationModal.css';

const ReservationModal = ({ item, onClose, onReserve }) => {
  const [selectedGuests, setSelectedGuests] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleReserve = () => {
    onReserve(selectedGuests, selectedTime);
  };

  const guestOptions = item.type === 'table'
    ? ['5 people', '4 people', '3 people', '2 people']
    : ['1 person'];

  // Time options based on the day
  const today = new Date().getDay();
  const hoursByDay = {
    0: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],                 // Sunday
    1: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],       // Monday
    2: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],       // Tuesday
    3: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],       // Wednesday
    4: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],       // Thursday
    5: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'], // Friday
    6: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'], // Saturday
  };

  const timeOptions = hoursByDay[today];

  return (
    <div className="modal-overlay">
      <div className="reservation-modal">
        <h3>{item.label}</h3>
        <p>How many guests?</p>
        <div className="guest-options">
          {guestOptions.map((option) => (
            <button
              key={option}
              className={selectedGuests === option ? 'active' : ''}
              onClick={() => setSelectedGuests(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <p>Select a time:</p>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="">-- Select Time --</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="confirm-btn" onClick={handleReserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
