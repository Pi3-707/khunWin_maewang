import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { usePageTitle } from '../lib/usePageTitle';

export default function NotFound({ message }: { message?: string }) {
  const { t } = useLang();
  usePageTitle(t('notFound.title'));
  return (
    <div className="container">
      <h1>{message ?? t('notFound.page')}</h1>
      <Link to="/products">{t('common.allProducts')}</Link>
    </div>
  );
}
