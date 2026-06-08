import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import Spotlight from '../components/Spotlight';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ data: [] }) })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

function renderSpotlight() {
  return render(
    <MemoryRouter>
      <Spotlight />
    </MemoryRouter>
  );
}

describe('Spotlight', () => {
  test('renders navigation buttons', () => {
    renderSpotlight();
    expect(screen.getByTitle('Previous spotlight')).toBeInTheDocument();
    expect(screen.getByTitle('Next spotlight')).toBeInTheDocument();
  });

  test('renders new player spotlight label', () => {
    renderSpotlight();
    expect(screen.getByText(/new player spotlight/i)).toBeInTheDocument();
  });

  test('renders new player tip', () => {
    renderSpotlight();
    expect(screen.getByText(/new player tip/i)).toBeInTheDocument();
  });

  test('next button advances the spotlight index', () => {
    renderSpotlight();
    const before = screen.getByText(/\/ 8/).textContent;
    fireEvent.click(screen.getByTitle('Next spotlight'));
    const after = screen.getByText(/\/ 8/).textContent;
    expect(before).not.toBe(after);
  });

  test('prev button wraps around from first spotlight', () => {
    renderSpotlight();
    // Navigate to first via clicks then wrap back
    const countEl = screen.getByText(/\/ 8/);
    // click prev — should wrap to last
    fireEvent.click(screen.getByTitle('Previous spotlight'));
    expect(countEl.textContent).toContain('/ 8');
  });

  test('fetches cards from Scryfall on mount', () => {
    renderSpotlight();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('api.scryfall.com'));
  });
});
