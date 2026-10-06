import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { CATEGORY_LABEL, DUNG_GROUP, filterCategories, parseFilter, type Filter } from '../lib/categories';
import { fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

const TOP: [Filter | '', StringKey][] = [['', 'filter.all'], ['ecoprint', 'filter.ecoprint'], ['dung', 'filter.dung']];

export default function Products() {
  const { lang, t } = useLang();
  usePageTitle(t('nav.products'));
  const [params, setParams] = useSearchParams();
  const filter = parseFilter(params.get('category'));
  const inDung = filter === 'dung' || DUNG_GROUP.includes(filter as never);
  const { data, error, loading } = useAsync(() => fetchProducts(filterCategories(filter)), [filter]);
  const pick = (v: Filter | '') => {
    const next = new URLSearchParams(params);
    if (v) next.set('category', v); else next.delete('category');
    setParams(next);
  };
  const isTop = (v: Filter | '') => (v === 'dung' ? inDung : (filter ?? '') === v);

  return (
    <section className="band band-white">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('home.collectionEyebrow')}</span>
          <h1>Living Artifacts</h1>
          <p>{t('products.text')}</p>
        </div>
        <div className="filters">
          {TOP.map(([v, key]) => (
            <button key={v} className={`btn ${isTop(v) ? '' : 'btn-ghost'}`} onClick={() => pick(v)}>{t(key)}</button>
          ))}
        </div>
        {inDung && (
          <div className="filters sub-filters">
            {DUNG_GROUP.map((c) => (
              <button key={c} className={`btn ${filter === c ? '' : 'btn-ghost'}`} onClick={() => pick(filter === c ? 'dung' : c)} title={lang === 'th' ? CATEGORY_LABEL[c] : undefined}>
                {t(`sub.${c}` as StringKey)}
              </button>
            ))}
          </div>
        )}
        {loading && <p>{t('common.loading')}</p>}
        {error && <p className="error">{t('common.loadError')}</p>}
        {data && data.length === 0 && <p>{t('products.empty')}</p>}
        <div className="grid">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </section>
  );
}
