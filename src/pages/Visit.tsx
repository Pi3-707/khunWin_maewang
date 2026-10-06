import { useLang } from '../i18n/LangContext';
import { track } from '../lib/analytics';
import { fetchVisitInfo } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import type { VisitRow } from '../lib/types';

const HEADINGS = { direction: 'visit.direction', activity: 'visit.activity', hours: 'visit.hours' } as const;

export default function Visit() {
  const { t, pick } = useLang();
  usePageTitle(t('visit.title'));
  const { data, error, loading } = useAsync(fetchVisitInfo, []);
  const by = (k: VisitRow['kind']) => data?.filter((r) => r.kind === k) ?? [];
  const map = by('map')[0];
  // The map query uses the Thai place name so Google finds the right spot in either language.
  const q = map ? encodeURIComponent(map.body) : '';

  return (
    <div className="container">
      <h1>{t('visit.title')}</h1>
      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="error">{t('common.loadError')}</p>}
      {map && (
        <section>
          <h2>{t('visit.map')}</h2>
          <iframe title={t('visit.mapTitle')} loading="lazy" width="100%" height="320" style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${q}&output=embed`} />
          <p>
            <a className="btn btn-ghost" target="_blank" rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${q}`}
              onClick={() => track('open_map')}>{t('visit.openMap')}</a>
          </p>
        </section>
      )}
      {(['direction', 'activity', 'hours'] as const).map((k) =>
        by(k).length ? (
          <section key={k}>
            <h2>{t(HEADINGS[k])}</h2>
            {by(k).map((r) => <p key={r.id}>{pick(r, 'title') && <strong>{pick(r, 'title')}: </strong>}{pick(r, 'body')}</p>)}
          </section>
        ) : null,
      )}
    </div>
  );
}
