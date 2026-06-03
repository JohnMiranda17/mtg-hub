import { describe, test, expect } from 'vitest';
import { parseBoardState } from '../utils/boardParser';

// parseBoardState converts the app's plain-text board state format into a
// structured object used by the interaction engine and AI advisor.
// Output shape: { myBattlefield, oppBattlefield, myHand, myGraveyard,
//                 stack, mana, actionsThisTurn, parseErrors }

describe('parseBoardState', () => {
  // An empty string has no section headers or card lines. Every array field
  // should be empty and mana should be an empty string — no errors thrown.
  test('returns empty state for empty input', () => {
    const result = parseBoardState('');
    expect(result.myBattlefield).toHaveLength(0);
    expect(result.oppBattlefield).toHaveLength(0);
    expect(result.myHand).toHaveLength(0);
    expect(result.stack).toHaveLength(0);
    expect(result.mana).toBe('');
  });

  // Lines under "MY BATTLEFIELD" become permanent objects with tapped/untapped
  // flags derived from the parenthetical annotation. "untapped" → untapped=true,
  // tapped=false. "tapped" → tapped=true, untapped=false.
  test('parses MY BATTLEFIELD permanents', () => {
    const result = parseBoardState('MY BATTLEFIELD\n- Birds of Paradise (untapped)\n- Llanowar Elves (tapped)');
    expect(result.myBattlefield).toHaveLength(2);
    expect(result.myBattlefield[0]).toMatchObject({ name: 'Birds of Paradise', untapped: true, tapped: false });
    expect(result.myBattlefield[1]).toMatchObject({ name: 'Llanowar Elves', tapped: true, untapped: false });
  });

  // Permanents under "OPP BATTLEFIELD" land in oppBattlefield. The "attacking"
  // annotation should set attacking=true on the permanent object.
  test('parses OPP BATTLEFIELD with attacking creature', () => {
    const result = parseBoardState('OPP BATTLEFIELD\n- Tarmogoyf (attacking)');
    expect(result.oppBattlefield[0]).toMatchObject({ name: 'Tarmogoyf', attacking: true });
  });

  // Hand cards are stored as plain strings (just the card name) rather than
  // permanent objects — there are no tapped/attacking states for hand cards.
  test('parses MY HAND as plain name strings', () => {
    const result = parseBoardState('MY HAND\n- Lightning Bolt\n- Counterspell');
    expect(result.myHand).toEqual(['Lightning Bolt', 'Counterspell']);
  });

  // Graveyard cards, like hand cards, are stored as plain name strings.
  test('parses MY GRAVEYARD', () => {
    const result = parseBoardState('MY GRAVEYARD\n- Ancestral Recall');
    expect(result.myGraveyard).toEqual(['Ancestral Recall']);
  });

  // Stack entries can have a "targeting <target>" suffix. When present, the
  // spell name and target must be split into separate fields so the interaction
  // engine can evaluate responses.
  test('parses STACK entry with target', () => {
    const result = parseBoardState('STACK\n1. Doom Blade targeting Birds of Paradise');
    expect(result.stack[0]).toMatchObject({ spell: 'Doom Blade', target: 'Birds of Paradise' });
  });

  // Stack entries without a "targeting" clause should have target=null rather
  // than an empty string or undefined — the engine checks for null explicitly.
  test('parses STACK entry without target', () => {
    const result = parseBoardState('STACK\n1. Ancestral Recall');
    expect(result.stack[0]).toMatchObject({ spell: 'Ancestral Recall', target: null });
  });

  // "MANA: WWUUR" records available mana as an uppercase string. This is used
  // by the interaction engine to assess whether a spell can be cast this turn.
  test('parses MANA: line', () => {
    const result = parseBoardState('MANA: WWUUR');
    expect(result.mana).toBe('WWUUR');
  });

  // "ACTIONS THIS TURN" logs what has already happened, giving the AI advisor
  // context. Entries are plain strings stored in actionsThisTurn.
  test('parses ACTIONS THIS TURN', () => {
    const result = parseBoardState('ACTIONS THIS TURN\n- Cast Lightning Bolt');
    expect(result.actionsThisTurn).toContain('Cast Lightning Bolt');
  });

  // "MY SIDE" is an accepted alias for "MY BATTLEFIELD". Cards under it should
  // land in myBattlefield, not a separate field.
  test('accepts MY SIDE alias for MY BATTLEFIELD', () => {
    const result = parseBoardState('MY SIDE\n- Island (untapped)');
    expect(result.myBattlefield).toHaveLength(1);
  });

  // "OPP SIDE" is an accepted alias for "OPP BATTLEFIELD". Cards under it
  // should land in oppBattlefield.
  test('accepts OPP SIDE alias for OPP BATTLEFIELD', () => {
    const result = parseBoardState('OPP SIDE\n- Mountain (untapped)');
    expect(result.oppBattlefield).toHaveLength(1);
  });

  // "HAND" (without "MY") is an accepted alias for "MY HAND". Cards under it
  // should be added to myHand as plain strings.
  test('accepts HAND alias', () => {
    const result = parseBoardState('HAND\n- Lightning Bolt');
    expect(result.myHand).toHaveLength(1);
  });

  // Integration test using a realistic multi-section board state. Verifies that
  // all sections are parsed together in one pass without interfering with each
  // other, and that the stack target is correctly extracted.
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

  // A permanent listed without any parenthetical annotation (no tapped/untapped
  // keyword) should default to untapped=true, tapped=false — the most common
  // board state for a freshly played permanent.
  test('permanent without parentheses is untapped by default', () => {
    const result = parseBoardState('MY BATTLEFIELD\n- Forest');
    expect(result.myBattlefield[0]).toMatchObject({ name: 'Forest', untapped: true, tapped: false });
  });

  // Lines that appear before the first recognised section header have no
  // section to belong to. They should be silently ignored rather than
  // attributed to whichever section comes next.
  test('ignores lines before any section header', () => {
    const result = parseBoardState('Some random text\n- Island\nMY HAND\n- Lightning Bolt');
    expect(result.myHand).toEqual(['Lightning Bolt']);
  });
});
