import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import SpotlightArchive from '../components/helper/SpotlightArchive';
import { SPOTLIGHTS } from '../data/spotlights';

// Pin Date.now() so dailySpotlightIndex() is deterministic.
// Day 20620 % 8 === 4, which is "Mana Ramp" (index 4).
const PINNED_DAY = 20620;
const PINNED_NOW = PINNED_DAY * 86400000;
const TODAY_IDX  = PINNED_DAY % SPOTLIGHTS.length;

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(PINNED_NOW);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SpotlightArchive', () => {
  test('renders intro text', () => {
    render(<SpotlightArchive />);
    expect(screen.getByText(/new spotlight rotates in every day/i)).toBeInTheDocument();
  });

  test('renders a row for every spotlight', () => {
    render(<SpotlightArchive />);
    for (const spot of SPOTLIGHTS) {
      expect(screen.getByText(spot.title)).toBeInTheDocument();
    }
  });

  test("today's spotlight has the Today badge", () => {
    render(<SpotlightArchive />);
    const badges = screen.getAllByText('Today');
    expect(badges).toHaveLength(1);
    const row = badges[0].closest('.spotlight-archive-row');
    expect(row).toHaveTextContent(SPOTLIGHTS[TODAY_IDX].title);
  });

  test("today's spotlight is open by default", () => {
    render(<SpotlightArchive />);
    expect(screen.getByText(SPOTLIGHTS[TODAY_IDX].desc)).toBeInTheDocument();
  });

  test('clicking a closed row opens it and shows desc + notes + tip', () => {
    render(<SpotlightArchive />);
    const otherIdx = (TODAY_IDX + 1) % SPOTLIGHTS.length;
    const other = SPOTLIGHTS[otherIdx];

    // Desc should not be visible before click
    expect(screen.queryByText(other.desc)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(other.title));

    expect(screen.getByText(other.desc)).toBeInTheDocument();
    expect(screen.getByText(other.notes)).toBeInTheDocument();
    expect(screen.getByText(/New Player Tip:/)).toBeInTheDocument();
    expect(screen.getByText(/Browse example cards on Scryfall/i)).toBeInTheDocument();
  });

  test('clicking an open row collapses it', () => {
    render(<SpotlightArchive />);
    const title = SPOTLIGHTS[TODAY_IDX].title;
    const desc  = SPOTLIGHTS[TODAY_IDX].desc;

    expect(screen.getByText(desc)).toBeInTheDocument();
    fireEvent.click(screen.getByText(title));
    expect(screen.queryByText(desc)).not.toBeInTheDocument();
  });

  test('Scryfall browse link has the right query encoded in href', () => {
    render(<SpotlightArchive />);
    const link = screen.getByRole('link', { name: /Browse example cards on Scryfall/i });
    expect(link.href).toContain('scryfall.com/search');
    expect(link.href).toContain(encodeURIComponent(SPOTLIGHTS[TODAY_IDX].query));
    expect(link.getAttribute('target')).toBe('_blank');
  });
});

describe('spotlights data', () => {
  test('every spotlight has required fields', () => {
    for (const spot of SPOTLIGHTS) {
      expect(spot.title,  `${spot.title}: missing title`).toBeTruthy();
      expect(spot.icon,   `${spot.title}: missing icon`).toBeTruthy();
      expect(spot.color,  `${spot.title}: missing color`).toBeTruthy();
      expect(spot.desc,   `${spot.title}: missing desc`).toBeTruthy();
      expect(spot.tip,    `${spot.title}: missing tip`).toBeTruthy();
      expect(spot.notes,  `${spot.title}: missing notes`).toBeTruthy();
      expect(spot.query,  `${spot.title}: missing query`).toBeTruthy();
    }
  });

  test('dailySpotlightIndex returns an index within bounds', () => {
    const { dailySpotlightIndex } = require('../data/spotlights');
    const idx = dailySpotlightIndex();
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(SPOTLIGHTS.length);
  });
});
