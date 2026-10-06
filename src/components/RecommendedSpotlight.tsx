import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { track } from '../lib/analytics';
import { categoryLabel } from '../lib/categories';
import { buildLineLink } from '../lib/contact';
import { formatPrice } from '../lib/format';
import type { ProductListItem } from '../lib/types';

// One large highlighted product next to a 2x2 block of smaller ones.
export function RecommendedSpotlight({ products }: { products: ProductListItem[] }) {
  const { lang, t, pick } = useLang();
  const items = products.filter((p) => p.cover_image_url).slice(0, 5);
  if (!items.length) return null;
  const [main, ...rest] = items;
  const mainName = pick(main, 'name') ?? main.name;

  return (
    <section className="band band-white">
      <div className="container">
        <div className="rec-head">
          <h2>{t('featured.label')}</h2>
          <Link to="/products" className="link-more">{t('featured.viewAll')}</Link>
        </div>
        <div className="spotlight">
          <article className="spot-main">
            <Link to={`/products/${main.id}`} className="spot-main-img">
              <img src={main.cover_image_url!} alt={mainName} />
              <span className="card-tag">{categoryLabel(main.category, lang)}</span>
            </Link>
            <div className="spot-main-body">
              <div className="card-title">
                <h3>{mainName}</h3>
                <span className="price">{formatPrice(main.reference_price, lang)}</span>
              </div>
              <p className="muted">{pick(main, 'story_summary') ?? pick(main, 'description')}</p>
              <div className="spot-actions">
                <a className="btn" href={buildLineLink(import.meta.env.VITE_LINE_OA_ID ?? '', mainName, lang)} target="_blank" rel="noopener noreferrer"
                  onClick={() => track('click_line', { product_name: main.name })}>{t('common.inquire')}</a>
                <Link to={`/products/${main.id}`} className="link-more">{t('common.details')}</Link>
              </div>
            </div>
          </article>
          <div className="spot-grid">
            {rest.map((p) => {
              const name = pick(p, 'name') ?? p.name;
              return (
                <Link key={p.id} to={`/products/${p.id}`} className="spot-small">
                  <img src={p.cover_image_url!} alt={name} loading="lazy" />
                  <strong>{name}</strong>
                  <span className="price">{formatPrice(p.reference_price, lang)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
