"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaStore, FaSearch, FaSort, FaSortUp, FaSortDown, FaUser, FaBuilding, FaTags, FaEllipsisV } from 'react-icons/fa';
import '../../../admin/TableStyles.css';
import '../../../admin/StoreListPage.css';

const StoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOwner, setFilterOwner] = useState('All');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Stores';
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else {
        console.error('Failed to fetch stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
    setLoading(false);
  };

  const owners = useMemo(() => ['All', ...new Set(stores.map(s => s.ownerId))], [stores]);

  const sortedAndFilteredStores = useMemo(() => {
    let currentStores = [...stores];

    if (searchTerm) {
      currentStores = currentStores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.ownerId.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      currentStores = currentStores.filter(store => store.status === filterStatus);
    }
    
    if (filterOwner !== 'All') {
      currentStores = currentStores.filter(store => store.ownerId.toString() === filterOwner);
    }

    if (sortColumn) {
      currentStores.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return currentStores;
  }, [stores, searchTerm, filterStatus, filterOwner, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedAndFilteredStores.length / itemsPerPage);
  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredStores.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedAndFilteredStores]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(paginatedStores.map(s => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        const response = await fetch(`/api/admin/stores/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchStores(); // Re-fetch stores after successful deletion
        } else {
          console.error('Failed to delete store');
        }
      } catch (error) {
        console.error('Error deleting store:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected stores?`)) {
      try {
        // Assuming your API supports bulk delete or you iterate and delete
        for (const id of selectedItems) {
          await fetch(`/api/admin/stores/${id}`, { method: 'DELETE' });
        }
        fetchStores(); // Re-fetch stores after successful deletion
        setSelectedItems([]);
      } catch (error) {
        console.error('Error bulk deleting stores:', error);
      }
    }
  };
  
  const handleBulkStatusChange = (status) => {
    // This would require an API endpoint to update status for multiple stores
    console.log(`Bulk changing status to ${status} for:`, selectedItems);
    // For now, just update locally
    setStores(prev => prev.map(s => 
      selectedItems.includes(s.id) ? { ...s, status } : s
    ));
    setSelectedItems([]);
  };

  if (loading) {
    return <div className="admin-page"><h1>Loading Stores...</h1></div>;
  }

  return (
    <div className="store-list-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title"><FaStore /> Stores</h1>
          <p className="page-subtitle">Manage your retail locations and vendor partnerships.</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-controls-bar">
          <div className="search-filter-controls">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or owner..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <FaTags className="filter-icon" />
              <select
                id="statusFilter"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="filter-group">
              <FaUser className="filter-icon" />
              <select
                id="ownerFilter"
                value={filterOwner}
                onChange={(e) => {
                  setFilterOwner(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {owners.map(owner => <option key={owner} value={owner}>{owner}</option>)}
              </select>
            </div>
          </div>
          <div className="header-right">
            <Link href="/admin/stores/add" className="add-new-btn"><FaPlus /> Add New Store</Link>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bulk-actions-bar">
            <span>{selectedItems.length} selected</span>
            <button onClick={handleBulkDelete} className="bulk-action-btn delete-btn">
              <FaTrash /> Delete Selected
            </button>
            <button onClick={() => handleBulkStatusChange('Active')} className="bulk-action-btn">
              Set to Active
            </button>
            <button onClick={() => handleBulkStatusChange('Inactive')} className="bulk-action-btn">
              Set to Inactive
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedItems.length > 0 && selectedItems.length === paginatedStores.length}
                  />
                </th>
                <th onClick={() => handleSort('name')} className="sortable">
                  <FaBuilding /> Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('ownerId')} className="sortable">
                  <FaUser /> Owner ID {getSortIcon('ownerId')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStores.length > 0 ? (
                paginatedStores.map(store => (
                  <tr key={store.id} className={selectedItems.includes(store.id) ? 'selected' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(store.id)}
                        onChange={() => handleSelectItem(store.id)}
                      />
                    </td>
                    <td>{store.name}</td>
                    <td>{store.ownerId}</td>
                    <td><span className={`status-badge ${store.status ? store.status.toLowerCase() : ''}`}>{store.status}</span></td>
                    <td className="actions-cell">
                      <Link href={`/admin/stores/edit/${store.id}`} className="action-btn"><FaEdit /> Edit</Link>
                      <button onClick={() => handleDelete(store.id)} className="action-btn delete-btn"><FaTrash /> Delete</button>
                      <button className="action-btn"><FaEllipsisV /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No stores found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-bottom-bar">
          <div className="items-per-page-group">
            <label htmlFor="itemsPerPage">Show:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
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

export default StoreListPage;
