import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { usePageTitle } from '../lib/usePageTitle';

// Google Drive file shared as "anyone with the link"; the /preview URL is the embeddable player.
const STORY_VIDEO = 'https://drive.google.com/file/d/1Xf_WcN904pE5hz2gLn15i0LUHvrgSyTd/preview';
// Chapters 1–6 use stills from the story video; chapter 7 is the real shop.
const CHAPTERS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  n, head: `story.s${n}h` as StringKey, body: `story.s${n}b` as StringKey, photo: `/photos/story-${n}.jpg`,
}));
const STATS: [StringKey, StringKey][] = [
  ['story.stat1n', 'story.stat1'], ['story.stat2n', 'story.stat2'], ['story.stat3n', 'story.stat3'], ['story.stat4n', 'story.stat4'],
];

export default function OurStory() {
  const { t } = useLang();
  usePageTitle(t('nav.story'));
  return (
    <>
      <section className="band band-paper story-hero">
        <div className="container">
          <span className="eyebrow">{t('story.subtitle')}</span>
          <h1>{t('story.title')}</h1>
          <p className="story-lead">{t('story.lead')}</p>
          <div className="story-video">
            <iframe src={STORY_VIDEO} title={t('story.video')} loading="lazy" allow="autoplay; fullscreen" allowFullScreen />
          </div>
          <dl className="story-stats">
            {STATS.map(([n, label]) => (
              <div key={n} className="reveal"><dt>{t(n)}</dt><dd>{t(label)}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band band-white">
        <ol className="container chapters">
          {CHAPTERS.map((c) => (
            <li key={c.n} className="chapter reveal">
              <figure className="chapter-photo"><img src={c.photo} alt="" loading="lazy" /></figure>
              <div className="chapter-text">
                <span className="chapter-num">{String(c.n).padStart(2, '0')}</span>
                <h2>{t(c.head)}</h2>
                <p>{t(c.body)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band-paper">
        <div className="container">
          <blockquote className="story-quote reveal">
            <p>{t('story.quote')}</p>
            <cite>{t('story.quoteBy')}</cite>
          </blockquote>
          <div className="story-cta reveal">
            <h2>{t('story.ctaTitle')}</h2>
            <div className="pill-row">
              <Link className="btn" to="/visit">{t('nav.visit')}</Link>
              <Link className="btn btn-ghost" to="/products">{t('common.allProducts')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
