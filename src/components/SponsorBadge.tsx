import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { BankIcon } from './Icons';

// Sponsor strip. Shows public/sponsors/gsb.png once the official logo is added; until then an icon and the bank's name.
export function SponsorBadge() {
  const { t } = useLang();
  const [logo, setLogo] = useState(true);
  return (
    <div className="sponsor-strip">
      <span className="sponsor-label">{t('sponsor.label')}</span>
      <div className="sponsor-card">
        {logo ? (
          <img src="/sponsors/gsb.png" alt={t('sponsor.gsb')} height={44} onError={() => setLogo(false)} />
        ) : (
          <>
            <span className="sponsor-icon"><BankIcon /></span>
            <strong>{t('sponsor.gsb')}</strong>
          </>
        )}
      </div>
    </div>
  );
}
