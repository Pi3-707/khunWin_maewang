import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ContactButtons } from '../components/ContactButtons';
import type { LayoutContext } from '../components/Layout';
import { useLang } from '../i18n/LangContext';
import { track } from '../lib/analytics';
import { categoryLabel } from '../lib/categories';
import { availabilityLabel, formatPrice } from '../lib/format';
import { coverUrl } from '../lib/product';
import { fetchProduct } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { lang, t, pick } = useLang();
  const { id = '' } = useParams();
  const { setProductName } = useOutletContext<LayoutContext>();
  const { data: p, error, loading } = useAsync(() => fetchProduct({ id }), [id]);
  const name = p ? pick(p, 'name') ?? p.name : null;
  usePageTitle(name ?? t('nav.products'));

  useEffect(() => {
    if (!p || !name) return;
    setProductName(name);
    track('view_product', { product_name: p.name });
    return () => setProductName(undefined);
  }, [p, name, setProductName]);

  if (loading) return <div className="container"><p>{t('common.loading')}</p></div>;
  if (error) return <div className="container"><p className="error">{t('common.loadError')}</p></div>;
  if (!p || !name) return <NotFound message={t('notFound.product')} />;

  const gallery = [...p.product_images].sort((a, b) => a.display_order - b.display_order);
  const story = (['introduction', 'origin_story', 'value_story'] as const).map((f) => pick(p.story, f)).filter(Boolean) as string[];
  const makers = p.artisans.map((a) => pick(a, 'name')).join(', ') || t('detail.makersDefault');
  const description = pick(p, 'description');
  return (
    <>
      <section className="detail-band">
        <div className="container">
          <div>
            <span className="eyebrow">{categoryLabel(p.category, lang)} • {availabilityLabel(p.availability, lang)}</span>
            <h1>{name}</h1>
            <p className="price">{formatPrice(p.reference_price, lang)}</p>
          </div>
          <img src={coverUrl(p)} alt={name} />
        </div>
      </section>

      <div className="container">
        <span className="eyebrow">{t('detail.philosophy')}</span>
        <h2>{pick(p.story, 'title') ?? t('detail.storyDefault')}</h2>
        {description && <p>{description}</p>}
        {story.map((s) => <p key={s}>{s}</p>)}

        <div className="stats">
          <div className="stat"><span className="eyebrow">{t('detail.materials')}</span><strong>{p.materials.map((m) => pick(m, 'name')).join(', ') || '—'}</strong></div>
          <div className="stat"><span className="eyebrow">{t('detail.status')}</span><strong>{availabilityLabel(p.availability, lang)}</strong></div>
          <div className="stat"><span className="eyebrow">{t('detail.makers')}</span><strong>{makers}</strong></div>
        </div>

        {p.processes.length > 0 && (
          <section>
            <span className="eyebrow">{t('detail.how')} • {p.processes.length} {t('detail.steps')}</span>
            <ol className="steps">
              {p.processes.map((s, i) => (
                <li key={s.id}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{pick(s, 'name')}</strong>
                  {pick(s, 'description') && <p>{pick(s, 'description')}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {p.elephants.length > 0 && (
          <section>
            <span className="eyebrow">{t('detail.elephants')}</span>
            {p.elephants.map((e) => (
              <p key={e.id}><strong>{pick(e, 'name')}</strong>{e.age_years ? ` · ${e.age_years} ${t('detail.years')}` : ''}{pick(e, 'description') ? ` — ${pick(e, 'description')}` : ''}</p>
            ))}
          </section>
        )}

        {gallery.length > 0 && (
          <section>
            <span className="eyebrow">{t('detail.gallery')}</span>
            <div className="grid">{gallery.map((g) => <img key={g.url} src={g.url} alt={name} loading="lazy" style={{ borderRadius: 12 }} />)}</div>
          </section>
        )}

        <section style={{ margin: '32px 0' }}>
          <span className="eyebrow">{t('footer.title')}</span>
          <ContactButtons productName={name} />
          {p.channels.length > 0 && (
            <div className="contact-buttons" style={{ marginTop: 10 }}>
              {p.channels.map((c) => (
                <a key={c.id} className="btn btn-ghost" href={c.url} target="_blank" rel="noopener noreferrer">{pick(c, 'name')}</a>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
