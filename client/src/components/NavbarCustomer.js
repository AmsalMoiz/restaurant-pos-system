import React from 'react';
import { Link } from 'react-router-dom';
import './navbarCustomer.css';

const NavbarCustomer = ({ customerName }) => {
  const storedName = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : customerName || "Customer";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1
          className="navbar-logo"
          onClick={() => window.location.href = '/customer-dashboard'}
          style={{ cursor: 'pointer' }}
        >
          Sweet Heaven, Welcome {storedName}
        </h1>
      </div>
      <div className="navbar-right">
        <Link to="/menu">Menu</Link>
        <Link to="/book-table">Reservations</Link> 
        <Link to="/cart">Bag</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default NavbarCustomer;
