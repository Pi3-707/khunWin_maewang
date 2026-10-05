export interface SaveDeps {
  insertProduct(row: Record<string, unknown>): Promise<string>;
  updateProduct(id: string, row: Record<string, unknown>): Promise<void>;
  setCover(id: string, url: string): Promise<void>;
  upload(id: string, file: File): Promise<{ url: string; path: string }>;
  addImage(id: string, url: string, order: number): Promise<void>;
  countImages(id: string): Promise<number>;
  removeUpload(path: string): Promise<void>;
}

export interface SaveResult {
  id?: string;
  coverDone?: boolean;
  pendingExtra: File[];
  error?: Error;
}

// Saves a product, then its photos. Returns the id as soon as the row exists and the files still
// pending, so a retry after a failure updates the same product and never repeats finished uploads.
export async function saveProduct(
  deps: SaveDeps,
  existingId: string | undefined,
  row: Record<string, unknown>,
  cover: File | null,
  extra: File[],
): Promise<SaveResult> {
  let id = existingId;
  try {
    if (id) await deps.updateProduct(id, row);
    else id = await deps.insertProduct(row);
  } catch (e) {
    return { id, pendingExtra: extra, error: e as Error };
  }

  let coverDone = !cover;
  let pending = extra;
  const orphan = (path: string) => deps.removeUpload(path).catch(() => {});
  try {
    if (cover) {
      const up = await deps.upload(id, cover);
      try {
        await deps.setCover(id, up.url);
      } catch (e) {
        await orphan(up.path);
        throw e;
      }
      coverDone = true;
    }
    let order = pending.length ? await deps.countImages(id) : 0;
    while (pending.length) {
      const up = await deps.upload(id, pending[0]);
      try {
        await deps.addImage(id, up.url, ++order);
      } catch (e) {
        await orphan(up.path);
        throw e;
      }
      pending = pending.slice(1);
    }
    return { id, coverDone, pendingExtra: [] };
  } catch (e) {
    return { id, coverDone, pendingExtra: pending, error: e as Error };
  }
}
