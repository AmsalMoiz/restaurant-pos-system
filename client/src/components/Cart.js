import React from 'react';
import './cart.css';
import Navbar from './Navbar';

const Cart = ({ cartItems, setCartItems }) => {
  const handleRemove = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, i) => i !== indexToRemove);
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((acc, item) => {
      const price = Number(item.price);
      const qty = Number(item.quantity);
      return acc + (isNaN(price * qty) ? 0 : price * qty);
    }, 0);

    return total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <Navbar />
      <div
        className="menu-background"
        style={{ backgroundImage: "url('/images/restomainpic.jpg')" }}
      >
        <div className="menu-overlay">
          <h1 className="menu-title">Your Bag</h1>

          {cartItems.length === 0 ? (
            <p style={{ color: '#eee', textAlign: 'center' }}>
              Your bag is currently empty.
            </p>
          ) : (
            <>
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
                      <p className="cart-price-small">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </p>
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

              <div className="cart-checkout-box">
                <p className="checkout-total">Total: ${calculateTotal()}</p>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
