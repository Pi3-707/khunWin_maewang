import { ourStory } from '../content/ourStory';
import { usePageTitle } from '../lib/usePageTitle';

// Google Drive file shared as "anyone with the link"; /preview is Drive's embeddable player.
const STORY_VIDEO = 'https://drive.google.com/file/d/1MqfeHWtN68PjJKCKotYhJTmsqatrOTot/preview';

export default function OurStory() {
  usePageTitle('เรื่องราวของเรา');
  return (
    <div className="container">
      <span className="eyebrow">ชุมชนขุนวินแม่วาง</span>
      <h1>เรื่องราวของเรา</h1>
      <div className="story-video">
        <iframe src={STORY_VIDEO} title="วิดีโอเรื่องราวชุมชนขุนวินแม่วาง" loading="lazy" allow="autoplay; fullscreen" allowFullScreen />
      </div>
      {ourStory.map((s) => (
        <section key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></section>
      ))}
    </div>
  );
}
