import { RecommendedRow } from '../components/RecommendedRow';
import { ForestBanner } from '../components/ForestBanner';
import { ProductCard } from '../components/ProductCard';
import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { fetchHomeStory, fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

const short = (s: string | null, n = 34) => (s && s.length > n ? `${s.slice(0, n)}…` : s ?? '');

export default function Home() {
  const { t, pick } = useLang();
  usePageTitle(t('home.title'));
  const story = useAsync(fetchHomeStory, []);
  const products = useAsync(() => fetchProducts(), []);
  const materials = story.data?.materials.slice(0, 3) ?? [];
  const steps = story.data?.processes.slice(0, 3) ?? [];
  const matType = (type: string) => {
    const key = `mat.${type}` as StringKey;
    return key === 'mat.natural_material' || key === 'mat.textile' ? t(key) : type;
  };

  return (
    <>
      <ForestBanner />

      {products.data && <RecommendedRow products={products.data} />}

      <section className="band band-white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t('home.collectionEyebrow')}</span>
            <h2>Living Artifacts</h2>
            <p>{t('home.collectionText')}</p>
          </div>
          {products.error && <p className="error">{t('common.loadError')}</p>}
          <div className="grid">{products.data?.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="band band-paper">
        <div className="container story-split">
          <div className="story-photo reveal">
            <img src="/stitch/fabric.jpg" alt={t('home.storyPhotoAlt')} loading="lazy" />
            <span>{t('home.studio')}</span>
          </div>
          <div className="story-card reveal">
            <h2>{t('nav.story')}</h2>
            <div className="story-cols">
              <p>{t('home.storyP1')}</p>
              <p>{t('home.storyP2')}</p>
            </div>
            <div className="story-foot"><span>{t('home.storyFoot1')}</span><strong>{t('home.storyFoot2')}</strong></div>
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t('home.cycleEyebrow')}</span>
            <h2>{t('home.cycleTitle')}</h2>
          </div>
          {story.error && <p className="error">{t('common.loadError')}</p>}
          <div className="cycle">
            <div className="callouts left">
              {materials.map((m) => (
                <div key={m.id} className="callout"><strong>{pick(m, 'name')}</strong><span>{matType(m.type)}</span></div>
              ))}
            </div>
            <div className="cycle-photo"><img src="/stitch/pots.jpg" alt="" loading="lazy" /></div>
            <div className="callouts right">
              {steps.map((s, i) => (
                <div key={s.id} className="callout"><strong>{`0${i + 1}`} {pick(s, 'name')}</strong><span>{short(pick(s, 'description'))}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
