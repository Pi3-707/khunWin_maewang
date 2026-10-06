import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import { usePageTitle } from '../lib/usePageTitle';

// Google Drive file shared as "anyone with the link"; the /preview URL is the embeddable player.
const STORY_VIDEO = 'https://drive.google.com/file/d/1MqfeHWtN68PjJKCKotYhJTmsqatrOTot/preview';
const SECTIONS: [StringKey, StringKey][] = [['story.s1h', 'story.s1b'], ['story.s2h', 'story.s2b'], ['story.s3h', 'story.s3b']];

export default function OurStory() {
  const { t } = useLang();
  usePageTitle(t('nav.story'));
  return (
    <div className="container">
      <span className="eyebrow">{t('story.eyebrow')}</span>
      <h1>{t('nav.story')}</h1>
      <div className="story-video">
        <iframe src={STORY_VIDEO} title={t('story.video')} loading="lazy" allow="autoplay; fullscreen" allowFullScreen />
      </div>
      {SECTIONS.map(([h, b]) => (
        <section key={h}><h2>{t(h)}</h2><p>{t(b)}</p></section>
      ))}
    </div>
  );
}
