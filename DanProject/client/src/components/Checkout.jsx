import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from './apiService';

function Checkout({ cartItems, total, placeOrder, goBack }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    deliveryMethod: 'pickup',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Load customer data on component mount
  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const parsedCustomer = JSON.parse(customerData);
      setCustomer(parsedCustomer);
      
      // Pre-fill form with customer data
      setFormData(prevData => ({
        ...prevData,
        name: parsedCustomer.customer_name || '',
        phone: parsedCustomer.customer_phone_num || '',
        email: parsedCustomer.customer_email || ''
      }));
    } else {
      // Redirect to login if not logged in
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customer) {
      setError('You must be logged in to place an order.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare order data for API
      const orderData = {
        customerId: customer.customer_id,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: total,
        total: total, // You could calculate tax or apply discounts here
        discountId: null // No discount in this example
      };
      
      // Create the order in the database
      const result = await apiService.createOrder(orderData);
      
      if (result.success) {
        // Send order data to parent component
        placeOrder({
          items: cartItems,
          total,
          customerInfo: {
            name: customer.customer_name,
            phone: customer.customer_phone_num,
            email: customer.customer_email,
            deliveryMethod: formData.deliveryMethod,
            address: formData.deliveryMethod === 'delivery' ? {
              street: formData.address,
              city: formData.city,
              zipCode: formData.zipCode
            } : null
          },
          paymentMethod: formData.paymentMethod,
          orderDate: new Date()
        });
      }
    } catch (error) {
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return <div className="checkout-container">Loading...</div>;
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-items">
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.quantity} × {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h3>Delivery Method</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={formData.deliveryMethod === 'pickup'}
                onChange={handleChange}
              />
              Pickup
            </label>
            <label>
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={formData.deliveryMethod === 'delivery'}
                onChange={handleChange}
              />
              Delivery
            </label>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled
            />
            <small>From your account profile</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled
            />
            <small>From your account profile</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
            <small>From your account profile</small>
          </div>
        </div>
        
        {formData.deliveryMethod === 'delivery' && (
          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required={formData.deliveryMethod === 'delivery'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required={formData.deliveryMethod === 'delivery'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required={formData.deliveryMethod === 'delivery'}
              />
            </div>
          </div>
        )}
        
        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={formData.paymentMethod === 'creditCard'}
                onChange={handleChange}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="payAtRestaurant"
                checked={formData.paymentMethod === 'payAtRestaurant'}
                onChange={handleChange}
              />
              Pay at Restaurant
            </label>
          </div>
        </div>
        
        {formData.paymentMethod === 'creditCard' && (
          <div className="form-section">
            <h3>Card Details</h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX XXXX"
                required={formData.paymentMethod === 'creditCard'}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardExpiry">Expiry Date</label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required={formData.paymentMethod === 'creditCard'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardCvv">CVV</label>
                <input
                  type="text"
                  id="cardCvv"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleChange}
                  placeholder="XXX"
                  required={formData.paymentMethod === 'creditCard'}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" className="back-btn" onClick={goBack}>
            Back to Cart
          </button>
          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );}

  export default Checkout;