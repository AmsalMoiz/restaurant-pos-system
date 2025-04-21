import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ onOpenSignupModal }) => {
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;
  const storedName = "Customer";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1
          className="navbar-logo"
          onClick={() => window.location.href = '/'}
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
        {/* Show Create Account button only if NOT logged in */}
        {!isLoggedIn && (
          <button
            className="create-account-btn"
            onClick={onOpenSignupModal}
            style={{
              marginLeft: "18px",
              background: "#E7CD78",
              color: "#222",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1.08em",
              padding: "8px 18px",
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(231,205,120,0.16)",
            }}
          >
            Create Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
