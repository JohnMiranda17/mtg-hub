import { describe, test, expect } from 'vitest';
import { buildKiku, kikuFilename, parseKiku, KIKU_MAGIC, KIKU_VERSION } from '../utils/kikuFormat';

// kikuFormat handles serialisation and deserialisation of .kiku game-state files.
// A .kiku file is a JSON document identified by the "kiku-mtg" format magic string.

// ── buildKiku ─────────────────────────────────────────────────────────────────
// buildKiku creates the JSON object that gets written to a .kiku file.

describe('buildKiku', () => {
  // Every .kiku file must include the format magic string and version number so
  // parseKiku can reject unrecognised files. Both constants are checked here.
  test('sets format and version constants', () => {
    const result = buildKiku({});
    expect(result.format).toBe(KIKU_MAGIC);
    expect(result.version).toBe(KIKU_VERSION);
  });

  // Caller-supplied fields should be preserved exactly in the output object
  // so that a file written from buildKiku round-trips cleanly through parseKiku.
  test('passes through name, boardText, and priority', () => {
    const result = buildKiku({ name: 'Test Game', boardText: 'MY BATTLEFIELD\n- Island', priority: 'opponent' });
    expect(result.name).toBe('Test Game');
    expect(result.boardText).toBe('MY BATTLEFIELD\n- Island');
    expect(result.priority).toBe('opponent');
  });

  // When the caller omits the name field, the output should use the default
  // label "MTG Game" so the saved file always has a human-readable title.
  test('defaults name to "MTG Game" when omitted', () => {
    expect(buildKiku({}).name).toBe('MTG Game');
  });

  // An explicitly empty name string should also be treated as "not provided"
  // and fall back to the default, preventing a file named just "kiku--<date>.kiku".
  test('defaults name to "MTG Game" when empty string', () => {
    expect(buildKiku({ name: '' }).name).toBe('MTG Game');
  });

  // When boardText is omitted the output must use an empty string, not undefined,
  // so JSON serialisation produces a valid "boardText": "" field.
  test('defaults boardText to empty string', () => {
    expect(buildKiku({}).boardText).toBe('');
  });

  // Priority defaults to "me" (the current player has priority) when omitted.
  // This matches the most common starting state for a board analysis.
  test('defaults priority to "me"', () => {
    expect(buildKiku({}).priority).toBe('me');
  });

  // The createdAt field must be a valid ISO 8601 timestamp string so the file
  // can be sorted or displayed by creation date. It is set at call time.
  test('includes an ISO createdAt timestamp', () => {
    const result = buildKiku({});
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

// ── kikuFilename ──────────────────────────────────────────────────────────────
// kikuFilename generates the suggested save filename from the game name.

describe('kikuFilename', () => {
  // The expected pattern is "kiku-<slug>-<YYYY-MM-DD>.kiku".
  // Spaces in the name become hyphens to keep the filename shell-safe.
  test('produces kiku-<slug>-<date>.kiku format', () => {
    const name = kikuFilename('My Game');
    expect(name).toMatch(/^kiku-My-Game-\d{4}-\d{2}-\d{2}\.kiku$/);
  });

  // Internal spaces in the game name must be replaced with hyphens so the
  // filename contains no whitespace.
  test('replaces spaces with hyphens', () => {
    expect(kikuFilename('Round One')).toContain('Round-One');
  });

  // Characters that are not alphanumeric or hyphens (colons, exclamation marks,
  // etc.) must be stripped to produce a valid filename on all operating systems.
  test('strips characters that are not alphanumeric or hyphen', () => {
    const name = kikuFilename('Game: Round 1!');
    expect(name).not.toMatch(/[!:]/);
  });

  // An empty name string should fall back to "MTG-Game" so the filename is
  // always non-empty and identifiable.
  test('defaults to MTG-Game when name is empty', () => {
    expect(kikuFilename('')).toMatch(/^kiku-MTG-Game-/);
  });

  // A null name (e.g., when the game name state was never set) should be
  // treated the same as an empty string and fall back to "MTG-Game".
  test('defaults to MTG-Game when name is null', () => {
    expect(kikuFilename(null)).toMatch(/^kiku-MTG-Game-/);
  });
});

// ── parseKiku ─────────────────────────────────────────────────────────────────
// parseKiku reads a File-like object (anything with a .text() method) and
// returns the deserialised game state, or throws on invalid input.

// makeFile simulates the browser File API for testing without a real filesystem.
function makeFile(obj) {
  const json = JSON.stringify(obj);
  return { text: () => Promise.resolve(json) };
}

describe('parseKiku', () => {
  // A fully-populated valid file should have all fields extracted correctly.
  // The version number is also returned so the caller can handle future formats.
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

  // If the format field doesn't match KIKU_MAGIC, the file is not a .kiku file
  // (e.g., a JSON file from another app was accidentally imported). A descriptive
  // error should be thrown so the UI can show a clear message.
  test('throws when format magic is wrong', async () => {
    const file = makeFile({ format: 'not-kiku', boardText: '' });
    await expect(parseKiku(file)).rejects.toThrow('Not a recognised .kiku file format.');
  });

  // If the file contains malformed JSON, JSON.parse will throw. parseKiku must
  // catch that and re-throw with a user-friendly message rather than exposing
  // a raw SyntaxError.
  test('throws when JSON is invalid', async () => {
    const file = { text: () => Promise.resolve('{ not valid json }') };
    await expect(parseKiku(file)).rejects.toThrow('File is not valid JSON.');
  });

  // Older .kiku files may lack a name field. The parser should fall back to
  // "MTG Game" so the UI always has a displayable title.
  test('falls back to "MTG Game" when name is missing', async () => {
    const file = makeFile({ format: KIKU_MAGIC });
    const result = await parseKiku(file);
    expect(result.name).toBe('MTG Game');
  });

  // A missing boardText field should produce an empty string rather than
  // undefined, so callers can safely pass it to a textarea without extra checks.
  test('falls back to empty string when boardText is missing', async () => {
    const file = makeFile({ format: KIKU_MAGIC });
    expect((await parseKiku(file)).boardText).toBe('');
  });

  // A missing priority field should fall back to "me" (local player has
  // priority), matching the UI's default radio selection.
  test('falls back to "me" when priority is missing', async () => {
    const file = makeFile({ format: KIKU_MAGIC });
    expect((await parseKiku(file)).priority).toBe('me');
  });

  // End-to-end round-trip: build a .kiku object, serialise it via makeFile,
  // then parse it back. The parsed values must exactly match the originals,
  // confirming buildKiku and parseKiku are inverses of each other.
  test('round-trips a buildKiku result', async () => {
    const built = buildKiku({ name: 'Round Trip', boardText: 'OPP BATTLEFIELD\n- Tarmogoyf', priority: 'opponent' });
    const file = makeFile(built);
    const parsed = await parseKiku(file);
    expect(parsed.name).toBe('Round Trip');
    expect(parsed.boardText).toBe('OPP BATTLEFIELD\n- Tarmogoyf');
    expect(parsed.priority).toBe('opponent');
  });
});
