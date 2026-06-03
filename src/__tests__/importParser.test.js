import { describe, test, expect } from 'vitest';
import { parseTextImport, parseCsvImport, normalizeCondition } from '../utils/importParser';

// importParser converts raw text/CSV deck lists into a structured array of card entries.
// Each entry shape: { qty, name, setCode, collNum, foil, condition, sideboard }

// ── parseTextImport ───────────────────────────────────────────────────────────
// Handles Moxfield, MTG Arena, MTGO, and Archidekt plain-text export formats.

describe('parseTextImport', () => {
  // A minimal valid line: "<qty> <name>". Should produce one entry with
  // qty=4, name correctly captured, foil=false, condition defaulting to NM,
  // and sideboard=false since no sideboard marker is present.
  test('parses a basic card entry', () => {
    const [card] = parseTextImport('4 Lightning Bolt');
    expect(card).toMatchObject({ qty: 4, name: 'Lightning Bolt', foil: false, condition: 'NM', sideboard: false });
  });

  // Moxfield/Arena format often appends "(SET) collectorNumber".
  // setCode should be stored lowercase; collNum preserved as a string.
  test('parses card with set code and collector number', () => {
    const [card] = parseTextImport('1 Counterspell (TSB) 2');
    expect(card).toMatchObject({ qty: 1, name: 'Counterspell', setCode: 'tsb', collNum: '2' });
  });

  // *F* is the foil marker used by Moxfield and MTGO exports.
  // foil should be true and the marker must be stripped from the card name.
  test('parses foil marker *F*', () => {
    const [card] = parseTextImport('1 Black Lotus *F*');
    expect(card.foil).toBe(true);
    expect(card.name).toBe('Black Lotus');
  });

  // *A* marks alternate-art prints, not foils. The flag should be stripped
  // from the name without setting foil=true.
  test('strips *A* (alternate art) without marking foil', () => {
    const [card] = parseTextImport('1 Island *A*');
    expect(card.foil).toBe(false);
    expect(card.name).toBe('Island');
  });

  // "SB: " is an inline sideboard prefix used by some exporters.
  // The prefix must be removed from the name and sideboard set to true.
  test('parses inline SB: prefix', () => {
    const [card] = parseTextImport("SB: 2 Tormod's Crypt");
    expect(card).toMatchObject({ qty: 2, name: "Tormod's Crypt", sideboard: true });
  });

  // A "Sideboard:" section header flips the sideboard flag for all subsequent
  // lines. Cards before the header should have sideboard=false; cards after
  // should have sideboard=true.
  test('parses Sideboard section header', () => {
    const cards = parseTextImport('2 Lightning Bolt\nSideboard:\n1 Relic of Progenitus');
    expect(cards[0].sideboard).toBe(false);
    expect(cards[1].sideboard).toBe(true);
  });

  // Lines starting with "//" are comments (used by Moxfield and MTGO).
  // They should be completely ignored — only the real card line is returned.
  test('skips // comment lines', () => {
    const cards = parseTextImport('// comment\n4 Island');
    expect(cards).toHaveLength(1);
    expect(cards[0].name).toBe('Island');
  });

  // Empty or whitespace-only lines must be skipped without causing a parse
  // error or producing phantom entries.
  test('skips blank lines', () => {
    expect(parseTextImport('\n\n4 Island\n\n')).toHaveLength(1);
  });

  // "Deck:", "Commander:", and "Companion:" are section headers, not card lines.
  // They should be consumed silently. Cards inside those sections are still
  // parsed normally and should not be marked as sideboard cards.
  test('skips Deck: / Commander: section headers without consuming a card', () => {
    const cards = parseTextImport('Deck:\n4 Lightning Bolt\nCommander:\n1 Niv-Mizzet Reborn');
    expect(cards).toHaveLength(2);
    expect(cards.every(c => !c.sideboard)).toBe(true);
  });

  // A realistic multi-card list should produce one entry per card line,
  // in the same order they appear in the input.
  test('parses multiple cards', () => {
    const text = '4 Lightning Bolt (M11) 115\n2 Counterspell\n4 Forest';
    expect(parseTextImport(text)).toHaveLength(3);
  });

  // An empty string has no valid card lines, so the result should be an
  // empty array — not an error or a single blank entry.
  test('returns empty array for empty input', () => {
    expect(parseTextImport('')).toHaveLength(0);
  });

  // Some exporters write "4x" instead of "4" before the card name.
  // The "x" suffix on the quantity must be handled and stripped so that
  // qty is correctly parsed as a number.
  test('handles qty with x suffix (4x format)', () => {
    const [card] = parseTextImport('4x Lightning Bolt');
    expect(card.qty).toBe(4);
    expect(card.name).toBe('Lightning Bolt');
  });
});

// ── parseCsvImport ────────────────────────────────────────────────────────────
// Handles CSV exports (Moxfield and similar). The first row is a header;
// column names are matched case-insensitively against known aliases.

describe('parseCsvImport', () => {
  // The minimum valid CSV needs at least Count and Name columns.
  // qty and name should map directly from those columns.
  test('parses basic Count + Name CSV', () => {
    const [card] = parseCsvImport('Count,Name\n4,Lightning Bolt');
    expect(card).toMatchObject({ qty: 4, name: 'Lightning Bolt' });
  });

  // "Quantity" is a common alternative header for the card count column.
  // It should be treated identically to "Count".
  test('accepts Quantity column alias', () => {
    const [card] = parseCsvImport('Quantity,Name\n3,Counterspell');
    expect(card.qty).toBe(3);
  });

  // "Qty" is another common abbreviation for the count column.
  // It should also be accepted as a valid alias.
  test('accepts Qty column alias', () => {
    const [card] = parseCsvImport('Qty,Name\n2,Forest');
    expect(card.qty).toBe(2);
  });

  // "Edition" is the Moxfield header for the set code. The value should be
  // stored lowercase so it matches Scryfall's expected format.
  test('maps Edition column to setCode (lowercased)', () => {
    const [card] = parseCsvImport('Count,Name,Edition\n2,Lightning Bolt,M11');
    expect(card.setCode).toBe('m11');
  });

  // "Set" is an alternative header for the set code column.
  // It should be mapped to setCode the same way as "Edition".
  test('maps Set column to setCode', () => {
    const [card] = parseCsvImport('Count,Name,Set\n1,Forest,eld');
    expect(card.setCode).toBe('eld');
  });

  // When the Foil column contains the word "foil" (case-insensitive),
  // the card should be marked foil=true.
  test('marks foil when Foil column is "foil"', () => {
    const [card] = parseCsvImport('Count,Name,Foil\n1,Black Lotus,foil');
    expect(card.foil).toBe(true);
  });

  // An empty Foil cell means the card is not foil.
  // foil should remain false rather than defaulting to true.
  test('does not mark foil when Foil column is empty', () => {
    const [card] = parseCsvImport('Count,Name,Foil\n1,Island,');
    expect(card.foil).toBe(false);
  });

  // The Condition column may contain long-form values like "lightly played".
  // These should be normalized to their standard abbreviation (LP, MP, etc.).
  test('normalizes Condition column', () => {
    const [card] = parseCsvImport('Count,Name,Condition\n1,Island,lightly played');
    expect(card.condition).toBe('LP');
  });

  // A CSV with only a header row and no data rows should produce an empty
  // array rather than an error or a single empty entry.
  test('returns empty array for header-only CSV', () => {
    expect(parseCsvImport('Count,Name')).toHaveLength(0);
  });

  // Rows where the Name cell is blank cannot be meaningfully imported.
  // They should be skipped entirely; valid rows in the same file still parse.
  test('skips rows with empty name', () => {
    const cards = parseCsvImport('Count,Name\n4,\n2,Forest');
    expect(cards).toHaveLength(1);
    expect(cards[0].name).toBe('Forest');
  });

  // Card names that contain commas must be wrapped in quotes in CSV.
  // The parser should correctly strip the quotes and preserve the full name.
  test('handles quoted fields containing commas', () => {
    const [card] = parseCsvImport('Count,Name\n1,"Sol, Ring"');
    expect(card.name).toBe('Sol, Ring');
  });

  // A completely empty string has no header row to read, so the result
  // should be an empty array.
  test('returns empty for completely empty input', () => {
    expect(parseCsvImport('')).toHaveLength(0);
  });
});

// ── normalizeCondition ────────────────────────────────────────────────────────
// Maps long-form condition strings (from various exporters) to the four
// standard abbreviations used by the app: NM, LP, MP, HP, DMG.

describe('normalizeCondition', () => {
  // Each row is [inputFromExporter, expectedAbbreviation].
  // Covers every mapped alias defined in the implementation.
  test.each([
    ['nm',                'NM'],  // abbreviation → itself
    ['near mint',         'NM'],  // long-form
    ['mint',              'NM'],  // treated as NM
    ['lp',                'LP'],  // abbreviation
    ['lightly played',    'LP'],  // long-form
    ['excellent',         'LP'],  // TCGPlayer alias
    ['sp',                'LP'],  // "slightly played" alias
    ['mp',                'MP'],  // abbreviation
    ['moderately played', 'MP'],  // long-form
    ['played',            'MP'],  // generic alias
    ['hp',                'HP'],  // abbreviation
    ['heavily played',    'HP'],  // long-form
    ['dmg',               'DMG'], // abbreviation
    ['damaged',           'DMG'], // long-form
    ['poor',              'DMG'], // eBay-style alias
  ])('"%s" → "%s"', (input, expected) => {
    expect(normalizeCondition(input)).toBe(expected);
  });

  // An unrecognised condition string should safely fall back to NM rather
  // than throwing an error or producing an undefined value.
  test('falls back to NM for unknown values', () => {
    expect(normalizeCondition('pristine')).toBe('NM');
  });

  // Condition inputs from CSV headers may arrive in uppercase. The function
  // must be case-insensitive so "NM" and "LP" resolve correctly.
  test('is case-insensitive', () => {
    expect(normalizeCondition('NM')).toBe('NM');
    expect(normalizeCondition('LP')).toBe('LP');
  });
});
