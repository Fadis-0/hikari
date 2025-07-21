'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../../admin/AddStorePage.css';

export default function AddStorePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/admin/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      router.push('/admin/stores');
    } else {
      const errorData = await response.json();
      console.error('Failed to create store:', response.status, errorData);
      alert(`Failed to create store: ${errorData.message || response.statusText}`);
    }
  };

  return (
    <div className="add-store-page">
      <h1>Add New Store</h1>
      <form onSubmit={handleSubmit} className="add-store-form">
        <div className="form-group">
          <label htmlFor="name">Store Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Create Store</button>
      </form>
    </div>
  );
}
