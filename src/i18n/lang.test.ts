import { describe, expect, test } from 'vitest';
import { detectLang, pick } from './lang';

describe('detectLang', () => {
  test('Thai browsers get Thai, everyone else English', () => {
    expect(detectLang({ languages: ['th-TH', 'en-US'] })).toBe('th');
    expect(detectLang({ languages: ['en-US'] })).toBe('en');
    expect(detectLang({ languages: ['zh-CN', 'ja'] })).toBe('en');
    expect(detectLang({ languages: [] })).toBe('en');
  });
  test('a stored choice beats the browser', () => {
    expect(detectLang({ languages: ['th-TH'], stored: 'en' })).toBe('en');
    expect(detectLang({ languages: ['en-US'], stored: 'th' })).toBe('th');
  });
  test('?lang= beats the stored choice; junk values are ignored', () => {
    expect(detectLang({ languages: ['th-TH'], stored: 'th', search: '?lang=en' })).toBe('en');
    expect(detectLang({ languages: ['en-US'], search: '?category=dung&lang=th' })).toBe('th');
    expect(detectLang({ languages: ['th-TH'], stored: 'fr', search: '?lang=xx' })).toBe('th');
  });
});

describe('pick', () => {
  const row = { name: 'ผ้าไอยรา', name_en: 'Ayara fabric', description: 'ไทย', description_en: '', story: 'ก', story_en: null };
  test('English mode uses the English value when present', () => {
    expect(pick(row, 'name', 'en')).toBe('Ayara fabric');
  });
  test('empty or null English falls back to Thai', () => {
    expect(pick(row, 'description', 'en')).toBe('ไทย');
    expect(pick(row, 'story', 'en')).toBe('ก');
  });
  test('Thai mode always returns Thai', () => {
    expect(pick(row, 'name', 'th')).toBe('ผ้าไอยรา');
  });
  test('missing row or field returns null', () => {
    expect(pick(null, 'name', 'en')).toBeNull();
    expect(pick({}, 'name', 'en')).toBeNull();
  });
});
