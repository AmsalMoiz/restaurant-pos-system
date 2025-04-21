import React, { useState } from 'react';
import './reservationModal.css';


function getReservationEndTime(startTime) {
  const [time, modifier] = startTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const endDate = new Date();
  endDate.setHours(hours + 2);
  endDate.setMinutes(minutes);

  const endHours = endDate.getHours();
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  const displayHours = ((endHours + 11) % 12 + 1);
  const displayModifier = endHours >= 12 ? 'PM' : 'AM';

  return `${displayHours}:${endMinutes} ${displayModifier}`;
}


const ReservationModal = ({ item, onClose, onReserve, date, time }) => {
  const isBar = item.startsWith('Bar');
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const handleReserve = () => {
    if (!guestCount) return;
    onReserve({
      item,
      guests: guestCount,
      time,
      date,
      special_requests: specialRequests
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{item}</h2>

        {!isBar && (
          <>
          <label>Number of Guests:</label>
          <select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
          </>
        )}

        {isBar && <p>1 person</p>}

        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          Reservation for <strong>{date}</strong> from <strong>{time}</strong> to <strong>{getReservationEndTime(time)}</strong>
        </p>

        <label>Special Requests:</label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Optional"
        />

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="reserve-btn" onClick={handleReserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
