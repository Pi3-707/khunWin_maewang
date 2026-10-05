import { track } from '../lib/analytics';

const FB_URL = import.meta.env.VITE_FB_URL ?? '';

// Details copied from the public Facebook page header.
export function FacebookCard() {
  return (
    <div className="fb-card">
      <p className="stamp">Facebook</p>
      <h3>วิสาหกิจชุมชนบ้านแม่มูตร</h3>
      <p className="muted">ร้านผ้าทอสีจากใบไม้ธรรมชาติ</p>
      <p className="muted">1 หมู่ 6 ต.แม่วิน อ.แม่วาง เชียงใหม่ 50360</p>
      {FB_URL && (
        <a className="btn" href={FB_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('click_facebook')}>
          เปิดเพจ Facebook
        </a>
      )}
    </div>
  );
}
