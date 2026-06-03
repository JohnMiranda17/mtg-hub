// Tests for useBinders localStorage logic and validateDeck format rules.
// The hooks are tested in isolation using a mock AuthContext (no user logged
// in) so they fall back to localStorage — no Supabase connection needed.

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { validateDeck } from '../hooks/useDecks';

// ── validateDeck ──────────────────────────────────────────────────────────────

function makeCard(name, quantity, overrides = {}) {
  return { scryfallId: name, cardName: name, imageUri: null, quantity, isCommander: false, isSideboard: false, ...overrides };
}

function makeDeck(format, cards) {
  return { id: '1', name: 'Test', format, cards };
}

describe('validateDeck — commander', () => {
  // A full valid Commander deck: 100 cards, 1 commander, all singletons.
  // Expected: no errors returned.
  test('valid 100-card commander deck with 1 commander returns no errors', () => {
    const cards = [
      makeCard('Sol Ring', 1, { isCommander: false }),
      ...Array.from({ length: 98 }, (_, i) => makeCard(`Card ${i}`, 1)),
      makeCard('Atraxa', 1, { isCommander: true }),
    ];
    const deck = makeDeck('commander', cards);
    expect(validateDeck(deck)).toHaveLength(0);
  });

  // If no commander is designated the validator must flag it.
  // Expected: error message mentioning "No commander".
  test('flags missing commander', () => {
    const cards = Array.from({ length: 100 }, (_, i) => makeCard(`Card ${i}`, 1));
    const errors = validateDeck(makeDeck('commander', cards));
    expect(errors.some(e => /no commander/i.test(e))).toBe(true);
  });

  // Commander decks must be exactly 100 cards. 99 is invalid.
  // Expected: error mentioning the current count.
  test('flags deck with fewer than 100 cards', () => {
    const cards = [
      makeCard('Atraxa', 1, { isCommander: true }),
      ...Array.from({ length: 98 }, (_, i) => makeCard(`Card ${i}`, 1)),
    ];
    const errors = validateDeck(makeDeck('commander', cards));
    expect(errors.some(e => /99/.test(e))).toBe(true);
  });

  // Non-basic cards can only appear once in a Commander deck.
  // Expected: error mentioning the duplicate card name.
  test('flags non-basic card with quantity > 1', () => {
    const cards = [
      makeCard('Atraxa', 1, { isCommander: true }),
      makeCard('Sol Ring', 2),
      ...Array.from({ length: 97 }, (_, i) => makeCard(`Card ${i}`, 1)),
    ];
    const errors = validateDeck(makeDeck('commander', cards));
    expect(errors.some(e => e.includes('Sol Ring'))).toBe(true);
  });

  // Basic lands may appear more than once — they are exempt from the 1-copy rule.
  // Expected: no errors for a deck with 5 Forests.
  test('allows basic lands with quantity > 1', () => {
    const cards = [
      makeCard('Atraxa', 1, { isCommander: true }),
      makeCard('Forest', 5),
      ...Array.from({ length: 94 }, (_, i) => makeCard(`Card ${i}`, 1)),
    ];
    expect(validateDeck(makeDeck('commander', cards))).toHaveLength(0);
  });
});

describe('validateDeck — standard / modern', () => {
  // A minimal valid Standard deck: 60 main deck cards, no sideboard.
  // Expected: no errors.
  test('valid 60-card standard deck returns no errors', () => {
    const cards = Array.from({ length: 60 }, (_, i) => makeCard(`Card ${i}`, 1));
    expect(validateDeck(makeDeck('standard', cards))).toHaveLength(0);
  });

  // Fewer than 60 main deck cards is illegal.
  // Expected: error mentioning the current count.
  test('flags fewer than 60 main deck cards', () => {
    const cards = Array.from({ length: 59 }, (_, i) => makeCard(`Card ${i}`, 1));
    const errors = validateDeck(makeDeck('modern', cards));
    expect(errors.some(e => /59/.test(e))).toBe(true);
  });

  // More than 4 copies of any non-basic card is illegal.
  // Expected: error mentioning the card name.
  test('flags non-basic card with quantity > 4', () => {
    const cards = [
      makeCard('Lightning Bolt', 5),
      ...Array.from({ length: 55 }, (_, i) => makeCard(`Card ${i}`, 1)),
    ];
    const errors = validateDeck(makeDeck('modern', cards));
    expect(errors.some(e => e.includes('Lightning Bolt'))).toBe(true);
  });

  // Up to 4 copies of any non-basic card is allowed.
  // Expected: no errors with exactly 4 copies.
  test('allows exactly 4 copies of a non-basic card', () => {
    const cards = [
      makeCard('Lightning Bolt', 4),
      ...Array.from({ length: 56 }, (_, i) => makeCard(`Card ${i}`, 1)),
    ];
    expect(validateDeck(makeDeck('modern', cards))).toHaveLength(0);
  });

  // Sideboard cannot exceed 15 cards.
  // Expected: error mentioning sideboard limit.
  test('flags sideboard exceeding 15 cards', () => {
    const main = Array.from({ length: 60 }, (_, i) => makeCard(`Card ${i}`, 1));
    const side = Array.from({ length: 16 }, (_, i) => makeCard(`Side ${i}`, 1, { isSideboard: true }));
    const errors = validateDeck(makeDeck('standard', [...main, ...side]));
    expect(errors.some(e => /sideboard/i.test(e))).toBe(true);
  });

  // A sideboard of exactly 15 cards is valid.
  // Expected: no sideboard error.
  test('allows sideboard of exactly 15 cards', () => {
    const main = Array.from({ length: 60 }, (_, i) => makeCard(`Card ${i}`, 1));
    const side = Array.from({ length: 15 }, (_, i) => makeCard(`Side ${i}`, 1, { isSideboard: true }));
    expect(validateDeck(makeDeck('standard', [...main, ...side]))).toHaveLength(0);
  });
});
