import { useLang } from '../i18n/LangContext';
import type { Lang } from '../i18n/lang';

const OPTIONS: [Lang, string][] = [['th', 'TH'], ['en', 'EN']];

export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label={t('lang.label')}>
      {OPTIONS.map(([l, label]) => (
        <button key={l} type="button" aria-pressed={lang === l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
          {label}
        </button>
      ))}
    </div>
  );
}
