import React from 'react';
import './cart.css'; // Cart-specific styles
import Navbar from './Navbar';

const Cart = ({ cartItems, setCartItems }) => {
  const handleRemove = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, i) => i !== indexToRemove);
    setCartItems(updatedCart);
  };

  return (
    <>
      <Navbar />
      <div
        className="menu-background"
        style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}
      >
        <div className="menu-overlay">
          <h1 className="menu-title">Your Cart</h1>
          {cartItems.length === 0 ? (
            <p style={{ color: '#eee', textAlign: 'center' }}>
              Your cart is currently empty.
            </p>
          ) : (
            <div className="cart-list">
              {cartItems.map((item, index) => (
                <div className="cart-item" key={index}>
                  <img
                    src={`/images/${item.image}`}
                    alt={item.name}
                    className="cart-img-small"
                  />

                  <div className="cart-details">
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <p>Note: {item.notes || "None"}</p>
                    <p className="cart-price-small">${item.price}</p>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => handleRemove(index)}
                  >
                    Remove Item
                  </button>
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
