'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../../../../admin/AddStorePage.css'; // Reusing styles for now

export default function EditOrderPage() {
  const [totalAmount, setTotalAmount] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await fetch(`/api/admin/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTotalAmount(data.totalAmount);
        setStatus(data.status);
      } else {
        console.error('Failed to fetch order');
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ totalAmount: parseFloat(totalAmount), status }),
    });

    if (response.ok) {
      router.push('/admin/orders');
    } else {
      console.error('Failed to update order');
    }
  };

  return (
    <div className="add-store-page">
      <h1>Edit Order</h1>
      <form onSubmit={handleSubmit} className="add-store-form">
        <div className="form-group">
          <label htmlFor="totalAmount">Total Amount</label>
          <input
            type="number"
            id="totalAmount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Update Order</button>
      </form>
    </div>
  );
}
