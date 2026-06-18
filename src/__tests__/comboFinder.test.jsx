import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach } from 'vitest';
import { COMBO_FINDER_PUZZLES, RESULT_TYPES, dailyPuzzle } from '../data/comboFinderPuzzles';
import ComboFinder from '../components/ComboFinder';

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

function renderComboFinder() {
  return render(<ComboFinder />);
}

/* ── Data integrity ─────────────────────────────────────────────────────── */
describe('COMBO_FINDER_PUZZLES data', () => {
  test('has at least 12 puzzles', () => {
    expect(COMBO_FINDER_PUZZLES.length).toBeGreaterThanOrEqual(12);
  });

  test('each puzzle has required fields', () => {
    COMBO_FINDER_PUZZLES.forEach(p => {
      expect(p.id, `puzzle ${p.id} missing id`).toBeDefined();
      expect(p.title, `puzzle ${p.id} missing title`).toBeTruthy();
      expect(p.difficulty, `puzzle ${p.id} missing difficulty`).toBeTruthy();
      expect(Array.isArray(p.board), `puzzle ${p.id} board must be array`).toBe(true);
      expect(p.board.length, `puzzle ${p.id} board must have cards`).toBeGreaterThan(0);
      const combos = p.combos ?? (p.combo ? [p.combo] : []);
      expect(combos.length, `puzzle ${p.id} must have at least one combo`).toBeGreaterThan(0);
      combos.forEach((c, i) => {
        expect(Array.isArray(c.pieces), `puzzle ${p.id} combo[${i}] pieces must be array`).toBe(true);
        expect(c.pieces.length, `puzzle ${p.id} combo[${i}] needs ≥2 pieces`).toBeGreaterThanOrEqual(2);
        expect(c.result, `puzzle ${p.id} combo[${i}] missing result type`).toBeTruthy();
        expect(c.explanation, `puzzle ${p.id} combo[${i}] missing explanation`).toBeTruthy();
      });
    });
  });

  test('each puzzle has valid mana object', () => {
    COMBO_FINDER_PUZZLES.forEach(p => {
      expect(p.mana, `puzzle ${p.id} missing mana`).toBeDefined();
      ['W', 'U', 'B', 'R', 'G', 'C'].forEach(color => {
        expect(typeof p.mana[color], `puzzle ${p.id} mana.${color} must be number`)
          .toBe('number');
      });
    });
  });

  test('each puzzle result type is a known RESULT_TYPES key', () => {
    COMBO_FINDER_PUZZLES.forEach(p => {
      const combos = p.combos ?? [p.combo];
      combos.forEach((c, i) => {
        expect(
          Object.keys(RESULT_TYPES),
          `puzzle ${p.id} combo[${i}] result "${c.result}" is not a valid RESULT_TYPES key`
        ).toContain(c.result);
      });
    });
  });

  test('each puzzle difficulty is Easy, Medium, or Hard', () => {
    COMBO_FINDER_PUZZLES.forEach(p => {
      expect(['Easy', 'Medium', 'Hard']).toContain(p.difficulty);
    });
  });

  test('combo pieces are present on the board or in hand/graveyard/exile/deck', () => {
    COMBO_FINDER_PUZZLES.forEach(p => {
      const allCardNames = new Set([
        ...(p.board ?? []).map(c => c.name.toLowerCase()),
        ...(p.hand ?? []).map(n => n.toLowerCase()),
        ...(p.graveyard ?? []).map(n => n.toLowerCase()),
        ...(p.exile ?? []).map(n => n.toLowerCase()),
        ...(p.deck ?? []).map(n => n.toLowerCase()),
        ...(p.oppBoard ?? []).map(c => c.name.toLowerCase()),
      ]);
      const combos = p.combos ?? [p.combo];
      combos.forEach((c, i) => {
        c.pieces.forEach(piece => {
          expect(
            allCardNames.has(piece.toLowerCase()),
            `puzzle ${p.id} combo[${i}]: piece "${piece}" not found in any zone`
          ).toBe(true);
        });
      });
    });
  });

  test('dailyPuzzle() returns a valid puzzle', () => {
    const puzzle = dailyPuzzle();
    expect(puzzle).toBeDefined();
    expect(puzzle.id).toBeDefined();
    expect(Array.isArray(puzzle.combo.pieces)).toBe(true);
  });
});

/* ── Component rendering ─────────────────────────────────────────────────── */
describe('ComboFinder component', () => {
  test('renders without crashing', () => {
    renderComboFinder();
    expect(screen.getByText(/🔄 Combo Finder/)).toBeInTheDocument();
  });

  test('shows the daily puzzle title', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    expect(screen.getAllByText(new RegExp(puzzle.title, 'i')).length).toBeGreaterThan(0);
  });

  test('shows puzzle navigation buttons', () => {
    renderComboFinder();
    expect(screen.getByTitle(/previous puzzle/i)).toBeInTheDocument();
    expect(screen.getByTitle(/next puzzle/i)).toBeInTheDocument();
  });

  test('shows puzzle count in format X/N', () => {
    renderComboFinder();
    expect(screen.getByText(new RegExp(`Puzzle \\d+/${COMBO_FINDER_PUZZLES.length}`))).toBeInTheDocument();
  });

  test('shows Available mana label', () => {
    renderComboFinder();
    expect(screen.getByText(/Available mana/i)).toBeInTheDocument();
  });

  test('shows Your Battlefield zone', () => {
    renderComboFinder();
    expect(screen.getByText(/Your Battlefield/i)).toBeInTheDocument();
  });

  test('shows Submit button disabled by default', () => {
    renderComboFinder();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  test('shows Reset and Give Up buttons', () => {
    renderComboFinder();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /give up/i })).toBeInTheDocument();
  });

  test('shows the result type dropdown', () => {
    renderComboFinder();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('shows "combo result" placeholder in dropdown', () => {
    renderComboFinder();
    expect(screen.getByText(/combo result/i)).toBeInTheDocument();
  });

  test('clicking a card chip selects it', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    const firstBoardCard = puzzle.board[0].name;
    const chip = screen.getAllByRole('button').find(b => b.textContent.includes(firstBoardCard));
    expect(chip).toBeDefined();
    fireEvent.click(chip);
    expect(chip.classList.contains('cf-card-selected')).toBe(true);
  });

  test('clicking a selected card deselects it', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    const firstBoardCard = puzzle.board[0].name;
    const chip = screen.getAllByRole('button').find(b => b.textContent.includes(firstBoardCard));
    fireEvent.click(chip); // select
    fireEvent.click(chip); // deselect
    expect(chip.classList.contains('cf-card-selected')).toBe(false);
  });

  test('submit is still disabled if card selected but no result type chosen', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  test('submit becomes enabled when card selected and result type chosen', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'infinite-mana' } });
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  test('wrong answer shows "Not quite" feedback', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    // pick a wrong result type (use the one NOT matching the puzzle)
    const wrongType = Object.keys(RESULT_TYPES).find(k => k !== puzzle.combo.result);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: wrongType } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
  });

  test('correct answer shows "Combo found!" and explanation', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();

    // Select all combo pieces
    puzzle.combo.pieces.forEach(piece => {
      const chip = screen.getAllByRole('button').find(b => b.textContent.includes(piece));
      if (chip) fireEvent.click(chip);
    });

    // Select the correct result type
    fireEvent.change(screen.getByRole('combobox'), { target: { value: puzzle.combo.result } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/combo found/i)).toBeInTheDocument();
    expect(screen.getByText(puzzle.combo.explanation)).toBeInTheDocument();
  });

  test('Give Up reveals the answer with explanation', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    fireEvent.click(screen.getByRole('button', { name: /give up/i }));
    // The reveal panel has a title "The Combo" (exact) and shows the pieces
    const revealPanel = screen.getByText('The Combo').closest('.cf-feedback-reveal');
    expect(revealPanel).toBeTruthy();
    expect(screen.getByText(puzzle.combo.explanation)).toBeInTheDocument();
  });

  test('Give Up button becomes disabled after clicking', () => {
    renderComboFinder();
    const btn = screen.getByRole('button', { name: /give up/i });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  test('Reset clears selection and feedback', () => {
    renderComboFinder();
    const puzzle = dailyPuzzle();
    const chip = screen.getAllByRole('button').find(b =>
      b.textContent.includes(puzzle.board[0].name)
    );
    fireEvent.click(chip);
    const wrongType = Object.keys(RESULT_TYPES).find(k => k !== puzzle.combo.result);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: wrongType } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.queryByText(/not quite/i)).not.toBeInTheDocument();
    expect(chip.classList.contains('cf-card-selected')).toBe(false);
  });

  test('Next puzzle button advances to the next puzzle', () => {
    renderComboFinder();
    const before = screen.getByText(new RegExp(`Puzzle \\d+/${COMBO_FINDER_PUZZLES.length}`)).textContent;
    fireEvent.click(screen.getByTitle(/next puzzle/i));
    const after = screen.getByText(new RegExp(`Puzzle \\d+/${COMBO_FINDER_PUZZLES.length}`)).textContent;
    expect(before).not.toBe(after);
  });

  test('Previous puzzle button goes back', () => {
    renderComboFinder();
    fireEvent.click(screen.getByTitle(/next puzzle/i));
    const after_next = screen.getByText(new RegExp(`Puzzle \\d+/${COMBO_FINDER_PUZZLES.length}`)).textContent;
    fireEvent.click(screen.getByTitle(/previous puzzle/i));
    const after_prev = screen.getByText(new RegExp(`Puzzle \\d+/${COMBO_FINDER_PUZZLES.length}`)).textContent;
    expect(after_next).not.toBe(after_prev);
  });
});
