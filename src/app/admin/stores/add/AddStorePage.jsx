"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes } from 'react-icons/fa';
import '../../../../admin/AddStorePage.css';

const AddStorePage = () => {
  const [storeName, setStoreName] = useState('');
  const [storeStatus, setStoreStatus] = useState('Active');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend API
    console.log('New Store:', { storeName, storeStatus });
    alert(`Store '${storeName}' added successfully! (Mock Data)`);
    router.push('/admin/stores');
  };

  return (
    <div className="add-store-page">
      <h2>Add New Store</h2>
      <form onSubmit={handleSubmit} className="add-store-form">
        <div className="form-group">
          <label htmlFor="storeName">Store Name</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeStatus">Status</label>
          <select
            id="storeStatus"
            value={storeStatus}
            onChange={(e) => setStoreStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn save-btn"><FaSave /> Save Store</button>
          <button type="button" onClick={() => router.push('/admin/stores')} className="secondary-btn cancel-btn"><FaTimes /> Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddStorePage;
