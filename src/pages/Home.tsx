import { RecommendedSpotlight } from '../components/RecommendedSpotlight';
import { ForestBanner } from '../components/ForestBanner';
import { MeetTheMakers } from '../components/MeetTheMakers';
import { CycleDiagram } from '../components/CycleDiagram';
import { useLang } from '../i18n/LangContext';
import { fetchHomeStory, fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

export default function Home() {
  const { t } = useLang();
  usePageTitle(t('home.title'));
  const story = useAsync(fetchHomeStory, []);
  const products = useAsync(() => fetchProducts(), []);
  const materials = story.data?.materials.slice(0, 3) ?? [];
  const steps = story.data?.processes.slice(0, 3) ?? [];

  return (
    <>
      <ForestBanner />

      {products.data && <RecommendedSpotlight products={products.data} />}

      {products.error && <div className="container"><p className="error">{t('common.loadError')}</p></div>}

      <section className="band band-paper">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t('home.cycleEyebrow')}</span>
            <h2>{t('home.cycleTitle')}</h2>
          </div>
          {story.error && <p className="error">{t('common.loadError')}</p>}
          <CycleDiagram materials={materials} steps={steps} />
        </div>
      </section>

      <MeetTheMakers />

      <section className="band band-paper">
        <div className="container story-split">
          <div className="story-photo reveal">
            <img src="/photos/shop-mannequins.jpg" alt={t('home.storyPhotoAlt')} loading="lazy" />
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
    </>
  );
}
