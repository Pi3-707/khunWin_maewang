import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import type { StringKey } from '../i18n/strings';
import type { Material, Process } from '../lib/types';
import { LeafIcon } from './Icons';

const DEFAULT_PHOTO = '/photos/dung-pots.jpg';

interface Item { id: string; side: 'left' | 'right'; badge: string; title: string; sub: string; text: string; photo: string }

// Materials on the left, steps on the right. Pointing at (or tapping) one swaps the centre photo
// and shows its full description underneath.
export function CycleDiagram({ materials, steps }: { materials: Material[]; steps: Process[] }) {
  const { t, pick } = useLang();
  const [activeId, setActiveId] = useState<string | null>(null);

  const matType = (type: string) => {
    const key = `mat.${type}` as StringKey;
    return key === 'mat.natural_material' || key === 'mat.textile' ? t(key) : type;
  };
  const items: Item[] = [
    ...materials.map((m) => ({
      id: m.id, side: 'left' as const, badge: '', title: pick(m, 'name') ?? m.name, sub: matType(m.type),
      text: pick(m, 'description') ?? '', photo: m.image_url ?? DEFAULT_PHOTO,
    })),
    ...steps.map((s, i) => ({
      id: s.id, side: 'right' as const, badge: `0${i + 1}`, title: pick(s, 'name') ?? s.name, sub: '',
      text: pick(s, 'description') ?? '', photo: s.image_url ?? DEFAULT_PHOTO,
    })),
  ];
  const active = items.find((x) => x.id === activeId) ?? null;

  const card = (x: Item) => (
    <button
      key={x.id}
      type="button"
      className={`callout${x.id === activeId ? ' is-active' : ''}`}
      aria-pressed={x.id === activeId}
      onMouseEnter={() => setActiveId(x.id)}
      onFocus={() => setActiveId(x.id)}
      onClick={() => setActiveId(x.id)}
    >
      <span className="callout-mark">{x.badge || <LeafIcon />}</span>
      <span className="callout-body">
        <strong>{x.title}</strong>
        {x.sub && <small>{x.sub}</small>}
      </span>
    </button>
  );

  return (
    <div className="cycle" onMouseLeave={() => setActiveId(null)}>
      <div className="callouts left">{items.filter((x) => x.side === 'left').map(card)}</div>
      <div className="cycle-centre">
        <div className={`cycle-ring${active ? ' is-active' : ''}`} aria-hidden="true"><span className="cycle-orbit"><LeafIcon /></span></div>
        <div className="cycle-photo">
          <img key={active?.photo ?? DEFAULT_PHOTO} src={active?.photo ?? DEFAULT_PHOTO} alt={active?.title ?? ''} loading="lazy" />
        </div>
        <p className="cycle-caption" aria-live="polite">
          {active ? <><strong>{active.title}</strong>{active.text}</> : t('home.cycleHint')}
        </p>
      </div>
      <div className="callouts right">{items.filter((x) => x.side === 'right').map(card)}</div>
    </div>
  );
}
