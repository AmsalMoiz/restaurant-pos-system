import React, { useState, useEffect } from 'react';
import './menu.css';
import Navbar from './Navbar';
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

const MenuTest = ({ cartItems, setCartItems }) => {
  const [desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDessert, setSelectedDessert] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Fetch menu items from the server when component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/menu`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setDesserts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCardClick = (dessert) => {
    setSelectedDessert(dessert);
    setQuantity(1);
    setNotes('');
  };

  const closeModal = () => {
    setSelectedDessert(null);
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...selectedDessert,
      price: Number(selectedDessert.price),
      quantity: Number(quantity),
      notes,
    };
  
    setCartItems([...cartItems, itemToAdd]);
    closeModal();
  
    setShowToast(true); // show toast
    setTimeout(() => setShowToast(false), 3000); // auto-hide after 3s
  };
  

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="menu-background" style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}>
          <div className="menu-overlay">
            <h1 className="menu-title">Our Signature Desserts</h1>
            <div className="loading-container">
              <p>Loading menu items...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="menu-background" style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}>
          <div className="menu-overlay">
            <h1 className="menu-title">Our Signature Desserts</h1>
            <div className="error-container">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="menu-background"
        style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}
      >
        <div className="menu-overlay">
          <h1 className="menu-title">Our Signature Desserts</h1>
          <div className="dessert-grid">
            {desserts.map((item, index) => (
              <div
                className="dessert-card"
                key={index}
                onClick={() => handleCardClick(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="dessert-img"
                />
                <h2 className="dessert-name">{item.name}</h2>
                <p className="dessert-description">{item.description}</p>
                <p className="dessert-price">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDessert && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/images/${selectedDessert.image}`}
              alt={selectedDessert.name}
              className="modal-img"
            />
            <h2>{selectedDessert.name}</h2>
            <p>${selectedDessert.price}</p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <textarea
              placeholder="Add notes (e.g. allergies, extra toppings)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            <div className="modal-buttons">
              <button onClick={handleAddToCart}>Add to your bag</button>
              <button onClick={closeModal} className="close-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <div className="toast-popup">
          ✅ Added to your bag with love 💕        
        </div>
      )}
    </>
  );
};

export default MenuTest;