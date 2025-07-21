"use client";
import React, { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    if (status === 'authenticated') {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [status]);

  const addToCart = async (product) => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        quantity: product.quantity || 1,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setCart(data);
    }
  };

  const removeFromCart = async (productId) => {
    const response = await fetch('/api/cart/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (response.ok) {
      // Refetch cart to get the updated state
      fetchCart();
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    const response = await fetch('/api/cart/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (response.ok) {
      // Refetch cart to get the updated state
      fetchCart();
    }
  };

  const flattenedCartItems = cart?.items.map(item => ({
    ...item.product,
    quantity: item.quantity,
    cartId: item.cartId,
  })) ?? [];

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: flattenedCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};