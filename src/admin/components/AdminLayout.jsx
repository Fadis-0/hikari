"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaStore, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h1 className="admin-logo">Hikari</h1>
        <nav className="admin-nav">
          <Link href="/admin/products" className={pathname === '/admin/products' ? 'active' : ''}>
            <FaBoxOpen /> Products
          </Link>
          <Link href="/admin/orders" className={pathname === '/admin/orders' ? 'active' : ''}>
            <FaShoppingCart /> Orders
          </Link>
          <Link href="/admin/stores" className={pathname.startsWith('/admin/stores') ? 'active' : ''}>
            <FaStore /> Stores
          </Link>
          <Link href="/"><FaHome /> Exit to Store</Link>
        </nav>
      </aside>
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;