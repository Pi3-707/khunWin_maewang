import { useState } from 'react';
import { ContactButtons } from '../components/ContactButtons';
import { FacebookCard } from '../components/FacebookCard';
import { useLang } from '../i18n/LangContext';
import { usePageTitle } from '../lib/usePageTitle';

export default function Contact() {
  const { t } = useLang();
  usePageTitle(t('nav.contact'));
  const [qr, setQr] = useState(true);
  return (
    <div className="container">
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.text')}</p>
      <ContactButtons />
      <div style={{ marginTop: 24, maxWidth: 420 }}><FacebookCard /></div>
      {qr && <img src="/line-qr.png" alt={t('contact.qrAlt')} width={200} height={200} onError={() => setQr(false)} style={{ marginTop: 24 }} />}
    </div>
  );
}
