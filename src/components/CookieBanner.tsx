import { useEffect, useState } from 'react';
import { setConsent } from '../lib/analytics';
import { useLang } from '../i18n/LangContext';

const KEY = 'ga-consent';

function read(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function write(v: string) {
  try { localStorage.setItem(KEY, v); } catch { /* storage blocked: choice lasts for this visit only */ }
}

export function CookieBanner() {
  const { t } = useLang();
  const [stored, setStored] = useState<string | null>(read);

  useEffect(() => {
    setConsent(stored === 'yes');
  }, [stored]);

  if (stored) return null;
  const choose = (v: 'yes' | 'no') => {
    write(v);
    setStored(v);
  };
  return (
    <div className="cookie-banner" role="dialog" aria-label={t('cookie.label')}>
      <span>{t('cookie.text')}</span>
      <button className="btn" onClick={() => choose('yes')}>{t('cookie.accept')}</button>
      <button className="btn btn-ghost" style={{ color: '#fff', borderColor: '#fff' }} onClick={() => choose('no')}>{t('cookie.decline')}</button>
    </div>
  );
}
