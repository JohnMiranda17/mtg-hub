import { describe, test, expect } from 'vitest';
import { parseTextImport, parseCsvImport, normalizeCondition } from '../utils/importParser';

// ── parseTextImport ───────────────────────────────────────────────────────────

describe('parseTextImport', () => {
  test('parses a basic card entry', () => {
    const [card] = parseTextImport('4 Lightning Bolt');
    expect(card).toMatchObject({ qty: 4, name: 'Lightning Bolt', foil: false, condition: 'NM', sideboard: false });
  });

  test('parses card with set code and collector number', () => {
    const [card] = parseTextImport('1 Counterspell (TSB) 2');
    expect(card).toMatchObject({ qty: 1, name: 'Counterspell', setCode: 'tsb', collNum: '2' });
  });

  test('parses foil marker *F*', () => {
    const [card] = parseTextImport('1 Black Lotus *F*');
    expect(card.foil).toBe(true);
    expect(card.name).toBe('Black Lotus');
  });

  test('strips *A* (alternate art) without marking foil', () => {
    const [card] = parseTextImport('1 Island *A*');
    expect(card.foil).toBe(false);
    expect(card.name).toBe('Island');
  });

  test('parses inline SB: prefix', () => {
    const [card] = parseTextImport("SB: 2 Tormod's Crypt");
    expect(card).toMatchObject({ qty: 2, name: "Tormod's Crypt", sideboard: true });
  });

  test('parses Sideboard section header', () => {
    const cards = parseTextImport('2 Lightning Bolt\nSideboard:\n1 Relic of Progenitus');
    expect(cards[0].sideboard).toBe(false);
    expect(cards[1].sideboard).toBe(true);
  });

  test('skips // comment lines', () => {
    const cards = parseTextImport('// comment\n4 Island');
    expect(cards).toHaveLength(1);
    expect(cards[0].name).toBe('Island');
  });

  test('skips blank lines', () => {
    expect(parseTextImport('\n\n4 Island\n\n')).toHaveLength(1);
  });

  test('skips Deck: / Commander: section headers without consuming a card', () => {
    const cards = parseTextImport('Deck:\n4 Lightning Bolt\nCommander:\n1 Niv-Mizzet Reborn');
    expect(cards).toHaveLength(2);
    expect(cards.every(c => !c.sideboard)).toBe(true);
  });

  test('parses multiple cards', () => {
    const text = '4 Lightning Bolt (M11) 115\n2 Counterspell\n4 Forest';
    expect(parseTextImport(text)).toHaveLength(3);
  });

  test('returns empty array for empty input', () => {
    expect(parseTextImport('')).toHaveLength(0);
  });

  test('handles qty with x suffix (4x format)', () => {
    const [card] = parseTextImport('4x Lightning Bolt');
    expect(card.qty).toBe(4);
    expect(card.name).toBe('Lightning Bolt');
  });
});

// ── parseCsvImport ────────────────────────────────────────────────────────────

describe('parseCsvImport', () => {
  test('parses basic Count + Name CSV', () => {
    const [card] = parseCsvImport('Count,Name\n4,Lightning Bolt');
    expect(card).toMatchObject({ qty: 4, name: 'Lightning Bolt' });
  });

  test('accepts Quantity column alias', () => {
    const [card] = parseCsvImport('Quantity,Name\n3,Counterspell');
    expect(card.qty).toBe(3);
  });

  test('accepts Qty column alias', () => {
    const [card] = parseCsvImport('Qty,Name\n2,Forest');
    expect(card.qty).toBe(2);
  });

  test('maps Edition column to setCode (lowercased)', () => {
    const [card] = parseCsvImport('Count,Name,Edition\n2,Lightning Bolt,M11');
    expect(card.setCode).toBe('m11');
  });

  test('maps Set column to setCode', () => {
    const [card] = parseCsvImport('Count,Name,Set\n1,Forest,eld');
    expect(card.setCode).toBe('eld');
  });

  test('marks foil when Foil column is "foil"', () => {
    const [card] = parseCsvImport('Count,Name,Foil\n1,Black Lotus,foil');
    expect(card.foil).toBe(true);
  });

  test('does not mark foil when Foil column is empty', () => {
    const [card] = parseCsvImport('Count,Name,Foil\n1,Island,');
    expect(card.foil).toBe(false);
  });

  test('normalizes Condition column', () => {
    const [card] = parseCsvImport('Count,Name,Condition\n1,Island,lightly played');
    expect(card.condition).toBe('LP');
  });

  test('returns empty array for header-only CSV', () => {
    expect(parseCsvImport('Count,Name')).toHaveLength(0);
  });

  test('skips rows with empty name', () => {
    const cards = parseCsvImport('Count,Name\n4,\n2,Forest');
    expect(cards).toHaveLength(1);
    expect(cards[0].name).toBe('Forest');
  });

  test('handles quoted fields containing commas', () => {
    const [card] = parseCsvImport('Count,Name\n1,"Sol, Ring"');
    expect(card.name).toBe('Sol, Ring');
  });

  test('returns empty for completely empty input', () => {
    expect(parseCsvImport('')).toHaveLength(0);
  });
});

// ── normalizeCondition ────────────────────────────────────────────────────────

describe('normalizeCondition', () => {
  test.each([
    ['nm',                'NM'],
    ['near mint',         'NM'],
    ['mint',              'NM'],
    ['lp',                'LP'],
    ['lightly played',    'LP'],
    ['excellent',         'LP'],
    ['sp',                'LP'],
    ['mp',                'MP'],
    ['moderately played', 'MP'],
    ['played',            'MP'],
    ['hp',                'HP'],
    ['heavily played',    'HP'],
    ['dmg',               'DMG'],
    ['damaged',           'DMG'],
    ['poor',              'DMG'],
  ])('"%s" → "%s"', (input, expected) => {
    expect(normalizeCondition(input)).toBe(expected);
  });

  test('falls back to NM for unknown values', () => {
    expect(normalizeCondition('pristine')).toBe('NM');
  });

  test('is case-insensitive', () => {
    expect(normalizeCondition('NM')).toBe('NM');
    expect(normalizeCondition('LP')).toBe('LP');
  });
});
