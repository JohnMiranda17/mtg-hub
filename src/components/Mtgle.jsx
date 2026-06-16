import { useState, useEffect, useRef } from 'react';
import { getCardByName } from '../utils/scryfall';
import { MTGLE_POOL } from '../data/mtglePool';
import CardSearchInput from './CardSearchInput';

/* ── Day utilities ─────────────────────────────────────────────────────────── */
function todayStr() { return new Date().toISOString().slice(0, 10); }
function dayNumber() { return Math.floor(Date.now() / 86400000); }

// Seeded PRNG (mulberry32) so the shuffle below is reproducible across sessions/users.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle of [0..length) using a fixed seed — same order for every
// player, but not the original array order (and no repeats until it cycles).
export function shuffledIndices(length, seed) {
  const arr = Array.from({ length }, (_, i) => i);
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const POOL_SHUFFLE_SEED = 20240101;
const POOL_ORDER = shuffledIndices(MTGLE_POOL.length, POOL_SHUFFLE_SEED);

function dailyCardName() { return MTGLE_POOL[POOL_ORDER[dayNumber() % POOL_ORDER.length]]; }

/* ── Persistent state (per-day) ───────────────────────────────────────────── */
const GAME_KEY   = 'mtg-hub:mtgle-game';
const STREAK_KEY = 'mtg-hub:mtgle-streak';

function loadGame() {
  try {
    const g = JSON.parse(localStorage.getItem(GAME_KEY));
    if (g?.date === todayStr()) return g;
  } catch { /* */ }
  return null;
}

function saveGame(g) { localStorage.setItem(GAME_KEY, JSON.stringify(g)); }

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY)) ?? { streak: 0, best: 0, lastWon: null }; }
  catch { return { streak: 0, best: 0, lastWon: null }; }
}

function saveStreak(s) { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); }

function updateStreak(won) {
  const today = todayStr();
  const s = loadStreak();
  if (won) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = s.lastWon === yesterday ? s.streak + 1 : 1;
    const updated = { streak: newStreak, best: Math.max(newStreak, s.best ?? 0), lastWon: today };
    saveStreak(updated);
    return updated;
  }
  // On loss, keep streak but don't reset — only a missed day resets it
  return s;
}

/* ── Hint definitions ─────────────────────────────────────────────────────── */
const MAX_GUESSES = 7;

const SUPERTYPES = new Set(['legendary', 'basic', 'snow', 'world', 'tribal', 'kindred']);
const MAIN_TYPES = new Set(['creature', 'enchantment', 'artifact', 'instant', 'sorcery', 'land', 'planeswalker', 'battle']);

export function simplifyTypeLine(typeLine) {
  // Take front face only for double-faced cards, then drop subtypes after "—"
  const frontFace = (typeLine ?? '').split('//')[0];
  const beforeDash = frontFace.split('—')[0].trim();
  const mainTypes = beforeDash.split(/\s+/)
    .filter(w => MAIN_TYPES.has(w.toLowerCase()))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return mainTypes.length ? mainTypes.join(' ') : beforeDash;
}

// Returns supertypes (Legendary, Snow…) + subtypes (Elf, Eldrazi, Aura…) stripped from simplifyTypeLine
export function extractSubtypes(typeLine) {
  const frontFace = (typeLine ?? '').split('//')[0];
  const parts = frontFace.split('—');
  const supertypes = (parts[0] ?? '').trim().split(/\s+/)
    .filter(w => SUPERTYPES.has(w.toLowerCase()));
  const subtypes = (parts[1] ?? '').trim().split(/\s+/).filter(Boolean);
  const all = [...supertypes, ...subtypes];
  return all.length ? all.join(', ') : null;
}

function extractKeywords(card) {
  const oracle = card.oracle_text ?? '';
  const kws = [];
  for (const kw of card.keywords ?? []) kws.push(kw);
  // Also look for first word of each ability line that's a known keyword indicator
  if (!kws.length) {
    const firstWords = oracle.split('\n').map(l => l.split(' ')[0].replace(/[^A-Za-z]/g, '')).filter(w => w.length > 3);
    kws.push(...firstWords.slice(0, 3));
  }
  return kws.length ? kws.join(', ') : '(none)';
}

function getHints(card) {
  return [
    { label: 'Card Type',  value: simplifyTypeLine(card.type_line) },
    { label: 'Mana Cost',  value: card.mana_cost || '{0}' },
    { label: 'First Letter', value: `The card name starts with "${card.name[0].toUpperCase()}"` },
    { label: 'Subtypes',   value: extractSubtypes(card.type_line) ?? '(none)' },
    { label: 'Keywords',   value: extractKeywords(card) },
    { label: 'Set',        value: card.set_name },
    { label: 'Art Crop',   value: card.image_uris?.art_crop ?? card.card_faces?.[0]?.image_uris?.art_crop ?? null, isArt: true },
  ];
}

/* ── Mana cost icons renderer ─────────────────────────────────────────────── */
// Maps scryfall mana notation like {2}{G}{U} to colored pips
const ManaSymbol = ({ sym }) => {
  const text = sym.replace(/[{}]/g, '').toUpperCase();
  const cls = {
    W: 'mana-w', U: 'mana-u', B: 'mana-b', R: 'mana-r', G: 'mana-g',
    C: 'mana-c', X: 'mana-x',
  }[text] ?? 'mana-generic';
  return <span className={`mana-pip ${cls}`}>{text}</span>;
};

function ManaCost({ cost }) {
  if (!cost) return <span className="hint-value">—</span>;
  const parts = (cost.match(/\{[^}]+\}/g) ?? [cost]);
  return <span className="hint-mana">{parts.map((s, i) => <ManaSymbol key={i} sym={s} />)}</span>;
}

/* ── Share text ───────────────────────────────────────────────────────────── */
export function buildShareText(guesses, won, puzzleNum) {
  const result = won ? guesses.length : 'X';
  const squares = Array(MAX_GUESSES).fill('⬛');
  for (let i = 0; i < guesses.length; i++) {
    squares[i] = guesses[i].correct ? '✅' : '❌';
  }
  return `MTGLE #${puzzleNum} ${result}/${MAX_GUESSES}\n${squares.join('')}\nhttps://JohnMiranda17.github.io/mtg-hub/mtgle`;
}

/* ── Main MTGLE component ─────────────────────────────────────────────────── */
// overrideCard: custom-mode card object (skips daily fetch, no localStorage/streak)
// onNewGame:    callback fired when user wants to start fresh in custom mode
export default function Mtgle({ overrideCard = null, onNewGame = null }) {
  const isCustom = Boolean(overrideCard);

  const [card, setCard]         = useState(isCustom ? overrideCard : null);
  const [loadError, setLoadError] = useState('');
  const [game, setGame]         = useState(null);
  const [streak, setStreak]     = useState(() => isCustom ? null : loadStreak());
  const [guess, setGuess]       = useState('');
  const [shakeInput, setShakeInput] = useState(false);
  const [copied, setCopied]     = useState(false);
  const guessRef                = useRef('');

  useEffect(() => {
    if (isCustom) {
      setGame({ date: todayStr(), guesses: [], won: false, lost: false });
      return;
    }
    const name = dailyCardName();
    getCardByName(name)
      .then(c => {
        setCard(c);
        const existing = loadGame();
        if (existing) {
          setGame(existing);
        } else {
          const fresh = { date: todayStr(), guesses: [], won: false, lost: false };
          setGame(fresh);
          saveGame(fresh);
        }
      })
      .catch(() => setLoadError(`Could not load today's card. Check your connection.`));
  }, []);

  function handleGuess() {
    const g = guessRef.current.trim();
    if (!g || !card || game.won || game.lost) return;

    const correct = g.toLowerCase() === card.name.toLowerCase();
    const newGuess = { text: g, correct };
    const newGuesses = [...game.guesses, newGuess];
    const won  = correct;
    const lost = !correct && newGuesses.length >= MAX_GUESSES;

    const updated = { ...game, guesses: newGuesses, won, lost };
    setGame(updated);
    if (!isCustom) saveGame(updated);
    setGuess('');
    guessRef.current = '';

    if (won || lost) {
      if (!isCustom) {
        const s = updateStreak(won);
        setStreak(s);
      }
    } else {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
    }
  }

  function handleCopy() {
    if (!game || !card) return;
    const text = buildShareText(game.guesses, game.won, dayNumber() % MTGLE_POOL.length + 1);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const wrongCount  = game ? game.guesses.filter(g => !g.correct).length : 0;
  const hintsToShow = card ? getHints(card).slice(0, Math.max(1, wrongCount + 1)) : [];
  const puzzleNum   = isCustom ? null : (dayNumber() % MTGLE_POOL.length + 1);
  const gameOver    = game?.won || game?.lost;

  if (loadError) {
    return (
      <div className="mtgle-error">
        <p>{loadError}</p>
        <p className="mtgle-error-sub">Today's card: {dailyCardName()}</p>
      </div>
    );
  }

  if (!card || !game) {
    return <div className="mtgle-loading">Loading today's puzzle…</div>;
  }

  return (
    <div className="mtgle-wrap">
      {/* Header */}
      <div className="mtgle-header">
        <div className="mtgle-title-row">
          <span className="mtgle-title">🎮 MTGLE</span>
          {isCustom
            ? <span className="mtgle-puzzle-num mtgle-custom-badge">Custom</span>
            : <span className="mtgle-puzzle-num">#{puzzleNum}</span>
          }
        </div>
        {!isCustom && streak && (
          <div className="mtgle-streak-row">
            <span className="mtgle-streak" title="Current streak">🔥 {streak.streak}</span>
            <span className="mtgle-best"   title="Best streak">⭐ {streak.best}</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      {game.guesses.length === 0 && !gameOver && (
        <p className="mtgle-instructions">
          Guess the MTG card! Card type is free — each wrong answer reveals another hint. 7 guesses total.
        </p>
      )}

      {/* Guess tracker */}
      <div className="mtgle-guesses">
        {Array(MAX_GUESSES).fill(null).map((_, i) => {
          const g = game.guesses[i];
          const isCurrent = i === game.guesses.length && !gameOver;
          return (
            <div
              key={i}
              className={[
                'mtgle-guess-slot',
                !g ? (isCurrent ? 'mtgle-slot-current' : 'mtgle-slot-empty') : '',
                g?.correct ? 'mtgle-slot-win' : g ? 'mtgle-slot-wrong' : '',
              ].join(' ')}
            >
              {g ? (
                <>
                  <span className="mtgle-slot-icon">{g.correct ? '✅' : '❌'}</span>
                  <span className="mtgle-slot-text">{g.text}</span>
                </>
              ) : (
                <span className="mtgle-slot-placeholder">
                  {isCurrent ? 'Current guess' : `Guess ${i + 1}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Hints revealed */}
      {hintsToShow.length > 0 && (
        <div className="mtgle-hints">
          {hintsToShow.map((hint, i) => (
            <div key={i} className="mtgle-hint">
              <span className="mtgle-hint-label">{hint.label}:</span>
              {hint.isArt
                ? hint.value
                  ? <img src={hint.value} alt="art crop" className="mtgle-hint-art" />
                  : <span className="mtgle-hint-value">Art unavailable</span>
                : hint.label === 'Mana Cost'
                  ? <ManaCost cost={hint.value} />
                  : <span className="mtgle-hint-value">{hint.value}</span>
              }
            </div>
          ))}
        </div>
      )}

      {/* Input or game-over state */}
      {!gameOver ? (
        <div className={`mtgle-input-row${shakeInput ? ' shake' : ''}`}>
          <CardSearchInput
            value={guess}
            onChange={v => { setGuess(v); guessRef.current = v; }}
            onSelect={v => { setGuess(v); guessRef.current = v; }}
            placeholder="Guess the card name…"
          />
          <button className="btn-primary" onClick={handleGuess} disabled={!guess.trim()}>
            Guess
          </button>
        </div>
      ) : (
        <div className="mtgle-result">
          {game.won ? (
            <>
              <div className="mtgle-result-icon">🎉</div>
              <div className="mtgle-result-title">
                You got it in {game.guesses.length} {game.guesses.length === 1 ? 'guess' : 'guesses'}!
              </div>
            </>
          ) : (
            <>
              <div className="mtgle-result-icon">💀</div>
              <div className="mtgle-result-title">
                {isCustom ? 'Not this time!' : 'Better luck tomorrow!'}
              </div>
              <div className="mtgle-result-sub">The card was:</div>
            </>
          )}

          {/* Reveal the card */}
          <div className="mtgle-reveal">
            {card.image_uris?.normal && (
              <img src={card.image_uris.normal} alt={card.name} className="mtgle-reveal-img" />
            )}
            <div className="mtgle-reveal-info">
              <div className="mtgle-reveal-name">{card.name}</div>
              <div className="mtgle-reveal-type">{card.type_line}</div>
              <div className="mtgle-reveal-set">{card.set_name}</div>
            </div>
          </div>

          {isCustom ? (
            <div className="mtgle-custom-actions">
              {onNewGame && (
                <button className="btn-primary" onClick={onNewGame}>🔄 New Custom Game</button>
              )}
            </div>
          ) : (
            <>
              <button className="btn-secondary mtgle-share-btn" onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📋 Share Result'}
              </button>
              <p className="mtgle-comeback">Come back tomorrow for puzzle #{puzzleNum + 1}!</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
