import React from 'react';
import './bookTable.css'; 

const tables = [
  { id: 1, seats: 4, label: 'A1' },
  { id: 2, seats: 2, label: 'A2' },
  { id: 3, seats: 4, label: 'B1' },
  { id: 4, seats: 2, label: 'B2' },
  { id: 5, seats: 4, label: 'C1' },
];

const BookTable = () => {
  return (
    <div className="layout-wrapper">
      {/* Left side photo like decor */}
      <div className="layout-photo">
        <img src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} alt="Restaurant" />
      </div>

      {/* Right side sketch layout */}
      <div className="layout-sketch">
        <h2 className="sketch-title">Reserve a Table</h2>

        <div className="table-sketch-zone">
          {tables.map((table) => (
            <div className="table-block" key={table.id}>
              <div className="table-circle">{table.label}</div>
              {[...Array(table.seats)].map((_, i) => (
                <div className="chair" key={i}></div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="legend">
          <div><span className="legend-box table-legend"></span> Table</div>
          <div><span className="legend-box chair-legend"></span> Chair</div>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
