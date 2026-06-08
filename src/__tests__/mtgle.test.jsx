import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach } from 'vitest';
import Mtgle from '../components/Mtgle';

const MOCK_CARD = {
  name: 'Lightning Bolt',
  type_line: 'Instant',
  mana_cost: '{R}',
  oracle_text: 'Lightning Bolt deals 3 damage to any target.',
  keywords: [],
  set_name: 'Alpha',
  cmc: 1,
  image_uris: {
    normal: 'https://example.com/normal.jpg',
    art_crop: 'https://example.com/art.jpg',
  },
};

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(MOCK_CARD),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

async function renderAndWait() {
  render(<Mtgle />);
  await waitFor(() => expect(screen.getByText(/MTGLE/)).toBeInTheDocument());
  await waitFor(() => screen.queryByText('Loading today') === null);
}

describe('Mtgle', () => {
  test('renders the MTGLE header', async () => {
    await renderAndWait();
    expect(screen.getByText(/MTGLE/)).toBeInTheDocument();
  });

  test('shows 6 guess slots', async () => {
    await renderAndWait();
    const slots = screen.getAllByText(/Guess \d|Current guess/);
    expect(slots.length).toBe(6);
  });

  test('card type hint is shown immediately for free', async () => {
    await renderAndWait();
    expect(screen.getByText('Card Type:')).toBeInTheDocument();
    expect(screen.getByText('Instant')).toBeInTheDocument();
  });

  test('mana cost hint revealed after first wrong guess', async () => {
    await renderAndWait();
    expect(screen.queryByText('Mana Cost:')).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Wrong Card' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));

    await waitFor(() => expect(screen.getByText('Mana Cost:')).toBeInTheDocument());
  });

  test('set hint revealed after four wrong guesses', async () => {
    await renderAndWait();

    for (let i = 0; i < 4; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
    }

    expect(screen.getByText('Set:')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  test('art crop shown after five wrong guesses', async () => {
    await renderAndWait();

    for (let i = 0; i < 5; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
    }

    expect(screen.getByText('Art Crop:')).toBeInTheDocument();
    expect(screen.getByAltText('art crop')).toBeInTheDocument();
  });

  test('correct guess shows win message', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Lightning Bolt' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => expect(screen.getByText(/You got it/i)).toBeInTheDocument());
  });

  test('six wrong guesses shows loss message', async () => {
    await renderAndWait();

    for (let i = 0; i < 6; i++) {
      const input = screen.getByPlaceholderText(/Guess the card/i);
      fireEvent.change(input, { target: { value: `Wrong ${i}` } });
      fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
      if (i < 5) {
        await waitFor(() => expect(screen.getAllByText(/❌/).length).toBe(i + 1));
      }
    }

    await waitFor(() => expect(screen.getByText(/Better luck tomorrow/i)).toBeInTheDocument());
  });

  test('share result button appears after game ends', async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/Guess the card/i);
    fireEvent.change(input, { target: { value: 'Lightning Bolt' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));
    await waitFor(() => expect(screen.getByText(/Share Result/i)).toBeInTheDocument());
  });
});
