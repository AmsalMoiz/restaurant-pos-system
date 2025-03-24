function OrderConfirmation({ order, returnToMenu }) {
    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };
  
    const getEstimatedTime = () => {
      const pickup = order.customerInfo.deliveryMethod === 'pickup';
      const baseTime = pickup ? 20 : 45; // minutes
      
      // Random variation to make it seem more realistic
      const variation = Math.floor(Math.random() * 10);
      
      return `${baseTime + variation} minutes`;
    };
  
    return (
      <div className="confirmation-container">
        <div className="confirmation-box">
          <h2>Order Confirmed!</h2>
          <p className="confirmation-number">Order #{Math.floor(Math.random() * 10000)}</p>
          
          <div className="confirmation-details">
            <p>Thank you for your order, {order.customerInfo.name}!</p>
            <p>
              Your {order.customerInfo.deliveryMethod === 'pickup' ? 'pickup' : 'delivery'} will be ready in approximately {getEstimatedTime()}.
            </p>
            <p>Order placed: {formatDate(order.orderDate)}</p>
            
            {order.customerInfo.deliveryMethod === 'delivery' && (
              <div className="delivery-info">
                <h3>Delivery Address</h3>
                <p>{order.customerInfo.address.street}</p>
                <p>{order.customerInfo.address.city}, {order.customerInfo.address.zipCode}</p>
              </div>
            )}
            
            <div className="order-items">
              <h3>Order Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.quantity} × {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="payment-info">
              <h3>Payment Method</h3>
              <p>
                {order.paymentMethod === 'creditCard' 
                  ? 'Credit Card (paid)' 
                  : 'Pay at Restaurant'}
              </p>
            </div>
          </div>
          
          <div className="confirmation-actions">
            <p>A confirmation email has been sent to {order.customerInfo.email}</p>
            <button className="return-btn" onClick={returnToMenu}>
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default OrderConfirmation;