import { useState } from 'react';
import CardTooltip from './CardTooltip';
import { COMBO_FINDER_PUZZLES, RESULT_TYPES, dailyPuzzle } from '../data/comboFinderPuzzles';

const RESULT_OPTIONS = Object.entries(RESULT_TYPES).map(([value, label]) => ({ value, label }));

const MANA_COLORS = ['W', 'U', 'B', 'R', 'G', 'C'];

function ManaDisplay({ mana }) {
  const pips = MANA_COLORS.flatMap(c =>
    Array.from({ length: mana[c] ?? 0 }, (_, i) => (
      <span key={c + i} className={`mana-pip mana-${c.toLowerCase()}`}>{c}</span>
    ))
  );
  return pips.length > 0
    ? <div className="cf-mana-pips">{pips}</div>
    : <span className="cf-mana-none">No floating mana</span>;
}

function ZonePanel({ label, items, selected, onToggle }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="cf-zone">
      <div className="cf-zone-label">{label}</div>
      <div className="cf-zone-cards">
        {items.map(({ name, note }) => (
          <button
            key={name + (note ?? '')}
            className={`cf-card-chip${selected.has(name) ? ' cf-card-selected' : ''}`}
            onClick={() => onToggle(name)}
          >
            <CardTooltip name={name}>
              <span className="cf-chip-name">{name}</span>
            </CardTooltip>
            {note && <span className="cf-card-note">{note}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ComboFinder() {
  const [puzzleIdx, setPuzzleIdx] = useState(() => {
    const day = Math.floor(Date.now() / 86400000);
    return day % COMBO_FINDER_PUZZLES.length;
  });
  const puzzle = COMBO_FINDER_PUZZLES[puzzleIdx];

  const [selected, setSelected] = useState(new Set());
  const [resultType, setResultType] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | { piecesOk, resultOk }
  const [revealed, setRevealed] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);

  function toggleCard(name) {
    setSelected(s => {
      const next = new Set(s);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
    setFeedback(null);
  }

  function reset() {
    setSelected(new Set());
    setResultType('');
    setFeedback(null);
    setRevealed(false);
    setHintRevealed(false);
  }

  function submit() {
    const combos = puzzle.combos ?? [puzzle.combo];
    const picked = new Set([...selected].map(n => n.toLowerCase()));

    const matched = combos.find(c => {
      const required = new Set(c.pieces.map(n => n.toLowerCase()));
      return required.size === picked.size && [...required].every(n => picked.has(n)) && resultType === c.result;
    });

    if (matched) {
      setFeedback({ correct: true, combo: matched });
      return;
    }

    const piecesOk = combos.some(c => {
      const required = new Set(c.pieces.map(n => n.toLowerCase()));
      return required.size === picked.size && [...required].every(n => picked.has(n));
    });
    const resultOk = combos.some(c => resultType === c.result);
    setFeedback({ correct: false, piecesOk, resultOk });
  }

  function goPrev() {
    reset();
    setHintRevealed(false);
    setPuzzleIdx(i => (i - 1 + COMBO_FINDER_PUZZLES.length) % COMBO_FINDER_PUZZLES.length);
  }

  function goNext() {
    reset();
    setHintRevealed(false);
    setPuzzleIdx(i => (i + 1) % COMBO_FINDER_PUZZLES.length);
  }

  const board = puzzle.board.map(c => ({ name: c.name, note: c.tapped ? 'tapped' : (c.note ?? null) }));
  const oppBoard = (puzzle.oppBoard ?? []).map(c => ({ name: c.name, note: c.tapped ? 'tapped' : (c.note ?? null) }));
  const hand = (puzzle.hand ?? []).map(n => ({ name: n }));
  const graveyard = (puzzle.graveyard ?? []).map(n => ({ name: n }));
  const exile = (puzzle.exile ?? []).map(n => ({ name: n }));
  const deck = (puzzle.deck ?? []).map(n => ({ name: n }));

  return (
    <div className="cf-wrap">
      {/* Header */}
      <div className="cf-header">
        <div>
          <h3 className="cf-title">🔄 Combo Finder</h3>
          <p className="cf-subtitle">
            An infinite combo lurks in this board state. Select the combo pieces,
            identify the result type, and submit to see if you're right.
          </p>
        </div>
        <div className="cf-puzzle-nav">
          <button className="cf-nav-btn" onClick={goPrev} title="Previous puzzle">‹</button>
          <div className="cf-puzzle-meta">
            <span className={`cf-difficulty cf-diff-${puzzle.difficulty.toLowerCase()}`}>
              {puzzle.difficulty}
            </span>
            <span className="cf-puzzle-num">Puzzle {puzzle.id}/{COMBO_FINDER_PUZZLES.length}</span>
          </div>
          <button className="cf-nav-btn" onClick={goNext} title="Next puzzle">›</button>
        </div>
      </div>

      {/* Puzzle title + hint (click to reveal) */}
      <div className="cf-puzzle-title-block">
        <span className="cf-puzzle-title">{puzzle.title}</span>
        {puzzle.flavor && (
          hintRevealed
            ? <span className="cf-puzzle-flavor">"{puzzle.flavor}"</span>
            : <button
                className="cf-hint-btn"
                onClick={() => setHintRevealed(true)}
              >
                💡 Show Hint
              </button>
        )}
      </div>

      {/* Mana available */}
      <div className="cf-mana-row">
        <span className="cf-mana-label">Available mana:</span>
        <ManaDisplay mana={puzzle.mana} />
      </div>

      {/* Board zones */}
      <div className="cf-board">
        {oppBoard.length > 0 && (
          <ZonePanel
            label="⚔️ Opponent's Battlefield"
            items={oppBoard}
            selected={selected}
            onToggle={toggleCard}
          />
        )}
        <ZonePanel label="⚔️ Your Battlefield" items={board} selected={selected} onToggle={toggleCard} />
        <ZonePanel label="🤚 Your Hand" items={hand} selected={selected} onToggle={toggleCard} />
        {graveyard.length > 0 && (
          <ZonePanel label="🪦 Graveyard" items={graveyard} selected={selected} onToggle={toggleCard} />
        )}
        {exile.length > 0 && (
          <ZonePanel label="⬜ Exile" items={exile} selected={selected} onToggle={toggleCard} />
        )}
        {deck.length > 0 && (
          <ZonePanel label="🎴 Library (known cards)" items={deck} selected={selected} onToggle={toggleCard} />
        )}
      </div>

      {/* Controls */}
      <div className="cf-controls">
        <div className="cf-selected-summary">
          <span className="cf-selected-label">Selected pieces:</span>
          {selected.size > 0
            ? <span className="cf-selected-names">{[...selected].join(' + ')}</span>
            : <span className="cf-none-selected">Click cards above to select</span>}
        </div>

        <div className="cf-submit-row">
          <select
            className="cf-result-select"
            value={resultType}
            onChange={e => { setResultType(e.target.value); setFeedback(null); }}
          >
            <option value="">Choose the combo result…</option>
            {RESULT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            className="btn-primary"
            onClick={submit}
            disabled={selected.size === 0 || !resultType || feedback?.correct}
          >
            Submit
          </button>

          <button className="btn-ghost-sm" onClick={reset}>Reset</button>

          <button
            className="btn-ghost-sm cf-give-up-btn"
            onClick={() => { setRevealed(true); setFeedback(null); }}
            disabled={revealed || feedback?.correct}
          >
            Give Up
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback?.correct && (
        <div className="cf-feedback cf-feedback-correct">
          <span className="cf-feedback-icon">✅</span>
          <div>
            <div className="cf-feedback-title">Combo found!</div>
            <div className="cf-feedback-explanation">{feedback.combo.explanation}</div>
          </div>
        </div>
      )}
      {feedback && !feedback.correct && (
        <div className="cf-feedback cf-feedback-wrong">
          <span className="cf-feedback-icon">❌</span>
          <div>
            <div className="cf-feedback-title">Not quite.</div>
            {!feedback.piecesOk && (
              <div className="cf-feedback-hint">
                The combo pieces aren't right — check all zones carefully.
                {feedback.resultOk && ' (Your result type was correct though!)'}
              </div>
            )}
            {feedback.piecesOk && !feedback.resultOk && (
              <div className="cf-feedback-hint">
                You found the right pieces! But the result type is incorrect.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Give-up reveal */}
      {revealed && !feedback?.correct && (
        <div className="cf-feedback cf-feedback-reveal">
          <span className="cf-feedback-icon">💡</span>
          <div>
            <div className="cf-feedback-title">{(puzzle.combos ?? [puzzle.combo]).length > 1 ? 'The Combos' : 'The Combo'}</div>
            {(puzzle.combos ?? [puzzle.combo]).map((c, i) => (
              <div key={i} className="cf-reveal-combo">
                {(puzzle.combos ?? [puzzle.combo]).length > 1 && (
                  <div className="cf-feedback-title" style={{ fontSize: '0.85em', marginBottom: '0.2rem' }}>Combo {i + 1}</div>
                )}
                <div className="cf-feedback-pieces"><strong>Pieces:</strong> {c.pieces.join(' + ')}</div>
                <div className="cf-feedback-pieces"><strong>Result:</strong> {RESULT_TYPES[c.result]}</div>
                <div className="cf-feedback-explanation">{c.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
