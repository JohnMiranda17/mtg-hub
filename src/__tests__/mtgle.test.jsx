import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';

// Mock scryfall to avoid sfetch cache and use oldest-printing format
vi.mock('../utils/scryfall', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, getCardOldestPrinting: vi.fn() };
});

import { getCardOldestPrinting } from '../utils/scryfall';
import Mtgle, { simplifyTypeLine, extractSubtypes, shuffledIndices, buildShareText } from '../components/Mtgle';

const MOCK_CARD = {
  name: 'Lightning Bolt',
  type_line: 'Instant',
  mana_cost: '{R}',
  oracle_text: 'Lightning Bolt deals 3 damage to any target.',
  keywords: [],
  set_name: 'Alpha',
  cmc: 1,
  image_uris: {
    normal: 'https://example.com/normal.jpg',
    art_crop: 'https://example.com/art.jpg',
  },
};

beforeEach(() => {
  localStorage.clear();
  getCardOldestPrinting.mockResolvedValue(MOCK_CARD);
  // Guess lookup goes through global.fetch (getCardByName is NOT mocked)
  // but Mtgle.jsx doesn't use getCardByName for guesses — they are string compares.
});

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

async function renderAndWait() {
  render(<Mtgle />);
  await waitFor(() => expect(screen.getByText(/MTGLE/)).toBeInTheDocument());
  await waitFor(() => screen.queryByText('Loading today') === null);
}

describe('Mtgle', () => {
  test('renders the MTGLE header', async () => {
    await renderAndWait();
    expect(screen.getByText(/MTGLE/)).toBeInTheDocument();
  });

  test('shows 8 guess slots', async () => {
    await renderAndWait();
    const slots = screen.getAllByText(/Guess \d|Current guess/);
    expect(slots.length).toBe(8);
  });

  test('card type hint is shown immediately for free', async () => {
    await renderAndWait();
    expect(screen.getByText('Card Type:')).toBeInTheDocument();
    expect(screen.getByText('Instant')).toBeInTheDocument();
  });


  test('mana value hint revealed after first wrong guess', async () => {
    await renderAndWait();
    expect(screen.queryByText('Mana Value:')).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Wrong Card' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));

    await waitFor(() => expect(screen.getByText('Mana Value:')).toBeInTheDocument());
  });

  test('exact mana cost hint revealed after four wrong guesses', async () => {
    await renderAndWait();

    for (let i = 0; i < 4; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
    }

    expect(screen.getByText('Mana Cost:')).toBeInTheDocument();
  });

  test('set hint revealed after six wrong guesses', async () => {
    await renderAndWait();

    for (let i = 0; i < 6; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
    }

    expect(screen.getByText('Set:')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  test('art crop shown after seven wrong guesses', async () => {
    await renderAndWait();

    for (let i = 0; i < 7; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
    }

    expect(screen.getByText('Art Crop:')).toBeInTheDocument();
    expect(screen.getByAltText('art crop')).toBeInTheDocument();
  });

  test('correct guess shows win message', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Lightning Bolt' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => expect(screen.getByText(/You got it/i)).toBeInTheDocument());
  });

  test('eight wrong guesses shows loss message', async () => {
    await renderAndWait();

    for (let i = 0; i < 8; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      if (i < 7) {
        await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
      }
    }

    await waitFor(() => expect(screen.getByText(/Better luck tomorrow/i)).toBeInTheDocument());
  });

  test('share result button appears after game ends', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Lightning Bolt' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => expect(screen.getByText(/Share Result/i)).toBeInTheDocument());
  });
});

describe('extractSubtypes', () => {
  test('extracts subtypes from legendary creature', () => {
    expect(extractSubtypes('Legendary Creature — Elf Druid')).toBe('Legendary, Elf, Druid');
  });

  test('extracts subtypes only (no supertype)', () => {
    expect(extractSubtypes('Enchantment — Aura')).toBe('Aura');
  });

  test('extracts supertype only (no subtype)', () => {
    expect(extractSubtypes('Legendary Instant')).toBe('Legendary');
  });

  test('returns null for bare type with no extras', () => {
    expect(extractSubtypes('Instant')).toBeNull();
  });

  test('handles kindred supertype', () => {
    expect(extractSubtypes('Kindred Sorcery — Shapeshifter')).toBe('Kindred, Shapeshifter');
  });
});

describe('buildShareText', () => {
  const MTGLE_URL = 'https://JohnMiranda17.github.io/mtg-hub/mtgle';

  test('contains the full MTGLE direct link', () => {
    const text = buildShareText([{ text: 'Wrong', correct: false }], false, 42);
    expect(text).toContain(MTGLE_URL);
  });

  test('shows puzzle number and guess count on win', () => {
    const text = buildShareText([{ text: 'Sol Ring', correct: true }], true, 5);
    expect(text).toContain('MTGLE #5');
    expect(text).toContain('1/8');
    expect(text).toContain('✅');
  });

  test('shows X/8 on loss', () => {
    const guesses = Array(8).fill(null).map(() => ({ text: 'Wrong', correct: false }));
    const text = buildShareText(guesses, false, 10);
    expect(text).toContain('X/8');
    expect(text).not.toContain('✅');
  });

  test('unfilled slots show as black squares', () => {
    const text = buildShareText([{ text: 'Sol Ring', correct: true }], true, 1);
    expect(text).toContain('⬛');
  });
});

describe('shuffledIndices', () => {
  test('returns a permutation of 0..length-1', () => {
    const order = shuffledIndices(56, 20240101);
    expect(order.length).toBe(56);
    expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: 56 }, (_, i) => i));
  });

  test('is not just the original sequential order', () => {
    const order = shuffledIndices(56, 20240101);
    expect(order).not.toEqual(Array.from({ length: 56 }, (_, i) => i));
  });

  test('is deterministic for the same seed', () => {
    expect(shuffledIndices(56, 20240101)).toEqual(shuffledIndices(56, 20240101));
  });

  test('different seeds produce different orders', () => {
    expect(shuffledIndices(56, 20240101)).not.toEqual(shuffledIndices(56, 999));
  });
});

describe('simplifyTypeLine', () => {
  test('keeps main type only from legendary creature', () => {
    expect(simplifyTypeLine('Legendary Creature — Elf Druid')).toBe('Creature');
  });

  test('keeps both main types for artifact creature', () => {
    expect(simplifyTypeLine('Artifact Creature — Construct')).toBe('Artifact Creature');
  });

  test('strips basic and land subtype', () => {
    expect(simplifyTypeLine('Basic Land — Forest')).toBe('Land');
  });

  test('keeps planeswalker', () => {
    expect(simplifyTypeLine('Legendary Planeswalker — Jace')).toBe('Planeswalker');
  });

  test('handles instant with no subtype', () => {
    expect(simplifyTypeLine('Instant')).toBe('Instant');
  });

  test('handles enchantment with subtype', () => {
    expect(simplifyTypeLine('Enchantment — Aura')).toBe('Enchantment');
  });

  test('strips kindred/tribal supertype', () => {
    expect(simplifyTypeLine('Kindred Sorcery — Shapeshifter')).toBe('Sorcery');
  });

  test('handles double-faced card front face only', () => {
    expect(simplifyTypeLine('Creature — Werewolf // Creature — Werewolf')).toBe('Creature');
  });
});
