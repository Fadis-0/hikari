import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        order,
      });

      if (searchTerm) {
        params.append('q', searchTerm);
      }
      if (filterCategory !== 'All') {
        params.append('category', filterCategory);
      }
      if (minPrice) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice);
      }

      try {
        const response = await fetch(`/api/products?${params.toString()}`);
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

    const debounceFetch = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [sortBy, order, searchTerm, filterCategory, minPrice, maxPrice]);

  const categories = useMemo(() => {
    if (products.length === 0) return ['All'];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return ['All', ...uniqueCategories];
  }, [products]);

  return (
    <div className="product-list-page">
      <div className="page-top-bar">
        <div className="search-bar-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            className="top-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-options">
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
            {order === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          </button>
        </div>
      </div>

      <div className="page-main-content">
        <div className="sidebar">
          <h2><FaFilter /> Filters</h2>
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
            />
          </div>
        </div>

        <div className="product-list-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
          ) : products.length > 0 ? (
            products.map(product => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="no-products-found">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;