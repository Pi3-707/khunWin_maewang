import { describe, expect, test, vi } from 'vitest';
import { saveProduct, type SaveDeps } from './saveProduct';

const file = (n: string) => ({ name: n }) as unknown as File;
const row = { name: 'x' };

function deps(over: Partial<SaveDeps> = {}): SaveDeps {
  return {
    insertProduct: vi.fn(async () => 'new-id'),
    updateProduct: vi.fn(async () => {}),
    setCover: vi.fn(async () => {}),
    upload: vi.fn(async (_id: string, f: File) => ({ url: `u-${(f as any).name}`, path: `p-${(f as any).name}` })),
    addImage: vi.fn(async () => {}),
    countImages: vi.fn(async () => 2),
    removeUpload: vi.fn(async () => {}),
    ...over,
  };
}

describe('saveProduct', () => {
  test('keeps the new id when the cover upload fails, so a retry updates instead of inserting again', async () => {
    const d = deps({ upload: vi.fn(async () => { throw new Error('timeout'); }) });
    const r = await saveProduct(d, undefined, row, file('c'), []);
    expect(r.id).toBe('new-id');
    expect(r.error?.message).toBe('timeout');
    const again = await saveProduct(d, r.id, row, null, []);
    expect(d.insertProduct).toHaveBeenCalledTimes(1);
    expect(d.updateProduct).toHaveBeenCalledWith('new-id', row);
    expect(again.error).toBeUndefined();
  });

  test('reports which gallery files are still pending when the second upload fails', async () => {
    const [a, b, c] = [file('a'), file('b'), file('c')];
    let n = 0;
    const d = deps({
      upload: vi.fn(async (_id: string, f: File) => {
        if (++n === 2) throw new Error('fail');
        return { url: `u-${(f as any).name}`, path: `p-${(f as any).name}` };
      }),
    });
    const r = await saveProduct(d, 'id1', row, null, [a, b, c]);
    expect(d.addImage).toHaveBeenCalledTimes(1);
    expect(r.pendingExtra).toEqual([b, c]);
    expect(r.error).toBeDefined();
  });

  test('removes the uploaded object when the image row insert fails', async () => {
    const d = deps({ addImage: vi.fn(async () => { throw new Error('db'); }) });
    const r = await saveProduct(d, 'id1', row, null, [file('a')]);
    expect(d.removeUpload).toHaveBeenCalledWith('p-a');
    expect(r.pendingExtra).toHaveLength(1);
  });

  test('numbers gallery images after the existing ones and clears pending on success', async () => {
    const d = deps();
    const r = await saveProduct(d, 'id1', row, file('c'), [file('a'), file('b')]);
    expect(d.addImage).toHaveBeenNthCalledWith(1, 'id1', 'u-a', 3);
    expect(d.addImage).toHaveBeenNthCalledWith(2, 'id1', 'u-b', 4);
    expect(r).toEqual({ id: 'id1', coverDone: true, pendingExtra: [] });
  });

  test('reports the cover as done when only the gallery fails', async () => {
    const d = deps({ addImage: vi.fn(async () => { throw new Error('db'); }) });
    const r = await saveProduct(d, 'id1', row, file('c'), [file('a')]);
    expect(r.coverDone).toBe(true);
  });
});
