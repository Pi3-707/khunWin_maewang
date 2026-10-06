import { useLang } from '../i18n/LangContext';
import { track } from '../lib/analytics';
import { buildMessengerLink } from '../lib/contact';
import { PinIcon } from './Icons';

const FB_URL = import.meta.env.VITE_FB_URL ?? '';
const FB_PAGE = import.meta.env.VITE_FB_PAGE ?? '';

// Shop details, logo and cover copied from the public Facebook page.
export function FacebookCard() {
  const { t } = useLang();
  return (
    <div className="fb-card">
      <div className="fb-cover" style={{ backgroundImage: 'url(/fb/cover.jpg)' }} aria-hidden="true" />
      <div className="fb-body">
        <img className="fb-logo" src="/fb/logo.png" alt={t('fb.logoAlt')} width={84} height={84} loading="lazy" />
        <span className="eyebrow">Facebook</span>
        <h3>วิสาหกิจชุมชนบ้านแม่มูตร</h3>
        <p className="muted">ร้านผ้าทอสีจากใบไม้ธรรมชาติ</p>
        <p className="fb-address"><PinIcon /> 1 หมู่ 6 ต.แม่วิน อ.แม่วาง เชียงใหม่ 50360</p>
        <div className="fb-actions">
          {FB_URL && (
            <a className="btn" href={FB_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('click_facebook')}>{t('fb.open')}</a>
          )}
          {FB_PAGE && (
            <a className="btn btn-ghost" href={buildMessengerLink(FB_PAGE)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_facebook')}>{t('fb.message')}</a>
          )}
        </div>
      </div>
    </div>
  );
}
