import { Navigate, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { fetchProduct } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import NotFound from './NotFound';

export default function QrRedirect() {
  const { t } = useLang();
  const { qr = '' } = useParams();
  const { data, loading, error } = useAsync(() => fetchProduct({ qr }), [qr]);
  if (loading) return <div className="container"><p>{t('common.loading')}</p></div>;
  if (error || !data) return <NotFound message={t('notFound.product')} />;
  return <Navigate to={`/products/${data.id}`} replace />;
}
