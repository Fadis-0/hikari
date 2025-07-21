import React from 'react';
import './ProductCardSkeleton.css';

const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-text-container">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-price"></div>
      </div>
      <div className="skeleton-button"></div>
    </div>
  );
};

export default ProductCardSkeleton;
