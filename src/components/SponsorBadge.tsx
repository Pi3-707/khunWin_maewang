import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { BankIcon } from './Icons';

// Credits for the footer's bottom row: the sponsor (public/sponsors/gsb.png when present, else an icon and the name)
// and CAMT, Chiang Mai University, whose students built the site.
export function SponsorBadge() {
  const { t } = useLang();
  const [logo, setLogo] = useState(true);
  return (
    <span className="sponsors">
      <span className="sponsor">
        <span className="sponsor-label">{t('sponsor.label')}</span>
        {logo ? (
          <img src="/sponsors/gsb.png" alt={t('sponsor.gsb')} height={30} onError={() => setLogo(false)} />
        ) : (
          <span className="sponsor-name"><BankIcon /> {t('sponsor.gsb')}</span>
        )}
      </span>
      <a className="sponsor" href="https://www.camt.cmu.ac.th/" target="_blank" rel="noopener noreferrer">
        <span className="sponsor-label">{t('sponsor.builtBy')}</span>
        <img src="/sponsors/camt.svg" alt={t('sponsor.camt')} height={30} />
      </a>
    </span>
  );
}
