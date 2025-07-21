'use client';

import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaPlus, FaMinus, FaInfoCircle, FaListAlt, FaStar } from 'react-icons/fa';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const params = useParams();
  const id = params.id;
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setSelectedImage(data.imageUrl); // Set the main image
        } else {
          console.error("Failed to fetch product");
        }
      };
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Aether Store`;
    }
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
    alert(`${quantity} of ${product.name} added to cart!`);
  };

  const imageGallery = [product.imageUrl].filter(Boolean); // Use only the main image from API

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-gallery">
          <div className="main-image-container">
            <img src={selectedImage} alt={product.name} className="main-product-image" />
          </div>
          <div className="thumbnail-images">
            {imageGallery.map((image, index) => (
              <div
                key={index}
                className={`thumbnail-image-wrapper ${selectedImage === image ? 'active' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="thumbnail-image" />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          {/* Options like size and color are not in the current backend schema.
              This section is hidden until the schema is updated. */}

          <div className="quantity-selector">
            <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}><FaMinus /></button>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
            <button onClick={() => setQuantity(prev => prev + 1)}><FaPlus /></button>
          </div>

          <button onClick={handleAddToCart} className="primary-btn add-to-cart-btn"><FaShoppingCart /> Add to Cart</button>
        </div>
      </div>

      <div className="product-additional-details">
        <h3><FaInfoCircle /> Product Details</h3>
        <div className="detail-section">
          <p>Details about the product will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
