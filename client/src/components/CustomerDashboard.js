import React, { useEffect, useState } from 'react';
import './customerDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import NavbarCustomer from './NavbarCustomer';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

const CustomerDashboard = ({ customerName }) => {
  const navigate = useNavigate();
  const [itemName, setItemName] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleItemImage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/customer/image`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setItemName(data.name);
        setItemImage(data.image);
        setError(null);
      } catch (err) {
        console.error("Error fetching single item name and image:", err);
        setError("Failed to load item image. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleItemImage();
  }, []);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const firstName = user?.name?.split(" ")[0] || "Guest";

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <>
      <NavbarCustomer customerName={customerName} />
      <div
        className="home-background"
        style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}
      >
        <div className="hero-overlay">
          {/* SECTION 1 */}
          <div className="hero-band">
            <div className="hero-content">
              <p className="subtitle">Intimate dining restaurant</p>
              <h1 className="main-title">Sweet Heaven</h1>
              <div className="hours-section">
                <div className="hours-grid">
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, idx) => (
                    <div className="hours-column" key={idx}>
                      <div className="day">{day}</div>
                      <div className="time">
                        {[
                          "5:00 PM – 9:00 PM",
                          "5:00 PM – 10:00 PM",
                          "5:00 PM – 10:00 PM",
                          "5:00 PM – 10:00 PM",
                          "5:00 PM – 10:00 PM",
                          "5:00 PM – 12:00 AM",
                          "5:00 PM – 12:00 AM"
                        ][idx]}
                      </div>
                      <div className="underline"></div>
                    </div>
                  ))}
                </div>
                <p className="note">
                  Reservations are limited to <span>2 hours</span> • No parties over <span>6</span>
                </p>
              </div>
            </div>
          </div>
          {/* SECTION 2 */}
          <div className="menu-preview-section">
            <div className="menu-preview-overlay">
              <div className="menu-preview-content">
                <div className="menu-text">
                  <p className="menu-subtitle">Taste the mood</p>
                  <h2 className="menu-heading">Our Menu</h2>
                  <p className="menu-description">
                    Reserve now at Sweet Heaven — an indulgent dessert and cocktail experience
                    inspired by timeless international flavors. Delight in artisanal sweets,
                    signature libations, and impeccable service in a setting of understated elegance.
                  </p>
                  <div className="menu-buttons">
                    <Link to="/book-table" className="menu-btn outlined">Reserve your table</Link>
                    <Link to="/menu" className="menu-btn filled">View Menu</Link>
                  </div>
                </div>
                <div className="menu-image">
                  {itemImage && <img src={itemImage} alt={itemName} />} {/* conflicted because this is a DB project, but for one image on a page that just sits there, it almost makes sense to statically get it, i will do db approach tho as db will have under 100 item images and img is in KBs */}
                  {!itemImage && error && <p className="error-message">{error}</p>}
                  {!itemImage && !error && loading && <p>Loading image...</p>}
                  {!itemImage && !error && !loading && <p>Image could not be loaded</p>}
                </div>
              </div>
            </div>
          </div>
          {/* SECTION 3 */}
          <div className="hero-final-band">
            <h2 className="final-title">We look forward to having you dine with us</h2>
            <div className="final-details">
              <span>
                <i className="fas fa-map-marker-alt"></i>
                <strong>Find us at:</strong> 3458 Seraphina Avenue, Lower Westside, NY 10219
              </span>
              <span>
                <i className="fas fa-phone-alt"></i>
                <strong>Call us on:</strong> +1 (212) 555-9874
              </span>
            </div>
            <div className="final-button">
              <Link to="/book-table">{firstName}, reserve your table now!</Link>
            </div>
            <div className="final-logo">SH</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;
