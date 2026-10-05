import { track } from '../lib/analytics';
import { fetchVisitInfo } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import type { VisitRow } from '../lib/types';

export default function Visit() {
  usePageTitle('มาเยี่ยมชมชุมชน');
  const { data, error, loading } = useAsync(fetchVisitInfo, []);
  const by = (k: VisitRow['kind']) => data?.filter((r) => r.kind === k) ?? [];
  const map = by('map')[0];
  const q = map ? encodeURIComponent(map.body) : '';

  return (
    <div className="container">
      <h1>มาเยี่ยมชมชุมชน</h1>
      {loading && <p>กำลังโหลด…</p>}
      {error && <p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
      {map && (
        <section>
          <h2>แผนที่</h2>
          <iframe title="แผนที่ชุมชน" loading="lazy" width="100%" height="320" style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${q}&output=embed`} />
          <p>
            <a className="btn btn-ghost" target="_blank" rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${q}`}
              onClick={() => track('open_map')}>เปิดใน Google Maps</a>
          </p>
        </section>
      )}
      {(['direction', 'activity', 'hours'] as const).map((k) =>
        by(k).length ? (
          <section key={k}>
            <h2>{{ direction: 'วิธีเดินทาง', activity: 'กิจกรรมและเวิร์กชอป', hours: 'ช่วงเวลาที่เปิด' }[k]}</h2>
            {by(k).map((r) => <p key={r.id}>{r.title && <strong>{r.title}: </strong>}{r.body}</p>)}
          </section>
        ) : null,
      )}
    </div>
  );
}
