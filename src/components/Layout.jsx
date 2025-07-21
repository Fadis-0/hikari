"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { CartContext } from '../context/CartContext';
import './Layout.css';

const Layout = ({ children }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { cartItems } = useContext(CartContext);
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="store-logo">
            <h1><Link href="/">Hikari</Link></h1>
          </div>
          <nav className="main-nav">
            <div className="auth-links">
              <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
              <Link href="/products" className={pathname.startsWith('/products') ? 'active' : ''}>Products</Link>
              <Link href="/cart" className={pathname === '/cart' ? 'active' : ''}>
                Cart ({cartItems.length})
              </Link>
              {status === 'authenticated' && (
                <Link href="/orders" className={pathname === '/orders' ? 'active' : ''}>Orders</Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin/stores" className="admin-link">Admin</Link>
              )}
              {status === 'authenticated' && (
                <button onClick={() => signOut()} className="logout-btn">Logout</button>
              )}
              {status !== 'authenticated' && (
                <>
                  <Link href="/login" className="login-btn">Login</Link>
                  <Link href="/register" className="register-btn">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; 2024 MyStore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
