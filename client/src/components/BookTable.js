import React, { useState, useEffect, useRef } from 'react';
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
const [reservationLimitReached, setReservationLimitReached] = useState(false);
const [message, setMessage] = useState(null);
const [messageType, setMessageType] = useState('');
const timeoutId = useRef(null);

const displayMessage = (newMessage, newMessageType, duration = 2500) => {
  if (timeoutId.current) clearTimeout(timeoutId.current);

  setMessage(newMessage);
  setMessageType(newMessageType);

  timeoutId.current = setTimeout(() => {
    setMessage(null);
    setMessageType('');
    timeoutId.current = null;
  }, duration);
};

  const openModal = (item) => {
    if (!selectedDate || !selectedTime) {
      displayMessage("Please select a date and time first.", 'error'); // get rid of alert function
      return;
    }
  
    const selectedDateTime = new Date(`${selectedDate}T${convertTo24HourFormat(selectedTime)}`);
    const now = new Date();
  
    if (selectedDateTime < now) {
      alert('You cannot reserve a past time.');
      return;
    }
  
    setModalData({ label: item });
  };
  

  const closeModal = () => {
    setModalData(null);
  };

  function convertTo24HourFormat(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
  
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  }
  

  const handleReserve = async ({ item, guests, time, date, special_requests }) => {
    const user = JSON.parse(localStorage.getItem("user")); // or from context
  
    if (!user || !user.name || !user.email || !user.phone) {
      alert("User info missing. Please log in again.");
      return;
    }
  
    const reservationData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      num_guests: guests,
      date,
      time: convertTo24HourFormat(time),
      table_name: item,
      special_requests
    };
  
    try {
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      });
  
      if (response.status === 409) {
        alert("This table is already booked for that time.");
        return;
      } else if (response.status === 403) {
        setReservationLimitReached(true);
        return;
      } else if (!response.ok) {
        throw new Error("Failed to reserve table");
      }
      
      
      setBookedTables((prev) => [
        ...prev,
        {
          table_name: item,
          time: convertTo24HourFormat(time)
        }
      ]);

      setShowConfirmation({ label: item, guests, time, date });
      setModalData(null);
      setTimeout(() => setShowConfirmation(false), 6000);

    } catch (err) {
      console.error(err);
      alert("An error occurred while reserving the table.");
    }
  };
  
  

  const isOccupied = (label) => {
    const toMinutes = (time) => {
      const normalized = time.includes(' ')
        ? convertTo24HourFormat(time)  // if input like "11:00 PM"
        : time;                        // if already in "23:00:00"
  
      const [h, m] = normalized.split(':').map(Number);
      return h * 60 + m;
    };
  
    const selectedMinutes = toMinutes(selectedTime);
  
    return bookedTables.some((r) => {
      if (r.table_name !== label) return false;
  
      const reservedMinutes = toMinutes(r.time);
      const diff = Math.abs(reservedMinutes - selectedMinutes);
  
      return diff < 120; // within 2 hours
    });
  };
  
  

  const getHour = (time) => {
    // Handle MySQL 24-hour format (e.g., "19:00:00")
    if (time.includes(":") && time.length === 8) {
      const [h] = time.split(':').map(Number);
      return h;
    }
  
    // Handle 12-hour format (e.g., "7:00 PM")
    const [hour, modifier] = time.split(' ');
    let [h] = hour.split(':').map(Number);
    if (modifier === 'PM' && h !== 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return h;
  };
  

  const timeOptions = [
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
    '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
  ];
  
  function getValidTimeOptions() {
    if (!selectedDate) return timeOptions;
  
    const selected = new Date(selectedDate);
    const now = new Date();
  
    const isToday = selected.toDateString() === now.toDateString();
  
    if (!isToday) return timeOptions;
  
    const currentTime = now.getHours() * 60 + now.getMinutes();
  
    return timeOptions.filter((timeStr) => {
      const [hour, modifier] = timeStr.split(' ');
      let [h, m] = hour.split(':').map(Number);
      if (modifier === 'PM' && h !== 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
  
      const optionMinutes = h * 60 + m;
      return optionMinutes > currentTime;
    });
  }

  //checking if table is reserved
  const [bookedTables, setBookedTables] = useState([]);
  useEffect(() => {
    if (!selectedDate || !selectedTime) return;
  
    const fetchReservations = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/reservations?date=${selectedDate}`);
        const data = await res.json();
        setBookedTables(data);
        console.log("Fetched reservations from DB:", data);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
      }
    };
  
    fetchReservations();
  }, [selectedDate, selectedTime]);
  

  

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
              {getValidTimeOptions().map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.9rem', marginTop: '6px', color: '#ccc' }}>
              * Reservations are for a maximum of 2 hours
            </p>
            {reservationLimitReached && (
            <p style={{ fontSize: '0.9rem', marginTop: '6px', color: '#ff7373' }}>
              You may only make 2 reservations per day. To change or remove one, go to <strong>Profile &gt; Reservations</strong>.
            </p>
          )}

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
                    onClick={() => {
                      if (!isOccupied(label)) openModal(label);
                    }}
                    disabled={isOccupied(label)}
                    title={isOccupied(label) ? "This table is booked" : ""}
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
                className="circle-chair disabled-bar"
                disabled
                title="Walk-ins only"
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
            <div className="toast-popup">
              <strong>Reservation Confirmed!</strong>
              <span>{showConfirmation.date}</span>,{" "}
              <span>{showConfirmation.guests} {showConfirmation.guests > 1 ? "people" : "person"}</span> at{" "}
              <span>{showConfirmation.time}</span> on table <span>{showConfirmation.label}</span>.
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
