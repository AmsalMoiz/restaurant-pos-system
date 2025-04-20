import React from 'react';
import { Link } from 'react-router-dom';
import './navbarCustomer.css';

const NavbarCustomer = ({ customerName }) => {
  let storedName = customerName || "Customer";
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      storedName = parsedUser.name || storedName;
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
  }

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
        {/* IMPORTANT: Profile link for signed-in users */}
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default NavbarCustomer;
