import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getCardByName, formatPrice, getCardImage } from '../utils/scryfall';
import { recordSnapshot, getHistory, recordSynergyLink, getSynergyLinks } from '../utils/priceHistory';
import { usePriceWatchlist } from '../hooks/usePriceWatchlist';
import CardSearchInput from '../components/CardSearchInput';
import PrintingPicker from '../components/PrintingPicker';
import PriceChart from '../components/PriceChart';

/* ── Reddit Mentions ─────────────────────────────────────────────────────── */
function RedditMentions({ cardName }) {
  const [posts, setPosts]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setPosts(null);

    const url = `https://www.reddit.com/r/magicTCG/search.json?q=${encodeURIComponent(cardName)}&restrict_sr=1&sort=new&t=month&limit=5`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const children = data?.data?.children ?? [];
        setPosts(children.map(c => ({
          title:   c.data.title,
          score:   c.data.score,
          url:     `https://reddit.com${c.data.permalink}`,
          created: c.data.created_utc,
        })));
      })
      .catch(() => { if (!cancelled) setError('Could not load Reddit data.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [cardName]);

  const count = posts?.length ?? 0;
  const demand =
    count >= 4 ? { label: 'High community interest', cls: 'demand-high' } :
    count >= 2 ? { label: 'Some community discussion', cls: 'demand-med' } :
                 { label: 'Low community activity', cls: 'demand-low' };

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <span className="insights-title">📣 r/magicTCG — last 30 days</span>
        {!loading && posts && (
          <span className={`demand-badge ${demand.cls}`}>{demand.label}</span>
        )}
      </div>
      {loading && <p className="insights-loading">Checking Reddit…</p>}
      {error   && <p className="insights-error">{error}</p>}
      {posts && posts.length === 0 && <p className="insights-empty">No recent posts found for "{cardName}".</p>}
      {posts && posts.length > 0 && (
        <ul className="reddit-posts">
          {posts.map((p, i) => (
            <li key={i} className="reddit-post">
              <a href={p.url} target="_blank" rel="noreferrer" className="reddit-post-title">{p.title}</a>
              <span className="reddit-post-score">▲ {p.score}</span>
            </li>
          ))}
        </ul>
      )}
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setSynCards(null);

    const slug = toEdhrecSlug(card.name);
    fetch(`https://json.edhrec.com/pages/cards/${slug}.json`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        // Navigate the EDHREC response tree to find synergy cards
        const lists = data?.container?.json_dict?.cardlists ?? [];
        const synergyList = lists.find(l =>
          l.tag === 'synergy' || (l.header ?? '').toLowerCase().includes('synergy')
        ) ?? lists[0];

        const views = (synergyList?.cardviews ?? []).slice(0, 8);
        setSynCards(views);

        // Record synergy links so those cards can reference back to this one
        for (const v of views) {
          if (v.sanitized_wo) recordSynergyLink(card, v.sanitized_wo);
        }
      })
      .catch(() => {
        if (!cancelled) setError('EDHREC data unavailable for this card.');
      })
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
        <a
          href={`https://edhrec.com/cards/${toEdhrecSlug(card.name)}`}
          target="_blank" rel="noreferrer"
          className="insights-external-link"
        >
          View on EDHREC ↗
        </a>
      </div>
      <p className="insights-sub">Cards commonly played alongside <strong>{card.name}</strong>. Price movement in this card may affect these.</p>
      <div className="syn-cards-grid">
        {synCards.map((c, i) => {
          const img    = c.image_uris?.[0];
          const price  = c.prices?.usd;
          const synPct = c.synergy != null ? Math.round(c.synergy * 100) : null;
          const name   = c.name ?? c.sanitized ?? '';
          return (
            <Link
              key={i}
              to="/prices"
              state={{ cardName: name }}
              className="syn-card"
              title={name}
            >
              {img
                ? <img src={img} alt={name} className="syn-card-img" loading="lazy" />
                : <div className="syn-card-placeholder">{name}</div>
              }
              <div className="syn-card-info">
                <div className="syn-card-name">{name}</div>
                {price  && <div className="syn-card-price">{formatPrice(price)}</div>}
                {synPct != null && <div className="syn-card-syn">{synPct > 0 ? '+' : ''}{synPct}% syn</div>}
              </div>
            </Link>
          );
        })}
      </div>
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
  const img = getCardImage(card, 'normal');
  return (
    <div className="price-card">
      {img && <img src={img} alt={card.name} className="price-card-img" />}
      <div className="price-card-info">
        <div className="price-card-name">{card.name}</div>
        <div className="price-card-set">
          {card.set_name} ({card.set?.toUpperCase()}) · #{card.collector_number}
        </div>
        <div className="price-card-type">{card.type_line}</div>
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
  const [query, setQuery]                       = useState('');
  const [initialCard, setInitialCard]           = useState(null);
  const [selectedPrinting, setSelectedPrinting] = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatched } = usePriceWatchlist();

  // Auto-search when navigated here from Collection (card name click)
  useEffect(() => {
    const name = location.state?.cardName;
    if (name) {
      setQuery(name);
      doSearch(name);
    }
  }, []);

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

  function handleSearch() { doSearch(query); }
  function handleQuerySelect(name) { setQuery(name); }

  const history = selectedPrinting ? getHistory(selectedPrinting.id) : [];

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#4ac97a' }}>
        <h1>💰 Price Tracker</h1>
        <p>Live prices from Scryfall (TCGPlayer data). Price history builds up as you browse. Select a printing for its specific price.</p>
      </div>

      <div className="price-search-row">
        <CardSearchInput
          value={query}
          onChange={setQuery}
          onSelect={handleQuerySelect}
          placeholder="Search for a card…"
        />
        <button className="btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? '…' : 'Look Up'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}

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
              <h3 className="insights-section-title">📈 Price History</h3>
              <PriceChart history={history} foil={false} />
              {history.some(s => s.priceFoil != null) && (
                <PriceChart history={history} foil={true} />
              )}
            </div>
          )}

          {/* Synergy back-references (cards that led here) */}
          <div className="price-insights-section">
            <SynergyBackLinks card={selectedPrinting} />
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
