import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../utils/scryfall', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, getCheapestPrintingPrice: vi.fn(), getCardOldestPrinting: vi.fn() };
});

import { getCheapestPrintingPrice, getCardOldestPrinting } from '../utils/scryfall';
import CustomMtglePage, { buildQuery } from '../pages/CustomMtglePage';
import Mtgle from '../components/Mtgle';

// ── buildQuery unit tests ─────────────────────────────────────────────────────

describe('buildQuery', () => {
  test('empty filters include no-token and lang:en base', () => {
    const q = buildQuery({ colors: [], types: [], rarities: [], sets: [] });
    expect(q).toContain('-is:token');
    expect(q).toContain('lang:en');
  });

  test('single color produces c: predicate', () => {
    const q = buildQuery({ colors: ['r'], types: [], rarities: [], sets: [] });
    expect(q).toContain('c:r');
  });

  test('multiple colors are joined with OR', () => {
    const q = buildQuery({ colors: ['w', 'u'], types: [], rarities: [], sets: [] });
    expect(q).toContain('c:w or c:u');
  });

  test('types produce t: predicates', () => {
    const q = buildQuery({ colors: [], types: ['Creature', 'Instant'], rarities: [], sets: [] });
    expect(q).toContain('t:creature');
    expect(q).toContain('t:instant');
    expect(q).toContain(' or ');
  });

  test('rarities produce r: predicates', () => {
    const q = buildQuery({ colors: [], types: [], rarities: ['Rare', 'Mythic'], sets: [] });
    expect(q).toContain('r:rare');
    expect(q).toContain('r:mythic');
  });

  test('sets produce e: predicates lowercased', () => {
    const q = buildQuery({ colors: [], types: [], rarities: [], sets: ['LTR', 'DSK'] });
    expect(q).toContain('e:ltr');
    expect(q).toContain('e:dsk');
  });

  test('bannedColors produce -c: predicates', () => {
    const q = buildQuery({ colors: [], types: [], rarities: [], sets: [], bannedColors: ['w', 'b'] });
    expect(q).toContain('-c:w');
    expect(q).toContain('-c:b');
  });

  test('bannedTypes produce -t: predicates', () => {
    const q = buildQuery({ colors: [], types: [], rarities: [], sets: [], bannedTypes: ['Creature'] });
    expect(q).toContain('-t:creature');
  });

  test('bannedRarities produce -r: predicates', () => {
    const q = buildQuery({ colors: [], types: [], rarities: [], sets: [], bannedRarities: ['Common'] });
    expect(q).toContain('-r:common');
  });

  test('bannedSets produce -e: predicates lowercased', () => {
    const q = buildQuery({ colors: [], types: [], rarities: [], sets: [], bannedSets: ['LEA', 'LEB'] });
    expect(q).toContain('-e:lea');
    expect(q).toContain('-e:leb');
  });

  test('include and exclude can coexist in same query', () => {
    const q = buildQuery({ colors: ['r'], types: [], rarities: [], sets: [], bannedColors: ['b'] });
    expect(q).toContain('c:r');
    expect(q).toContain('-c:b');
  });
});

// ── CustomMtglePage form ──────────────────────────────────────────────────────

const MOCK_CARD = {
  id: 'abc123',
  name: 'Black Lotus',
  type_line: 'Artifact',
  mana_cost: '{0}',
  oracle_text: 'Sacrifice Black Lotus: Add three mana of any one color.',
  keywords: [],
  set_name: 'Alpha',
  cmc: 0,
  image_uris: {
    normal: 'https://example.com/normal.jpg',
    art_crop: 'https://example.com/art.jpg',
  },
};

function renderPage() {
  return render(
    <MemoryRouter>
      <CustomMtglePage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(MOCK_CARD) })
  );
  getCheapestPrintingPrice.mockResolvedValue(null);
});

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

describe('CustomMtglePage builder form', () => {
  test('renders the page heading', () => {
    renderPage();
    expect(screen.getByText(/Custom MTGLE/i)).toBeInTheDocument();
  });

  test('shows color filter pills', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /White/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Blue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Red/i })).toBeInTheDocument();
  });

  test('shows card type pills', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Creature/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Instant/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Planeswalker/ })).toBeInTheDocument();
  });

  test('shows rarity pills', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Common/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mythic/ })).toBeInTheDocument();
  });

  test('shows include set code input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/e\.g\. dsk/i)).toBeInTheDocument();
  });

  test('shows exclude set code input', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/e\.g\. lea/i)).toBeInTheDocument();
  });

  test('shows Create Game button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Create Game/i })).toBeInTheDocument();
  });

  test('toggling a pill marks it as include', () => {
    renderPage();
    const pill = screen.getByRole('button', { name: /Red/i });
    expect(pill).not.toHaveClass('filter-pill-include');
    fireEvent.click(pill);
    expect(pill).toHaveClass('filter-pill-include');
  });

  test('pill cycles include → exclude → neutral on repeated clicks', () => {
    renderPage();
    const pill = screen.getByRole('button', { name: /Red/i });
    fireEvent.click(pill);
    expect(pill).toHaveClass('filter-pill-include');
    fireEvent.click(pill);
    expect(pill).toHaveClass('filter-pill-exclude');
    fireEvent.click(pill);
    expect(pill).not.toHaveClass('filter-pill-include');
    expect(pill).not.toHaveClass('filter-pill-exclude');
  });

  test('shows game mode toggle with Regular MTGLE and No-Hint Mode options', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Regular MTGLE/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /No-Hint Mode/i })).toBeInTheDocument();
  });

  test('Regular MTGLE is selected by default', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Regular MTGLE/i })).toHaveClass('filter-pill-include');
    expect(screen.getByRole('button', { name: /No-Hint Mode/i })).not.toHaveClass('filter-pill-include');
  });

  test('clicking No-Hint Mode selects it and deselects Regular', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /No-Hint Mode/i }));
    expect(screen.getByRole('button', { name: /No-Hint Mode/i })).toHaveClass('filter-pill-include');
    expect(screen.getByRole('button', { name: /Regular MTGLE/i })).not.toHaveClass('filter-pill-include');
  });

  test('clicking Create Game calls Scryfall random endpoint', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.scryfall.com/cards/random'),
        expect.objectContaining({ headers: expect.objectContaining({ 'User-Agent': expect.stringContaining('mtg-hub') }) })
      );
    });
  });

  test('after successful fetch, shows the MTGLE game with Custom badge', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    await waitFor(() => expect(screen.getByText('Custom')).toBeInTheDocument());
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });
});

// ── NoHintMtgle in custom mode via page ──────────────────────────────────────

describe('CustomMtglePage in no-hint mode', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(MOCK_CARD) })
    );
    getCheapestPrintingPrice.mockResolvedValue(null);
    getCardOldestPrinting.mockResolvedValue(MOCK_CARD);
  });

  test('creates a No-Hint game and shows No-Hint Mode header', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /No-Hint Mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    await waitFor(() => expect(screen.getByText('🧠 No-Hint Mode')).toBeInTheDocument());
  });

  test('shows Custom badge in no-hint custom mode', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /No-Hint Mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    await waitFor(() => expect(screen.getByText('Custom')).toBeInTheDocument());
    expect(screen.queryByText(/^#\d+$/)).not.toBeInTheDocument();
  });

  test('shows New Custom Game button after winning in no-hint mode', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /No-Hint Mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    await waitFor(() => expect(screen.getByText('🧠 No-Hint Mode')).toBeInTheDocument());

    const input = screen.getByPlaceholderText(/Guess any card name/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /^Guess$/ }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /New Custom Game/i })).toBeInTheDocument()
    );
  });
});

// ── Mtgle component in custom mode ───────────────────────────────────────────

describe('Mtgle in custom mode', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(MOCK_CARD) })
    );
  });

  async function renderCustom(onNewGame = vi.fn()) {
    render(
      <MemoryRouter>
        <Mtgle overrideCard={MOCK_CARD} onNewGame={onNewGame} />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/MTGLE/)).toBeInTheDocument());
  }

  test('shows Custom badge instead of puzzle number', async () => {
    await renderCustom();
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.queryByText(/^#\d+$/)).not.toBeInTheDocument();
  });

  test('does not render streak row', async () => {
    await renderCustom();
    expect(screen.queryByTitle('Current streak')).not.toBeInTheDocument();
  });

  test('correct guess shows win message', async () => {
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => expect(screen.getByText(/You got it/i)).toBeInTheDocument());
  });

  test('shows New Custom Game button after game over', async () => {
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /New Custom Game/i })).toBeInTheDocument()
    );
  });

  test('clicking New Custom Game calls onNewGame callback', async () => {
    const onNewGame = vi.fn();
    await renderCustom(onNewGame);
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() =>
      fireEvent.click(screen.getByRole('button', { name: /New Custom Game/i }))
    );
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  test('does not show Share Result button in custom mode', async () => {
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Black Lotus' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => screen.getByText(/You got it/i));
    expect(screen.queryByText(/Share Result/i)).not.toBeInTheDocument();
  });

  test('does not save game state to localStorage in custom mode', async () => {
    await renderCustom();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Wrong Card' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(1));
    expect(localStorage.getItem('mtg-hub:mtgle-game')).toBeNull();
  });
});
