'use client';

import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Link from 'next/link';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import './CartPage.css';
import { useSession } from 'next-auth/react';

const CartPage = () => {
  const { cart, cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const { status } = useSession();

  if (status === 'loading') {
    return <div className="cart-page"><h1>Loading...</h1></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="cart-page empty-cart">
        <h1>Please Log In</h1>
        <p>You need to be logged in to view your cart.</p>
        <Link href="/api/auth/signin" className="primary-btn">Log In</Link>
      </div>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="primary-btn"><FaShoppingBag /> Start Shopping</Link>
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items-container">
          {cartItems.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h2>{item.product.name}</h2>
                <p>${parseFloat(item.product.price).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.productId)} className="remove-btn"><FaTrash /> Remove</button>
              </div>
              <div className="cart-item-quantity">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div className="cart-item-total">
                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="primary-btn checkout-btn">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
