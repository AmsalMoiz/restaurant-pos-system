import React from 'react';
import './placeOrder.css'; // ✅ lowercase

const PlaceOrder = () => {
  return (
    <div className="order-wrapper">
      <h1 className="order-title">Your Dessert Order</h1>

      <div className="order-card">
        <img src="/images/nuageAuCaramel.jpg" alt="Nuage au Caramel" />
        <div className="order-details">
          <h2>Nuage au Caramel</h2>
          <p>$11</p>
          <input type="number" min="1" defaultValue="1" />
          <textarea placeholder="Notes (optional)" />
        </div>
      </div>

      <button className="confirm-btn">Confirm Order</button>
    </div>
  );
};

export default PlaceOrder;
