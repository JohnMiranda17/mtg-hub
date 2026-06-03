import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardFilterSearch from '../components/CardFilterSearch';

vi.mock('../utils/scryfall', () => ({
  searchCards:  vi.fn(),
  getCardImage: vi.fn(() => null),
  autocomplete: vi.fn(),
}));

import { searchCards, autocomplete } from '../utils/scryfall';

const MOCK_CARD = {
  id: 'abc123',
  name: 'Lightning Bolt',
  set_name: 'Alpha',
  type_line: 'Instant',
  prices: { usd: '1.50' },
};

beforeEach(() => {
  searchCards.mockResolvedValue({ data: [], total: 0 });
  autocomplete.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('CardFilterSearch', () => {
  test('renders the search input and Search button', () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    expect(screen.getByPlaceholderText(/Name or Scryfall syntax/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('Search button is disabled when query and all filters are empty', () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  test('Search button enables when text is typed', () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'island' },
    });
    expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled();
  });

  test('clears the input text after clicking Search', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'lightning bolt' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(input.value).toBe(''));
  });

  test('calls searchCards with the typed query', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'counterspell' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('counterspell'));
  });

  test('Enter key triggers the search', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'island' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('island'));
  });

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

  test('shows "No cards matched" when search returns empty results', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'zzzyyyxxx not a card' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText(/No cards matched/i));
  });

  test('shows error message when searchCards throws', async () => {
    searchCards.mockRejectedValue(new Error('Network error'));
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'counterspell' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => screen.getByText(/Search failed/i));
  });

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

describe('CardFilterSearch — autocomplete', () => {
  // These tests use real timers since the 200ms debounce is async.
  // autocomplete mock resolves synchronously, so waitFor catches it quickly.
  beforeEach(() => {
    searchCards.mockResolvedValue({ data: [], total: 0 });
    autocomplete.mockResolvedValue([]);
  });

  afterEach(() => vi.clearAllMocks());

  test('shows suggestions after debounce when 2+ chars typed', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt', 'Lightning Strike', 'Lightning Helix']);
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'li' },
    });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    expect(screen.getByText('Lightning Strike')).toBeInTheDocument();
  }, 3000);

  test('does not call autocomplete for fewer than 2 chars', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'l' },
    });
    // Give debounce time to fire if it were going to
    await new Promise(r => setTimeout(r, 300));
    expect(autocomplete).not.toHaveBeenCalled();
  }, 3000);

  test('does not call autocomplete when query contains Scryfall operators', async () => {
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 't:instant' },
    });
    await new Promise(r => setTimeout(r, 300));
    expect(autocomplete).not.toHaveBeenCalled();
  }, 3000);

  test('clicking a suggestion triggers a search with that name', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt', 'Lightning Strike']);
    render(<CardFilterSearch onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Name or Scryfall syntax/i), {
      target: { value: 'li' },
    });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    fireEvent.mouseDown(screen.getByText('Lightning Bolt'));
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('Lightning Bolt'));
  }, 3000);

  test('ArrowDown then Enter selects the highlighted suggestion', async () => {
    autocomplete.mockResolvedValue(['Lightning Bolt', 'Lightning Strike']);
    render(<CardFilterSearch onSelect={() => {}} />);
    const input = screen.getByPlaceholderText(/Name or Scryfall syntax/i);
    fireEvent.change(input, { target: { value: 'li' } });
    await waitFor(() => screen.getByText('Lightning Bolt'), { timeout: 1000 });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(searchCards).toHaveBeenCalledWith('Lightning Bolt'));
  }, 3000);

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
