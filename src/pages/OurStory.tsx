import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { usePageTitle } from '../lib/usePageTitle';

// Google Drive file shared as "anyone with the link"; the /preview URL is the embeddable player.
const STORY_VIDEO = 'https://drive.google.com/file/d/1MqfeHWtN68PjJKCKotYhJTmsqatrOTot/preview';
const SECTIONS = [1, 2, 3, 4, 5, 6, 7].map((n) => [`story.s${n}h`, `story.s${n}b`] as [StringKey, StringKey]);

export default function OurStory() {
  const { t } = useLang();
  usePageTitle(t('nav.story'));
  return (
    <div className="container">
      <span className="eyebrow">{t('story.subtitle')}</span>
      <h1>{t('story.title')}</h1>
      <div className="story-video">
        <iframe src={STORY_VIDEO} title={t('story.video')} loading="lazy" allow="autoplay; fullscreen" allowFullScreen />
      </div>
      {SECTIONS.map(([h, b]) => (
        <section key={h}><h2>{t(h)}</h2><p>{t(b)}</p></section>
      ))}
      <blockquote className="story-quote">
        <p>{t('story.quote')}</p>
        <cite>{t('story.quoteBy')}</cite>
      </blockquote>
    </div>
  );
}
