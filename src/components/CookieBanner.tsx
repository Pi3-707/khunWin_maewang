import { useEffect, useState } from 'react';
import { setConsent } from '../lib/analytics';

const KEY = 'ga-consent';

function read(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function write(v: string) {
  try { localStorage.setItem(KEY, v); } catch { /* storage blocked: choice lasts for this visit only */ }
}

export function CookieBanner() {
  const [stored, setStored] = useState<string | null>(read);

  useEffect(() => {
    setConsent(stored === 'yes');
  }, [stored]);

  if (stored) return null;
  const choose = (v: 'yes' | 'no') => {
    write(v);
    setStored(v);
  };
  return (
    <div className="cookie-banner" role="dialog" aria-label="คุกกี้">
      <span>เว็บไซต์นี้ใช้คุกกี้เพื่อวัดจำนวนผู้เข้าชม ยอมรับหรือไม่</span>
      <button className="btn" onClick={() => choose('yes')}>ยอมรับ</button>
      <button className="btn btn-ghost" style={{ color: '#fff', borderColor: '#fff' }} onClick={() => choose('no')}>ไม่ยอมรับ</button>
    </div>
  );
}
