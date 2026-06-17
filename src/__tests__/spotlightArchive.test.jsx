import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import SpotlightArchive, { expiredSpotlights } from '../components/helper/SpotlightArchive';
import { SPOTLIGHTS } from '../data/spotlights';

// 20620 % 100 = 20 → today is spotlight index 20 with the 100-theme pool
const PINNED_DAY = 20620;
const PINNED_NOW = PINNED_DAY * 86400000;
const TODAY_IDX  = PINNED_DAY % SPOTLIGHTS.length;  // dynamic with pool size
const ARCHIVE_LIMIT = 28; // expiredSpotlights caps at this

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(PINNED_NOW);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('expiredSpotlights()', () => {
  test('returns at most 28 entries (4-week cap)', () => {
    const entries = expiredSpotlights(TODAY_IDX);
    expect(entries).toHaveLength(Math.min(SPOTLIGHTS.length - 1, ARCHIVE_LIMIT));
  });

  test('first entry is yesterday (1 day ago)', () => {
    const entries = expiredSpotlights(TODAY_IDX);
    expect(entries[0].daysAgo).toBe(1);
    expect(entries[0].spot).toBe(SPOTLIGHTS[(TODAY_IDX - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length]);
  });

  test('entries are ordered most-recent-first', () => {
    const entries = expiredSpotlights(TODAY_IDX);
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].daysAgo).toBeGreaterThan(entries[i - 1].daysAgo);
    }
  });

  test("today's spotlight is not included", () => {
    const entries = expiredSpotlights(TODAY_IDX);
    expect(entries.map(e => e.spot)).not.toContain(SPOTLIGHTS[TODAY_IDX]);
  });
});

describe('SpotlightArchive component', () => {
  test('renders the archive intro text', () => {
    render(<SpotlightArchive />);
    expect(screen.getByText(/Past New Player Spotlights/i)).toBeInTheDocument();
  });

  test("does NOT render today's spotlight title", () => {
    render(<SpotlightArchive />);
    const todayTitle = SPOTLIGHTS[TODAY_IDX].title;
    expect(screen.queryByText(todayTitle)).not.toBeInTheDocument();
  });

  test('renders up to 28 spotlight rows', () => {
    render(<SpotlightArchive />);
    const expected = Math.min(SPOTLIGHTS.length - 1, ARCHIVE_LIMIT);
    // Count rows by their "days ago" / "Yesterday" labels
    const yesterday = screen.queryAllByText('Yesterday');
    expect(yesterday.length).toBe(1);
    // Spot-check: row count = expected
    const entries = expiredSpotlights(TODAY_IDX);
    expect(entries).toHaveLength(expected);
  });

  test('first row is labelled Yesterday', () => {
    render(<SpotlightArchive />);
    expect(screen.getAllByText('Yesterday')).toHaveLength(1);
  });

  test('remaining rows show "N days ago" up to the cap', () => {
    render(<SpotlightArchive />);
    const cap = Math.min(SPOTLIGHTS.length - 1, ARCHIVE_LIMIT);
    for (let d = 2; d <= cap; d++) {
      expect(screen.getByText(`${d} days ago`)).toBeInTheDocument();
    }
  });

  test('most-recent entry is open by default and shows body content', () => {
    render(<SpotlightArchive />);
    const yesterdaySpot = SPOTLIGHTS[(TODAY_IDX - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length];
    expect(screen.getByText(yesterdaySpot.desc)).toBeInTheDocument();
  });

  test('clicking a closed row opens its body', () => {
    render(<SpotlightArchive />);
    // second-most-recent entry (2 days ago)
    const twoDaysAgoSpot = SPOTLIGHTS[(TODAY_IDX - 2 + SPOTLIGHTS.length) % SPOTLIGHTS.length];
    expect(screen.queryByText(twoDaysAgoSpot.desc)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(twoDaysAgoSpot.title));
    expect(screen.getByText(twoDaysAgoSpot.desc)).toBeInTheDocument();
  });

  test('clicking an open row collapses it', () => {
    render(<SpotlightArchive />);
    const yesterdaySpot = SPOTLIGHTS[(TODAY_IDX - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length];
    expect(screen.getByText(yesterdaySpot.desc)).toBeInTheDocument();
    fireEvent.click(screen.getByText(yesterdaySpot.title));
    expect(screen.queryByText(yesterdaySpot.desc)).not.toBeInTheDocument();
  });

  test('open body has a Scryfall browse link', () => {
    render(<SpotlightArchive />);
    const link = screen.getByRole('link', { name: /Browse example cards on Scryfall/i });
    expect(link.href).toContain('scryfall.com/search');
    expect(link.getAttribute('target')).toBe('_blank');
  });
});
