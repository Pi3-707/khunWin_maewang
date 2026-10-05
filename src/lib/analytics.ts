declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

let consented = false;

function loadGA() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id || typeof document === 'undefined' || document.getElementById('ga4')) return;
  const s = document.createElement('script');
  s.id = 'ga4';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

export function setConsent(v: boolean) {
  consented = v;
  if (v) loadGA();
}

export function track(name: string, params?: Record<string, unknown>) {
  if (!consented) return;
  window.gtag?.('event', name, params);
}
