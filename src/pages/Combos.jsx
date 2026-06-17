import { useState } from 'react';
import { Link } from 'react-router-dom';
import CardSearchInput from '../components/CardSearchInput';
import CardTooltip from '../components/CardTooltip';
import ComboFinder from '../components/ComboFinder';
import { TOP_COMBOS, COMBO_TYPE_COLORS, dailyTopCombo } from '../data/topCombos';

const PROXY_BASE = import.meta.env.VITE_SPELLBOOK_PROXY ?? '';
const API_BASE   = PROXY_BASE || 'https://backend.commanderspellbook.com';

const TABS = [
  { id: 'search',      label: '🔍 Search'      },
  { id: 'top-combos',  label: '⭐ Top Combos'  },
  { id: 'combo-finder', label: '🔄 Combo Finder' },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function cardCount(combo) { return combo.uses?.length ?? 0; }
function formatSteps(description) {
  if (!description) return [];
  return description.split('\n').map(s => s.trim()).filter(Boolean);
}
function collectProduces(combo) {
  return (combo.produces ?? [])
    .map(p => p.feature?.name ?? p.name ?? '')
    .filter(Boolean);
}
function csbSearchUrl(name) {
  return `https://commanderspellbook.com/search/?q=card%3A%22${encodeURIComponent(name)}%22`;
}

/* ── Live API combo card ─────────────────────────────────────────────────── */
function ComboCard({ combo }) {
  const [open, setOpen] = useState(false);
  const cards    = combo.uses?.map(u => u.card?.name ?? '') ?? [];
  const produces = collectProduces(combo);
  const steps    = formatSteps(combo.description);
  const preReqs  = [combo.easyPrerequisites, combo.notablePrerequisites].filter(Boolean).join(' ');

  return (
    <div className={`combo-card${open ? ' combo-card-open' : ''}`}>
      <button className="combo-card-header" onClick={() => setOpen(o => !o)}>
        <div className="combo-card-title-wrap">
          <span className="combo-size-badge">{cards.length}-card</span>
          <span className="combo-card-names">
            {cards.map((n, i) => (
              <span key={n}>
                <CardTooltip name={n}>{n}</CardTooltip>
                {i < cards.length - 1 && ' + '}
              </span>
            ))}
          </span>
        </div>
        {produces.length > 0 && (
          <div className="combo-produces">
            {produces.slice(0, 2).map((p, i) => (
              <span key={i} className="combo-produce-tag">{p}</span>
            ))}
            {produces.length > 2 && <span className="combo-produce-more">+{produces.length - 2}</span>}
          </div>
        )}
        <span className="combo-expand-icon">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="combo-card-body">
          <div className="combo-cards-row">
            {cards.map(name => (
              <Link key={name} to="/prices" state={{ cardName: name }} className="combo-card-link">
                <CardTooltip name={name}>{name} ↗</CardTooltip>
              </Link>
            ))}
          </div>
          {preReqs && (
            <div className="combo-section">
              <div className="combo-section-label">Prerequisites</div>
              <p className="combo-prereq-text">{preReqs}</p>
            </div>
          )}
          {steps.length > 0 && (
            <div className="combo-section">
              <div className="combo-section-label">Steps</div>
              <ol className="combo-steps">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
          )}
          {produces.length > 0 && (
            <div className="combo-section">
              <div className="combo-section-label">Produces</div>
              <div className="combo-produces-full">
                {produces.map((p, i) => <span key={i} className="combo-produce-tag">{p}</span>)}
              </div>
            </div>
          )}
          {combo.manaNeeded && (
            <div className="combo-section">
              <div className="combo-section-label">Mana Needed</div>
              <span className="combo-mana">{combo.manaNeeded}</span>
            </div>
          )}
          <a
            href={`https://commanderspellbook.com/combo/${combo.id}/`}
            target="_blank" rel="noreferrer"
            className="combo-external-link"
          >
            View on Commander Spellbook ↗
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Static top-combo card ───────────────────────────────────────────────── */
function TopComboCard({ combo }) {
  const [open, setOpen] = useState(false);
  const color = combo.color ?? COMBO_TYPE_COLORS[combo.type] ?? '#c9a84c';

  return (
    <div
      className={`combo-card${open ? ' combo-card-open' : ''}`}
      style={{ '--combo-color': color }}
    >
      <button className="combo-card-header" onClick={() => setOpen(o => !o)}>
        <div className="combo-card-title-wrap">
          <span className="combo-size-badge" style={{ background: color }}>
            {combo.icon} {combo.type}
          </span>
          <span className="combo-card-names">
            {combo.cards.map((n, i) => (
              <span key={n}>
                <CardTooltip name={n}>{n}</CardTooltip>
                {i < combo.cards.length - 1 && ' + '}
              </span>
            ))}
          </span>
        </div>
        <span className="combo-expand-icon">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="combo-card-body">
          <div className="combo-cards-row">
            {combo.cards.map(name => (
              <Link key={name} to="/prices" state={{ cardName: name }} className="combo-card-link">
                <CardTooltip name={name}>{name} ↗</CardTooltip>
              </Link>
            ))}
          </div>
          <div className="combo-section">
            <div className="combo-section-label">Prerequisites</div>
            <p className="combo-prereq-text">{combo.prereqs}</p>
          </div>
          <div className="combo-section">
            <div className="combo-section-label">Steps</div>
            <ol className="combo-steps">
              {combo.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          <div className="combo-section">
            <div className="combo-section-label">Result</div>
            <p className="combo-prereq-text" style={{ color }}>{combo.result}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Combo type educational card ─────────────────────────────────────────── */
const COMBO_TYPES = [
  {
    type: 'Infinite Mana',
    icon: '💎',
    color: '#4a8fc9',
    desc: 'Generate unlimited mana by looping two or more pieces. Usually requires a mana source that untaps or resets itself.',
    how_to_stop: 'Counter a key piece before it resolves, or remove one of the pieces. Stax pieces like "players can\'t untap more than one permanent per turn" also shut these down.',
  },
  {
    type: 'Instant Win',
    icon: '🏆',
    color: '#c9684a',
    desc: 'Directly win the game — usually by emptying your library (Thassa\'s Oracle) or dealing 120+ damage (Aetherflux Reservoir).',
    how_to_stop: 'Counterspells are most effective. Graveyard hate can pre-empt reanimation combos. Exiling key pieces prevents them from being recurred.',
  },
  {
    type: 'Infinite Tokens',
    icon: '👥',
    color: '#a06cd5',
    desc: 'Create unlimited creature tokens, usually with haste. Win by attacking with the token army in the same turn.',
    how_to_stop: 'Remove the token generator before the combo activates. "Tokens can\'t attack" or "creatures can\'t get haste" shut down most token combos.',
  },
  {
    type: 'Infinite Damage',
    icon: '💥',
    color: '#c94a4a',
    desc: 'Deal unlimited direct damage, often through a creature that can ping or by looping a spell. Frequently uses undying or recursion.',
    how_to_stop: 'Remove the damage source before they loop. Lifegain doesn\'t stop these — they deal infinite damage regardless.',
  },
  {
    type: 'Infinite Turns',
    icon: '🔄',
    color: '#4ac97a',
    desc: 'Take unlimited additional turns by recurring "take an extra turn" cards. The opponent never untaps or draws again.',
    how_to_stop: 'Counter the extra turn spell. Some decks run "players can\'t take extra turns" (Stranglehold). Milling the recursion piece also works.',
  },
  {
    type: 'Infinite Draw',
    icon: '📚',
    color: '#c9a84c',
    desc: 'Draw your entire library, then win with Laboratory Maniac, Jace Wielder of Mysteries, or Thassa\'s Oracle.',
    how_to_stop: 'Remove the draw engine before it activates. Leyline of the Void prevents them from winning via empty library graveyard interactions.',
  },
];

function ComboTypeCard({ type }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`combo-card${open ? ' combo-card-open' : ''}`}
      style={{ '--combo-color': type.color }}
    >
      <button className="combo-card-header" onClick={() => setOpen(o => !o)}>
        <div className="combo-card-title-wrap">
          <span className="combo-size-badge" style={{ background: type.color }}>{type.icon} {type.type}</span>
        </div>
        <span className="combo-expand-icon">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="combo-card-body">
          <p className="combo-prereq-text">{type.desc}</p>
          <div className="combo-section" style={{ marginTop: '0.5rem' }}>
            <div className="combo-section-label">How to stop it</div>
            <p className="combo-prereq-text">{type.how_to_stop}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Search tab ──────────────────────────────────────────────────────────── */
function SearchTab() {
  const [query, setQuery]     = useState('');
  const [combos, setCombos]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [corsBlocked, setCorsBlocked] = useState(false);
  const [lastQuery, setLastQuery]     = useState('');
  const [filter, setFilter]   = useState('all');
  const [featuredOpen, setFeaturedOpen] = useState(false);

  async function search(name) {
    const n = name ?? query;
    if (!n.trim()) return;
    setLoading(true); setCorsBlocked(false); setCombos(null); setLastQuery(n);

    try {
      const url = `${API_BASE}/variants?q=card%3A"${encodeURIComponent(n)}"&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const all = (data.results ?? []).filter(c => {
        const count = cardCount(c);
        return count === 2 || count === 3;
      });
      setCombos(all);
    } catch {
      setCorsBlocked(true);
    } finally { setLoading(false); }
  }

  const displayed = combos
    ? (filter === 'all' ? combos : combos.filter(c => cardCount(c) === parseInt(filter)))
    : null;

  const count2 = combos?.filter(c => cardCount(c) === 2).length ?? 0;
  const count3 = combos?.filter(c => cardCount(c) === 3).length ?? 0;

  return (
    <>
      {/* Search input */}
      <div className="combo-search-row">
        <CardSearchInput
          value={query}
          onChange={setQuery}
          onSelect={n => { setQuery(n); search(n); }}
          placeholder="Search a card to find combos…"
        />
        <button className="btn-primary" onClick={() => search()} disabled={loading || !query.trim()}>
          {loading ? '…' : 'Find Combos'}
        </button>
      </div>

      {corsBlocked && (
        <div className="combo-cors-fallback">
          <p className="combo-cors-msg">
            Live search requires the proxy to be configured. Browse the featured combos below, or{' '}
            <a href={csbSearchUrl(lastQuery)} target="_blank" rel="noreferrer" style={{ color: '#a06cd5' }}>
              search "{lastQuery}" on Commander Spellbook ↗
            </a>
          </p>
        </div>
      )}

      {/* Live results */}
      {combos !== null && (
        <>
          {combos.length === 0 ? (
            <div className="empty-state">
              <p>No 2 or 3-card combos found for "{lastQuery}".</p>
              <p style={{ fontSize: '.85rem', color: 'var(--text-dim)', marginTop: '.5rem' }}>
                Try a different card name. Browse the featured combos below for inspiration.
              </p>
            </div>
          ) : (
            <>
              <div className="combo-filter-bar">
                <span className="combo-result-count">
                  {combos.length} combo{combos.length !== 1 ? 's' : ''} found for "{lastQuery}"
                </span>
                <div className="combo-filter-tabs">
                  <button className={`combo-filter-tab${filter === 'all' ? ' active' : ''}`}
                    onClick={() => setFilter('all')}>All ({combos.length})</button>
                  {count2 > 0 && (
                    <button className={`combo-filter-tab${filter === '2' ? ' active' : ''}`}
                      onClick={() => setFilter('2')}>2-Card ({count2})</button>
                  )}
                  {count3 > 0 && (
                    <button className={`combo-filter-tab${filter === '3' ? ' active' : ''}`}
                      onClick={() => setFilter('3')}>3-Card ({count3})</button>
                  )}
                </div>
              </div>
              <div className="combo-list">
                {displayed?.map(combo => <ComboCard key={combo.id} combo={combo} />)}
              </div>
            </>
          )}
        </>
      )}

      {/* What is a Combo? */}
      <div className="combo-info-section">
        <h3 className="subsection-title" style={{ marginTop: combos !== null ? '2rem' : '0.5rem' }}>
          What is a Combo?
        </h3>
        <p className="section-intro">
          A <strong>combo</strong> is two or more cards that interact to create a powerful or game-ending effect — usually generating infinite resources, drawing your whole deck, or winning outright.
        </p>
        <div className="combo-list" style={{ marginTop: '0.75rem' }}>
          {COMBO_TYPES.map(t => <ComboTypeCard key={t.type} type={t} />)}
        </div>
      </div>

      {/* Featured combos (collapsed by default) */}
      <div className="combo-info-section">
        <div className="combo-featured-header" onClick={() => setFeaturedOpen(o => !o)}>
          <h3 className="subsection-title" style={{ margin: 0 }}>⭐ Featured Commander Combos</h3>
          <span className="combo-expand-icon">{featuredOpen ? '▲' : '▼'}</span>
        </div>
        <p className="section-intro" style={{ marginTop: '0.4rem' }}>
          Classic examples. Hover card names to preview them.
        </p>
        {featuredOpen ? (
          <div className="combo-list" style={{ marginTop: '0.75rem' }}>
            {TOP_COMBOS.slice(0, 6).map(c => <TopComboCard key={c.id} combo={c} />)}
          </div>
        ) : (
          <button className="combo-show-featured-btn" onClick={() => setFeaturedOpen(true)}>
            Show featured combos ▼
          </button>
        )}
      </div>
    </>
  );
}

/* ── Top Combos tab ──────────────────────────────────────────────────────── */
const ALL_TYPES = ['All', ...new Set(TOP_COMBOS.map(c => c.type))];

function TopCombosTab() {
  const daily = dailyTopCombo();
  const [typeFilter, setTypeFilter] = useState('All');
  const [showDaily, setShowDaily] = useState(true);

  const filtered = typeFilter === 'All'
    ? TOP_COMBOS
    : TOP_COMBOS.filter(c => c.type === typeFilter);

  return (
    <>
      {/* Daily featured */}
      {showDaily && (
        <div className="tc-daily">
          <div className="tc-daily-header">
            <div>
              <div className="tc-daily-eyebrow">⭐ Today's Featured Combo</div>
              <div className="tc-daily-title">{daily.cards.join(' + ')}</div>
            </div>
            <button className="btn-ghost-sm" onClick={() => setShowDaily(false)}>✕</button>
          </div>
          <TopComboCard combo={daily} />
        </div>
      )}

      {/* Type filter */}
      <div className="tc-filter-row">
        {ALL_TYPES.map(t => (
          <button
            key={t}
            className={`combo-filter-tab${typeFilter === t ? ' active' : ''}`}
            onClick={() => setTypeFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="section-intro">
        {filtered.length} combo{filtered.length !== 1 ? 's' : ''}. Hover card names to preview the card image.
      </p>

      <div className="combo-list">
        {filtered.map(c => <TopComboCard key={c.id} combo={c} />)}
      </div>
    </>
  );
}

/* ── Main Combos page ────────────────────────────────────────────────────── */
export default function Combos() {
  const [tab, setTab] = useState('search');

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#d4622a' }}>
        <h1>💥 Combos</h1>
        <p>
          Search card-specific combos, explore the top 80 Commander combos with card hover previews,
          or test your knowledge with the Combo Finder mini-game.
        </p>
      </div>

      <nav className="sub-tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`sub-tab${tab === t.id ? ' sub-tab-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'search'       && <SearchTab />}
      {tab === 'top-combos'   && <TopCombosTab />}
      {tab === 'combo-finder' && <ComboFinder />}
    </div>
  );
}
