import React, { useEffect } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  useEffect(() => {
    document.title = 'Dashboard | Aether Admin';
  }, []);

  // Placeholder data for recent orders and top products
  const recentOrders = [
    { id: '#1001', customer: 'Alice Smith', amount: '$250.00', status: 'Completed' },
    { id: '#1002', customer: 'Bob Johnson', amount: '$120.50', status: 'Pending' },
    { id: '#1003', customer: 'Charlie Brown', amount: '$500.00', status: 'Shipped' },
    { id: '#1004', customer: 'Diana Prince', amount: '$75.00', status: 'Completed' },
  ];

  const topProducts = [
    { id: 'P001', name: 'Wireless Headphones', sales: '150 units' },
    { id: 'P002', name: 'Smartwatch X', sales: '120 units' },
    { id: 'P003', name: 'Portable Bluetooth Speaker', sales: '90 units' },
  ];

  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="icon-bg"><i className="fas fa-dollar-sign"></i></div>
          <h2>Total Revenue</h2>
          <p>$125,678</p>
        </div>
        <div className="stat-card sales">
          <div className="icon-bg"><i className="fas fa-shopping-bag"></i></div>
          <h2>Total Sales</h2>
          <p>1,234</p>
        </div>
        <div className="stat-card customers">
          <div className="icon-bg"><i className="fas fa-users"></i></div>
          <h2>New Customers</h2>
          <p>56</p>
        </div>
        <div className="stat-card orders">
          <div className="icon-bg"><i className="fas fa-clipboard-list"></i></div>
          <h2>Pending Orders</h2>
          <p>12</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Orders</h3>
        <ul className="recent-list">
          {recentOrders.map(order => (
            <li key={order.id}>
              <span>{order.id} - {order.customer}</span>
              <span>{order.amount} <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Top Products</h3>
        <ul className="top-products-list">
          {topProducts.map(product => (
            <li key={product.id}>
              <span>{product.name}</span>
              <span>{product.sales}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
