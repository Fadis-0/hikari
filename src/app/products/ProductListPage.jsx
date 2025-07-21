"use client";
import React, { useState, useMemo } from 'react';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import './ProductListPage.css';

const ProductListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))], []);
  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))], []);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = (minPrice === '' || product.price >= parseFloat(minPrice)) && (maxPrice === '' || product.price <= parseFloat(maxPrice));
      const matchesRating = product.rating >= minRating;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
    });
  }, [searchTerm, selectedCategories, selectedBrands, minPrice, maxPrice, minRating]);

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
      </div>

      <div className="page-main-content">
        <div className="sidebar">
          <h2><FaFilter /> Filters</h2>

          <div className="filter-group">
            <ul className="category-list">
              {allCategories.map(category => (
                <li key={category}>
                  <label>
                    <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <ul className="category-list">
              {allBrands.map(brand => (
                <li key={brand}>
                  <label>
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <div className="price-range-inputs">
              <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0" />
              <span>-</span>
              <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0" />
            </div>
          </div>

          <div className="filter-group">
            <div className="rating-filter">
              {[4, 3, 2, 1].map(star => (
                <button key={star} className={`rating-button ${minRating >= star ? 'active' : ''}`} onClick={() => setMinRating(minRating === star ? 0 : star)}>
                  {star} <FaStar /> & Up
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-list-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="no-products-found">No products found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
