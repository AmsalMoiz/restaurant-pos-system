import React, { useState } from 'react';
import './bookTable.css';
import Navbar from './Navbar';

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

const barChairs = Array.from({ length: 12 }, (_, i) => `Bar-${i + 1}`);

const BookTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const handleClick = (label) => {
    setSelected(label);
    setModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        {/* Left Image */}
        <div className="layout-photo">
          <img src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} alt="Restaurant" />
        </div>

        {/* Right Layout */}
        <div className="layout-sketch">
          <div className="view-label">View</div>
          <h2 className="sketch-title">Reserve a Table</h2>

          <div className="table-sketch-zone">
            {tableLabels.map((row, i) => (
              <div className="table-row" key={i}>
                {row.map((label) => (
                  <button
                    key={label}
                    className="square-table"
                    onClick={() => handleClick(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="restroom-label">Restroom</div>

          <div className="bar-section">
            <div className="bar-label">Bar</div>
            {barChairs.map((chair) => (
              <button
                key={chair}
                className="circle-chair"
                onClick={() => handleClick(chair)}
              />
            ))}
          </div>

          <div className="legend">
            <div><span className="legend-box table-legend"></span> Table</div>
            <div><span className="legend-box chair-legend"></span> Bar Chair</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selected}</h3>
            <p>How many guests?</p>
            <div className="modal-options">
              {[5, 4, 3, 2].map((num) => (
                <button key={num}>{num} people</button>
              ))}
            </div>
            <button className="close-button" onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookTable;
