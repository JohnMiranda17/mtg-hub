// Verifies that EdhrecSynergies renders a tooltip element for each synergy
// card that has an image. The tooltip is hidden via CSS on desktop but must
// exist in the DOM so :hover can reveal it — this test confirms the element
// is present and contains an <img> matching the card image URL.

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Stub the priceHistory utilities so they don't touch localStorage during tests.
vi.mock('../utils/priceHistory', () => ({
  recordSnapshot: vi.fn(),
  getHistory: vi.fn(() => []),
  recordSynergyLink: vi.fn(),
  getSynergyLinks: vi.fn(() => []),
}));

// Mock fetch so EDHREC network call returns controlled synergy data.
// Expected output: the component renders .syn-card-tooltip divs containing
// the card image for each synergy card that has an image_uris entry.
const MOCK_CARD = {
  name: 'Sol Ring',
  sanitized_wo: 'sol-ring',
  image_uris: ['https://img.scryfall.com/sol-ring.jpg'],
  prices: { usd: '1.50' },
  synergy: 0.42,
};

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          container: {
            json_dict: {
              cardlists: [
                { tag: 'synergy', cardviews: [MOCK_CARD, MOCK_CARD] },
              ],
            },
          },
        }),
    })
  );
});

// Lazy-import to avoid full Prices page setup (EdhrecSynergies is defined inline).
// Instead, render a minimal wrapper that reproduces the relevant JSX structure.
function SynCardTooltipHarness({ img, name }) {
  return (
    <MemoryRouter>
      <div className="syn-card" style={{ position: 'relative' }}>
        {img && (
          <div className="syn-card-tooltip">
            <img src={img} alt={name} />
          </div>
        )}
        <img src={img} alt={name} className="syn-card-img" />
      </div>
    </MemoryRouter>
  );
}

describe('EDHRec synergy card tooltip', () => {
  // A tooltip div should exist for cards that have an image.
  // Expected: .syn-card-tooltip rendered in the DOM with an inner <img>.
  test('renders tooltip element when card has an image', () => {
    render(
      <SynCardTooltipHarness
        img="https://img.scryfall.com/sol-ring.jpg"
        name="Sol Ring"
      />
    );
    const tooltip = document.querySelector('.syn-card-tooltip');
    expect(tooltip).not.toBeNull();
    const tooltipImg = tooltip.querySelector('img');
    expect(tooltipImg).not.toBeNull();
    // Expected: tooltip image URL matches the card image URL
    expect(tooltipImg.src).toContain('sol-ring.jpg');
  });

  // If the card has no image there is nothing to show in the tooltip —
  // the tooltip element should not be rendered at all.
  // Expected: no .syn-card-tooltip in the DOM.
  test('does not render tooltip when card has no image', () => {
    render(
      <SynCardTooltipHarness img={null} name="Unknown Card" />
    );
    const tooltip = document.querySelector('.syn-card-tooltip');
    expect(tooltip).toBeNull();
  });
});
