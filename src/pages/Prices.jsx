import { useState } from 'react';
import { getCardByName, formatPrice, getCardImage } from '../utils/scryfall';
import { usePriceWatchlist } from '../hooks/usePriceWatchlist';
import CardSearchInput from '../components/CardSearchInput';
import PrintingPicker from '../components/PrintingPicker';

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

export default function Prices() {
  const [query, setQuery]                       = useState('');
  const [initialCard, setInitialCard]           = useState(null);
  const [selectedPrinting, setSelectedPrinting] = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatched } = usePriceWatchlist();

  async function search() {
    if (!query.trim()) return;
    setLoading(true); setError('');
    setInitialCard(null); setSelectedPrinting(null);
    try {
      const card = await getCardByName(query);
      setInitialCard(card);
      setSelectedPrinting(card);
    } catch {
      setError(`Card "${query}" not found.`);
    } finally {
      setLoading(false);
    }
  }

  function handleQuerySelect(name) {
    setQuery(name);
  }

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#4ac97a' }}>
        <h1>💰 Price Tracker</h1>
        <p>Live prices from Scryfall. Select a printing to see its specific price.</p>
      </div>

      <div className="price-search-row">
        <CardSearchInput
          value={query}
          onChange={setQuery}
          onSelect={handleQuerySelect}
          placeholder="Search for a card…"
        />
        <button className="btn-primary" onClick={search} disabled={loading || !query.trim()}>
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
        <div className="price-result-section">
          <PriceCard
            card={selectedPrinting}
            watched={isWatched(selectedPrinting.id)}
            onWatch={addToWatchlist}
            onUnwatch={removeFromWatchlist}
          />
        </div>
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
