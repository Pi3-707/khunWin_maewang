import { Navigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import NotFound from './NotFound';

export default function QrRedirect() {
  const { qr = '' } = useParams();
  const { data, loading, error } = useAsync(() => fetchProduct({ qr }), [qr]);
  if (loading) return <div className="container"><p>กำลังโหลด…</p></div>;
  if (error || !data) return <NotFound message="ไม่พบสินค้านี้" />;
  return <Navigate to={`/products/${data.id}`} replace />;
}
