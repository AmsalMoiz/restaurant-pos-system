import React, { useState } from 'react';
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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const openModal = (item) => {
    setModalData({ label: item });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleReserve = (item, guests, time, day) => {
    const reservation = {
      label: item.label,
      guests,
      time,
      day,
    };
    setReservations([...reservations, reservation]);
    closeModal();
  };

  const handleDone = () => {
    setShowConfirmation(true);
  };

  return (
    <>
      <Navbar />
      <div className="layout-wrapper">

        {/* Left Image */}
        <div className="layout-photo">
          <img src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} alt="Restaurant" />
        </div>

        {/* Layout Zone */}
        <div className="layout-sketch center-align">
          <h2 className="sketch-title">Reserve a Table</h2>

          <div className="reservation-zone">
            {/* View label */}
            <div className="side-label left-label">View</div>

            {/* Table Grid */}
            <div className="table-grid">
              {tables.map((row, rowIndex) => (
                <div className="table-row" key={rowIndex}>
                  {row.map((label, colIndex) => (
                    <button className="square-table" key={`${rowIndex}-${colIndex}`} onClick={() => openModal(label)}>
                      {label}
                    </button>
                  ))}
                </div>
              ))}

              <div className="restroom-label">Restroom</div>
            </div>

            {/* Bar Chairs */}
            <div className="bar-chair-column">
              {barChairs.map((chair, index) => (
                <button key={index} className="circle-chair" onClick={() => openModal(chair)} />
              ))}
              <div className="bar-label">Bar</div>
            </div>
          </div>

          {/* Legend */}
          <div className="legend">
            <div><span className="legend-icon square"></span> Table</div>
            <div><span className="legend-icon circle"></span> Bar Chair</div>
            <div><span className="legend-icon occupied"></span> Occupied</div>
          </div>

          {/* Reservation List */}
          {reservations.length > 0 && !showConfirmation && (
            <div className="reservation-summary">
              <h4>Current Reservations:</h4>
              <ul>
                {reservations.map((r, i) => (
                  <li key={i}>{`${r.label} at ${r.day} ${r.time}`}</li>
                ))}
              </ul>
              <button className="done-btn" onClick={handleDone}>Done</button>
            </div>
          )}

          {showConfirmation && (
            <div className="confirmation-message">
              <h3>You’re reserved at Sweet Heaven!</h3>
              <p>Confirmation sent. Please enter an email or phone for updates:</p>
              <input type="text" placeholder="example@email.com or 555-1234" />
            </div>
          )}
        </div>

        {/* Modal */}
        {modalData && (
          <ReservationModal
            item={modalData}
            onClose={closeModal}
            onReserve={handleReserve}
          />
        )}
      </div>
    </>
  );
};

export default BookTable;
