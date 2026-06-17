import { useState } from 'react';
import CardTooltip from './CardTooltip';
import { GAME_WINNER_PUZZLES, WIN_METHODS, dailyGamePuzzle } from '../data/gameWinnerPuzzles';

const METHOD_OPTIONS = Object.entries(WIN_METHODS).map(([value, label]) => ({ value, label }));

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

function OppZonePanel({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="cf-zone gw-opp-zone">
      <div className="cf-zone-label">{label}</div>
      <div className="cf-zone-cards">
        {items.map(({ name, note }) => (
          <div key={name + (note ?? '')} className="gw-opp-chip">
            <CardTooltip name={name}>
              <span className="cf-chip-name">{name}</span>
            </CardTooltip>
            {note && <span className="cf-card-note">{note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameWinner() {
  const [puzzleIdx, setPuzzleIdx] = useState(() => {
    const day = Math.floor(Date.now() / 86400000);
    return day % GAME_WINNER_PUZZLES.length;
  });
  const puzzle = GAME_WINNER_PUZZLES[puzzleIdx];

  const [selected, setSelected] = useState(new Set());
  const [method, setMethod] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | { cardsOk, methodOk }
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
    setMethod('');
    setFeedback(null);
    setRevealed(false);
    setHintRevealed(false);
  }

  function submit() {
    const required = new Set(puzzle.win.cards.map(n => n.toLowerCase()));
    const picked   = new Set([...selected].map(n => n.toLowerCase()));
    const cardsOk  = required.size === picked.size && [...required].every(n => picked.has(n));
    const methodOk = method === puzzle.win.method;
    setFeedback(cardsOk && methodOk ? 'correct' : { cardsOk, methodOk });
  }

  function goPrev() {
    reset();
    setHintRevealed(false);
    setPuzzleIdx(i => (i - 1 + GAME_WINNER_PUZZLES.length) % GAME_WINNER_PUZZLES.length);
  }

  function goNext() {
    reset();
    setHintRevealed(false);
    setPuzzleIdx(i => (i + 1) % GAME_WINNER_PUZZLES.length);
  }

  const board    = puzzle.board.map(c => ({ name: c.name, note: c.note ?? null }));
  const hand     = (puzzle.hand ?? []).map(n => ({ name: n }));
  const graveyard = (puzzle.graveyard ?? []).map(n => ({ name: n }));
  const oppBoard  = (puzzle.opponent?.board ?? []).map(c => ({ name: c.name, note: c.note ?? null }));

  return (
    <div className="cf-wrap gw-wrap">
      {/* Header */}
      <div className="cf-header">
        <div>
          <h3 className="cf-title">🏆 Game Winner</h3>
          <p className="cf-subtitle">
            You can win this turn. Select the cards that deliver the kill,
            choose how you win, and submit.
          </p>
        </div>
        <div className="cf-puzzle-nav">
          <button className="cf-nav-btn" onClick={goPrev} title="Previous puzzle">‹</button>
          <div className="cf-puzzle-meta">
            <span className={`cf-difficulty cf-diff-${puzzle.difficulty.toLowerCase()}`}>
              {puzzle.difficulty}
            </span>
            <span className="cf-puzzle-num">Puzzle {puzzle.id}/{GAME_WINNER_PUZZLES.length}</span>
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

      {/* Scenario + opponent life */}
      <div className="gw-scenario-row">
        <p className="gw-scenario">{puzzle.scenario}</p>
        <div className="gw-life-badge">
          <span className="gw-life-label">Opponent life</span>
          <span className="gw-life-total">{puzzle.opponent.life}</span>
          {puzzle.opponent.poisonCounters != null && (
            <span className="gw-poison-badge">☠️ {puzzle.opponent.poisonCounters} poison</span>
          )}
          {puzzle.opponent.commanderDamage != null && (
            <span className="gw-cmd-badge">👑 {puzzle.opponent.commanderDamage} cmd dmg</span>
          )}
        </div>
      </div>

      {/* Mana available */}
      <div className="cf-mana-row">
        <span className="cf-mana-label">Available mana:</span>
        <ManaDisplay mana={puzzle.mana} />
      </div>

      {/* Board zones */}
      <div className="cf-board">
        {oppBoard.length > 0 && (
          <OppZonePanel label="🛡️ Opponent's Battlefield" items={oppBoard} />
        )}
        <ZonePanel label="⚔️ Your Battlefield" items={board} selected={selected} onToggle={toggleCard} />
        <ZonePanel label="🤚 Your Hand" items={hand} selected={selected} onToggle={toggleCard} />
        {graveyard.length > 0 && (
          <ZonePanel label="🪦 Graveyard" items={graveyard} selected={selected} onToggle={toggleCard} />
        )}
      </div>

      {/* Controls */}
      <div className="cf-controls">
        <div className="cf-selected-summary">
          <span className="cf-selected-label">Kill cards selected:</span>
          {selected.size > 0
            ? <span className="cf-selected-names">{[...selected].join(' + ')}</span>
            : <span className="cf-none-selected">Click your cards above to select</span>}
        </div>

        <div className="cf-submit-row">
          <select
            className="cf-result-select"
            value={method}
            onChange={e => { setMethod(e.target.value); setFeedback(null); }}
          >
            <option value="">Choose how you win…</option>
            {METHOD_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            className="btn-primary"
            onClick={submit}
            disabled={selected.size === 0 || !method || feedback === 'correct'}
          >
            Submit
          </button>

          <button className="btn-ghost-sm" onClick={reset}>Reset</button>

          <button
            className="btn-ghost-sm cf-give-up-btn"
            onClick={() => { setRevealed(true); setFeedback(null); }}
            disabled={revealed || feedback === 'correct'}
          >
            Give Up
          </button>
        </div>
      </div>

      {/* Feedback: correct */}
      {feedback === 'correct' && (
        <div className="cf-feedback cf-feedback-correct">
          <span className="cf-feedback-icon">✅</span>
          <div>
            <div className="cf-feedback-title">You win!</div>
            <div className="cf-feedback-explanation">{puzzle.win.explanation}</div>
          </div>
        </div>
      )}

      {/* Feedback: wrong */}
      {feedback && feedback !== 'correct' && (
        <div className="cf-feedback cf-feedback-wrong">
          <span className="cf-feedback-icon">❌</span>
          <div>
            <div className="cf-feedback-title">Not quite.</div>
            {!feedback.cardsOk && (
              <div className="cf-feedback-hint">
                The kill cards aren't right — double-check which cards deliver the damage.
                {feedback.methodOk && ' (Your win method was correct though!)'}
              </div>
            )}
            {feedback.cardsOk && !feedback.methodOk && (
              <div className="cf-feedback-hint">
                You found the right cards! But the win method is incorrect.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Give-up reveal */}
      {revealed && feedback !== 'correct' && (
        <div className="cf-feedback cf-feedback-reveal">
          <span className="cf-feedback-icon">💡</span>
          <div>
            <div className="cf-feedback-title">The Winning Line</div>
            <div className="cf-feedback-pieces">
              <strong>Kill cards:</strong> {puzzle.win.cards.join(' + ')}
            </div>
            <div className="cf-feedback-pieces">
              <strong>Win method:</strong> {WIN_METHODS[puzzle.win.method]}
            </div>
            <div className="cf-feedback-explanation">{puzzle.win.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
}
