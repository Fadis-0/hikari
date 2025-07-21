'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes } from 'react-icons/fa';
import '../../../../admin/AddStorePage.css'; // Reusing the same CSS

const AddOrderPage = () => {
  const [totalAmount, setTotalAmount] = useState('');
  const [status, setStatus] = useState('Processing');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: parseFloat(totalAmount), status }),
      });

      if (response.ok) {
        alert(`Order added successfully!`);
        router.push('/admin/orders');
      } else {
        console.error('Failed to add order');
        alert('Failed to add order. Please try again.');
      }
    } catch (error) {
      console.error('Error adding order:', error);
      alert('An error occurred while adding the order.');
    }
  };

  return (
    <div className="add-store-page">
      <h2>Add New Order</h2>
      <form onSubmit={handleSubmit} className="add-store-form">
        <div className="form-group">
          <label htmlFor="totalAmount">Total Amount</label>
          <input
            type="number"
            id="totalAmount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="Enter order total amount"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn save-btn"><FaSave /> Save Order</button>
          <button type="button" onClick={() => router.push('/admin/orders')} className="secondary-btn cancel-btn"><FaTimes /> Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddOrderPage;