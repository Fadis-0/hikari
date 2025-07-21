'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../../../../admin/AddStorePage.css';

export default function EditStorePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchStore = async () => {
      const response = await fetch(`/api/admin/stores/${id}`);
      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setDescription(data.description);
      } else {
        console.error('Failed to fetch store');
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/admin/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      router.push('/admin/stores');
    } else {
      // Handle error
      console.error('Failed to update store');
    }
  };

  return (
    <div className="add-store-page">
      <h1>Edit Store</h1>
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
        <button type="submit" className="submit-btn">Update Store</button>
      </form>
    </div>
  );
}
