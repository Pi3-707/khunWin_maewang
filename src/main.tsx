import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { LangProvider } from './i18n/LangContext';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
    {/* Cookieless page-view counts on Vercel; does nothing until Web Analytics is enabled for the project. */}
    <Analytics />
  </StrictMode>,
);
