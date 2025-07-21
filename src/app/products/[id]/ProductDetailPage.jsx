"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { products } from '../../../data/products';
import { CartContext } from '../../../context/CartContext';
import { FaShoppingCart, FaPlus, FaMinus, FaInfoCircle, FaListAlt, FaStar } from 'react-icons/fa';
import '../ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const productData = products.find(p => p.id === parseInt(id));

  // Mock data for demonstration if productData doesn't have these properties
  const product = productData ? {
    ...productData,
    images: productData.images || [
      productData.imageUrl,
      'https://images.unsplash.com/photo-1542291026-79eddc9cdfd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec148e20b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    ],
    sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
    colors: productData.colors || [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blue', hex: '#007bff' },
      { name: 'Red', hex: '#dc3545' },
    ],
    details: productData.details || [
      'Material: 100% Premium Cotton',
      'Care Instructions: Machine wash cold, tumble dry low',
      'Origin: Made in Vietnam',
      'Weight: 200 GSM',
    ],
    specifications: productData.specifications || {
      'Brand': 'hikari',
      'Model': 'Classic Tee',
      'SKU': 'AET-CT-001',
      'Warranty': '1 Year Limited',
    },
    reviews: productData.reviews || [
      { rating: 5, author: 'Customer A', text: 'Amazing quality and perfect fit!' },
      { rating: 4, author: 'Customer B', text: 'Good product, a bit slow on shipping.' },
    ],
  } : null;

  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.hex);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Aether Store`;
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
    alert(`${quantity} of ${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) added to cart!`);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-gallery">
          <div className="main-image-container">
            <img src={selectedImage} alt={product.name} className="main-product-image" />
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
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
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="product-options">
            {product.sizes && product.sizes.length > 0 && (
              <div className="option-group">
                <label>Size:</label>
                <div className="size-options">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="option-group">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-swatch ${selectedColor === color.hex ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #ccc' : 'none' }}
                      onClick={() => setSelectedColor(color.hex)}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
          {product.details && product.details.map((detail, index) => (
            <p key={index}>{detail}</p>
          ))}
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="detail-section">
            <h3><FaListAlt /> Specifications</h3>
            <ul>
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="customer-reviews">
          <h3><FaStar /> Customer Reviews ({product.reviews.length})</h3>
          {product.reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <p className="review-author">{review.author}</p>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
