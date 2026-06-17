import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';

// Mock getCardOldestPrinting and getCheapestPrintingPrice to avoid sfetch network calls
vi.mock('../utils/scryfall', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, getCardOldestPrinting: vi.fn(), getCheapestPrintingPrice: vi.fn() };
});

import { getCardOldestPrinting, getCheapestPrintingPrice } from '../utils/scryfall';
import NoHintMtgle, { compareCards, getCardColors, getScoreTier } from '../components/NoHintMtgle';

// ── Pure-function unit tests ──────────────────────────────────────────────────

const SOL_RING = {
  name: 'Sol Ring', cmc: 1, colors: [], rarity: 'uncommon',
  type_line: 'Artifact',
  image_uris: { normal: 'https://example.com/sol-ring.jpg' },
};
const BLACK_LOTUS = {
  name: 'Black Lotus', cmc: 0, colors: [], rarity: 'rare',
  type_line: 'Artifact',
  image_uris: { normal: 'https://example.com/black-lotus.jpg' },
};
const LIGHTNING_BOLT = {
  name: 'Lightning Bolt', cmc: 1, colors: ['R'], rarity: 'common',
  type_line: 'Instant',
  image_uris: { normal: 'https://example.com/lb.jpg' },
};
const TARMOGOYF = {
  name: 'Tarmogoyf', cmc: 2, colors: ['G'], rarity: 'rare',
  type_line: 'Creature — Lhurgoyf',
  image_uris: { normal: 'https://example.com/goyf.jpg' },
};

describe('getCardColors', () => {
  test('returns colors array for colored card', () => {
    expect(getCardColors(LIGHTNING_BOLT)).toEqual(['R']);
  });
  test('returns empty array for colorless card', () => {
    expect(getCardColors(SOL_RING)).toEqual([]);
  });
  test('falls back to card_faces colors if no top-level colors', () => {
    const dfc = { card_faces: [{ colors: ['W', 'U'] }] };
    expect(getCardColors(dfc)).toEqual(['W', 'U']);
  });
});

describe('compareCards', () => {
  describe('CMC comparison', () => {
    test('exact when CMC matches', () => {
      const r = compareCards(SOL_RING, SOL_RING);
      expect(r.cmc.result).toBe('exact');
      expect(r.cmc.value).toBe(1);
    });
    test('low when guess CMC is lower than target', () => {
      // guess: Black Lotus (0), target: Sol Ring (1) → too low, target is higher
      const r = compareCards(BLACK_LOTUS, SOL_RING);
      expect(r.cmc.result).toBe('low');
    });
    test('high when guess CMC is higher than target', () => {
      // guess: Tarmogoyf (2), target: Sol Ring (1) → too high
      const r = compareCards(TARMOGOYF, SOL_RING);
      expect(r.cmc.result).toBe('high');
    });
  });

  describe('color comparison', () => {
    test('exact when both are colorless', () => {
      const r = compareCards(SOL_RING, BLACK_LOTUS); // both []
      expect(r.colors.result).toBe('exact');
      expect(r.colors.value).toBe('Colorless');
    });
    test('exact when both share the same color', () => {
      const r = compareCards(LIGHTNING_BOLT, LIGHTNING_BOLT); // both ['R']
      expect(r.colors.result).toBe('exact');
    });
    test('partial-more when guess has fewer colors than target', () => {
      // guess: colorless (0 colors), target: Lightning Bolt (1 color)
      const r = compareCards(SOL_RING, LIGHTNING_BOLT);
      expect(r.colors.result).toBe('partial-more');
    });
    test('partial-fewer when guess has more colors than target', () => {
      // guess: Lightning Bolt (1 color), target: colorless (0 colors)
      const r = compareCards(LIGHTNING_BOLT, SOL_RING);
      expect(r.colors.result).toBe('partial-fewer');
    });
    test('miss when same count but different colors', () => {
      const GREEN_CARD = { ...TARMOGOYF, colors: ['G'] };
      // guess: R, target: G — both 1 color but different
      const r = compareCards(LIGHTNING_BOLT, GREEN_CARD);
      expect(r.colors.result).toBe('miss');
    });
  });

  describe('type comparison', () => {
    test('match when cards share a main type', () => {
      const r = compareCards(SOL_RING, BLACK_LOTUS); // both Artifact
      expect(r.type.result).toBe('match');
    });
    test('miss when types do not overlap', () => {
      const r = compareCards(TARMOGOYF, LIGHTNING_BOLT); // Creature vs Instant
      expect(r.type.result).toBe('miss');
    });
    test('type value is the simplified type of the guessed card', () => {
      const r = compareCards(SOL_RING, BLACK_LOTUS);
      expect(r.type.value).toBe('Artifact');
    });
  });

  describe('rarity comparison', () => {
    test('match when rarities are the same', () => {
      const r = compareCards(SOL_RING, SOL_RING);
      expect(r.rarity.result).toBe('match');
    });
    test('miss when rarities differ', () => {
      const r = compareCards(SOL_RING, LIGHTNING_BOLT); // uncommon vs common
      expect(r.rarity.result).toBe('miss');
    });
  });

  test('isCorrect true when names match case-insensitively', () => {
    const r = compareCards(SOL_RING, { ...SOL_RING, name: 'sol ring' });
    expect(r.isCorrect).toBe(true);
  });
  test('isCorrect false when names differ', () => {
    const r = compareCards(BLACK_LOTUS, SOL_RING);
    expect(r.isCorrect).toBe(false);
  });
});

describe('getScoreTier', () => {
  test('1 guess = Legendary', () => {
    expect(getScoreTier(1).label).toMatch(/Legendary/);
  });
  test('3 guesses = Mythic', () => {
    expect(getScoreTier(3).label).toMatch(/Mythic/);
  });
  test('5 guesses = Rare', () => {
    expect(getScoreTier(5).label).toMatch(/Rare/);
  });
  test('10 guesses = Common', () => {
    expect(getScoreTier(10).label).toMatch(/Common/);
  });
  test('returns null beyond 10 guesses', () => {
    expect(getScoreTier(11)).toBeNull();
  });
});

// ── Component integration tests ───────────────────────────────────────────────

const MOCK_TARGET = {
  name: 'Sol Ring', cmc: 1, colors: [], rarity: 'uncommon',
  type_line: 'Artifact', set_name: 'Commander',
  image_uris: { normal: 'https://example.com/sol-ring.jpg', art_crop: 'https://example.com/art.jpg' },
  oracle_text: 'T: Add {C}{C}.', keywords: [],
};

beforeEach(() => {
  localStorage.clear();
  // daily card load → MOCK_TARGET; guessed card fetches → BLACK_LOTUS
  getCardOldestPrinting
    .mockResolvedValueOnce(MOCK_TARGET)
    .mockResolvedValue(BLACK_LOTUS);
  getCheapestPrintingPrice.mockResolvedValue(0.50);
});

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

async function renderAndWait() {
  render(<NoHintMtgle />);
  await waitFor(() => expect(screen.getByText('🧠 No-Hint Mode')).toBeInTheDocument());
  await waitFor(() => screen.queryByText('Loading today') === null);
}

describe('NoHintMtgle component', () => {
  test('renders the No-Hint Mode header', async () => {
    await renderAndWait();
    expect(screen.getByText('🧠 No-Hint Mode')).toBeInTheDocument();
  });

  test('shows instructions subtitle', async () => {
    await renderAndWait();
    expect(screen.getByText(/each guess reveals how its attributes compare/i)).toBeInTheDocument();
  });

  test('shows guess input and Guess button', async () => {
    await renderAndWait();
    expect(screen.getByPlaceholderText(/Guess any card name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Guess$/ })).toBeInTheDocument();
  });

  test('after a wrong guess shows comparison table header', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => expect(screen.getByText('Card Guessed')).toBeInTheDocument());
  });

  test('comparison row shows guessed card name', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => expect(screen.getByText('Black Lotus')).toBeInTheDocument());
  });

  test('correct guess shows win with score tier', async () => {
    getCardOldestPrinting
      .mockReset()
      .mockResolvedValueOnce(MOCK_TARGET)   // daily card
      .mockResolvedValue(MOCK_TARGET);      // guessed card = correct answer

    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Sol Ring' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => expect(screen.getByText(/Legendary/i)).toBeInTheDocument());
  });

  test('shows cheapest printing price hint', async () => {
    await renderAndWait();
    await waitFor(() => expect(screen.getByText(/\$0\.50/)).toBeInTheDocument());
  });

  test('saves game to localStorage after a guess', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => screen.getByText('Black Lotus'));
    expect(localStorage.getItem('mtg-hub:mtgle-nh-game')).not.toBeNull();
  });

  test('shows Share Result button after daily game ends', async () => {
    getCardOldestPrinting
      .mockReset()
      .mockResolvedValueOnce(MOCK_TARGET)
      .mockResolvedValue(MOCK_TARGET);

    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Sol Ring' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Share Result/i })).toBeInTheDocument());
  });
});

// ── Custom mode ───────────────────────────────────────────────────────────────

describe('NoHintMtgle in custom mode', () => {
  beforeEach(() => {
    getCardOldestPrinting.mockReset();
    getCardOldestPrinting.mockResolvedValue(BLACK_LOTUS);
    getCheapestPrintingPrice.mockResolvedValue(0.50);
  });

  async function renderCustom(onNewGame = vi.fn()) {
    render(<NoHintMtgle overrideCard={MOCK_TARGET} onNewGame={onNewGame} />);
    await waitFor(() => expect(screen.getByText('🧠 No-Hint Mode')).toBeInTheDocument());
  }

  test('renders No-Hint Mode header with Custom badge', async () => {
    await renderCustom();
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.queryByText(/^#\d+$/)).not.toBeInTheDocument();
  });

  test('does not save to localStorage after a guess', async () => {
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => screen.getByText('Black Lotus'));
    expect(localStorage.getItem('mtg-hub:mtgle-nh-game')).toBeNull();
  });

  test('shows New Custom Game button after winning', async () => {
    getCardOldestPrinting.mockResolvedValue(MOCK_TARGET);
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Sol Ring' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /New Custom Game/i })).toBeInTheDocument()
    );
  });

  test('clicking New Custom Game calls onNewGame', async () => {
    getCardOldestPrinting.mockResolvedValue(MOCK_TARGET);
    const onNewGame = vi.fn();
    await renderCustom(onNewGame);
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Sol Ring' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() =>
      fireEvent.click(screen.getByRole('button', { name: /New Custom Game/i }))
    );
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  test('does not show Share Result button in custom mode after win', async () => {
    getCardOldestPrinting.mockResolvedValue(MOCK_TARGET);
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Sol Ring' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() => screen.getByRole('button', { name: /New Custom Game/i }));
    expect(screen.queryByText(/Share Result/i)).not.toBeInTheDocument();
  });
});
