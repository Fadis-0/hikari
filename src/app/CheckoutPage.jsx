'use client';

import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaLock } from 'react-icons/fa';
import './CheckoutPage.css';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to add your publishable key to your .env.local file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cart, cartItems } = useContext(CartContext);

  if (!cart || cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Your cart is empty.</h1>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
  const shipping = 0; // Assuming free shipping for now
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="checkout-summary-only">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.productId} className="summary-item">
                <span className="item-name">{item.product.name} (x{item.quantity})</span>
                <span className="item-price">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="primary-btn place-order-btn">
            <FaLock /> Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
