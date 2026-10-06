import { useState } from 'react';
import { useLang } from '../i18n/LangContext';

// Sponsor credit. Shows public/sponsors/gsb.png when the official logo file is added, otherwise the bank's name as text.
export function SponsorBadge() {
  const { t } = useLang();
  const [logo, setLogo] = useState(true);
  return (
    <div className="sponsor">
      <span className="sponsor-label">{t('sponsor.label')}</span>
      {logo ? (
        <img src="/sponsors/gsb.png" alt={t('sponsor.gsb')} height={36} onError={() => setLogo(false)} />
      ) : (
        <strong>{t('sponsor.gsb')}</strong>
      )}
    </div>
  );
}
