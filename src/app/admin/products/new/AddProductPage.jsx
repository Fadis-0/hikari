"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes } from 'react-icons/fa';
import '../../../../admin/AddStorePage.css'; // Reusing the same CSS

const AddProductPage = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Product:', { productName, category, price, stock });
    alert(`Product '${productName}' added successfully! (Mock Data)`);
    router.push('/admin/products');
  };

  return (
    <div className="add-store-page">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-store-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Apparel">Apparel</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter stock quantity"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn save-btn"><FaSave /> Save Product</button>
          <button type="button" onClick={() => router.push('/admin/products')} className="secondary-btn cancel-btn"><FaTimes /> Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
