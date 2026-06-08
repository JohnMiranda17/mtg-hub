import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getCardByName, formatPrice, getCardImage } from '../utils/scryfall';
import { recordSnapshot, getHistory, recordSynergyLink, getSynergyLinks } from '../utils/priceHistory';
import { usePriceWatchlist } from '../hooks/usePriceWatchlist';
import { useDecks } from '../hooks/useDecks';
import { analyzeCard, getSynergyTags } from '../utils/cardAdvisor';
import CardFilterSearch from '../components/CardFilterSearch';
import PrintingPicker from '../components/PrintingPicker';
import PriceChart from '../components/PriceChart';

/* ── Reddit Mentions ─────────────────────────────────────────────────────── */
const REDDIT_SUBS = ['magicTCG', 'EDH', 'mtgfinance', 'spikes'];

function SubredditPosts({ cardName, sub }) {
  const [posts, setPosts]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setPosts(null);

    const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(cardName)}&restrict_sr=1&sort=new&t=month&limit=5`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const children = data?.data?.children ?? [];
        setPosts(children.map(c => ({
          title: c.data.title,
          score: c.data.score,
          url:   `https://reddit.com${c.data.permalink}`,
        })));
      })
      .catch(() => { if (!cancelled) setError('Could not load Reddit data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [cardName, sub]);

  if (loading) return <p className="insights-loading">Checking r/{sub}…</p>;
  if (error)   return <p className="insights-error">{error}</p>;
  if (!posts || posts.length === 0) return <p className="insights-empty">No recent posts in r/{sub} for "{cardName}".</p>;

  return (
    <ul className="reddit-posts">
      {posts.map((p, i) => (
        <li key={i} className="reddit-post">
          <a href={p.url} target="_blank" rel="noreferrer" className="reddit-post-title">{p.title}</a>
          <span className="reddit-post-score">▲ {p.score}</span>
        </li>
      ))}
    </ul>
  );
}

function RedditMentions({ cardName }) {
  const [activeSub, setActiveSub] = useState(REDDIT_SUBS[0]);

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">📣 Reddit — last 30 days</span>
      </div>
      <div className="reddit-sub-tabs">
        {REDDIT_SUBS.map(sub => (
          <button
            key={sub}
            className={`reddit-sub-tab${activeSub === sub ? ' active' : ''}`}
            onClick={() => setActiveSub(sub)}
          >
            r/{sub}
          </button>
        ))}
      </div>
      <SubredditPosts cardName={cardName} sub={activeSub} />
    </div>
  );
}

/* ── EDHREC Synergies ────────────────────────────────────────────────────── */
function toEdhrecSlug(name) {
  return name
    .toLowerCase()
    .replace(/[',]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function EdhrecSynergies({ card }) {
  const [synCards, setSynCards] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  // hovered: { img, name, x, y } where x/y are viewport coords from getBoundingClientRect
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setSynCards(null);

    const slug = toEdhrecSlug(card.name);

    async function load() {
      // 1. Fetch EDHREC synergy card list (names only — no images in their API)
      const data = await fetch(`https://json.edhrec.com/pages/cards/${slug}.json`).then(r => r.json());
      if (cancelled) return;

      const lists = data?.container?.json_dict?.cardlists ?? [];
      const synergyList = lists.find(l =>
        l.tag === 'synergy' || (l.header ?? '').toLowerCase().includes('synergy')
      ) ?? lists[0];

      const views = (synergyList?.cardviews ?? []).slice(0, 8);
      if (views.length === 0) { setSynCards([]); setLoading(false); return; }

      // 2. Batch-fetch card images from Scryfall's collection endpoint
      const names = views.map(v => v.name ?? v.sanitized ?? '').filter(Boolean);
      const scData = await fetch('https://api.scryfall.com/cards/collection', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ identifiers: names.map(name => ({ name })) }),
      }).then(r => r.json());
      if (cancelled) return;

      const byName = {};
      for (const c of scData.data ?? []) {
        byName[c.name.toLowerCase()] = c;
      }

      const enriched = views.map(v => {
        const name = v.name ?? v.sanitized ?? '';
        const sc   = byName[name.toLowerCase()];
        const img  = sc
          ? (sc.image_uris?.normal ?? sc.card_faces?.[0]?.image_uris?.normal ?? null)
          : null;
        return { name, img, price: sc?.prices?.usd ?? null, synPct: v.synergy != null ? Math.round(v.synergy * 100) : null };
      });

      setSynCards(enriched);

      // Record synergy links for back-reference on other cards
      for (const v of views) {
        const slug = v.sanitized ?? v.name;
        if (slug) recordSynergyLink(card, slug);
      }
    }

    load()
      .catch(() => { if (!cancelled) setError('EDHREC data unavailable for this card.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [card.id]);

  if (loading) return (
    <div className="insights-panel">
      <div className="insights-header"><span className="insights-title">♻ EDHREC Synergies</span></div>
      <p className="insights-loading">Loading EDHREC data…</p>
    </div>
  );

  if (error) return (
    <div className="insights-panel">
      <div className="insights-header"><span className="insights-title">♻ EDHREC Synergies</span></div>
      <p className="insights-error">{error}</p>
    </div>
  );

  if (!synCards || synCards.length === 0) return (
    <div className="insights-panel">
      <div className="insights-header"><span className="insights-title">♻ EDHREC Synergies</span></div>
      <p className="insights-empty">No synergy data found on EDHREC.</p>
    </div>
  );

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">♻ EDHREC Synergy Cards</span>
        <a href={`https://edhrec.com/cards/${toEdhrecSlug(card.name)}`}
          target="_blank" rel="noreferrer" className="insights-external-link">
          View on EDHREC ↗
        </a>
      </div>
      <p className="insights-sub">Cards commonly played alongside <strong>{card.name}</strong>.</p>
      {/* Hover tooltip — position:fixed escapes parent overflow/border-radius clipping
          without needing createPortal (which has Rolldown bundling issues). */}
      {hovered?.img && (
        <div style={{
          position: 'fixed', left: hovered.x, top: hovered.y - 8,
          transform: 'translate(-50%,-100%)', zIndex: 10000,
          pointerEvents: 'none', filter: 'drop-shadow(0 6px 24px rgba(0,0,0,.85))',
        }}>
          <img src={hovered.img} alt={hovered.name} style={{ width: 200, borderRadius: 8, display: 'block' }} />
        </div>
      )}
      <div className="syn-cards-grid">
        {synCards.map((c, i) => (
          <Link
            key={i}
            to="/prices"
            state={{ cardName: c.name }}
            className="syn-card"
            onMouseEnter={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setHovered({ img: c.img, name: c.name, x: r.left + r.width / 2, y: r.top });
            }}
            onMouseLeave={() => setHovered(null)}
          >
            {c.img
              ? <img src={c.img} alt={c.name} className="syn-card-img" loading="lazy" />
              : <div className="syn-card-placeholder">{c.name}</div>
            }
            <div className="syn-card-info">
              <div className="syn-card-name">{c.name}</div>
              {c.price  && <div className="syn-card-price">{formatPrice(c.price)}</div>}
              {c.synPct != null && <div className="syn-card-syn">{c.synPct > 0 ? '+' : ''}{c.synPct}% syn</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Deck commander synergy rating ──────────────────────────────────────── */
function DeckCommanderSynergy({ card }) {
  const { decks } = useDecks();
  const [synergies, setSynergies] = useState(null);
  const [loading, setLoading] = useState(false);

  // Commanders designated in the user's Commander-format decks
  const commanderDecks = useMemo(() =>
    decks
      .filter(d => d.format === 'commander')
      .flatMap(d => {
        const cmdr = d.cards.find(c => c.isCommander);
        return cmdr ? [{ deckName: d.name, commanderName: cmdr.cardName }] : [];
      }),
    [decks]
  );

  useEffect(() => {
    if (!card || commanderDecks.length === 0) { setSynergies([]); return; }

    let cancelled = false;
    setLoading(true);
    setSynergies(null);

    async function load() {
      const slug = toEdhrecSlug(card.name);
      const data = await fetch(`https://json.edhrec.com/pages/cards/${slug}.json`).then(r => r.json());
      if (cancelled) return;

      const lists = data?.container?.json_dict?.cardlists ?? [];

      // Commander cardviews have URLs starting with /commanders/
      // Each entry's inclusion/num_decks tells us what % of that commander's decks play this card
      const edhCmdMap = {};
      for (const list of lists) {
        for (const view of list.cardviews ?? []) {
          if ((view.url ?? '').startsWith('/commanders/') && view.name) {
            const pct = view.num_decks > 0
              ? Math.round((view.inclusion / view.num_decks) * 100)
              : 0;
            edhCmdMap[view.name.toLowerCase()] = { pct, inclusion: view.inclusion ?? 0, numDecks: view.num_decks ?? 0 };
          }
        }
      }

      const results = commanderDecks
        .map(({ deckName, commanderName }) => {
          const e = edhCmdMap[commanderName.toLowerCase()];
          if (!e) return null;
          return { deckName, commanderName, ...e };
        })
        .filter(Boolean)
        .sort((a, b) => b.pct - a.pct);

      if (!cancelled) setSynergies(results);
    }

    load()
      .catch(() => { if (!cancelled) setSynergies([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [card?.id, commanderDecks]);

  if (commanderDecks.length === 0) return null;

  const ratingFor = pct =>
    pct >= 70 ? { label: 'Staple',      cls: 'cmdr-rating-staple' } :
    pct >= 40 ? { label: 'Good Fit',    cls: 'cmdr-rating-good'   } :
                { label: 'Situational', cls: 'cmdr-rating-situ'   };

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">🃏 Your Commander Synergy</span>
      </div>
      <p className="insights-sub">How often EDHREC lists this card with your commanders.</p>
      {loading && <p className="insights-loading">Checking your commanders…</p>}
      {synergies?.length === 0 && (
        <p className="insights-empty">None of your designated commanders appear in EDHREC's data for this card.</p>
      )}
      {synergies?.length > 0 && (
        <div className="cmdr-syn-list">
          {synergies.map((s, i) => {
            const r = ratingFor(s.pct);
            return (
              <div key={i} className="cmdr-syn-item">
                <div className="cmdr-syn-row">
                  <span className="cmdr-syn-name">{s.commanderName}</span>
                  <span className={`cmdr-syn-badge ${r.cls}`}>{r.label}</span>
                  <span className="cmdr-syn-pct">{s.pct}%</span>
                </div>
                <div className="cmdr-syn-sub">
                  {s.inclusion.toLocaleString()} of {s.numDecks.toLocaleString()} decks · "{s.deckName}"
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Card Advisor — static analysis of why a card is good ───────────────── */
function CardAdvisor({ card }) {
  const reasons = analyzeCard(card);
  const tags    = getSynergyTags(card);
  if (reasons.length === 0 && tags.length === 0) return null;

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">🧠 Why Play This?</span>
      </div>
      <p className="insights-sub">Key strengths of <strong>{card.name}</strong>.</p>
      {reasons.length > 0 && (
        <div className="advisor-reasons">
          {reasons.map((r, i) => (
            <div key={i} className="advisor-reason">
              <span className="advisor-reason-icon">{r.icon}</span>
              <div>
                <div className="advisor-reason-title">{r.title}</div>
                <div className="advisor-reason-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div className="advisor-synergies">
          <div className="advisor-syn-label">Synergizes with:</div>
          <div className="advisor-syn-tags">
            {tags.map((t, i) => <span key={i} className="advisor-syn-tag">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Synergy back-reference (shown when current card is in someone else's synergy list) */
function SynergyBackLinks({ card }) {
  const links = getSynergyLinks(card.id);
  if (links.length === 0) return null;
  return (
    <div className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">💡 Price Influence Notes</span>
      </div>
      <p className="insights-sub">Price may be affected by community interest in the following cards:</p>
      <ul className="backlink-list">
        {links.map((l, i) => (
          <li key={i}>
            <Link to="/prices" state={{ cardName: l.name }} className="backlink-name">{l.name}</Link>
            {' '}— viewed together on this app
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main price card ─────────────────────────────────────────────────────── */
function PriceCard({ card, onWatch, onUnwatch, watched }) {
  const img = getCardImage(card, 'large');
  return (
    <div className="price-card">
      {img && <img src={img} alt={card.name} className="price-card-img" />}
      <div className="price-card-info">
        <div className="price-card-name">{card.name}</div>
        <div className="price-card-set">
          {card.set_name} ({card.set?.toUpperCase()}) · #{card.collector_number}
          {card.rarity && (
            <span className={`price-rarity-badge rarity-${card.rarity}`}>{card.rarity}</span>
          )}
        </div>
        <div className="price-card-type">{card.type_line}</div>
        {card.oracle_text && (
          <div className="price-card-oracle">{card.oracle_text}</div>
        )}
        {card.flavor_text && (
          <div className="price-card-flavor">"{card.flavor_text}"</div>
        )}
        <div className="price-grid">
          <div className="price-item">
            <span className="price-label">Normal USD</span>
            <span className="price-val">{formatPrice(card.prices?.usd)}</span>
          </div>
          <div className="price-item">
            <span className="price-label">Foil USD</span>
            <span className="price-val">{formatPrice(card.prices?.usd_foil)}</span>
          </div>
          <div className="price-item">
            <span className="price-label">Normal EUR</span>
            <span className="price-val">{card.prices?.eur ? `€${card.prices.eur}` : '—'}</span>
          </div>
          <div className="price-item">
            <span className="price-label">Foil EUR</span>
            <span className="price-val">{card.prices?.eur_foil ? `€${card.prices.eur_foil}` : '—'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {card.purchase_uris?.tcgplayer && (
            <a href={card.purchase_uris.tcgplayer} target="_blank" rel="noreferrer" className="buy-link">
              Buy on TCGPlayer ↗
            </a>
          )}
          {card.scryfall_uri && (
            <a href={card.scryfall_uri} target="_blank" rel="noreferrer" className="buy-link">
              View on Scryfall ↗
            </a>
          )}
        </div>
        <button
          className={watched ? 'btn-secondary' : 'btn-primary'}
          style={{ marginTop: '0.75rem' }}
          onClick={() => watched
            ? onUnwatch(card.id)
            : onWatch({
                scryfallId: card.id,
                name:       card.name,
                setCode:    card.set,
                setName:    card.set_name,
                imageUri:   getCardImage(card, 'small'),
              })
          }
        >
          {watched ? '★ Watching' : '☆ Add to Watchlist'}
        </button>
      </div>
    </div>
  );
}

/* ── Watchlist row ───────────────────────────────────────────────────────── */
function WatchlistRow({ item, onRemove }) {
  const [liveCard, setLiveCard] = useState(null);
  const [loading, setLoading]   = useState(false);

  async function refresh() {
    setLoading(true);
    try { setLiveCard(await getCardByName(item.name)); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  }

  const price = liveCard?.prices?.usd;
  return (
    <div className="watchlist-row">
      {item.imageUri && <img src={item.imageUri} alt={item.name} className="watch-img" />}
      <div className="watch-info">
        <div className="watch-name">{item.name}</div>
        <div className="watch-set">{item.setName}</div>
      </div>
      <div className="watch-price">{loading ? '…' : price ? formatPrice(price) : '—'}</div>
      <div className="watch-actions">
        <button className="btn-secondary-sm" onClick={refresh} disabled={loading}>↻ Refresh</button>
        <button className="btn-danger-sm" onClick={() => onRemove(item.scryfallId)}>✕</button>
      </div>
    </div>
  );
}

/* ── Prices page ─────────────────────────────────────────────────────────── */
export default function Prices() {
  const location = useLocation();
  const [initialCard, setInitialCard]           = useState(null);
  const [selectedPrinting, setSelectedPrinting] = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const [chartRange, setChartRange]             = useState('90d');
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatched } = usePriceWatchlist();

  // Auto-search when navigated here from Collection or a synergy card click.
  // Must re-run when cardName changes so same-page navigation (e.g. clicking
  // a synergy card while already on /prices) triggers a fresh lookup.
  const lastAutoSearched = useRef(null);
  useEffect(() => {
    const name = location.state?.cardName;
    if (name && name !== lastAutoSearched.current) {
      lastAutoSearched.current = name;
      doSearch(name);
    }
  }, [location.state?.cardName]);

  // Auto-snapshot all watchlisted cards once per session for chart history
  useEffect(() => {
    if (watchlist.length === 0) return;
    const key = 'mtg-hub:auto-snap';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    (async () => {
      for (const item of watchlist) {
        try {
          await new Promise(r => setTimeout(r, 120));
          const card = await getCardByName(item.name);
          recordSnapshot(
            card.id,
            card.prices?.usd      ? parseFloat(card.prices.usd)      : null,
            card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null,
          );
        } catch { /* ignore */ }
      }
    })();
  }, [watchlist]);

  // Record price snapshot whenever a printing is selected
  useEffect(() => {
    if (selectedPrinting) {
      recordSnapshot(
        selectedPrinting.id,
        selectedPrinting.prices?.usd      ? parseFloat(selectedPrinting.prices.usd)      : null,
        selectedPrinting.prices?.usd_foil ? parseFloat(selectedPrinting.prices.usd_foil) : null,
      );
    }
  }, [selectedPrinting?.id]);

  async function doSearch(name) {
    if (!name?.trim()) return;
    setLoading(true); setError('');
    setInitialCard(null); setSelectedPrinting(null);
    try {
      const card = await getCardByName(name);
      setInitialCard(card); setSelectedPrinting(card);
    } catch {
      setError(`Card "${name}" not found.`);
    } finally { setLoading(false); }
  }

  function handleFilterSelect(card) {
    setInitialCard(card); setSelectedPrinting(card); setError('');
    recordSnapshot(
      card.id,
      card.prices?.usd      ? parseFloat(card.prices.usd)      : null,
      card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null,
    );
  }

  const history = selectedPrinting ? getHistory(selectedPrinting.id) : [];

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#4ac97a' }}>
        <h1>💰 Price Tracker</h1>
        <p>Live prices from Scryfall (TCGPlayer data). Price history builds up as you browse. Select a printing for its specific price.</p>
      </div>

      <CardFilterSearch onSelect={handleFilterSelect} showPrices />
      {loading && <p className="price-loading">Looking up card…</p>}
      {error   && <p className="form-error">{error}</p>}

      {initialCard && (
        <div className="price-printings-section">
          <PrintingPicker
            card={initialCard}
            selectedId={selectedPrinting?.id}
            onSelect={setSelectedPrinting}
          />
        </div>
      )}

      {selectedPrinting && (
        <>
          <div className="price-result-section">
            <PriceCard
              card={selectedPrinting}
              watched={isWatched(selectedPrinting.id)}
              onWatch={addToWatchlist}
              onUnwatch={removeFromWatchlist}
            />
          </div>

          {/* Price history chart */}
          {history.length > 0 && (
            <div className="price-insights-section">
              <div className="price-chart-section-header">
                <h3 className="insights-section-title">📈 Price History</h3>
                <div className="chart-range-selector">
                  {[['30d','30D'],['90d','90D'],['6m','6M'],['1yr','1YR']].map(([val, label]) => (
                    <button key={val}
                      className={`chart-range-btn${chartRange === val ? ' active' : ''}`}
                      onClick={() => setChartRange(val)}
                    >{label}</button>
                  ))}
                </div>
              </div>
              <PriceChart history={history} range={chartRange} />
            </div>
          )}

          {/* Synergy back-references (cards that led here) */}
          <div className="price-insights-section">
            <SynergyBackLinks card={selectedPrinting} />
          </div>

          {/* Card advisor — why to play this card */}
          <div className="price-insights-section">
            <CardAdvisor card={selectedPrinting} />
          </div>

          {/* Deck commander synergy rating */}
          <div className="price-insights-section">
            <DeckCommanderSynergy card={selectedPrinting} />
          </div>

          {/* Community & synergy insights */}
          <div className="price-insights-section">
            <h3 className="insights-section-title">🔍 Market Insights</h3>
            <div className="insights-columns">
              <RedditMentions cardName={selectedPrinting.name} />
              <EdhrecSynergies card={selectedPrinting} />
            </div>
          </div>
        </>
      )}

      {watchlist.length > 0 && (
        <div className="watchlist-section">
          <h2 className="section-title" style={{ color: '#4ac97a' }}>
            Watchlist ({watchlist.length})
          </h2>
          <p className="section-hint">Click ↻ Refresh to pull the latest price from Scryfall.</p>
          <div className="watchlist-list">
            {watchlist.map(item => (
              <WatchlistRow key={item.scryfallId} item={item} onRemove={removeFromWatchlist} />
            ))}
          </div>
        </div>
      )}

      {watchlist.length === 0 && !initialCard && (
        <div className="empty-state">
          <p>Search for a card above, then add it to your watchlist.</p>
        </div>
      )}
    </div>
  );
}
