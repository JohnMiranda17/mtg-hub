import { useState, useEffect, useRef } from 'react';
import { searchCards, getCardImage, autocomplete } from '../utils/scryfall';

const COLORS = [
  { code: 'W', title: 'White' },
  { code: 'U', title: 'Blue'  },
  { code: 'B', title: 'Black' },
  { code: 'R', title: 'Red'   },
  { code: 'G', title: 'Green' },
];

const TYPES = [
  '', 'Creature', 'Instant', 'Sorcery', 'Enchantment',
  'Artifact', 'Land', 'Planeswalker', 'Battle',
];

const SYNTAX_EXAMPLES = [
  { label: 't:instant c:r', desc: 'Red instants' },
  { label: 'e:m21 t:creature', desc: 'Creatures from M21' },
  { label: 'is:legendary t:creature c:g', desc: 'Legendary green creatures' },
  { label: 'cmc=3 t:instant', desc: 'Instants that cost exactly 3' },
  { label: 'o:flying t:creature', desc: 'Creatures with "flying" in text' },
];

export default function CardFilterSearch({ onSelect, showPrices = false }) {
  const [rawQuery,      setRawQuery]      = useState('');
  const [colors,        setColors]        = useState([]);
  const [type,          setType]          = useState('');
  const [setCode,       setSetCode]       = useState('');
  const [results,       setResults]       = useState([]);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [searched,      setSearched]      = useState(false);
  const [showHelp,      setShowHelp]      = useState(false);
  const [suggestions,   setSuggestions]   = useState([]);
  const [showSugg,      setShowSugg]      = useState(false);
  const [activeSugg,    setActiveSugg]    = useState(-1);
  const inputRef  = useRef(null);
  const suggRef   = useRef(null);

  // Autocomplete: debounce 200 ms, min 2 chars, only for plain-name queries
  useEffect(() => {
    const q = rawQuery.trim();
    // Don't autocomplete if query looks like Scryfall syntax (contains operators)
    if (q.length < 2 || /[:<>=!]/.test(q)) {
      setSuggestions([]); setShowSugg(false); return;
    }
    const t = setTimeout(async () => {
      try {
        const names = await autocomplete(q);
        setSuggestions(names.slice(0, 8));
        setShowSugg(names.length > 0);
        setActiveSugg(-1);
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(t);
  }, [rawQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (suggRef.current && !suggRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSugg(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function buildQuery(nameOverride) {
    const parts = [];
    const name = nameOverride ?? rawQuery.trim();
    if (name) parts.push(name);
    if (colors.length > 0) parts.push(`c>=${colors.join('').toLowerCase()}`);
    if (type) parts.push(`t:${type.toLowerCase()}`);
    if (setCode.trim()) parts.push(`e:${setCode.trim().toLowerCase()}`);
    return parts.join(' ');
  }

  async function doSearch(nameOverride) {
    const q = buildQuery(nameOverride);
    if (!q) return;
    setRawQuery('');
    setSuggestions([]); setShowSugg(false);
    setLoading(true); setError(''); setResults([]); setTotal(0); setSearched(true);
    try {
      const { data, total: t } = await searchCards(q);
      setResults(data.slice(0, 24));
      setTotal(t);
    } catch {
      setError('Search failed — check your query syntax.');
    } finally { setLoading(false); }
  }

  function pickSuggestion(name) {
    setShowSugg(false);
    doSearch(name);
  }

  function handleKeyDown(e) {
    if (showSugg && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSugg(i => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSugg(i => Math.max(i - 1, -1));
        return;
      }
      if (e.key === 'Enter' && activeSugg >= 0) {
        e.preventDefault();
        pickSuggestion(suggestions[activeSugg]);
        return;
      }
      if (e.key === 'Escape') {
        setShowSugg(false); setActiveSugg(-1);
        return;
      }
    }
    if (e.key === 'Enter') doSearch();
  }

  function toggleColor(code) {
    setColors(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  }

  function applyExample(label) {
    setRawQuery(label);
    setColors([]); setType(''); setSetCode('');
    setSuggestions([]); setShowSugg(false);
  }

  const built = buildQuery();

  return (
    <div className="cfs-wrap">
      {/* ── Query input + autocomplete ───────────────────────── */}
      <div className="cfs-query-row" style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          className="cfs-input"
          value={rawQuery}
          onChange={e => setRawQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSugg(true)}
          placeholder="Name or Scryfall syntax: t:instant c:r, e:m21 lightning, is:legendary…"
          spellCheck={false}
          autoComplete="off"
        />
        <button className="btn-ghost-sm cfs-help-btn" onClick={() => setShowHelp(h => !h)} title="Syntax help">?</button>
        <button className="btn-primary" onClick={() => doSearch()} disabled={loading || !built}>
          {loading ? '…' : 'Search'}
        </button>

        {/* Autocomplete dropdown */}
        {showSugg && suggestions.length > 0 && (
          <ul className="cfs-suggestions" ref={suggRef}>
            {suggestions.map((name, i) => (
              <li
                key={name}
                className={`cfs-suggestion-item${i === activeSugg ? ' active' : ''}`}
                onMouseDown={e => { e.preventDefault(); pickSuggestion(name); }}
                onMouseEnter={() => setActiveSugg(i)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Syntax help ─────────────────────────────────────── */}
      {showHelp && (
        <div className="cfs-help-panel">
          <p className="cfs-help-title">Common Scryfall operators</p>
          <div className="cfs-help-table">
            <div><code>t:creature</code><span>Type includes "creature"</span></div>
            <div><code>c:r</code><span>Color is red (use w u b r g)</span></div>
            <div><code>c&gt;=rg</code><span>Contains red AND green</span></div>
            <div><code>e:dom</code><span>From set with code "dom"</span></div>
            <div><code>cmc=3</code><span>Mana value exactly 3</span></div>
            <div><code>is:legendary</code><span>Legendary supertype</span></div>
            <div><code>o:flying</code><span>Oracle text contains "flying"</span></div>
            <div><code>r:rare</code><span>Rarity (common/uncommon/rare/mythic)</span></div>
            <div><code>-t:creature</code><span>NOT a creature (negation)</span></div>
          </div>
          <p className="cfs-help-examples-label">Try these:</p>
          <div className="cfs-examples">
            {SYNTAX_EXAMPLES.map(ex => (
              <button key={ex.label} className="cfs-example-btn" onClick={() => { applyExample(ex.label); setShowHelp(false); }}>
                <code>{ex.label}</code>
                <span>{ex.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter chips ────────────────────────────────────── */}
      <div className="cfs-filters">
        <div className="cfs-filter-group">
          <span className="cfs-filter-label">Color</span>
          {COLORS.map(c => (
            <button key={c.code}
              className={`cfs-color-chip cfs-color-${c.code.toLowerCase()}${colors.includes(c.code) ? ' active' : ''}`}
              onClick={() => toggleColor(c.code)} title={c.title}
            >{c.code}</button>
          ))}
          {colors.length > 1 && (
            <span className="cfs-color-note">contains all selected</span>
          )}
        </div>

        <div className="cfs-filter-group">
          <span className="cfs-filter-label">Type</span>
          <select className="cfs-select" value={type} onChange={e => setType(e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t || 'Any'}</option>)}
          </select>
        </div>

        <div className="cfs-filter-group">
          <span className="cfs-filter-label">Set</span>
          <input className="cfs-set-input" value={setCode} onChange={e => setSetCode(e.target.value)}
            placeholder="e.g. m21" maxLength={6} onKeyDown={e => e.key === 'Enter' && doSearch()} />
        </div>
      </div>

      {/* ── Query preview ───────────────────────────────────── */}
      {built && <p className="cfs-preview">Scryfall query: <code>{built}</code></p>}

      {/* ── Results ─────────────────────────────────────────── */}
      {error   && <p className="form-error cfs-error">{error}</p>}
      {loading && <p className="cfs-loading">Searching Scryfall…</p>}

      {results.length > 0 && (
        <>
          {total > 24 && (
            <p className="cfs-count">{total.toLocaleString()} results — showing first 24</p>
          )}
          <div className="cfs-results">
            {results.map(card => {
              const img = getCardImage(card, 'small');
              return (
                <button key={card.id} className="cfs-result-item" onClick={() => onSelect(card)}>
                  {img && <img src={img} alt={card.name} className="cfs-result-img" loading="lazy" />}
                  <div className="cfs-result-info">
                    <span className="cfs-result-name">{card.name}</span>
                    <span className="cfs-result-meta">
                      {card.set_name} · {card.type_line?.split('—')[0].trim()}
                    </span>
                    {showPrices && card.prices?.usd && (
                      <span className="cfs-result-price">${card.prices.usd}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <p className="cfs-empty">No cards matched your search.</p>
      )}
    </div>
  );
}
