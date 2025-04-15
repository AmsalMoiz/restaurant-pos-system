import React, { useState } from 'react';
import './checkout.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cartItems = [], setCartItems }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
    address: '',
    zip: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

  const validate = () => {
    const newErrors = {};

    if (!form.holder.trim()) newErrors.holder = 'Card holder name is required';
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.number)) newErrors.number = 'Card number must be 16 digits';
    
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Use MM/YY format';
    } else {
      const [month, year] = form.expiry.split('/');
      const now = new Date();
      const input = new Date(`20${year}`, month - 1); // subtract 1 since months are 0-indexed
      if (input < now) newErrors.expiry = 'Expiry must be in the future';
    }

    if (!/^\d{3}$/.test(form.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!/^\d{5}$/.test(form.zip)) newErrors.zip = 'ZIP code must be 5 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    if (field === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }

    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSuccess(true);
    setCartItems([]);
    setTimeout(() => {
      navigate('/menu');
    }, 3000);
  };

   
  return (
    <>
      <Navbar />
      <div className="checkout-container">
        {success ? (
          <div className="success-popup">
            <h2><span role="img" aria-label="check">✅</span> Payment Successful!</h2>
            <p>Thank you for your order.</p>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 className="checkout-title">Checkout</h2>

            <label>Card Holder</label>
            <input
              type="text"
              value={form.holder}
              onChange={e => handleChange('holder', e.target.value)}
              placeholder="John Doe"
            />
            {errors.holder && <p className="error">{errors.holder}</p>}

            <label>Card Number</label>
            <input
              type="text"
              value={form.number}
              onChange={e => handleChange('number', e.target.value)}
              placeholder="1234 5678 9012 3456"
            />
            {errors.number && <p className="error">{errors.number}</p>}

            <div className="flex-row">
              <div className="half">
                <label>Expiration Date</label>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={e => handleChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                />
                {errors.expiry && <p className="error">{errors.expiry}</p>}
              </div>
              <div className="half">
                <label>CVV</label>
                <input
                  type="text"
                  value={form.cvv}
                  onChange={e => handleChange('cvv', e.target.value)}
                  placeholder="123"
                  maxLength={3}
                />
                {errors.cvv && <p className="error">{errors.cvv}</p>}
              </div>
            </div>

            <label>Billing Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="123 Main St, City, State"
            />
            {errors.address && <p className="error">{errors.address}</p>}

            <label>ZIP Code</label>
            <input
              type="text"
              value={form.zip}
              onChange={e => handleChange('zip', e.target.value)}
              placeholder="77004"
              maxLength={5}
            />
            {errors.zip && <p className="error">{errors.zip}</p>}

            <div className="total-display">
              Total: <strong>${total}</strong>
            </div>

            <button type="submit" className="pay-button">Pay Now</button>
          </form>
        )}
      </div>
    </>
  );
};

export default Checkout;
