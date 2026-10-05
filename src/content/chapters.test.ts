import { expect, test } from 'vitest';
import { chapters } from './chapters';

test('five chapters, each short enough to read in one scroll', () => {
  expect(chapters).toHaveLength(5);
  for (const c of chapters) {
    expect(c.title.length).toBeGreaterThan(0);
    expect(c.text.length).toBeLessThanOrEqual(200);
  }
});
