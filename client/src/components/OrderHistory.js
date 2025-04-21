import React from 'react';

const OrderHistory = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  if (!orders.length) {
    return <div style={{padding: 24}}>No orders yet.</div>;
  }

  return (
    <div style={{padding: 24}}>
      <h2>Order History</h2>
      <ul>
        {orders.map((order, idx) => (
          <li key={idx} style={{marginBottom: 16, background: "#222", padding: 12, borderRadius: 8}}>
            <div><b>Order #:</b> {order.orderNumber}</div>
            <div><b>Date:</b> {new Date(order.date).toLocaleString()}</div>
            <div><b>Total:</b> ${order.total}</div>
            <div>
              <b>Items:</b>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>{item.quantity}x {item.name}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
