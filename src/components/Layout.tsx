import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { CookieBanner } from './CookieBanner';
import { FallingLeaves } from './FallingLeaves';
import { Footer } from './Footer';
import { LangSwitch } from './LangSwitch';
import { StickyContact } from './StickyContact';

export type LayoutContext = { setProductName: (n?: string) => void };

const links: [string, StringKey][] = [
  ['/products', 'nav.products'],
  ['/our-story', 'nav.story'],
  ['/visit', 'nav.visit'],
  ['/contact', 'nav.contact'],
];

export function Layout() {
  const { t } = useLang();
  const [productName, setProductName] = useState<string>();
  return (
    <>
      <header className="site-header">
        <nav>
          <Link to="/" className="brand">
            <img src="/stitch/emblem.jpg" alt="" width={38} height={38} />
            <span><strong>{t('site.name')}</strong><small>{t('site.tagline')}</small></span>
          </Link>
          {links.map(([to, key]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {t(key)}
            </NavLink>
          ))}
          <LangSwitch />
        </nav>
      </header>
      <main>
        <Outlet context={{ setProductName } satisfies LayoutContext} />
      </main>
      <Footer />
      <StickyContact productName={productName} />
      <CookieBanner />
      <FallingLeaves />
    </>
  );
}
