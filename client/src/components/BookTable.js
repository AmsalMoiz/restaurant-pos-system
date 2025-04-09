import React, { useState } from 'react';
import './bookTable.css';
import ReservationModal from './ReservationModal';
import Navbar from './Navbar';

const BookTable = () => {
  const tableLabels = [
    ['A1', 'A2', 'A3', 'A4', 'A5'],
    ['B1', 'B2', 'B3', 'B4', 'B5'],
    ['C1', 'C2', 'C3', 'C4', 'C5'],
    ['D1', 'D2', 'D3', 'D4', 'D5'],
    ['E1', 'E2', 'E3', 'E4', 'E5'],
    ['F1', 'F2', 'F3', 'F4', 'F5'],
    ['G1', 'G2', 'G3', 'G4', 'G5'],
    ['H1', 'H2', 'H3', 'H4', 'H5']
  ];

  const barChairs = Array.from({ length: 10 }, (_, i) => `Bar${i + 1}`);

  const [modalData, setModalData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const openModal = (label, type) => {
    setModalData({ label, type });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleReserve = (guests, time) => {
    if (!guests || !time) return;
    const newEntry = `${modalData.label} (${guests} at ${time}) reserved`;
    setReservations(prev => [...prev, newEntry]);
    closeModal();
  };

  const finalizeReservations = () => {
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        {/* LEFT IMAGE */}
        <div className="layout-photo">
          <img src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} alt="Restaurant" />
        </div>

        {/* RIGHT LAYOUT */}
        <div className="layout-sketch">
          <span className="left-label">View</span>

          <h2 className="sketch-title">Reserve a Table</h2>

          <div className="table-grid">
            {tableLabels.map((row, rowIndex) => (
              <div className="table-row" key={rowIndex}>
                {row.map((label) => (
                  <button
                    className="square-table"
                    key={label}
                    onClick={() => openModal(label, 'table')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <span className="restroom-label">Restroom</span>

          {/* BAR */}
          <div className="bar-area">
            {barChairs.map((label) => (
              <button
                className="circle-chair"
                key={label}
                onClick={() => openModal(label, 'chair')}
              />
            ))}
            <span className="bar-label">Bar</span>
          </div>

          {/* LEGEND */}
          <div className="legend">
            <div><input type="checkbox" disabled /> Table</div>
            <div><input type="checkbox" disabled /> Bar Chair</div>
          </div>

          {/* RESERVATION TOOLBAR */}
          {reservations.length > 0 && (
            <div className="reservation-toolbar">
              <strong>Current Reservations:</strong>
              <ul>
                {reservations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              <button className="done-btn" onClick={finalizeReservations}>Done</button>
            </div>
          )}

          {/* CONFIRMATION */}
          {showConfirmation && (
            <div className="confirmation-popup">
              You are reserved for: {reservations.join(', ')} 🎉
            </div>
          )}

          {/* MODAL */}
          {modalData && (
            <ReservationModal
              item={modalData}
              onClose={closeModal}
              onReserve={handleReserve}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BookTable;
