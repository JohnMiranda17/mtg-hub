import { useState } from 'react';
import { getRandomCard } from '../utils/scryfall';
import Mtgle from '../components/Mtgle';
import NoHintMtgle from '../components/NoHintMtgle';

const COLORS = [
  { code: 'w', label: 'White',     symbol: 'W' },
  { code: 'u', label: 'Blue',      symbol: 'U' },
  { code: 'b', label: 'Black',     symbol: 'B' },
  { code: 'r', label: 'Red',       symbol: 'R' },
  { code: 'g', label: 'Green',     symbol: 'G' },
  { code: 'c', label: 'Colorless', symbol: 'C' },
];

const TYPES = ['Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker', 'Land', 'Battle'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Mythic'];

export function buildQuery({ colors, types, rarities, sets, bannedColors = [], bannedTypes = [], bannedRarities = [], bannedSets = [] }) {
  const parts = [];

  if (colors.length > 0)    parts.push(`(${colors.map(c => `c:${c}`).join(' or ')})`);
  if (types.length > 0)     parts.push(`(${types.map(t => `t:${t.toLowerCase()}`).join(' or ')})`);
  if (rarities.length > 0)  parts.push(`(${rarities.map(r => `r:${r.toLowerCase()}`).join(' or ')})`);
  if (sets.length > 0)      parts.push(`(${sets.map(s => `e:${s.trim().toLowerCase()}`).join(' or ')})`);
  bannedColors.forEach(c =>   parts.push(`-c:${c}`));
  bannedTypes.forEach(t =>    parts.push(`-t:${t.toLowerCase()}`));
  bannedRarities.forEach(r => parts.push(`-r:${r.toLowerCase()}`));
  bannedSets.forEach(s =>     parts.push(`-e:${s.trim().toLowerCase()}`));

  parts.push('-is:token lang:en');

  return parts.join(' ');
}

function cycleState(current) {
  if (!current) return 'include';
  if (current === 'include') return 'exclude';
  return '';
}

function FilterPill({ label, state, onClick }) {
  const cls = state === 'include' ? ' filter-pill-include'
            : state === 'exclude' ? ' filter-pill-exclude'
            : '';
  const prefix = state === 'include' ? '✓ ' : state === 'exclude' ? '✕ ' : '';
  return (
    <button
      className={`filter-pill${cls}`}
      onClick={onClick}
      type="button"
    >
      {prefix}{label}
    </button>
  );
}

const GAME_MODES = [
  { value: 'regular', label: 'Regular MTGLE' },
  { value: 'nohint',  label: '🧠 No-Hint Mode' },
];

function GameBuilder({ onCard }) {
  const [colorState,  setColorState]  = useState({});
  const [typeState,   setTypeState]   = useState({});
  const [rarityState, setRarityState] = useState({});
  const [setInput,    setSetInput]    = useState('');
  const [banSetInput, setBanSetInput] = useState('');
  const [gameMode,    setGameMode]    = useState('regular');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const includeColors   = Object.entries(colorState).filter(([,v]) => v === 'include').map(([k]) => k);
  const excludeColors   = Object.entries(colorState).filter(([,v]) => v === 'exclude').map(([k]) => k);
  const includeTypes    = Object.entries(typeState).filter(([,v]) => v === 'include').map(([k]) => k);
  const excludeTypes    = Object.entries(typeState).filter(([,v]) => v === 'exclude').map(([k]) => k);
  const includeRarities = Object.entries(rarityState).filter(([,v]) => v === 'include').map(([k]) => k);
  const excludeRarities = Object.entries(rarityState).filter(([,v]) => v === 'exclude').map(([k]) => k);

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      const sets = setInput.trim()
        ? setInput.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const bannedSets = banSetInput.trim()
        ? banSetInput.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const query = buildQuery({
        colors:   includeColors,
        types:    includeTypes,
        rarities: includeRarities,
        sets,
        bannedColors:   excludeColors,
        bannedTypes:    excludeTypes,
        bannedRarities: excludeRarities,
        bannedSets,
      });
      const card = await getRandomCard(query);
      onCard(card, gameMode);
    } catch (e) {
      setError(e.message ?? 'Could not fetch a card. Try different filters.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="custom-mtgle-builder">
      <p className="custom-mtgle-intro">
        Choose your filters and we'll pull a random matching card from Scryfall.
        Click once to include, click twice to exclude. Leave a section empty to include all options.
      </p>

      <div className="filter-section">
        <div className="filter-section-label">Colors</div>
        <div className="filter-pills">
          {COLORS.map(c => (
            <FilterPill
              key={c.code}
              label={`${c.symbol} ${c.label}`}
              state={colorState[c.code] ?? ''}
              onClick={() => setColorState(s => ({ ...s, [c.code]: cycleState(s[c.code] ?? '') }))}
            />
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-label">Card Types</div>
        <div className="filter-pills">
          {TYPES.map(t => (
            <FilterPill
              key={t}
              label={t}
              state={typeState[t] ?? ''}
              onClick={() => setTypeState(s => ({ ...s, [t]: cycleState(s[t] ?? '') }))}
            />
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-label">Rarity</div>
        <div className="filter-pills">
          {RARITIES.map(r => (
            <FilterPill
              key={r}
              label={r}
              state={rarityState[r] ?? ''}
              onClick={() => setRarityState(s => ({ ...s, [r]: cycleState(s[r] ?? '') }))}
            />
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-label">Include Sets <span className="filter-optional">(optional)</span></div>
        <input
          className="filter-set-input"
          type="text"
          placeholder="e.g. dsk, ltr, neo"
          value={setInput}
          onChange={e => setSetInput(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <div className="filter-section-label">Exclude Sets <span className="filter-optional">(optional)</span></div>
        <input
          className="filter-set-input"
          type="text"
          placeholder="e.g. lea, leb, 2ed"
          value={banSetInput}
          onChange={e => setBanSetInput(e.target.value)}
        />
        <p className="filter-set-hint">
          Comma-separated Scryfall set codes. Find codes at{' '}
          <a href="https://scryfall.com/sets" target="_blank" rel="noreferrer">scryfall.com/sets ↗</a>
        </p>
      </div>

      <div className="filter-section">
        <div className="filter-section-label">Game Mode</div>
        <div className="filter-pills">
          {GAME_MODES.map(m => (
            <button
              key={m.value}
              className={`filter-pill${gameMode === m.value ? ' filter-pill-include' : ''}`}
              onClick={() => setGameMode(m.value)}
              type="button"
            >
              {gameMode === m.value ? '✓ ' : ''}{m.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="custom-mtgle-error">{error}</p>}

      <button
        className="btn-primary custom-mtgle-submit"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? 'Finding a card…' : '🎲 Create Game'}
      </button>
    </div>
  );
}

export default function CustomMtglePage() {
  const [customCard, setCustomCard] = useState(null);
  const [gameMode,   setGameMode]   = useState('regular');

  function handleCard(card, mode) {
    setCustomCard(card);
    setGameMode(mode);
  }

  function handleNewGame() {
    setCustomCard(null);
  }

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#e07b39' }}>
        <h1>⚙️ Custom MTGLE</h1>
        <p>Build your own puzzle — filter by color, type, rarity, and set.</p>
      </div>

      {customCard ? (
        gameMode === 'nohint' ? (
          <NoHintMtgle
            key={customCard.id}
            overrideCard={customCard}
            onNewGame={handleNewGame}
          />
        ) : (
          <Mtgle
            key={customCard.id}
            overrideCard={customCard}
            onNewGame={handleNewGame}
          />
        )
      ) : (
        <GameBuilder onCard={handleCard} />
      )}
    </div>
  );
}
