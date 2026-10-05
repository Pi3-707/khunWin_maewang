import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { CookieBanner } from './CookieBanner';
import { Footer } from './Footer';
import { StickyContact } from './StickyContact';

export type LayoutContext = { setProductName: (n?: string) => void };

const links: [string, string][] = [
  ['/products', 'สินค้า'],
  ['/our-story', 'เรื่องราวของเรา'],
  ['/visit', 'มาเยี่ยมชม'],
  ['/contact', 'ติดต่อ'],
];

export function Layout() {
  const [productName, setProductName] = useState<string>();
  return (
    <>
      <header className="site-header">
        <nav>
          <Link to="/" className="brand">
            <img src="/stitch/emblem.jpg" alt="" width={38} height={38} />
            <span><strong>ขุนวินแม่วาง</strong><small>Living Craft • Mae Wang</small></span>
          </Link>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet context={{ setProductName } satisfies LayoutContext} />
      </main>
      <Footer />
      <StickyContact productName={productName} />
      <CookieBanner />
    </>
  );
}
