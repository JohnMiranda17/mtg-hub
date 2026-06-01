import { useState } from 'react';
import { parseBoardState } from '../utils/boardParser';
import { analyzeInteractions } from '../utils/interactionEngine';
import { getCardByName } from '../utils/scryfall';

const EXAMPLE = `MY BATTLEFIELD
  - Birds of Paradise (untapped)
  - Lightning Angel (untapped)

OPP BATTLEFIELD
  - Tarmogoyf (attacking)
  - Grand Abolisher (untapped)

MY HAND
  - Lightning Bolt
  - Giant Growth
  - Counterspell

STACK
  1. Doom Blade targeting Birds of Paradise

MANA: WWUUR

ACTIONS THIS TURN
  - Opponent cast Doom Blade`;

const PRIORITY_OPTIONS = [
  { value: 'me',       label: 'Me (I have priority)' },
  { value: 'opponent', label: 'Opponent (they have priority)' },
];

function ActionBadge({ restricted }) {
  if (!restricted) return <span className="badge-ok">✓ Available</span>;
  return <span className="badge-restricted" title={restricted}>⛔ Restricted</span>;
}

export default function BoardState() {
  const [text, setText]         = useState('');
  const [priority, setPriority] = useState('me');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true); setError(''); setAnalysis(null);
    try {
      const board = parseBoardState(text);

      // Gather all unique card names to look up
      const allNames = new Set([
        ...board.myBattlefield.map(p => p.name),
        ...board.oppBattlefield.map(p => p.name),
        ...board.myHand,
        ...board.stack.map(s => s.spell),
      ]);

      // Look up each card on Scryfall (in parallel, best-effort)
      const cardData = (await Promise.allSettled(
        [...allNames].map(name => getCardByName(name))
      ))
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      const result = analyzeInteractions(board, cardData, priority);
      setAnalysis({ board, ...result });
    } catch (e) {
      setError('Analysis failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#c9604a' }}>
        <h1>⚔️ Board State Analyzer</h1>
        <p>Describe your game state in text. The analyzer shows what instant-speed actions are available and flags interaction restrictions.</p>
      </div>

      <div className="board-layout">
        {/* ── Input Panel ─────────────────────────────────────────────── */}
        <div className="board-input-panel">
          <div className="board-section-header">
            <h2>Board State Input</h2>
            <button className="btn-ghost-sm" onClick={() => setText(EXAMPLE)}>Load example</button>
          </div>

          <textarea
            className="board-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={EXAMPLE}
            rows={20}
            spellCheck={false}
          />

          <div className="board-format-hint">
            <strong>Format:</strong> Use section headers <code>MY BATTLEFIELD</code>, <code>OPP BATTLEFIELD</code>,{' '}
            <code>MY HAND</code>, <code>STACK</code>, <code>MANA: WUUR</code>, <code>ACTIONS THIS TURN</code>.
            List cards with <code>- Card Name (tapped/untapped/attacking)</code>.
            Stack entries: <code>1. Spell Name targeting Target</code>.
          </div>

          <div className="board-controls">
            <div className="priority-select">
              <label>Who has priority?</label>
              <div className="radio-group">
                {PRIORITY_OPTIONS.map(o => (
                  <label key={o.value} className="radio-label">
                    <input type="radio" name="priority" value={o.value}
                      checked={priority === o.value}
                      onChange={() => setPriority(o.value)} />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
            <button className="btn-primary btn-large" onClick={analyze}
              disabled={loading || !text.trim()}>
              {loading ? 'Analyzing…' : 'Analyze Board State'}
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>

        {/* ── Analysis Panel ───────────────────────────────────────────── */}
        <div className="board-analysis-panel">
          {!analysis && !loading && (
            <div className="board-empty">
              <p>Enter your board state and click <strong>Analyze</strong>.</p>
              <p className="board-empty-hint">Cards are looked up on Scryfall to determine instant-speed eligibility and restriction interactions.</p>
            </div>
          )}

          {loading && <div className="board-loading">Looking up cards on Scryfall…</div>}

          {analysis && (
            <>
              {/* Stack */}
              {analysis.board.stack.length > 0 && (
                <section className="board-section">
                  <h3 className="board-section-title">📦 Stack (bottom → top)</h3>
                  {analysis.splitSecondOnStack && (
                    <div className="restriction-alert restriction-hard">
                      ⚠️ Split Second — no spells or non-mana abilities can be activated
                    </div>
                  )}
                  <ol className="stack-list">
                    {analysis.board.stack.map((entry, i) => (
                      <li key={i} className="stack-entry">
                        <span className="stack-spell">{entry.spell}</span>
                        {entry.target && <span className="stack-target"> → targeting <em>{entry.target}</em></span>}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <section className="board-section">
                  {analysis.warnings.map((w, i) => (
                    <div key={i} className="restriction-alert restriction-hard">{w.message}</div>
                  ))}
                </section>
              )}

              {/* Restrictions in play */}
              {analysis.restrictions.length > 0 && (
                <section className="board-section">
                  <h3 className="board-section-title">🔒 Active Restrictions</h3>
                  {analysis.restrictions.map(r => (
                    <div key={r.name} className={`restriction-alert restriction-${r.severity}`}>
                      <strong>{r.name}</strong> — {r.description}
                    </div>
                  ))}
                </section>
              )}

              {/* Castable spells */}
              <section className="board-section">
                <h3 className="board-section-title">⚡ Instant-Speed Casts</h3>
                {analysis.canCast.length === 0
                  ? <p className="board-none">No instant-speed spells available in hand.</p>
                  : (
                    <div className="action-list">
                      {analysis.canCast.map((c, i) => (
                        <div key={i} className={`action-card${c.restriction ? ' action-blocked' : ''}`}>
                          <div className="action-header">
                            <span className="action-name">{c.name}</span>
                            <span className="action-type-badge">{c.type}</span>
                            <span className="action-cost">{c.manaCost}</span>
                            <ActionBadge restricted={c.restriction} />
                          </div>
                          {c.oracleText && <p className="action-text">{c.oracleText}</p>}
                          {c.restriction && <p className="action-restriction-note">⛔ {c.restriction}</p>}
                        </div>
                      ))}
                    </div>
                  )
                }
              </section>

              {/* Activated abilities */}
              {analysis.activatableAbilities.length > 0 && (
                <section className="board-section">
                  <h3 className="board-section-title">🔧 Activated Abilities</h3>
                  <div className="action-list">
                    {analysis.activatableAbilities.map((a, i) => (
                      <div key={i} className={`action-card${a.blocked ? ' action-blocked' : ''}`}>
                        <div className="action-header">
                          <span className="action-name">{a.source}</span>
                          <span className="action-cost">{a.cost}</span>
                          <ActionBadge restricted={a.blocked ? `Blocked by ${a.blockedBy}` : null} />
                        </div>
                        <p className="action-text">{a.effect}</p>
                        {a.blocked && <p className="action-restriction-note">⛔ Blocked by {a.blockedBy}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Context notes */}
              {analysis.notes.length > 0 && (
                <section className="board-section">
                  <h3 className="board-section-title">💡 Notes</h3>
                  <ul className="notes-list">
                    {analysis.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </section>
              )}

              <p className="board-disclaimer">
                This analyzer uses Scryfall card data to determine instant-speed eligibility.
                It does not replace a judge — always consult the official Comprehensive Rules or a judge for complex interactions.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
