import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { BankIcon } from './Icons';

// Compact sponsor credit for the footer's bottom row. Shows public/sponsors/gsb.png when present, else an icon and the name.
export function SponsorBadge() {
  const { t } = useLang();
  const [logo, setLogo] = useState(true);
  return (
    <span className="sponsor">
      <span className="sponsor-label">{t('sponsor.label')}</span>
      {logo ? (
        <img src="/sponsors/gsb.png" alt={t('sponsor.gsb')} height={30} onError={() => setLogo(false)} />
      ) : (
        <span className="sponsor-name"><BankIcon /> {t('sponsor.gsb')}</span>
      )}
    </span>
  );
}
