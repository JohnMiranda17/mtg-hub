import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import Combos from '../pages/Combos';
import { dailyTopCombo } from '../data/topCombos';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

function renderCombos() {
  return render(
    <MemoryRouter>
      <Combos />
    </MemoryRouter>
  );
}

describe('Combos page', () => {
  test('renders the page heading', () => {
    renderCombos();
    expect(screen.getByRole('heading', { name: /💥 Combos/i })).toBeInTheDocument();
  });

  test('renders all four sub-tabs', () => {
    renderCombos();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top Combos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Combo Finder/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Game Winner/i })).toBeInTheDocument();
  });

  test('Search tab is active by default', () => {
    renderCombos();
    expect(screen.getByRole('button', { name: /Find Combos/i })).toBeInTheDocument();
  });

  test('renders the search button', () => {
    renderCombos();
    expect(screen.getByRole('button', { name: /find combos/i })).toBeInTheDocument();
  });

  test('renders the What is a Combo section', () => {
    renderCombos();
    expect(screen.getByText('What is a Combo?')).toBeInTheDocument();
  });

  test('renders all combo type cards', () => {
    renderCombos();
    expect(screen.getAllByText(/Infinite Mana/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Instant Win/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Infinite Tokens/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Infinite Damage/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Infinite Turns/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Infinite Draw/).length).toBeGreaterThan(0);
  });

  test('expanding a combo type shows how to stop it', () => {
    renderCombos();
    const btn = screen.getAllByRole('button').find(b =>
      b.textContent.includes('Infinite Mana') && !b.textContent.includes('+')
    );
    fireEvent.click(btn);
    expect(screen.getAllByText(/How to stop it/i).length).toBeGreaterThan(0);
  });

  test("renders today's featured combo section on search tab", () => {
    renderCombos();
    expect(screen.getByText(/Today's Featured Combo/i)).toBeInTheDocument();
  });

  test("daily featured combo card is visible by default", () => {
    renderCombos();
    const daily = dailyTopCombo();
    expect(screen.getAllByText(new RegExp(daily.type, 'i')).length).toBeGreaterThan(0);
  });

  test("expanding the daily featured combo shows prerequisites", () => {
    renderCombos();
    const daily = dailyTopCombo();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(daily.cards[0])
    );
    expect(chip).toBeDefined();
    fireEvent.click(chip);
    expect(screen.getAllByText(/Prerequisites/i).length).toBeGreaterThan(0);
  });

  test('switching to Top Combos tab shows type filter buttons', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Top Combos/i }));
    expect(screen.getByRole('button', { name: /^All$/ })).toBeInTheDocument();
  });

  test('Top Combos tab shows type filter buttons', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Top Combos/i }));
    expect(screen.getByRole('button', { name: /^All$/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Infinite Mana/i }).length).toBeGreaterThan(0);
  });

  test('Top Combos tab can filter by Infinite Mana type', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Top Combos/i }));
    const infiniteManaFilter = screen.getAllByRole('button').find(b => b.textContent === 'Infinite Mana');
    expect(infiniteManaFilter).toBeDefined();
    fireEvent.click(infiniteManaFilter);
    // After filtering, count text like "20 combos" appears
    expect(screen.getAllByText(/\d+ combos?/).length).toBeGreaterThan(0);
  });

  test('switching to Combo Finder tab renders the puzzle', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Combo Finder/i }));
    // heading h3 is inside the tab — there are two matches (tab button + h3), so use getAllBy
    expect(screen.getAllByText(/🔄 Combo Finder/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Puzzle \d+\/\d+/)).toBeInTheDocument();
  });

  test('Combo Finder shows Your Battlefield zone', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Combo Finder/i }));
    expect(screen.getByText(/Your Battlefield/i)).toBeInTheDocument();
  });

  test('Combo Finder shows Submit and Reset buttons', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Combo Finder/i }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('Combo Finder shows result type dropdown', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Combo Finder/i }));
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('Combo Finder submit is disabled without selections', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Combo Finder/i }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  test('switching to Game Winner tab renders the puzzle', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Game Winner/i }));
    expect(screen.getAllByText(/🏆 Game Winner/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Puzzle \d+\/\d+/)).toBeInTheDocument();
  });

  test('Game Winner shows opponent life', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Game Winner/i }));
    expect(screen.getByText(/Opponent life/i)).toBeInTheDocument();
  });

  test('Game Winner shows Submit and Reset buttons', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Game Winner/i }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('Game Winner submit is disabled without selections', () => {
    renderCombos();
    fireEvent.click(screen.getByRole('button', { name: /Game Winner/i }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
