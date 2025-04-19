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
    holder: '', number: '', expiry: '', cvv: '',
    street: '', city: '', state: '', zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [tipPercent, setTipPercent] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [taxRate] = useState(0.0825);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  //const [orderNumber, setOrderNumber] = useState('');
  const [receipt, setReceipt] = useState(null); // Store all receipt values together
  const [itemsPurchased, setItemsPurchased] = useState([]);

  // Helper for subtotal
  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Helper for tip percent
  const getTipRate = () =>
    tipPercent === 'custom'
      ? parseFloat(customTip || 0) / 100
      : tipPercent / 100;

  // Validation
  const validate = () => {
    if (paymentMethod !== 'card') return true;
    const newErrors = {};
    if (!form.holder.trim()) newErrors.holder = 'Card holder name is required';
    if (!/\d{4} \d{4} \d{4} \d{4}/.test(form.number)) newErrors.number = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Use MM/YY format';
    } else {
      const [month, year] = form.expiry.split('/');
      const now = new Date();
      const input = new Date(`20${year}`, month - 1);
      if (input < now) newErrors.expiry = 'Expiry must be in the future';
    }
    if (!/\d{3}/.test(form.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    if (!form.street.trim()) newErrors.street = 'Street is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!/\d{5}/.test(form.zip)) newErrors.zip = 'ZIP code must be 5 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input changes
  const handleChange = (field, value) => {
    if (field === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }
    if (field === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Discount
  const handleDiscountApply = () => {
    if (discountCode.trim().toUpperCase() === 'SWEET10') {
      setDiscountPercent(10);
      setDiscountMessage('✅ Code SWEET10 applied: 10% off!');
    } else {
      setDiscountPercent(0);
      setDiscountMessage('❌ Invalid discount code.');
    }
  };

  // Order number
  const generateOrderNumber = () => {
    const now = new Date();
    return 'SH-' + now.getTime().toString().slice(-6);
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Calculate values, rounding each to 2 decimals before summing
    const subtotal = Number(calculateSubtotal().toFixed(2));
    const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
    const taxedSubtotal = subtotal - discount;
    const tax = Number((taxedSubtotal * taxRate).toFixed(2));
    const tip = Number((taxedSubtotal * getTipRate()).toFixed(2));
    const total = Number((taxedSubtotal + tax + tip).toFixed(2));

    const newOrderNum = generateOrderNumber();

    setReceipt({
      orderNumber: newOrderNum,
      holder: form.holder,
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip,
      subtotal: subtotal.toFixed(2),
      discount: discountPercent > 0 ? `${discountPercent}%` : 'None',
      tax: tax.toFixed(2),
      tip: tip.toFixed(2),
      total: total.toFixed(2)
    });
    setItemsPurchased([...cartItems]);
    setSuccess(true);
    setCartItems([]);
    setDiscountCode('');
    setDiscountMessage('');
    setDiscountPercent(0);

    setTimeout(() => {
      navigate('/menu');
    }, 6000);
  };

  // Receipt download
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
      pdf.setTextColor(218, 165, 32);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sweet Heaven - Order Receipt', pageWidth / 2, 20, { align: 'center' });
      pdf.addImage(imgData, 'PNG', 15, 30, pageWidth - 30, imgHeight);
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Thank you for dining with us!', pageWidth / 2, imgHeight + 45, { align: 'center' });
      pdf.save(`SweetHeaven_Receipt_${receipt?.orderNumber || 'Order'}.pdf`);
    });
  };

  return (
    <>
      <Navbar />
      <div
        className="checkout-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${process.env.PUBLIC_URL}/images/restomainpic.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div className="checkout-glass">
          {success ? (
            <div className="success-popup">
              <h2>✅ Payment Successful!</h2>
              <p>Thank you for your order.</p>
              <div id="receipt-content" className="receipt-box pretty-receipt">
                <p><strong>Order #:</strong> {receipt?.orderNumber}</p>
                <p><strong>Cardholder:</strong> {receipt?.holder}</p>
                <p><strong>Billing Address:</strong> {receipt?.street}, {receipt?.city}, {receipt?.state} {receipt?.zip}</p>
                <p><strong>Subtotal:</strong> ${receipt?.subtotal}</p>
                <p><strong>Discount:</strong> {receipt?.discount}</p>
                <p><strong>Tax (8.25%):</strong> ${receipt?.tax}</p>
                <p><strong>Tip:</strong> ${receipt?.tip}</p>
                <p><strong>Total Paid:</strong> ${receipt?.total}</p>
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
              <p style={{ textAlign: 'center', marginTop: '-10px', fontSize: '13px', color: '#aaa' }}>
                Your information is secure
              </p>
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">💳 Credit/Debit Card</option>
                <option value="applepay">Apple Pay</option>
              </select>
              {paymentMethod === 'card' && (
                <>
                  <label>Card Holder</label>
                  <input type="text" value={form.holder} onChange={e => handleChange('holder', e.target.value)} placeholder="John Doe" />
                  {errors.holder && <p className="error">{errors.holder}</p>}
                  <label>Card Number</label>
                  <input type="text" value={form.number} onChange={e => handleChange('number', e.target.value)} placeholder="1234 5678 9012 3456" />
                  {errors.number && <p className="error">{errors.number}</p>}
                  <div className="flex-row">
                    <div className="half">
                      <label>Expiration Date</label>
                      <input type="text" value={form.expiry} onChange={e => handleChange('expiry', e.target.value)} placeholder="MM/YY" maxLength={5} />
                      {errors.expiry && <p className="error">{errors.expiry}</p>}
                    </div>
                    <div className="half">
                      <label>CVV</label>
                      <input type="text" value={form.cvv} onChange={e => handleChange('cvv', e.target.value)} placeholder="123" maxLength={3} />
                      {errors.cvv && <p className="error">{errors.cvv}</p>}
                    </div>
                  </div>
                </>
              )}
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
              <label>Discount Code</label>
              <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Enter code like SWEET10" />
              <button type="button" className="pay-button" onClick={handleDiscountApply}>Apply Code</button>
              {discountMessage && <p style={{ fontSize: '0.9em' }}>{discountMessage}</p>}
              <div className="total-display">
                <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                <p>Tax (8.25%): ${(Number((calculateSubtotal() - (calculateSubtotal() * (discountPercent / 100))) * taxRate).toFixed(2))}</p>
                <label style={{ marginTop: '10px' }}>Tip:</label>
                <select value={tipPercent} onChange={(e) => setTipPercent(e.target.value === 'custom' ? 'custom' : parseInt(e.target.value))}>
                  <option value={0}>None</option>
                  <option value={10}>10%</option>
                  <option value={15}>15%</option>
                  <option value={20}>20%</option>
                  <option value="custom">Custom</option>
                </select>
                {tipPercent === 'custom' && (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter tip %"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    style={{ marginTop: '5px', padding: '8px', width: '100%', borderRadius: '8px' }}
                  />
                )}
                <p>Tip Amount: ${(Number((calculateSubtotal() - (calculateSubtotal() * (discountPercent / 100))) * getTipRate()).toFixed(2))}</p>
              </div>
              <div className="total-display">
                Total: <strong>
                  {(() => {
                    const subtotal = Number(calculateSubtotal().toFixed(2));
                    const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
                    const taxedSubtotal = subtotal - discount;
                    const tax = Number((taxedSubtotal * taxRate).toFixed(2));
                    const tip = Number((taxedSubtotal * getTipRate()).toFixed(2));
                    const total = Number((taxedSubtotal + tax + tip).toFixed(2));
                    return `$${total.toFixed(2)}`;
                  })()}
                </strong>
              </div>
              <button type="submit" className="pay-button">
                {paymentMethod === 'applepay' ? 'Pay with Apple' : 'Pay Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );  
};

export default Checkout;
