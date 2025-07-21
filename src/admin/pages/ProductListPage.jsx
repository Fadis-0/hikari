import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen, FaSearch, FaSort, FaSortUp, FaSortDown, FaBuilding, FaTags, FaEllipsisV, FaShoppingCart } from 'react-icons/fa';
import '../TableStyles.css';
import './ProductListPage.css';

// Enhanced mock data
const initialProducts = [
  { id: 1, name: 'Classic Tee', category: 'Apparel', price: 24.99, stock: 150, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y290dG9uJTIwdGVlJTIwc2hpcnR8ZW58MHx8MHx8fDA%3D' },
  { id: 2, name: 'Running Sneakers', category: 'Footwear', price: 89.99, stock: 75, status: 'In Stock', image: 'https://i.imgur.com/sC0ztOB.jpeg' },
  { id: 3, name: 'Leather Backpack', category: 'Accessories', price: 120.00, stock: 30, status: 'In Stock', image: 'https://plus.unsplash.com/premium_photo-1723649902616-0dce94980e06?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHVyYmFuJTIwYmFja3BhY2t8ZW58MHx8MHx8fDA%3D' },
  { id: 4, name: 'Slim Fit Jeans', category: 'Apparel', price: 64.50, stock: 0, status: 'Out of Stock', image: 'https://plus.unsplash.com/premium_photo-1690820317745-770eb6a3ee67?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFNsaW0lMjBGaXQlMjBEZW5pbSUyMEplYW5zfGVufDB8fDB8fHww' },
  { id: 5, name: 'Aviator Sunglasses', category: 'Accessories', price: 45.00, stock: 120, status: 'In Stock', image: 'https://plus.unsplash.com/premium_photo-1681487982472-555f97d80234?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V2F5ZmFyZXIlMjBTdW5nbGFzc2VzfGVufDB8fDB8fHww' },
  { id: 6, name: 'Winter Parka', category: 'Apparel', price: 199.99, stock: 25, status: 'Low Stock', image: 'https://plus.unsplash.com/premium_photo-1697183203082-1adbab812ea9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UGFya2F8ZW58MHx8MHx8fDA%3D' },
  { id: 7, name: 'Hiking Boots', category: 'Footwear', price: 150.00, stock: 40, status: 'In Stock', image: 'https://images.unsplash.com/photo-1631287381310-925554130169?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SGlraW5nJTIwQm9vdHN8ZW58MHx8MHx8fDA%3D' },
  { id: 8, name: 'Beanie Hat', category: 'Accessories', price: 19.99, stock: 200, status: 'In Stock', image: 'https://media.istockphoto.com/id/174963873/photo/warm-winter-hat.webp?a=1&b=1&s=612x612&w=0&k=20&c=n8C5C6WmxPNf6V18TgpKAcjbDEY3xfdj4-dRDB1FHWE=' },
];


const ProductListPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    document.title = 'Products';
  }, []);

  const categories = useMemo(() => ['All', ...new Set(initialProducts.map(p => p.category))], []);
  const statuses = useMemo(() => ['All', ...new Set(initialProducts.map(p => p.status))], []);

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

  const handleBulkDelete = () => {
    setProducts(prev => prev.filter(p => !selectedItems.includes(p.id)));
    setSelectedItems([]);
  };

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
            <Link to="/admin/products/new" className="add-new-btn"><FaPlus /> Add New Product</Link>
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
                <th onClick={() => handleSort('stock')} className="sortable">Stock {getSortIcon('stock')}</th>
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
                      <img src={product.image} alt={product.name} className="product-thumbnail" />
                      {product.name}
                    </td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td><span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>{product.status}</span></td>
                    <td className="actions-cell">
                      <button className="action-btn"><FaEdit /> Edit</button>
                      <button className="action-btn"><FaTrash /> Delete</button>
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
          <div className="items-per-page-group">
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
