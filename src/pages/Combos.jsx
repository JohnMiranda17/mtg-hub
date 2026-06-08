import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CardSearchInput from '../components/CardSearchInput';

/*
 * Data source: Commander Spellbook (https://commanderspellbook.com)
 * API: https://backend.commanderspellbook.com/api/v2/combos/?q=card%3A"CARDNAME"
 *
 * NOTE — Why not EDHREC combos?
 * EDHREC's combo data lives at https://edhrec.com/combos/[cardname] as a server-side
 * rendered Next.js page. Their JSON API (json.edhrec.com) does not expose a combo
 * search endpoint. Accessing the combo data would require:
 *   1. Fetching the full HTML page
 *   2. Extracting the __NEXT_DATA__ JSON embedded in a <script> tag
 *   3. Parsing an undocumented, frequently-changing internal schema
 * This approach is brittle and could break on any EDHREC deployment.
 *
 * Commander Spellbook advantages:
 *   - Official REST API with consistent JSON schema
 *   - Each combo includes: card names, steps, prerequisites, and win condition
 *   - Actively maintained with 800+ combos
 *   - Free, no authentication required
 *   - Supports filtering by card count (2-card, 3-card, etc.)
 */

const API_BASE = 'https://backend.commanderspellbook.com/api/v2';

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function cardCount(combo) { return combo.uses?.length ?? 0; }

function formatSteps(steps) {
  if (!steps) return [];
  return steps.split(/\d+\.\s+/).map(s => s.trim()).filter(Boolean);
}

function collectProduces(combo) {
  return (combo.produces ?? [])
    .map(p => p.feature?.name ?? p.name ?? '')
    .filter(Boolean);
}

/* ── Combo card ────────────────────────────────────────────────────────────── */
function ComboCard({ combo }) {
  const [open, setOpen] = useState(false);
  const cards    = combo.uses?.map(u => u.card?.name ?? '') ?? [];
  const produces = collectProduces(combo);
  const steps    = formatSteps(combo.steps);
  const preReqs  = [combo.easyPrerequisites, combo.notablePrerequisites].filter(Boolean).join(' ');

  return (
    <div className={`combo-card${open ? ' combo-card-open' : ''}`}>
      <button className="combo-card-header" onClick={() => setOpen(o => !o)}>
        <div className="combo-card-title-wrap">
          <span className="combo-size-badge">{cards.length}-card</span>
          <span className="combo-card-names">{cards.join(' + ')}</span>
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
          {/* Cards in combo as clickable links */}
          <div className="combo-cards-row">
            {cards.map(name => (
              <Link key={name} to="/prices" state={{ cardName: name }} className="combo-card-link">
                {name} ↗
              </Link>
            ))}
          </div>

          {/* Prerequisites */}
          {preReqs && (
            <div className="combo-section">
              <div className="combo-section-label">Prerequisites</div>
              <p className="combo-prereq-text">{preReqs}</p>
            </div>
          )}

          {/* Steps */}
          {steps.length > 0 && (
            <div className="combo-section">
              <div className="combo-section-label">Steps</div>
              <ol className="combo-steps">
                {steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}

          {/* Results */}
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

/* ── Combos page ───────────────────────────────────────────────────────────── */
export default function Combos() {
  const [query, setQuery]   = useState('');
  const [combos, setCombos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | '2' | '3'

  async function search(name) {
    const n = name ?? query;
    if (!n.trim()) return;
    setLoading(true); setError(''); setCombos(null);

    try {
      const url = `${API_BASE}/combos/?q=card%3A"${encodeURIComponent(n)}"&format=json`;
      const data = await fetch(url).then(r => r.json());
      const all = (data.results ?? []).filter(c => {
        const count = cardCount(c);
        return count === 2 || count === 3;
      });
      setCombos(all);
    } catch {
      setError('Could not reach Commander Spellbook. Check your connection.');
    } finally { setLoading(false); }
  }

  const displayed = combos
    ? (filter === 'all'
        ? combos
        : combos.filter(c => cardCount(c) === parseInt(filter))
      )
    : null;

  const count2 = combos?.filter(c => cardCount(c) === 2).length ?? 0;
  const count3 = combos?.filter(c => cardCount(c) === 3).length ?? 0;

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#a06cd5' }}>
        <h1>💥 Combo Searcher</h1>
        <p>
          Find 2 and 3-card combos for any card. Data from{' '}
          <a href="https://commanderspellbook.com" target="_blank" rel="noreferrer" style={{ color: '#a06cd5' }}>
            Commander Spellbook
          </a>.
        </p>
      </div>

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
      {error && <p className="form-error">{error}</p>}

      {combos !== null && (
        <>
          {combos.length === 0 ? (
            <div className="empty-state">
              <p>No 2 or 3-card combos found for "{query}".</p>
              <p style={{ fontSize: '.85rem', color: 'var(--text-dim)', marginTop: '.5rem' }}>
                Try a different card name, or search on{' '}
                <a href="https://commanderspellbook.com" target="_blank" rel="noreferrer">
                  Commander Spellbook
                </a>{' '}
                directly.
              </p>
            </div>
          ) : (
            <>
              <div className="combo-filter-bar">
                <span className="combo-result-count">
                  {combos.length} combo{combos.length !== 1 ? 's' : ''} found for "{query}"
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
                {displayed?.map(combo => (
                  <ComboCard key={combo.id} combo={combo} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {combos === null && !loading && (
        <div className="empty-state">
          <p>Enter a card name above to search for combos.</p>
          <p style={{ fontSize: '.85rem', color: 'var(--text-dim)', marginTop: '.5rem' }}>
            Only 2-card and 3-card combos are shown. Powered by Commander Spellbook.
          </p>
        </div>
      )}
    </div>
  );
}
