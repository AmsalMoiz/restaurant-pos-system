import React, { useState } from 'react';
import './checkout.css';
import Navbar from './Navbar';

const Checkout = () => {
  const [form, setForm] = useState({
    cardNumber: '',
    expDate: '',
    cvv: '',
    billingAddress: '',
    zip: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment info:', form);
    alert("Payment successful! 💳");
  };

  return (
    <>
      <Navbar />
      <div className="checkout-background">
        <div className="checkout-container">
          <h2 className="checkout-title">Checkout</h2>

          <form onSubmit={handleSubmit}>
            <label className="checkout-label">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              className="checkout-input"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
            />

            <div className="checkout-row">
              <div style={{ flex: 1 }}>
                <label className="checkout-label">Expiration Date</label>
                <input
                  type="text"
                  name="expDate"
                  className="checkout-input"
                  value={form.expDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="checkout-label">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  className="checkout-input"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                />
              </div>
            </div>

            <label className="checkout-label">Billing Address</label>
            <input
              type="text"
              name="billingAddress"
              className="checkout-input"
              value={form.billingAddress}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
            />

            <label className="checkout-label">ZIP Code</label>
            <input
              type="text"
              name="zip"
              className="checkout-input"
              value={form.zip}
              onChange={handleChange}
              placeholder="77004"
            />

            <button type="submit" className="checkout-btn">Pay Now</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
