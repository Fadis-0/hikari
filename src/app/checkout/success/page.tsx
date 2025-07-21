'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import './CheckoutSuccessPage.css';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Here you could clear the cart, but the webhook on the backend already does that.
    // You might want to trigger a refetch of the cart context if it's not automatically updated.
  }, []);

  return (
    <div className="checkout-success-page">
      <div className="success-container">
        <h1>Payment Successful!</h1>
        <p>Thank you for your order. You will receive a confirmation email shortly.</p>
        <Link href="/orders" className="primary-btn">View Your Orders</Link>
        <Link href="/" className="secondary-btn">Continue Shopping</Link>
      </div>
    </div>
  );
}
