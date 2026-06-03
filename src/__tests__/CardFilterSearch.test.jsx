import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardFilterSearch from '../components/CardFilterSearch';

// Mock the entire scryfall module so tests never make real HTTP requests.
// searchCards returns the result grid; autocomplete returns name suggestions;
// getCardImage is stubbed to null so no <img> src is needed in assertions.
vi.mock('../utils/scryfall', () => ({
  searchCards:  vi.fn(),
  getCardImage: vi.fn(() => null),
  autocomplete: vi.fn(),
}));

import { searchCards, autocomplete } from '../utils/scryfall';

// Minimal card object that satisfies all the fields CardFilterSearch renders.
const MOCK_CARD = {
  id: 'abc123',
  name: 'Lightning Bolt',
  set_name: 'Alpha',
  type_line: 'Instant',
  prices: { usd: '1.50' },
};

// Default mocks: empty results so tests that don't need results don't break.
beforeEach(() => {
  searchCards.mockResolvedValue({ data: [], total: 0 });
  autocomplete.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Core search behaviour ─────────────────────────────────────────────────────

describe('CardFilterSearch', () => {
  // The component should always render a text input and a Search button on
  // mount, regardless of any props passed to it.
  test('renders the search input and Search button', () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    expect(screen.getByPlaceholderText(/Name or Scryfall syntax/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  // When the query text and all filter chips are empty, buildQuery() returns
  // an empty string and the Search button must be disabled to prevent a
  // blank Scryfall request.
  test('Search button is disabled when query and all filters are empty', () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  // As soon as the user types any text, buildQuery() returns a non-empty
  // string and the Search button should become enabled.
  test('Search button enables when text is typed', () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'island' },
    });
    expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled();
  });

  // Clicking Search should immediately clear the text input. This prevents
  // the user from having to manually delete their query before typing the
  // next card name — the core UX requirement that prompted this test.
  test('clears the input text after clicking Search', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'lightning bolt' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(input.value).toBe(''));
  });

  // The text typed in the input should be passed verbatim to searchCards so
  // Scryfall receives the exact query the user wrote, including any operators.
  test('calls searchCards with the typed query', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'counterspell' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('counterspell'));
  });

  // Pressing Enter in the text input should trigger the same search as
  // clicking the Search button — a standard form-submission affordance.
  test('Enter key triggers the search', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'island' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('island'));
  });

  // When searchCards resolves with results, each card's name should appear
  // in the results grid so the user can identify and click the card they want.
  test('shows a result card when searchCards returns data', async () => {
    searchCards.mockResolvedValue({ data: [MOCK_CARD], total: 1 });
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'lightning bolt' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText('Lightning Bolt'));
    expect(screen.getByText('Lightning Bolt')).toBeInTheDocument();
  });

  // Clicking a result card should call onSelect with the full card object
  // so the parent (Prices, Collection) can load prices or add the card.
  test('calls onSelect with the card when a result is clicked', async () => {
    searchCards.mockResolvedValue({ data: [MOCK_CARD], total: 1 });
    const onSelect = vi.fn();
    render(<CardFilterSearch onSelect={onSelect} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'lightning bolt' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText('Lightning Bolt'));
    fireEvent.click(screen.getByText('Lightning Bolt'));
    expect(onSelect).toHaveBeenCalledWith(MOCK_CARD);
  });

  // When the search returns zero results, the component should show a
  // "No cards matched" message so the user knows the search ran successfully
  // but found nothing — as opposed to never having searched at all.
  test('shows "No cards matched" when search returns empty results', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'zzzyyyxxx not a card' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText(/No cards matched/i));
  });

  // If searchCards throws (network error, Scryfall 500, etc.), the component
  // should display a "Search failed" error message rather than crashing.
  test('shows error message when searchCards throws', async () => {
    searchCards.mockRejectedValue(new Error('Network error'));
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'counterspell' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText(/Search failed/i));
  });

  // When Scryfall returns more than 24 total matches, the component caps the
  // display at 24 and shows the total count so the user knows to refine their
  // query if they didn't find what they wanted.
  test('shows total count when more than 24 results exist', async () => {
    const cards = Array.from({ length: 24 }, (_, i) => ({ ...MOCK_CARD, id: String(i) }));
    searchCards.mockResolvedValue({ data: cards, total: 100 });
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'lightning' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText(/100 results/i));
  });

  // When showPrices=true, each result card should display its USD price so
  // the user can compare prices without navigating away to the Prices page.
  test('shows price when showPrices prop is true', async () => {
    searchCards.mockResolvedValue({ data: [MOCK_CARD], total: 1 });
    render(<CardFilterSearch onSelect={() => {}} showPrices />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'lightning bolt' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText('$1.50'));
  });
});

// ── Autocomplete suggestions ──────────────────────────────────────────────────
// These tests use real timers because the debounce is a real setTimeout.
// autocomplete mock resolves synchronously so waitFor catches it quickly.

describe('CardFilterSearch — autocomplete', () => {
  beforeEach(() => {
    searchCards.mockResolvedValue({ data: [], total: 0 });
    autocomplete.mockResolvedValue([]);
  });

  afterEach(() => vi.clearAllMocks());

  // After 200 ms of no further typing, autocomplete should be called and its
  // suggestions should appear in a dropdown list below the input. This lets
  // the user pick a card name without typing it in full.
  test('shows suggestions after debounce when 2+ chars typed', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt', 'Lightning Strike', 'Lightning Helix']);
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'li' },
    });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    expect(screen.getByText('Lightning Strike')).toBeInTheDocument();
  }, 3000);

  // A single character is too short for useful autocomplete results and would
  // produce too many irrelevant suggestions. The autocomplete call should be
  // skipped entirely until at least 2 characters are typed.
  test('does not call autocomplete for fewer than 2 chars', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'l' },
    });
    // Wait longer than the debounce to confirm autocomplete was never called.
    await new Promise(r => setTimeout(r, 300));
    expect(autocomplete).not.toHaveBeenCalled();
  }, 3000);

  // Queries containing Scryfall operators (t:, c:, e:, >=, etc.) are syntax
  // expressions, not card names. Autocomplete would return irrelevant results,
  // so it is suppressed for any query that contains those characters.
  test('does not call autocomplete when query contains Scryfall operators', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 't:instant' },
    });
    await new Promise(r => setTimeout(r, 300));
    expect(autocomplete).not.toHaveBeenCalled();
  }, 3000);

  // Clicking a suggestion should immediately trigger a full Scryfall search
  // for that card name (combining it with any active filter chips), so the
  // user gets results with a single click rather than having to press Search.
  test('clicking a suggestion triggers a search with that name', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt', 'Lightning Strike']);
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'li' },
    });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    // mouseDown is used because the suggestion uses onMouseDown to prevent
    // the input from losing focus and hiding the dropdown before the click fires.
    fireEvent.mouseDown(screen.getByText('Lightning Bolt'));
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('Lightning Bolt'));
  }, 3000);

  // ArrowDown moves highlight to the first suggestion; Enter then picks it
  // and triggers a search. This lets keyboard-only users navigate the list
  // without touching the mouse.
  test('ArrowDown then Enter selects the highlighted suggestion', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt', 'Lightning Strike']);
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'li' } });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // highlight index 0
    fireEvent.keyDown(input, { key: 'Enter' });      // pick highlighted item
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('Lightning Bolt'));
  }, 3000);

  // Pressing Escape should dismiss the suggestion dropdown without triggering
  // a search or selecting any suggestion, letting the user abandon the
  // autocomplete flow and keep typing their own query.
  test('Escape closes the suggestions list', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt']);
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'li' } });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    fireEvent.keyDown(input, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText('Lightning Bolt')).not.toBeInTheDocument());
  }, 3000);
});
