import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { fetchMakers } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { ElephantIcon, WeaverIcon } from './Icons';

// Profile cards for the artisans and elephants behind the products, linked to what they made.
export function MeetTheMakers() {
  const { t, pick } = useLang();
  const { data, error } = useAsync(fetchMakers, []);
  if (error || !data?.length) return null;

  return (
    <section className="band band-white">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('makers.eyebrow')}</span>
          <h2>{t('makers.title')}</h2>
          <p>{t('makers.text')}</p>
        </div>
        <div className="makers">
          {data.map((m) => {
            const name = pick(m, 'name') ?? m.name;
            const sub = m.kind === 'elephant'
              ? `${t('makers.elephant')}${m.age_years ? ` · ${m.age_years} ${t('detail.years')}` : ''}`
              : pick(m, 'role');
            return (
              <article key={m.id} className="maker reveal">
                <div className="maker-avatar">
                  {m.image_url ? <img src={m.image_url} alt={name} loading="lazy" /> : m.kind === 'elephant' ? <ElephantIcon /> : <WeaverIcon />}
                </div>
                <h3>{name}</h3>
                {sub && <span className="maker-role">{sub}</span>}
                {pick(m, 'text') && <p className="muted">{pick(m, 'text')}</p>}
                {m.works.length > 0 && (
                  <div className="maker-works">
                    <span className="eyebrow">{t('makers.works')}</span>
                    {m.works.map((w) => <Link key={w.id} to={`/products/${w.id}`}>{pick(w, 'name')}</Link>)}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
