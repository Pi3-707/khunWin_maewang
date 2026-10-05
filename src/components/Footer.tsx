import { Link } from 'react-router-dom';
import { FacebookCard } from './FacebookCard';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="brand-lg">ขุนวินแม่วาง</p>
          <p className="muted">งานคราฟต์ที่เล่าเรื่องของป่า ผู้คน และช้าง</p>
          <p>
            <Link to="/products">สินค้า</Link> · <Link to="/our-story">เรื่องราวของเรา</Link> ·{' '}
            <Link to="/visit">มาเยี่ยมชม</Link> · <Link to="/contact">ติดต่อ</Link>
          </p>
        </div>
        <FacebookCard />
      </div>
    </footer>
  );
}
