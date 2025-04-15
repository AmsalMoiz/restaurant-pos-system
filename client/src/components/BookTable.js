import React, { useState, useRef } from 'react';
import './bookTable.css';
import ReservationModal from './ReservationModal';
import Navbar from './Navbar';

const tables = [
  ['A1', 'A2', 'A3', 'A4', 'A5'],
  ['B1', 'B2', 'B3', 'B4', 'B5'],
  ['C1', 'C2', 'C3', 'C4', 'C5'],
  ['D1', 'D2', 'D3', 'D4', 'D5'],
  ['E1', 'E2', 'E3', 'E4', 'E5'],
  ['F1', 'F2', 'F3', 'F4', 'F5'],
  ['G1', 'G2', 'G3', 'G4', 'G5'],
  ['H1', 'H2', 'H3', 'H4', 'H5'],
];
const barChairs = ['Bar1', 'Bar2', 'Bar3', 'Bar4', 'Bar5', 'Bar6', 'Bar7', 'Bar8'];

const BookTable = () => {
  const [modalData, setModalData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const timeoutId = useRef(null); 

  const displayMessage = (newMessage, newMessageType, duration = 2500) => {
    // clear existing timeout, so msg time is consistent, 
    // this is so if someone is spamming buttons, triggering different messages
    if (timeoutId.current) {
        clearTimeout(timeoutId.current);
    }

    setMessage(newMessage);
    setMessageType(newMessageType);

    // set new timeout
    timeoutId.current = setTimeout(() => {
        setMessage(null);
        setMessageType('');
        timeoutId.current = null; //clear ref
    }, duration);
  };

  const openModal = (item) => {
    if (!selectedDate || !selectedTime) {
      displayMessage("Please select a date and time first.", 'error'); // get rid of alert function
      return;
    }
    setModalData({ label: item });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleReserve = ({ item, guests, time, date }) => {
    const newReservation = { item, guests, time, date };
    setReservations((prev) => [...prev, newReservation]);
    setModalData(null);
    setShowConfirmation({
      label: item,
      guests,
      time,
      date
    });
  };
  

  const isOccupied = (label) => {
    return reservations.some(
      (r) =>
        r.item === label &&
        r.date === selectedDate &&
        Math.abs(getHour(r.time) - getHour(selectedTime)) < 2
    );
  };

  const getHour = (time) => {
    const [hour, modifier] = time.split(' ');
    let [h] = hour.split(':').map(Number);
    if (modifier === 'PM' && h !== 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return h;
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const todayStr = today.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        <div className="layout-photo">
          <img src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} alt="Restaurant" />
        </div>

        <div className="layout-sketch center-align">
          {/* message display area, messages go here, maybe consider changing color */}
            {message && (
              <div className={`message ${messageType}`}>
              {message}
              </div>
          )}
          <h2 className="sketch-title">Reserve a Table</h2>

          <div className="datetime-selectors">
            <label>Date:</label>
            <input
              type="date"
              min={todayStr}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowConfirmation(false);
              }}
            />
            <label>Time:</label>
            <select
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
                setShowConfirmation(false);
              }}
            >
              <option value="">-- Select Time --</option>
              {['5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM','12:00 AM'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="reservation-zone">
            <div className="side-label left-label">View</div>
            <div className="table-grid">
              {tables.map((row, rowIndex) => (
                <div className="table-row" key={rowIndex}>
                  {row.map((label, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`square-table ${isOccupied(label) ? 'occupied' : ''}`}
                      onClick={() => openModal(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ))}
              <div className="restroom-label">Restroom</div>
            </div>

            <div className="bar-chair-column">
              {barChairs.map((chair, i) => (
                <button
                  key={i}
                  className={`circle-chair ${isOccupied(chair) ? 'occupied' : ''}`}
                  onClick={() => openModal(chair)}
                />
              ))}
              <div className="bar-label">Bar</div>
            </div>
          </div>

          <div className="legend">
            <div><span className="legend-icon square"></span> Table</div>
            <div><span className="legend-icon circle"></span> Bar Chair</div>
            <div><span className="legend-icon occupied"></span> Occupied</div>
          </div>

          {showConfirmation && (
  <div className="confirmation-message">
    <h3>
      You are reserved successfully <strong></strong> on{" "}
      <span style={{ color: "#ffd700" }}>{showConfirmation.date}</span>,{" "}
      {showConfirmation.guests} {showConfirmation.guests > 1 ? 'people' : 'person'}{" "}
      at <span style={{ color: "#ffd700" }}>{showConfirmation.time}</span>{" "}
      on table <span style={{ color: "#ffd700" }}>{showConfirmation.label}</span>.
    </h3>
  </div>
)}
        </div>

        {modalData && (
          <ReservationModal
            item={modalData.label}
            onClose={closeModal}
            onReserve={handleReserve}
            date={selectedDate}
            time={selectedTime}
          />
        )}
      </div>
    </>
  );
};

export default BookTable;
