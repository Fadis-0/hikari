"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300.png?text=Image+Not+Found'; // Placeholder image
  };

  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-card-image" onError={handleImageError} />
        </div>
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="add-to-cart-container">
        <button onClick={() => addToCart(product)} className="primary-btn add-to-cart-btn"><FaShoppingCart /> Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;