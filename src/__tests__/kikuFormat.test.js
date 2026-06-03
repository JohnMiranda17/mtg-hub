import { describe, test, expect } from 'vitest';
import { buildKiku, kikuFilename, parseKiku, KIKU_MAGIC, KIKU_VERSION } from '../utils/kikuFormat';

// ── buildKiku ─────────────────────────────────────────────────────────────────

describe('buildKiku', () => {
  test('sets format and version constants', () => {
    const result = buildKiku({});
    expect(result.format).toBe(KIKU_MAGIC);
    expect(result.version).toBe(KIKU_VERSION);
  });

  test('passes through name, boardText, and priority', () => {
    const result = buildKiku({ name: 'Test Game', boardText: 'MY BATTLEFIELD\n- Island', priority: 'opponent' });
    expect(result.name).toBe('Test Game');
    expect(result.boardText).toBe('MY BATTLEFIELD\n- Island');
    expect(result.priority).toBe('opponent');
  });

  test('defaults name to "MTG Game" when omitted', () => {
    expect(buildKiku({}).name).toBe('MTG Game');
  });

  test('defaults name to "MTG Game" when empty string', () => {
    expect(buildKiku({ name: '' }).name).toBe('MTG Game');
  });

  test('defaults boardText to empty string', () => {
    expect(buildKiku({}).boardText).toBe('');
  });

  test('defaults priority to "me"', () => {
    expect(buildKiku({}).priority).toBe('me');
  });

  test('includes an ISO createdAt timestamp', () => {
    const result = buildKiku({});
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

// ── kikuFilename ──────────────────────────────────────────────────────────────

describe('kikuFilename', () => {
  test('produces kiku-<slug>-<date>.kiku format', () => {
    const name = kikuFilename('My Game');
    expect(name).toMatch(/^kiku-My-Game-\d{4}-\d{2}-\d{2}\.kiku$/);
  });

  test('replaces spaces with hyphens', () => {
    expect(kikuFilename('Round One')).toContain('Round-One');
  });

  test('strips characters that are not alphanumeric or hyphen', () => {
    const name = kikuFilename('Game: Round 1!');
    expect(name).not.toMatch(/[!:]/);
  });

  test('defaults to MTG-Game when name is empty', () => {
    expect(kikuFilename('')).toMatch(/^kiku-MTG-Game-/);
  });

  test('defaults to MTG-Game when name is null', () => {
    expect(kikuFilename(null)).toMatch(/^kiku-MTG-Game-/);
  });
});

// ── parseKiku ─────────────────────────────────────────────────────────────────

function makeFile(obj) {
  const json = JSON.stringify(obj);
  return { text: () => Promise.resolve(json) };
}

describe('parseKiku', () => {
  test('parses a valid .kiku file', async () => {
    const file = makeFile({
      format: KIKU_MAGIC, version: 1,
      name: 'Test Game', boardText: 'MY BATTLEFIELD\n- Island',
      priority: 'opponent', createdAt: '2026-01-01T00:00:00.000Z',
    });
    const result = await parseKiku(file);
    expect(result.name).toBe('Test Game');
    expect(result.boardText).toBe('MY BATTLEFIELD\n- Island');
    expect(result.priority).toBe('opponent');
    expect(result.version).toBe(1);
  });

  test('throws when format magic is wrong', async () => {
    const file = makeFile({ format: 'not-kiku', boardText: '' });
    await expect(parseKiku(file)).rejects.toThrow('Not a .kiku game file.');
  });

  test('throws when JSON is invalid', async () => {
    const file = { text: () => Promise.resolve('{ not valid json }') };
    await expect(parseKiku(file)).rejects.toThrow('File is not valid JSON.');
  });

  test('falls back to "MTG Game" when name is missing', async () => {
    const file = makeFile({ format: KIKU_MAGIC });
    const result = await parseKiku(file);
    expect(result.name).toBe('MTG Game');
  });

  test('falls back to empty string when boardText is missing', async () => {
    const file = makeFile({ format: KIKU_MAGIC });
    expect((await parseKiku(file)).boardText).toBe('');
  });

  test('falls back to "me" when priority is missing', async () => {
    const file = makeFile({ format: KIKU_MAGIC });
    expect((await parseKiku(file)).priority).toBe('me');
  });

  test('round-trips a buildKiku result', async () => {
    const built = buildKiku({ name: 'Round Trip', boardText: 'OPP BATTLEFIELD\n- Tarmogoyf', priority: 'opponent' });
    const file = makeFile(built);
    const parsed = await parseKiku(file);
    expect(parsed.name).toBe('Round Trip');
    expect(parsed.boardText).toBe('OPP BATTLEFIELD\n- Tarmogoyf');
    expect(parsed.priority).toBe('opponent');
  });
});
