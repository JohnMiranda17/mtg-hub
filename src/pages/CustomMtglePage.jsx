import { useState } from 'react';
import { getRandomCard } from '../utils/scryfall';
import Mtgle from '../components/Mtgle';

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

export function buildQuery(filters) {
  const parts = [];

  if (filters.colors.length > 0) {
    parts.push(`(${filters.colors.map(c => `c:${c}`).join(' or ')})`);
  }
  if (filters.types.length > 0) {
    parts.push(`(${filters.types.map(t => `t:${t.toLowerCase()}`).join(' or ')})`);
  }
  if (filters.rarities.length > 0) {
    parts.push(`(${filters.rarities.map(r => `r:${r.toLowerCase()}`).join(' or ')})`);
  }
  if (filters.sets.length > 0) {
    parts.push(`(${filters.sets.map(s => `e:${s.trim().toLowerCase()}`).join(' or ')})`);
  }

  // Exclude tokens and non-English cards from the random draw
  parts.push('-is:token lang:en');

  return parts.join(' ');
}

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      className={`filter-pill${active ? ' filter-pill-active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function GameBuilder({ onCard }) {
  const [colors,   setColors]   = useState([]);
  const [types,    setTypes]    = useState([]);
  const [rarities, setRarities] = useState([]);
  const [setInput, setSetInput] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      const sets = setInput.trim()
        ? setInput.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const query = buildQuery({ colors, types, rarities, sets });
      const card  = await getRandomCard(query);
      onCard(card);
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
        Leave a section empty to include all options.
      </p>

      <div className="filter-section">
        <div className="filter-section-label">Colors</div>
        <div className="filter-pills">
          {COLORS.map(c => (
            <FilterPill
              key={c.code}
              label={`${c.symbol} ${c.label}`}
              active={colors.includes(c.code)}
              onClick={() => setColors(toggle(colors, c.code))}
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
              active={types.includes(t)}
              onClick={() => setTypes(toggle(types, t))}
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
              active={rarities.includes(r)}
              onClick={() => setRarities(toggle(rarities, r))}
            />
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-label">Set Codes <span className="filter-optional">(optional)</span></div>
        <input
          className="filter-set-input"
          type="text"
          placeholder="e.g. dsk, ltr, neo"
          value={setInput}
          onChange={e => setSetInput(e.target.value)}
        />
        <p className="filter-set-hint">
          Comma-separated Scryfall set codes. Find codes at{' '}
          <a href="https://scryfall.com/sets" target="_blank" rel="noreferrer">scryfall.com/sets ↗</a>
        </p>
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

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#e07b39' }}>
        <h1>⚙️ Custom MTGLE</h1>
        <p>Build your own puzzle — filter by color, type, rarity, and set.</p>
      </div>

      {customCard ? (
        <Mtgle
          key={customCard.id}
          overrideCard={customCard}
          onNewGame={() => setCustomCard(null)}
        />
      ) : (
        <GameBuilder onCard={setCustomCard} />
      )}
    </div>
  );
}
