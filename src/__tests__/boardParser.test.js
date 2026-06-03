import { describe, test, expect } from 'vitest';
import { parseBoardState } from '../utils/boardParser';

describe('parseBoardState', () => {
  test('returns empty state for empty input', () => {
    const result = parseBoardState('');
    expect(result.myBattlefield).toHaveLength(0);
    expect(result.oppBattlefield).toHaveLength(0);
    expect(result.myHand).toHaveLength(0);
    expect(result.stack).toHaveLength(0);
    expect(result.mana).toBe('');
  });

  test('parses MY BATTLEFIELD permanents', () => {
    const result = parseBoardState('MY BATTLEFIELD\n- Birds of Paradise (untapped)\n- Llanowar Elves (tapped)');
    expect(result.myBattlefield).toHaveLength(2);
    expect(result.myBattlefield[0]).toMatchObject({ name: 'Birds of Paradise', untapped: true, tapped: false });
    expect(result.myBattlefield[1]).toMatchObject({ name: 'Llanowar Elves', tapped: true, untapped: false });
  });

  test('parses OPP BATTLEFIELD with attacking creature', () => {
    const result = parseBoardState('OPP BATTLEFIELD\n- Tarmogoyf (attacking)');
    expect(result.oppBattlefield[0]).toMatchObject({ name: 'Tarmogoyf', attacking: true });
  });

  test('parses MY HAND as plain name strings', () => {
    const result = parseBoardState('MY HAND\n- Lightning Bolt\n- Counterspell');
    expect(result.myHand).toEqual(['Lightning Bolt', 'Counterspell']);
  });

  test('parses MY GRAVEYARD', () => {
    const result = parseBoardState('MY GRAVEYARD\n- Ancestral Recall');
    expect(result.myGraveyard).toEqual(['Ancestral Recall']);
  });

  test('parses STACK entry with target', () => {
    const result = parseBoardState('STACK\n1. Doom Blade targeting Birds of Paradise');
    expect(result.stack[0]).toMatchObject({ spell: 'Doom Blade', target: 'Birds of Paradise' });
  });

  test('parses STACK entry without target', () => {
    const result = parseBoardState('STACK\n1. Ancestral Recall');
    expect(result.stack[0]).toMatchObject({ spell: 'Ancestral Recall', target: null });
  });

  test('parses MANA: line', () => {
    const result = parseBoardState('MANA: WWUUR');
    expect(result.mana).toBe('WWUUR');
  });

  test('parses ACTIONS THIS TURN', () => {
    const result = parseBoardState('ACTIONS THIS TURN\n- Cast Lightning Bolt');
    expect(result.actionsThisTurn).toContain('Cast Lightning Bolt');
  });

  test('accepts MY SIDE alias for MY BATTLEFIELD', () => {
    const result = parseBoardState('MY SIDE\n- Island (untapped)');
    expect(result.myBattlefield).toHaveLength(1);
  });

  test('accepts OPP SIDE alias for OPP BATTLEFIELD', () => {
    const result = parseBoardState('OPP SIDE\n- Mountain (untapped)');
    expect(result.oppBattlefield).toHaveLength(1);
  });

  test('accepts HAND alias', () => {
    const result = parseBoardState('HAND\n- Lightning Bolt');
    expect(result.myHand).toHaveLength(1);
  });

  test('parses full board example correctly', () => {
    const text = [
      'MY BATTLEFIELD',
      '  - Birds of Paradise (untapped)',
      '  - Lightning Angel (untapped)',
      'OPP BATTLEFIELD',
      '  - Tarmogoyf (attacking)',
      'MY HAND',
      '  - Lightning Bolt',
      '  - Counterspell',
      'STACK',
      '  1. Doom Blade targeting Birds of Paradise',
      'MANA: WWUUR',
    ].join('\n');

    const result = parseBoardState(text);
    expect(result.myBattlefield).toHaveLength(2);
    expect(result.oppBattlefield).toHaveLength(1);
    expect(result.myHand).toHaveLength(2);
    expect(result.stack).toHaveLength(1);
    expect(result.stack[0].target).toBe('Birds of Paradise');
    expect(result.mana).toBe('WWUUR');
  });

  test('permanent without parentheses is untapped by default', () => {
    const result = parseBoardState('MY BATTLEFIELD\n- Forest');
    expect(result.myBattlefield[0]).toMatchObject({ name: 'Forest', untapped: true, tapped: false });
  });

  test('ignores lines before any section header', () => {
    const result = parseBoardState('Some random text\n- Island\nMY HAND\n- Lightning Bolt');
    expect(result.myHand).toEqual(['Lightning Bolt']);
  });
});
