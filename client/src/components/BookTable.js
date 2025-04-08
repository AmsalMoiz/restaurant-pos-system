import React from 'react';
import './bookTable.css';

const tables = [
  { id: 1, seats: 2 },
  { id: 2, seats: 4 },
  { id: 3, seats: 2 },
  { id: 4, seats: 4 },
  { id: 5, seats: 2 },
];

const BookTable = () => {
  return (
    <div
      className="book-table-wrapper"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '40px',
      }}
    >
      <div className="booking-background">
        <h1 className="booking-title">Reserve Your Table</h1>
        <div className="table-layout">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`table table-${table.seats}`}
            >
              <div className="table-top">Table {table.id}</div>
              {Array.from({ length: table.seats }).map((_, i) => (
                <div key={i} className="chair" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookTable;
