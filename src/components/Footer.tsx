import { Link } from 'react-router-dom';
import { ContactButtons } from './ContactButtons';
import { FacebookCard } from './FacebookCard';

export function Footer() {
  return (
    <footer className="site-footer" id="order">
      <div className="container">
        <h2>สั่งซื้อตรงจากช่างฝีมือ</h2>
        <p>งานทุกชิ้นทำมือเป็นล็อตเล็ก ทักมาคุยกับทีมช่างในชุมชนได้โดยตรง ทั้งสั่งทำพิเศษ ขนาด และการจัดส่ง</p>
        <ContactButtons />
        <FacebookCard />
        <div className="footer-meta">
          <span>© ขุนวินแม่วาง อ.แม่วาง เชียงใหม่ · <Link to="/our-story">เรื่องราวของเรา</Link> · <Link to="/visit">มาเยี่ยมชม</Link></span>
          <em>งานมือจากวัตถุดิบธรรมชาติ</em>
        </div>
      </div>
    </footer>
  );
}
