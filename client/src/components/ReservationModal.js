import React, { useState } from 'react';
import './reservationModal.css';

const ReservationModal = ({ item, onClose, onReserve }) => {
  const label = typeof item === 'string' ? item : item.label; // support both string and object
  const isBarChair = label.startsWith('Bar');

  const [selectedGuestCount, setSelectedGuestCount] = useState(isBarChair ? 1 : null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleReserve = () => {
    if (!selectedTime || !selectedDate) return;

    const reservationInfo = {
      item: label,
      guests: isBarChair ? 1 : selectedGuestCount,
      time: selectedTime,
      date: selectedDate
    };

    onReserve(reservationInfo);
    onClose();
  };

  const getDayFromDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  

  const getTimeOptions = (day) => {
    switch (day) {
      case 'Sunday':
        return ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM','9:00 PM'];
      case 'Monday':
      case 'Tuesday':
      case 'Wednesday':
      case 'Thursday':
        return ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];
      case 'Friday':
      case 'Saturday':
        return ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'];
      default:
        return [];
    }
  };  

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const day = selectedDate ? getDayFromDate(selectedDate) : null;
  const timeOptions = day ? getTimeOptions(day) : [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{label}</h2>
        {!isBarChair && (
          <>
            <p>How many guests?</p>
            <div className="guest-options">
              {[5, 4, 3, 2].map(num => (
                <button
                  key={num}
                  className={selectedGuestCount === num ? 'active' : ''}
                  onClick={() => setSelectedGuestCount(num)}
                >
                  {num} people
                </button>
              ))}
            </div>
          </>
        )}

        <div className="date-time-section">
          <p>Select a date:</p>
          <input
            type="date"
            min={todayStr}
            max={maxDateStr}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime('');
            }}
          />
        </div>

        {day && (
          <div className="date-time-section">
            <p>Select a time:</p>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="">-- Select Time --</option>
              {timeOptions.map((time, idx) => (
                <option key={idx} value={time}>{time}</option>
              ))}
            </select>
          </div>
        )}

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>Close</button>
          <button className="reserve-btn" onClick={handleReserve} disabled={!selectedDate || !selectedTime}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
