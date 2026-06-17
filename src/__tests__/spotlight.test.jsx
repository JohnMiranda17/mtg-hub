import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import Spotlight from '../components/Spotlight';
import { SPOTLIGHTS, dailySpotlightIndex } from '../data/spotlights';

const PINNED_DAY = 20620;
beforeEach(() => vi.spyOn(Date, 'now').mockReturnValue(PINNED_DAY * 86400000));
afterEach(() => vi.restoreAllMocks());

function renderSpotlight() {
  return render(<MemoryRouter><Spotlight /></MemoryRouter>);
}

describe('Spotlight', () => {
  test('renders New Player Spotlight eyebrow', () => {
    renderSpotlight();
    expect(screen.getByText(/new player spotlight/i)).toBeInTheDocument();
  });

  test("renders today's spotlight title", () => {
    renderSpotlight();
    const idx = dailySpotlightIndex();
    expect(screen.getByText(SPOTLIGHTS[idx].title)).toBeInTheDocument();
  });

  test('renders new player tip', () => {
    renderSpotlight();
    expect(screen.getByText(/new player tip/i)).toBeInTheDocument();
  });

  test("renders all 6 cards for today's spotlight", () => {
    renderSpotlight();
    const idx = dailySpotlightIndex();
    for (const name of SPOTLIGHTS[idx].cards) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  test('card names are links', () => {
    renderSpotlight();
    const idx = dailySpotlightIndex();
    const link = screen.getByText(SPOTLIGHTS[idx].cards[0]);
    expect(link.closest('a')).toBeInTheDocument();
  });

  test('no prev/next navigation buttons', () => {
    renderSpotlight();
    expect(screen.queryByTitle('Previous spotlight')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Next spotlight')).not.toBeInTheDocument();
  });

  test('does not call fetch (cards are hardcoded)', () => {
    const spy = vi.spyOn(window, 'fetch');
    renderSpotlight();
    expect(spy).not.toHaveBeenCalled();
  });
});
