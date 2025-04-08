import React from 'react';
import './bookTable.css';

const BookTable = () => {
  return (
    <div className="reservation-screen">
      <div className="reservation-left">
        <img 
          src={`${process.env.PUBLIC_URL}/images/tablerestocloseup.jpg`} 
          alt="Restaurant Interior" 
          className="reservation-image"
        />
      </div>
      <div className="reservation-right">
        <h1 className="reservation-title">Reserve Your Table</h1>
        <div className="table-sketch">
        </div>
      </div>
    </div>
  );
};

export default BookTable;
