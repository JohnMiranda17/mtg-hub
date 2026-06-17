import { useState, useEffect, useRef } from 'react';
import { getCardOldestPrinting } from '../utils/scryfall';
import { MTGLE_POOL } from '../data/mtglePool';
import { simplifyTypeLine, shuffledIndices } from './Mtgle';
import CardSearchInput from './CardSearchInput';

/* ── Day utilities (mirrors Mtgle.jsx) ────────────────────────────────────── */
function todayStr()  { return new Date().toISOString().slice(0, 10); }
function dayNumber() { return Math.floor(Date.now() / 86400000); }

const POOL_SHUFFLE_SEED = 20240101;
const POOL_ORDER        = shuffledIndices(MTGLE_POOL.length, POOL_SHUFFLE_SEED);

function dailyCardName() { return MTGLE_POOL[POOL_ORDER[dayNumber() % POOL_ORDER.length]]; }

/* ── Constants ────────────────────────────────────────────────────────────── */
const MAX_GUESSES = 10;
const NH_GAME_KEY = 'mtg-hub:mtgle-nh-game';

const RARITY_ABBR = { common: 'C', uncommon: 'U', rare: 'R', mythic: 'M' };

const SCORE_TIERS = [
  { max: 1,  label: '🏆 Legendary', desc: 'Unbelievable — first try!' },
  { max: 3,  label: '⭐ Mythic',    desc: 'Incredible deduction!' },
  { max: 5,  label: '🥇 Rare',      desc: 'Great work!' },
  { max: 7,  label: '🥈 Uncommon',  desc: 'Well played!' },
  { max: 10, label: '🥉 Common',    desc: 'You cracked it!' },
];

/* ── Pure helpers (exported for tests) ───────────────────────────────────── */
export function getCardColors(card) {
  const c = card.colors ?? card.card_faces?.[0]?.colors ?? [];
  return c;
}

export function compareCards(guessCard, targetCard) {
  const gc = getCardColors(guessCard);
  const tc = getCardColors(targetCard);

  // Color comparison: exact match, partial (wrong count), or miss (same count, different colors)
  const exactColors = gc.length === tc.length &&
    gc.every(c => tc.includes(c)) &&
    tc.every(c => gc.includes(c));
  let colorResult;
  if (exactColors) {
    colorResult = 'exact';
  } else if (gc.length < tc.length) {
    colorResult = 'partial-more';   // target has more colors
  } else if (gc.length > tc.length) {
    colorResult = 'partial-fewer';  // target has fewer colors
  } else {
    colorResult = 'miss';           // same count, wrong colors
  }

  const gCmc = guessCard.cmc ?? 0;
  const tCmc = targetCard.cmc ?? 0;
  const cmc  = gCmc === tCmc ? 'exact' : gCmc < tCmc ? 'low' : 'high';

  const guessTypes  = simplifyTypeLine(guessCard.type_line).split(' ');
  const targetTypes = simplifyTypeLine(targetCard.type_line).split(' ');
  const typeMatch   = guessTypes.some(t => targetTypes.includes(t));

  return {
    name:   guessCard.name,
    cmc:    { result: cmc,                         value: gCmc },
    colors: { result: colorResult,                 value: gc.length === 0 ? 'Colorless' : gc.join('') },
    type:   { result: typeMatch ? 'match' : 'miss', value: simplifyTypeLine(guessCard.type_line) },
    rarity: { result: guessCard.rarity === targetCard.rarity ? 'match' : 'miss', value: guessCard.rarity },
    isCorrect: guessCard.name.toLowerCase() === targetCard.name.toLowerCase(),
  };
}

export function getScoreTier(guessCount) {
  return SCORE_TIERS.find(t => guessCount <= t.max) ?? null;
}

/* ── LocalStorage helpers ─────────────────────────────────────────────────── */
function loadNhGame() {
  try {
    const g = JSON.parse(localStorage.getItem(NH_GAME_KEY));
    if (g?.date === todayStr()) return g;
  } catch { /* */ }
  return null;
}
function saveNhGame(g) { localStorage.setItem(NH_GAME_KEY, JSON.stringify(g)); }

/* ── Sub-components ───────────────────────────────────────────────────────── */
function CmcCell({ cmc }) {
  const { result, value } = cmc;
  const icon = result === 'exact' ? '✅' : result === 'low' ? '↑' : '↓';
  const cls  = result === 'exact' ? 'nh-cell-match' : 'nh-cell-dir';
  return (
    <div className={`nh-cell nh-cell-cmc ${cls}`} title={result === 'low' ? 'Target CMC is higher' : result === 'high' ? 'Target CMC is lower' : 'Exact match'}>
      <span className="nh-cell-icon">{icon}</span>
      <span className="nh-cell-val">{value}</span>
    </div>
  );
}

function ColorsCell({ colors }) {
  const { result, value } = colors;
  const labels = {
    'exact':         { text: `✅ ${value}`, cls: 'nh-cell-match',   title: 'Color identity matches exactly' },
    'partial-more':  { text: '~ Partial — more colors',  cls: 'nh-cell-partial', title: 'Target has more colors' },
    'partial-fewer': { text: '~ Partial — fewer colors', cls: 'nh-cell-partial', title: 'Target has fewer colors' },
    'miss':          { text: `❌ ${value}`, cls: 'nh-cell-miss',    title: 'Same color count, different colors' },
  };
  const { text, cls, title } = labels[result] ?? labels.miss;
  return <div className={`nh-cell nh-cell-colors-result ${cls}`} title={title}>{text}</div>;
}

function AttrCell({ result, value }) {
  return (
    <div className={`nh-cell nh-cell-attr ${result === 'match' ? 'nh-cell-match' : 'nh-cell-miss'}`}>
      {result === 'match' ? '✅' : '❌'} {value}
    </div>
  );
}

function GuessRow({ comparison }) {
  return (
    <div className={`nh-row${comparison.isCorrect ? ' nh-row-correct' : ''}`}>
      <div className="nh-cell nh-cell-name" title={comparison.name}>{comparison.name}</div>
      <CmcCell  cmc={comparison.cmc} />
      <ColorsCell colors={comparison.colors} />
      <AttrCell result={comparison.type.result}   value={comparison.type.value} />
      <AttrCell result={comparison.rarity.result} value={RARITY_ABBR[comparison.rarity.value] ?? comparison.rarity.value} />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="nh-row nh-header-row">
      <div className="nh-cell nh-cell-name">Card Guessed</div>
      <div className="nh-cell nh-cell-cmc">CMC</div>
      <div className="nh-cell nh-cell-colors-result">Colors</div>
      <div className="nh-cell nh-cell-attr">Type</div>
      <div className="nh-cell nh-cell-attr">Rarity</div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function NoHintMtgle() {
  const [targetCard, setTargetCard] = useState(null);
  const [loadError,  setLoadError]  = useState('');
  const [game,       setGame]       = useState(null);
  const [guess,      setGuess]      = useState('');
  const [guessError, setGuessError] = useState('');
  const [fetching,   setFetching]   = useState(false);
  const guessRef = useRef('');

  useEffect(() => {
    getCardOldestPrinting(dailyCardName())
      .then(card => {
        setTargetCard(card);
        const existing = loadNhGame();
        if (existing) {
          setGame(existing);
        } else {
          const fresh = { date: todayStr(), guesses: [], won: false, lost: false };
          setGame(fresh);
          saveNhGame(fresh);
        }
      })
      .catch(() => setLoadError("Could not load today's card. Check your connection."));
  }, []);

  async function handleGuess() {
    const g = guessRef.current.trim();
    if (!g || !targetCard || game.won || game.lost || fetching) return;

    setGuessError('');
    setFetching(true);
    let guessCard;
    try {
      guessCard = await getCardOldestPrinting(g);
    } catch {
      setGuessError(`"${g}" not found — check the spelling and try again.`);
      setFetching(false);
      return;
    } finally {
      setFetching(false);
    }

    const comparison = compareCards(guessCard, targetCard);
    const newGuesses = [...game.guesses, comparison];
    const won  = comparison.isCorrect;
    const lost = !won && newGuesses.length >= MAX_GUESSES;

    const updated = { ...game, guesses: newGuesses, won, lost };
    setGame(updated);
    saveNhGame(updated);
    setGuess('');
    guessRef.current = '';
  }

  if (loadError) return <div className="mtgle-error"><p>{loadError}</p></div>;
  if (!targetCard || !game) return <div className="mtgle-loading">Loading today's puzzle…</div>;

  const gameOver  = game.won || game.lost;
  const scoreTier = game.won ? getScoreTier(game.guesses.length) : null;
  const puzzleNum = dayNumber() % POOL_ORDER.length + 1;

  return (
    <div className="nh-wrap">
      <div className="nh-header">
        <div className="nh-title-row">
          <span className="nh-title">🧠 No-Hint Mode</span>
          <span className="mtgle-puzzle-num">#{puzzleNum}</span>
        </div>
        <p className="nh-subtitle">
          Guess any card — each guess reveals how its attributes compare to the target.
          Green = match · Red = miss · ↑↓ = CMC direction
        </p>
      </div>

      {game.guesses.length > 0 && (
        <div className="nh-table">
          <TableHeader />
          {game.guesses.map((c, i) => <GuessRow key={i} comparison={c} />)}
        </div>
      )}

      {!gameOver ? (
        <>
          <div className="nh-progress">
            Guess {game.guesses.length + 1} of {MAX_GUESSES}
          </div>
          {guessError && <p className="nh-guess-error">{guessError}</p>}
          <div className="mtgle-input-row">
            <CardSearchInput
              value={guess}
              onChange={v => { setGuess(v); guessRef.current = v; }}
              onSelect={v => { setGuess(v); guessRef.current = v; }}
              placeholder="Guess any card name…"
            />
            <button className="btn-primary" onClick={handleGuess} disabled={!guess.trim() || fetching}>
              {fetching ? '…' : 'Guess'}
            </button>
          </div>
        </>
      ) : (
        <div className="mtgle-result">
          {game.won ? (
            <>
              <div className="mtgle-result-icon">{scoreTier?.label.split(' ')[0]}</div>
              <div className="mtgle-result-title">{scoreTier?.label}</div>
              <div className="mtgle-result-sub">{scoreTier?.desc}</div>
            </>
          ) : (
            <>
              <div className="mtgle-result-icon">💀</div>
              <div className="mtgle-result-title">Better luck tomorrow!</div>
              <div className="mtgle-result-sub">The card was:</div>
            </>
          )}

          <div className="mtgle-reveal">
            {targetCard.image_uris?.normal && (
              <img src={targetCard.image_uris.normal} alt={targetCard.name} className="mtgle-reveal-img" />
            )}
            <div className="mtgle-reveal-info">
              <div className="mtgle-reveal-name">{targetCard.name}</div>
              <div className="mtgle-reveal-type">{targetCard.type_line}</div>
              <div className="mtgle-reveal-set">{targetCard.set_name}</div>
            </div>
          </div>

          <p className="mtgle-comeback">Come back tomorrow for puzzle #{puzzleNum + 1}!</p>
        </div>
      )}
    </div>
  );
}
