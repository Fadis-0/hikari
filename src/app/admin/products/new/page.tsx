'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../../../admin/AddStorePage.css';

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [storeId, setStoreId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stores, setStores] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      const response = await fetch('/api/admin/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    };
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceValue = price ? parseFloat(price) : null;
    const stockValue = stockQuantity ? parseInt(stockQuantity) : null;

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        price: priceValue, 
        stockQuantity: stockValue, 
        storeId: parseInt(storeId), 
        description, 
        imageUrl 
      }),
    });

    if (response.ok) {
      router.push('/admin/products');
    } else {
      const errorData = await response.json();
      console.error('Failed to create product:', response.status, errorData);
      alert(`Failed to create product: ${errorData.message || response.statusText}`);
    }
  };

  return (
    <div className="add-store-page">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} className="add-store-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stockQuantity">Stock Quantity</label>
          <input
            type="number"
            id="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeId">Store</label>
          <select
            id="storeId"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            required
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Create Product</button>
      </form>
    </div>
  );
}