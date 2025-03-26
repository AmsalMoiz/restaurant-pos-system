import React from 'react';
import './menu.css'; // Reuse the same classy styles
import Navbar from './Navbar';

const Cart = ({ cartItems }) => {
  return (
    <>
      <Navbar />
  
      <div className="menu-background" style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}>
        <div className="menu-overlay">
          <h1 className="menu-title">Your Cart</h1>
          {cartItems.length === 0 ? (
            <p style={{ color: '#eee', textAlign: 'center' }}>Your cart is currently empty.</p>
          ) : (
            <div className="dessert-grid">
              {cartItems.map((item, index) => (
                <div className="dessert-card" key={index}>
                  <img src={`/images/${item.image}`} alt={item.name} className="dessert-img" />
                  <h2 className="dessert-name">{item.name}</h2>
                  <p className="dessert-description">Qty: {item.quantity}</p>
                  <p className="dessert-description">Note: {item.notes || "None"}</p>
                  <p className="dessert-price">{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
  
};

export default Cart;
