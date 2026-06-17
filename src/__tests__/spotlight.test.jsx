import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import Spotlight from '../components/Spotlight';
import { SPOTLIGHTS, dailySpotlightIndex } from '../data/spotlights';

const PINNED_DAY = 20620;
beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(PINNED_DAY * 86400000);
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ image_uris: { normal: 'https://example.com/card.jpg' } }),
    })
  );
});
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

  test("renders placeholder cards for today's spotlight (loading state)", () => {
    renderSpotlight();
    const idx = dailySpotlightIndex();
    for (const name of SPOTLIGHTS[idx].cards) {
      expect(screen.getAllByTitle(name).length).toBeGreaterThan(0);
    }
  });

  test('card names are links to /prices', () => {
    renderSpotlight();
    const idx = dailySpotlightIndex();
    const link = screen.getAllByTitle(SPOTLIGHTS[idx].cards[0])[0].closest('a');
    expect(link).toBeInTheDocument();
  });

  test('no prev/next navigation buttons', () => {
    renderSpotlight();
    expect(screen.queryByTitle('Previous spotlight')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Next spotlight')).not.toBeInTheDocument();
  });

  test('renders card images (or placeholders) for all 6 cards', async () => {
    renderSpotlight();
    const idx = dailySpotlightIndex();
    // Images load asynchronously; once loaded each card becomes an <img>
    await waitFor(() => {
      const imgs = screen.getAllByRole('img');
      expect(imgs.length).toBe(SPOTLIGHTS[idx].cards.length);
    });
  });
});
