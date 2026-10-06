import { buildLineLink, buildMessengerLink, buildTelLink } from '../lib/contact';
import { track } from '../lib/analytics';
import { useLang } from '../i18n/LangContext';

const LINE = import.meta.env.VITE_LINE_OA_ID ?? '';
const FB = import.meta.env.VITE_FB_PAGE ?? '';
const PHONE = import.meta.env.VITE_PHONE ?? '';

export function ContactButtons({ productName }: { productName?: string }) {
  const { lang, t } = useLang();
  const params = productName ? { product_name: productName } : undefined;
  return (
    <div className="contact-buttons">
      <a className="btn btn-line" href={buildLineLink(LINE, productName, lang)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_line', params)}>LINE</a>
      <a className="btn btn-ghost" href={buildMessengerLink(FB)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_facebook', params)}>Messenger</a>
      <a className="btn btn-ghost" href={buildTelLink(PHONE)} onClick={() => track('click_phone', params)}>{t('common.call')}</a>
    </div>
  );
}
