"use client";
import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { FaUser, FaMapMarkerAlt, FaCity, FaMailBulk, FaGlobe, FaCreditCard, FaUserCircle, FaCalendarAlt, FaKey, FaLock } from 'react-icons/fa';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0; // Assuming free shipping for now
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="checkout-forms">
          <div className="shipping-form">
            <h2>Shipping Information</h2>
            <form>
              <div className="input-with-icon"><FaUser /><input type="text" placeholder="Full Name" required /></div>
              <div className="input-with-icon"><FaMapMarkerAlt /><input type="text" placeholder="Address" required /></div>
              <div className="input-with-icon"><FaCity /><input type="text" placeholder="City" required /></div>
              <div className="input-with-icon"><FaMailBulk /><input type="text" placeholder="Postal Code" required /></div>
              <div className="input-with-icon"><FaGlobe /><input type="text" placeholder="Country" required /></div>
            </form>
          </div>
          <div className="payment-form">
            <h2>Payment Details</h2>
            <form>
              <div className="input-with-icon"><FaCreditCard /><input type="text" placeholder="Card Number" required /></div>
              <div className="input-with-icon"><FaUserCircle /><input type="text" placeholder="Cardholder Name" required /></div>
              <div className="input-with-icon"><FaCalendarAlt /><input type="text" placeholder="MM/YY" required /></div>
              <div className="input-with-icon"><FaKey /><input type="text" placeholder="CVC" required /></div>
            </form>
          </div>
        </div>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
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
          <button className="primary-btn place-order-btn"><FaLock /> Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
