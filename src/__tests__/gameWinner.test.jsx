import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach } from 'vitest';
import { GAME_WINNER_PUZZLES, WIN_METHODS, dailyGamePuzzle } from '../data/gameWinnerPuzzles';
import GameWinner from '../components/GameWinner';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ image_uris: { normal: 'https://example.com/card.jpg' } }),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

function renderGameWinner() {
  return render(<GameWinner />);
}

/* ── Data integrity ─────────────────────────────────────────────────────── */
describe('GAME_WINNER_PUZZLES data', () => {
  test('has at least 12 puzzles', () => {
    expect(GAME_WINNER_PUZZLES.length).toBeGreaterThanOrEqual(12);
  });

  test('each puzzle has required fields', () => {
    GAME_WINNER_PUZZLES.forEach(p => {
      expect(p.id,         `puzzle ${p.id} missing id`).toBeDefined();
      expect(p.title,      `puzzle ${p.id} missing title`).toBeTruthy();
      expect(p.difficulty, `puzzle ${p.id} missing difficulty`).toBeTruthy();
      expect(p.scenario,   `puzzle ${p.id} missing scenario`).toBeTruthy();
      expect(Array.isArray(p.board), `puzzle ${p.id} board must be array`).toBe(true);
      expect(p.board.length, `puzzle ${p.id} board must have cards`).toBeGreaterThan(0);
      expect(p.win,              `puzzle ${p.id} missing win`).toBeDefined();
      expect(Array.isArray(p.win.cards), `puzzle ${p.id} win.cards must be array`).toBe(true);
      expect(p.win.cards.length, `puzzle ${p.id} win.cards must have cards`).toBeGreaterThan(0);
      expect(p.win.method,       `puzzle ${p.id} missing win.method`).toBeTruthy();
      expect(p.win.explanation,  `puzzle ${p.id} missing win.explanation`).toBeTruthy();
      expect(p.opponent,         `puzzle ${p.id} missing opponent`).toBeDefined();
      expect(typeof p.opponent.life, `puzzle ${p.id} opponent.life must be number`).toBe('number');
    });
  });

  test('each puzzle has valid mana object', () => {
    GAME_WINNER_PUZZLES.forEach(p => {
      expect(p.mana, `puzzle ${p.id} missing mana`).toBeDefined();
      ['W', 'U', 'B', 'R', 'G', 'C'].forEach(color => {
        expect(typeof p.mana[color], `puzzle ${p.id} mana.${color} must be number`)
          .toBe('number');
      });
    });
  });

  test('each puzzle win.method is a known WIN_METHODS key', () => {
    GAME_WINNER_PUZZLES.forEach(p => {
      expect(
        Object.keys(WIN_METHODS),
        `puzzle ${p.id} win.method "${p.win.method}" is not a valid WIN_METHODS key`
      ).toContain(p.win.method);
    });
  });

  test('each puzzle difficulty is Easy, Medium, or Hard', () => {
    GAME_WINNER_PUZZLES.forEach(p => {
      expect(['Easy', 'Medium', 'Hard']).toContain(p.difficulty);
    });
  });

  test('win.cards are present in your board, hand, or graveyard', () => {
    GAME_WINNER_PUZZLES.forEach(p => {
      const allYourCards = new Set([
        ...(p.board     ?? []).map(c => c.name.toLowerCase()),
        ...(p.hand      ?? []).map(n => n.toLowerCase()),
        ...(p.graveyard ?? []).map(n => n.toLowerCase()),
      ]);
      p.win.cards.forEach(card => {
        expect(
          allYourCards.has(card.toLowerCase()),
          `puzzle ${p.id}: win card "${card}" not found in your board/hand/graveyard`
        ).toBe(true);
      });
    });
  });

  test('dailyGamePuzzle() returns a valid puzzle', () => {
    const puzzle = dailyGamePuzzle();
    expect(puzzle).toBeDefined();
    expect(puzzle.id).toBeDefined();
    expect(Array.isArray(puzzle.win.cards)).toBe(true);
  });
});

/* ── Component rendering ────────────────────────────────────────────────── */
describe('GameWinner component', () => {
  test('renders without crashing', () => {
    renderGameWinner();
    expect(screen.getByText(/🏆 Game Winner/)).toBeInTheDocument();
  });

  test('shows the daily puzzle title', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    expect(screen.getAllByText(new RegExp(puzzle.title, 'i')).length).toBeGreaterThan(0);
  });

  test('shows opponent life total', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    expect(screen.getByText(String(puzzle.opponent.life))).toBeInTheDocument();
  });

  test('shows puzzle navigation buttons', () => {
    renderGameWinner();
    expect(screen.getByTitle(/previous puzzle/i)).toBeInTheDocument();
    expect(screen.getByTitle(/next puzzle/i)).toBeInTheDocument();
  });

  test('shows puzzle count in format X/N', () => {
    renderGameWinner();
    expect(screen.getByText(new RegExp(`Puzzle \\d+/${GAME_WINNER_PUZZLES.length}`))).toBeInTheDocument();
  });

  test('shows Available mana label', () => {
    renderGameWinner();
    expect(screen.getByText(/Available mana/i)).toBeInTheDocument();
  });

  test('shows Your Battlefield zone', () => {
    renderGameWinner();
    expect(screen.getByText(/Your Battlefield/i)).toBeInTheDocument();
  });

  test('shows opponent life label', () => {
    renderGameWinner();
    expect(screen.getByText(/Opponent life/i)).toBeInTheDocument();
  });

  test('shows Submit button disabled by default', () => {
    renderGameWinner();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  test('shows Reset and Give Up buttons', () => {
    renderGameWinner();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /give up/i })).toBeInTheDocument();
  });

  test('shows the win method dropdown', () => {
    renderGameWinner();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('shows "how you win" placeholder in dropdown', () => {
    renderGameWinner();
    expect(screen.getAllByText(/how you win/i).length).toBeGreaterThan(0);
  });

  test('clicking a board card chip selects it', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    const firstCard = puzzle.board[0].name;
    const chip = screen.getAllByRole('button').find(b => b.textContent.includes(firstCard));
    expect(chip).toBeDefined();
    fireEvent.click(chip);
    expect(chip.classList.contains('cf-card-selected')).toBe(true);
  });

  test('clicking a selected card deselects it', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    const firstCard = puzzle.board[0].name;
    const chip = screen.getAllByRole('button').find(b => b.textContent.includes(firstCard));
    fireEvent.click(chip);
    fireEvent.click(chip);
    expect(chip.classList.contains('cf-card-selected')).toBe(false);
  });

  test('submit is still disabled if card selected but no win method chosen', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  test('submit becomes enabled when card selected and win method chosen', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'combat' } });
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  test('wrong answer shows "Not quite" feedback', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    const wrongMethod = Object.keys(WIN_METHODS).find(k => k !== puzzle.win.method);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: wrongMethod } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
  });

  test('correct answer shows "You win!" and explanation', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();

    puzzle.win.cards.forEach(card => {
      const chip = screen.getAllByRole('button').find(b => b.textContent.includes(card));
      if (chip) fireEvent.click(chip);
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: puzzle.win.method } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/you win!/i)).toBeInTheDocument();
    expect(screen.getByText(puzzle.win.explanation)).toBeInTheDocument();
  });

  test('Give Up reveals the winning line with explanation', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    fireEvent.click(screen.getByRole('button', { name: /give up/i }));
    const revealPanel = screen.getByText('The Winning Line').closest('.cf-feedback-reveal');
    expect(revealPanel).toBeTruthy();
    expect(screen.getByText(puzzle.win.explanation)).toBeInTheDocument();
  });

  test('Give Up button becomes disabled after clicking', () => {
    renderGameWinner();
    const btn = screen.getByRole('button', { name: /give up/i });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  test('Reset clears selection and feedback', () => {
    renderGameWinner();
    const puzzle = dailyGamePuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    const wrongMethod = Object.keys(WIN_METHODS).find(k => k !== puzzle.win.method);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: wrongMethod } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.queryByText(/not quite/i)).not.toBeInTheDocument();
    expect(chip.classList.contains('cf-card-selected')).toBe(false);
  });

  test('Next puzzle button advances to the next puzzle', () => {
    renderGameWinner();
    const before = screen.getByText(new RegExp(`Puzzle \\d+/${GAME_WINNER_PUZZLES.length}`)).textContent;
    fireEvent.click(screen.getByTitle(/next puzzle/i));
    const after = screen.getByText(new RegExp(`Puzzle \\d+/${GAME_WINNER_PUZZLES.length}`)).textContent;
    expect(before).not.toBe(after);
  });

  test('Previous puzzle button goes back', () => {
    renderGameWinner();
    fireEvent.click(screen.getByTitle(/next puzzle/i));
    const afterNext = screen.getByText(new RegExp(`Puzzle \\d+/${GAME_WINNER_PUZZLES.length}`)).textContent;
    fireEvent.click(screen.getByTitle(/previous puzzle/i));
    const afterPrev = screen.getByText(new RegExp(`Puzzle \\d+/${GAME_WINNER_PUZZLES.length}`)).textContent;
    expect(afterNext).not.toBe(afterPrev);
  });
});
