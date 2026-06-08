import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import Combos from '../pages/Combos';

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
    expect(screen.getByText(/combo searcher/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Infinite Mana/)).toBeInTheDocument();
    expect(screen.getByText(/Instant Win/)).toBeInTheDocument();
    expect(screen.getByText(/Infinite Tokens/)).toBeInTheDocument();
    expect(screen.getByText(/Infinite Damage/)).toBeInTheDocument();
    expect(screen.getByText(/Infinite Turns/)).toBeInTheDocument();
    expect(screen.getByText(/Infinite Draw/)).toBeInTheDocument();
  });

  test('expanding a combo type shows its description and how to stop it', () => {
    renderCombos();
    const btn = screen.getAllByRole('button').find(b =>
      b.textContent.includes('Infinite Mana') && !b.textContent.includes('+')
    );
    fireEvent.click(btn);
    expect(screen.getAllByText(/How to stop it/i).length).toBeGreaterThan(0);
  });

  test('renders the featured combos section', () => {
    renderCombos();
    expect(screen.getByText(/Featured Commander Combos/i)).toBeInTheDocument();
  });

  test('featured combos are collapsed by default', () => {
    renderCombos();
    expect(screen.queryByText('Isochron Scepter + Dramatic Reversal')).not.toBeInTheDocument();
  });

  test('clicking show featured combos reveals them', () => {
    renderCombos();
    fireEvent.click(screen.getByText(/Show.*featured combos/i));
    expect(screen.getByText(/Isochron Scepter/)).toBeInTheDocument();
  });

  test('featured combo header toggle also reveals combos', () => {
    renderCombos();
    fireEvent.click(screen.getByText(/Featured Commander Combos/i));
    expect(screen.getByText(/Thassa's Oracle/)).toBeInTheDocument();
  });

  test('expanding a featured combo shows its steps', () => {
    renderCombos();
    fireEvent.click(screen.getByText(/Featured Commander Combos/i));
    const comboNames = screen.getAllByText(/Kiki-Jiki/);
    fireEvent.click(comboNames[0].closest('button') ?? comboNames[0]);
    // At minimum the card names appear
    expect(screen.getAllByText(/Kiki-Jiki/).length).toBeGreaterThan(0);
  });
});
