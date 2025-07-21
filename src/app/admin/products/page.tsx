"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen, FaSearch, FaSort, FaSortUp, FaSortDown, FaTags } from 'react-icons/fa';
import '../../../admin/TableStyles.css';
import '../../../admin/ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Products';
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const statuses = useMemo(() => ['All', ...new Set(products.map(p => p.status))], [products]);

  const sortedAndFilteredProducts = useMemo(() => {
    let currentProducts = [...products];

    if (searchTerm) {
      currentProducts = currentProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterCategory !== 'All') {
      currentProducts = currentProducts.filter(p => p.category === filterCategory);
    }
    
    if (filterStatus !== 'All') {
      currentProducts = currentProducts.filter(p => p.status === filterStatus);
    }

    if (sortColumn) {
      currentProducts.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return currentProducts;
  }, [products, searchTerm, filterCategory, filterStatus, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedAndFilteredProducts]);

  const handleSort = (column) => {
    setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? paginatedProducts.map(p => p.id) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProducts();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected products?`)) {
      try {
        for (const id of selectedItems) {
          await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        }
        fetchProducts();
        setSelectedItems([]);
      } catch (error) {
        console.error('Error bulk deleting products:', error);
      }
    }
  };

  if (loading) {
    return <div className="admin-page"><h1>Loading Products...</h1></div>;
  }

  return (
    <div className="store-list-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title"><FaBoxOpen /> Products</h1>
          <p className="page-subtitle">Manage your product inventory and details.</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-controls-bar">
          <div className="search-filter-controls">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <FaTags className="filter-icon" />
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <FaTags className="filter-icon" />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>
          <div className="header-right">
            <Link href="/admin/products/new" className="add-new-btn"><FaPlus /> Add New Product</Link>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bulk-actions-bar">
            <span>{selectedItems.length} selected</span>
            <button onClick={handleBulkDelete} className="bulk-action-btn delete-btn">
              <FaTrash /> Delete Selected
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length > 0 && selectedItems.length === paginatedProducts.length} /></th>
                <th onClick={() => handleSort('name')} className="sortable">Product {getSortIcon('name')}</th>
                <th onClick={() => handleSort('category')} className="sortable">Category {getSortIcon('category')}</th>
                <th onClick={() => handleSort('price')} className="sortable">Price {getSortIcon('price')}</th>
                <th onClick={() => handleSort('stockQuantity')} className="sortable">Stock {getSortIcon('stockQuantity')}</th>
                <th onClick={() => handleSort('status')} className="sortable">Status {getSortIcon('status')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <tr key={product.id} className={selectedItems.includes(product.id) ? 'selected' : ''}>
                    <td><input type="checkbox" checked={selectedItems.includes(product.id)} onChange={() => handleSelectItem(product.id)} /></td>
                    <td className="product-image-cell">
                      <Image src={product.imageUrl} alt={product.name} className="product-thumbnail" width={50} height={50} />
                      {product.name}
                    </td>
                    <td>{product.category}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                    <td><span className={`status-badge ${product.status ? product.status.toLowerCase().replace(' ', '-') : ''}`}>{product.status}</span></td>
                    <td className="actions-cell">
                      <Link href={`/admin/products/edit/${product.id}`} className="action-btn"><FaEdit /> Edit</Link>
                      <button onClick={() => handleDelete(product.id)} className="action-btn delete-btn"><FaTrash /> Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="no-results">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-bottom-bar">
          <div className.items-per-page-group">
            <label htmlFor="itemsPerPage">Show:</label>
            <select id="itemsPerPage" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;