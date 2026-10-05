import { ourStory } from '../content/ourStory';
import { usePageTitle } from '../lib/usePageTitle';

export default function OurStory() {
  usePageTitle('เรื่องราวของเรา');
  return (
    <div className="container">
      <h1>เรื่องราวของเรา</h1>
      {ourStory.map((s) => (
        <section key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></section>
      ))}
    </div>
  );
}
