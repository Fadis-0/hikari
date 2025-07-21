"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaShoppingCart, FaSearch, FaSort, FaSortUp, FaSortDown, FaUser, FaTags, FaCalendarAlt } from 'react-icons/fa';
import TableSkeleton from '../components/TableSkeleton';
import '../products/ProductListPage.css';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Orders';
    const fetchOrders = async () => {
      setLoading(true);
      // Replace with actual API call
      const response = await new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => initialOrders }), 1500));
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const statuses = useMemo(() => ['All', ...new Set(orders.map(o => o.status))], []);

  const sortedAndFilteredOrders = useMemo(() => {
    let currentOrders = [...orders];

    if (searchTerm) {
      currentOrders = currentOrders.filter(o => o.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterStatus !== 'All') {
      currentOrders = currentOrders.filter(o => o.status === filterStatus);
    }

    if (sortColumn) {
      currentOrders.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return currentOrders;
  }, [orders, searchTerm, filterStatus, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedAndFilteredOrders]);

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
    setSelectedItems(e.target.checked ? paginatedOrders.map(o => o.id) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    setOrders(prev => prev.filter(o => !selectedItems.includes(o.id)));
    setSelectedItems([]);
  };

  return (
    <div className="store-list-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title"><FaShoppingCart /> Orders</h1>
          <p className="page-subtitle">Track and manage customer orders.</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-controls-bar">
          <div className="search-filter-controls">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by customer..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
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
            <Link href="/admin/orders/new" className="add-new-btn"><FaPlus /> Add New Order</Link>
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

        {loading ? (
          <TableSkeleton columns={7} rows={itemsPerPage} />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length > 0 && selectedItems.length === paginatedOrders.length} /></th>
                  <th onClick={() => handleSort('id')} className="sortable">Order ID {getSortIcon('id')}</th>
                  <th onClick={() => handleSort('customer')} className="sortable"><FaUser /> Customer {getSortIcon('customer')}</th>
                  <th onClick={() => handleSort('date')} className="sortable"><FaCalendarAlt/> Date {getSortIcon('date')}</th>
                  <th onClick={() => handleSort('total')} className="sortable">Total {getSortIcon('total')}</th>
                  <th onClick={() => handleSort('status')} className="sortable">Status {getSortIcon('status')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map(order => (
                    <tr key={order.id} className={selectedItems.includes(order.id) ? 'selected' : ''}>
                      <td><input type="checkbox" checked={selectedItems.includes(order.id)} onChange={() => handleSelectItem(order.id)} /></td>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td className="actions-cell">
                        <button className="action-btn">View</button>
                        <button className="action-btn"><FaTrash /> Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="no-results">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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



export default OrderListPage;
