import React, { useState } from 'react';
import './checkout.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const Checkout = ({ cartItems = [], setCartItems }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [finalTotal, setFinalTotal] = useState('');
  const [itemsPurchased, setItemsPurchased] = useState([]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.holder.trim()) newErrors.holder = 'Card holder name is required';
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.number)) newErrors.number = 'Card number must be 16 digits';

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Use MM/YY format';
    } else {
      const [month, year] = form.expiry.split('/');
      const now = new Date();
      const input = new Date(`20${year}`, month - 1);
      if (input < now) newErrors.expiry = 'Expiry must be in the future';
    }

    if (!/^\d{3}$/.test(form.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    if (!form.street.trim()) newErrors.street = 'Street is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
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

  const generateOrderNumber = () => {
    const now = new Date();
    return 'SH-' + now.getTime().toString().slice(-6);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrderNum = generateOrderNumber();
    const totalBeforeClear = calculateTotal();

    setOrderNumber(newOrderNum);
    setFinalTotal(totalBeforeClear);
    setItemsPurchased([...cartItems]); // Save copy before clearing
    setSuccess(true);
    setCartItems([]);

    setTimeout(() => {
      navigate('/menu');
    }, 6000);
  };

  const handleDownloadReceipt = () => {
    const input = document.getElementById('receipt-content');

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, imgHeight + 20, 'F');

      pdf.setFontSize(18);
      pdf.setTextColor(218, 165, 32); // golden
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sweet Heaven - Order Receipt', pageWidth / 2, 20, { align: 'center' });

      pdf.addImage(imgData, 'PNG', 15, 30, pageWidth - 30, imgHeight);

      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Thank you for dining with us!', pageWidth / 2, imgHeight + 45, { align: 'center' });

      pdf.save(`SweetHeaven_Receipt_${orderNumber}.pdf`);
    });
  };

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        {success ? (
          <div className="success-popup">
            <h2>✅ Payment Successful!</h2>
            <p>Thank you for your order.</p>

            <div id="receipt-content" className="receipt-box pretty-receipt">
              <p><strong>Order #:</strong> {orderNumber}</p>
              <p><strong>Cardholder:</strong> {form.holder}</p>
              <p><strong>Billing Address:</strong> {form.street}, {form.city}, {form.state} {form.zip}</p>
              <p><strong>Total Paid:</strong> ${finalTotal}</p>

              <h4 style={{ marginTop: '20px' }}>🍰 Items Purchased</h4>
              <ul className="receipt-items">
                {itemsPurchased.map((item, index) => (
                  <li key={index}>
                    {item.quantity}x {item.name} - ${Number(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <button className="download-btn" onClick={handleDownloadReceipt}>Download Receipt</button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 className="checkout-title gold-text">Checkout</h2>

            {/* Card Info */}
            <label>Card Holder</label>
            <input type="text" value={form.holder} onChange={e => handleChange('holder', e.target.value)} placeholder="John Doe" />
            {errors.holder && <p className="error">{errors.holder}</p>}

            <label>Card Number</label>
            <input type="text" value={form.number} onChange={e => handleChange('number', e.target.value)} placeholder="1234 5678 9012 3456" />
            {errors.number && <p className="error">{errors.number}</p>}

            <div className="flex-row">
              <div className="half">
                <label>Expiration Date</label>
                <input type="text" value={form.expiry} onChange={e => handleChange('expiry', e.target.value)} placeholder="MM/YY" />
                {errors.expiry && <p className="error">{errors.expiry}</p>}
              </div>
              <div className="half">
                <label>CVV</label>
                <input type="text" value={form.cvv} onChange={e => handleChange('cvv', e.target.value)} placeholder="123" maxLength={3} />
                {errors.cvv && <p className="error">{errors.cvv}</p>}
              </div>
            </div>

            {/* Billing Info */}
            <label>Street Address</label>
            <input type="text" value={form.street} onChange={e => handleChange('street', e.target.value)} placeholder="123 Main St" />
            {errors.street && <p className="error">{errors.street}</p>}

            <label>City</label>
            <input type="text" value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder="Austin" />
            {errors.city && <p className="error">{errors.city}</p>}

            <label>State</label>
            <select value={form.state} onChange={e => handleChange('state', e.target.value)}>
              <option value="">-- Select State --</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="error">{errors.state}</p>}

            <label>ZIP Code</label>
            <input type="text" value={form.zip} onChange={e => handleChange('zip', e.target.value)} placeholder="77004" maxLength={5} />
            {errors.zip && <p className="error">{errors.zip}</p>}

            {/* Total */}
            <div className="total-display">
              Total: <strong>${calculateTotal()}</strong>
            </div>

            <button type="submit" className="pay-button">Pay Now</button>
          </form>
        )}
      </div>
    </>
  );
};

export default Checkout;
