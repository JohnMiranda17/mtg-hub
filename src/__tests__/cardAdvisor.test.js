import { analyzeCard, getSynergyTags } from '../utils/cardAdvisor';

describe('analyzeCard', () => {
  test('detects flying keyword', () => {
    const card = { keywords: ['Flying'], type_line: 'Creature', oracle_text: '', cmc: 3 };
    expect(analyzeCard(card).some(r => r.title === 'Flying')).toBe(true);
  });

  test('detects instant speed from type line', () => {
    const card = { keywords: [], type_line: 'Instant', oracle_text: '', cmc: 2 };
    expect(analyzeCard(card).some(r => r.title === 'Instant Speed')).toBe(true);
  });

  test('detects flash keyword', () => {
    const card = { keywords: ['Flash'], type_line: 'Creature', oracle_text: '', cmc: 3 };
    expect(analyzeCard(card).some(r => r.title === 'Flash')).toBe(true);
  });

  test('detects card draw', () => {
    const card = { keywords: [], type_line: 'Sorcery', oracle_text: 'Draw three cards.', cmc: 4 };
    expect(analyzeCard(card).some(r => r.title === 'Card Draw')).toBe(true);
  });

  test('detects removal', () => {
    const card = { keywords: [], type_line: 'Instant', oracle_text: 'Destroy target creature.', cmc: 2 };
    expect(analyzeCard(card).some(r => r.title === 'Removal')).toBe(true);
  });

  test('detects token maker', () => {
    const card = { keywords: [], type_line: 'Sorcery', oracle_text: 'Create three 1/1 white Soldier creature tokens.', cmc: 3 };
    expect(analyzeCard(card).some(r => r.title === 'Token Maker')).toBe(true);
  });

  test('detects haste', () => {
    const card = { keywords: ['Haste'], type_line: 'Creature', oracle_text: '', cmc: 3 };
    expect(analyzeCard(card).some(r => r.title === 'Haste')).toBe(true);
  });

  test('detects indestructible', () => {
    const card = { keywords: ['Indestructible'], type_line: 'Creature', oracle_text: '', cmc: 5 };
    expect(analyzeCard(card).some(r => r.title === 'Indestructible')).toBe(true);
  });

  test('detects high power threat', () => {
    const card = { keywords: [], type_line: 'Creature', oracle_text: '', cmc: 6, power: '7', toughness: '7' };
    expect(analyzeCard(card).some(r => r.title.includes('Threat'))).toBe(true);
  });

  test('returns at most 5 reasons', () => {
    const card = {
      keywords: ['Flying', 'Lifelink', 'Haste', 'Hexproof', 'Trample', 'Indestructible'],
      type_line: 'Instant Creature',
      oracle_text: 'Draw a card. Create a token.',
      cmc: 3,
      power: '6',
      toughness: '6',
    };
    expect(analyzeCard(card).length).toBeLessThanOrEqual(5);
  });

  test('returns array for vanilla creature with no keywords', () => {
    const card = { keywords: [], type_line: 'Creature', oracle_text: '', cmc: 4, power: '3', toughness: '3' };
    expect(Array.isArray(analyzeCard(card))).toBe(true);
  });
});

describe('getSynergyTags', () => {
  test('detects graveyard synergy from flashback keyword', () => {
    const card = { keywords: ['Flashback'], type_line: 'Sorcery', oracle_text: '' };
    expect(getSynergyTags(card).includes('Graveyard strategies')).toBe(true);
  });

  test('detects ETB synergy from oracle text', () => {
    const card = { keywords: [], type_line: 'Creature', oracle_text: 'When this enters the battlefield, draw a card.' };
    expect(getSynergyTags(card).includes('ETB effects')).toBe(true);
  });

  test('detects token synergy', () => {
    const card = { keywords: [], type_line: 'Sorcery', oracle_text: 'Create three 1/1 white Soldier creature tokens.' };
    expect(getSynergyTags(card).includes('Token strategies')).toBe(true);
  });

  test('detects sacrifice synergy', () => {
    const card = { keywords: [], type_line: 'Sorcery', oracle_text: 'Sacrifice a creature: draw a card.' };
    expect(getSynergyTags(card).includes('Sacrifice matters')).toBe(true);
  });

  test('detects counter synergy', () => {
    const card = { keywords: [], type_line: 'Creature', oracle_text: 'Put three +1/+1 counters on target creature.' };
    expect(getSynergyTags(card).includes('+1/+1 Counters')).toBe(true);
  });

  test('detects flying tribal from keyword', () => {
    const card = { keywords: ['Flying'], type_line: 'Creature', oracle_text: '' };
    expect(getSynergyTags(card).includes('Flying tribal')).toBe(true);
  });

  test('returns an array even for empty card', () => {
    const card = { keywords: [], type_line: 'Creature', oracle_text: '' };
    expect(Array.isArray(getSynergyTags(card))).toBe(true);
  });
});
