import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from './apiService';

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const parsedCustomer = JSON.parse(customerData);
      setCustomer(parsedCustomer);
      fetchOrders(parsedCustomer.customer_id);
    } else {
      // Redirect to login if not logged in
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  const fetchOrders = async (customerId) => {
    try {
      setLoading(true);
      const orders = await apiService.getCustomerOrders(customerId);
      setOrders(orders);
    } catch (error) {
      setError('Failed to load order history. Please try again later.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="orders-container">Loading order history...</div>;
  }

  if (error) {
    return (
      <div className="orders-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => customer && fetchOrders(customer.customer_id)}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Order History</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{formatDate(order.timestamp)}</p>
                </div>
                <div className="order-total">
                  <span>Total: ${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="order-items">
                <h4>Items Ordered</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;