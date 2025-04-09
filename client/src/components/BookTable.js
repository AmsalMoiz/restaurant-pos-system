import React, { useState } from 'react';
import './bookTable.css';
import Navbar from './Navbar';

const tableRows = [
  ['A1', 'A2', 'A3', 'A4', 'A5'],
  ['B1', 'B2', 'B3', 'B4', 'B5'],
  ['C1', 'C2', 'C3', 'C4', 'C5'],
  ['D1', 'D2', 'D3', 'D4', 'D5'],
  ['E1', 'E2', 'E3', 'E4', 'E5'],
  ['F1', 'F2', 'F3', 'F4', 'F5'],
  ['G1', 'G2', 'G3', 'G4', 'G5'],
  ['H1', 'H2', 'H3', 'H4', 'H5'],
];

const barChairs = Array.from({ length: 12 }, (_, i) => `Bar${i + 1}`);

const BookTable = () => {
  const [selectedBar, setSelectedBar] = useState(null);

  return (
    <>
      <Navbar />
      <div className="reservation-screen">
        {/* Left restaurant image */}
        <div className="reservation-left">
          <img
            src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`}
            alt="Restaurant"
            className="reservation-image"
          />
        </div>

        {/* Right layout */}
        <div className="reservation-right">
          <div className="layout-wrapper">
            <div className="view-label">View</div>

            <div className="layout-center">
              <h2 className="sketch-title">Reserve a Table</h2>
              <div className="table-grid">
                {tableRows.map((row, rowIndex) => (
                  <div className="table-row" key={rowIndex}>
                    {row.map((table) => (
                      <div className="square-table" key={table}>
                        {table}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="restroom-label">Restroom</div>
              <div className="legend">
                <label>
                  <div className="legend-box table-legend" /> Table
                </label>
                <label>
                  <div className="legend-circle bar-legend" /> Bar Chair
                </label>
              </div>
            </div>

            {/* Bar area */}
            <div className="bar-column">
              {barChairs.map((chair, index) => (
                <button
                  key={chair}
                  className={`bar-chair ${selectedBar === chair ? 'selected' : ''}`}
                  onClick={() => setSelectedBar(chair)}
                ></button>
              ))}
              <div className="bar-label">Bar</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookTable;
