import { PLACEHOLDER } from '../lib/product';

export function CollageLayer({ srcs, bw = false }: { srcs: string[]; bw?: boolean }) {
  return (
    <div className={`collage parallax ${bw ? 'bw' : ''}`}>
      {srcs.map((s, i) => (
        <img key={i} src={s || PLACEHOLDER} alt="" loading="lazy" />
      ))}
    </div>
  );
}
