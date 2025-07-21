'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import './OrdersPage.css';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchOrders = async () => {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
        setLoading(false);
      };
      fetchOrders();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return <div className="orders-page"><h1>Loading...</h1></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="orders-page">
        <h1>Please Log In</h1>
        <p>You need to be logged in to view your orders.</p>
        <Link href="/api/auth/signin" className="primary-btn">Log In</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h2>Order #{order.id}</h2>
                <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${parseFloat(order.totalAmount).toFixed(2)}</p>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.productId} className="order-item">
                    <img src={item.product.imageUrl} alt={item.product.name} />
                    <div>
                      <p>{item.product.name}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
