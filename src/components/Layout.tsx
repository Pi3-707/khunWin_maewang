import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { StickyContact } from './StickyContact';

export type LayoutContext = { setProductName: (n?: string) => void };

const links: [string, string][] = [
  ['/', 'หน้าแรก'],
  ['/products', 'สินค้า'],
  ['/our-story', 'เรื่องราวของเรา'],
  ['/visit', 'มาเยี่ยมชมชุมชน'],
  ['/contact', 'ติดต่อ'],
];

export function Layout() {
  const [productName, setProductName] = useState<string>();
  return (
    <>
      <header className="site-header">
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet context={{ setProductName } satisfies LayoutContext} />
      </main>
      <StickyContact productName={productName} />
    </>
  );
}
