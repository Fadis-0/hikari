'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './AdminLayout.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <Link href="/admin/stores" className={pathname === '/admin/stores' ? 'active' : ''}>Stores</Link>
          <Link href="/admin/products" className={pathname === '/admin/products' ? 'active' : ''}>Products</Link>
          <Link href="/admin/orders" className={pathname === '/admin/orders' ? 'active' : ''}>Orders</Link>
          <Link href="/" className="back-to-site">Back to Site</Link>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
