import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';

export default function NotFound({ message = 'ไม่พบหน้าที่ต้องการ' }: { message?: string }) {
  usePageTitle('ไม่พบหน้า');
  return (
    <div className="container">
      <h1>{message}</h1>
      <Link to="/products">ดูสินค้าทั้งหมด</Link>
    </div>
  );
}
