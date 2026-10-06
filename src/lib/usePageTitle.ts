import { useEffect } from 'react';
import { useLang } from '../i18n/LangContext';

export function usePageTitle(title: string) {
  const { t } = useLang();
  const site = t('site.name');
  useEffect(() => {
    document.title = `${title} | ${site}`;
  }, [title, site]);
}
