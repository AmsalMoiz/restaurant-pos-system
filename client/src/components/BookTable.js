import React from 'react';
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
  ['H1', 'H2', 'H3', 'H4', 'H5']
];

const BookTable = () => {
  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        <div className="layout-photo">
          <img src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} alt="Restaurant" />
          <div className="side-label view">View</div>
        </div>

        <div className="layout-center">
          <h2 className="sketch-title">Reserve a Table</h2>
          <div className="table-grid">
            {tableRows.map((row, i) => (
              <div className="table-row" key={i}>
                {row.map((label, j) => (
                  <div className="square-table" key={j}>{label}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="side-label bottom">Restroom</div>

          <div className="legend">
            <div><span className="legend-box table-legend"></span> Table</div>
            <div><span className="legend-box chair-legend"></span> Bar Chair</div>
          </div>
        </div>

        <div className="layout-right">
          <div className="bar">
            {[...Array(10)].map((_, i) => (
              <div className="bar-chair" key={i}></div>
            ))}
          </div>
          <div className="bar-label">Bar</div>
        </div>
      </div>
    </>
  );
};

export default BookTable;
