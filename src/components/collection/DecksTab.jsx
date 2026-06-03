import { useState } from 'react';
import { useDecks, validateDeck } from '../../hooks/useDecks';
import { searchCards } from '../../utils/scryfall';

const FORMATS = [
  { id: 'commander', label: 'Commander', target: 100, maxCopies: 1 },
  { id: 'standard',  label: 'Standard',  target: 60,  maxCopies: 4 },
  { id: 'modern',    label: 'Modern',    target: 60,  maxCopies: 4 },
];

function CreateDeckForm({ onCreate }) {
  const [name, setName]     = useState('');
  const [format, setFormat] = useState('commander');
  const [open, setOpen]     = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), format });
    setName(''); setFormat('commander'); setOpen(false);
  }

  if (!open) return (
    <button className="btn-primary binder-create-btn" onClick={() => setOpen(true)}>
      + New Deck
    </button>
  );

  return (
    <form className="binder-create-form" onSubmit={handleSubmit}>
      <input
        className="filter-input"
        placeholder="Deck name…"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
      />
      <div className="format-selector">
        {FORMATS.map(f => (
          <button key={f.id} type="button"
            className={`format-btn${format === f.id ? ' active' : ''}`}
            onClick={() => setFormat(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!name.trim()}>Create</button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

function CardSearchInput({ onAdd, isSideboard = false }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await searchCards(query.trim());
      setResults(data.slice(0, 8));
    } catch { setResults([]); }
    finally { setLoading(false); }
  }

  function pick(card) {
    onAdd({
      scryfallId: card.id,
      cardName:   card.name,
      imageUri:   card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null,
      quantity:   1,
      isSideboard,
    });
    setQuery(''); setResults([]);
  }

  return (
    <div className="deck-search-wrap">
      <form className="deck-search-form" onSubmit={handleSearch}>
        <input
          className="filter-input"
          placeholder={isSideboard ? 'Search card for sideboard…' : 'Search card to add…'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-secondary" disabled={loading || !query.trim()}>
          {loading ? '…' : 'Search'}
        </button>
      </form>
      {results.length > 0 && (
        <ul className="deck-search-results">
          {results.map(c => (
            <li key={c.id} className="deck-search-result" onClick={() => pick(c)}>
              <span className="deck-result-name">{c.name}</span>
              <span className="deck-result-type">{c.type_line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DeckDetail({ deck, onBack, onAddCard, onRemoveCard, onSetCommander, onUpdateQty }) {
  const errors      = validateDeck(deck);
  const formatInfo  = FORMATS.find(f => f.id === deck.format);
  const main        = deck.cards.filter(c => !c.isSideboard);
  const side        = deck.cards.filter(c =>  c.isSideboard);
  const mainTotal   = main.reduce((s, c) => s + c.quantity, 0);
  const sideTotal   = side.reduce((s, c) => s + c.quantity, 0);
  const target      = formatInfo?.target ?? 60;
  const isValid     = errors.length === 0;

  return (
    <div className="deck-detail">
      <div className="binder-detail-header">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <div>
          <h2 className="binder-detail-title">{deck.name}</h2>
          <span className="deck-format-badge">{formatInfo?.label}</span>
        </div>
        <span className={`deck-count-badge${isValid ? ' valid' : ' invalid'}`}>
          {mainTotal}/{target} {isValid ? '✓' : '!'}
        </span>
      </div>

      {errors.length > 0 && (
        <div className="deck-errors">
          {errors.map((e, i) => <div key={i} className="deck-error-item">⚠ {e}</div>)}
        </div>
      )}

      <div className="deck-columns">
        <div className="deck-section">
          <div className="deck-section-header">
            <span>Main Deck ({mainTotal})</span>
          </div>
          <CardSearchInput onAdd={onAddCard} isSideboard={false} />
          <div className="deck-card-list">
            {main.map(c => (
              <div key={c.scryfallId} className="deck-card-row">
                <span className={`deck-commander-dot${c.isCommander ? ' active' : ''}`}
                  title={c.isCommander ? 'Commander' : 'Set as commander'}
                  onClick={() => deck.format === 'commander' && onSetCommander(c.scryfallId)}
                />
                <span className="deck-card-name">{c.cardName}</span>
                <div className="deck-qty-controls">
                  <button className="deck-qty-btn" onClick={() => onUpdateQty(c.scryfallId, false, c.quantity - 1)}>−</button>
                  <span className="deck-qty-val">{c.quantity}</span>
                  <button className="deck-qty-btn" onClick={() => onUpdateQty(c.scryfallId, false, c.quantity + 1)}>+</button>
                </div>
                <button className="binder-thumb-remove" onClick={() => onRemoveCard(c.scryfallId, false)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="deck-section">
          <div className="deck-section-header">
            <span>Sideboard ({sideTotal}/15)</span>
          </div>
          {deck.format !== 'commander' && <CardSearchInput onAdd={onAddCard} isSideboard={true} />}
          {deck.format === 'commander' && <p className="insights-empty">Commander decks don't use a sideboard.</p>}
          <div className="deck-card-list">
            {side.map(c => (
              <div key={c.scryfallId} className="deck-card-row">
                <span className="deck-card-name">{c.cardName}</span>
                <div className="deck-qty-controls">
                  <button className="deck-qty-btn" onClick={() => onUpdateQty(c.scryfallId, true, c.quantity - 1)}>−</button>
                  <span className="deck-qty-val">{c.quantity}</span>
                  <button className="deck-qty-btn" onClick={() => onUpdateQty(c.scryfallId, true, c.quantity + 1)}>+</button>
                </div>
                <button className="binder-thumb-remove" onClick={() => onRemoveCard(c.scryfallId, true)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DecksTab() {
  const { decks, loading, createDeck, deleteDeck, addCardToDeck, removeCardFromDeck, setCommander, updateCardQuantity } = useDecks();
  const [openDeck, setOpenDeck] = useState(null);

  if (loading) return <p className="insights-loading">Loading decks…</p>;

  const detail = openDeck ? decks.find(d => d.id === openDeck) : null;

  if (detail) {
    return (
      <DeckDetail
        deck={detail}
        onBack={() => setOpenDeck(null)}
        onAddCard={card => addCardToDeck(detail.id, card)}
        onRemoveCard={(scryfallId, isSideboard) => removeCardFromDeck(detail.id, scryfallId, isSideboard)}
        onSetCommander={scryfallId => setCommander(detail.id, scryfallId)}
        onUpdateQty={(scryfallId, isSideboard, qty) => updateCardQuantity(detail.id, scryfallId, isSideboard, qty)}
      />
    );
  }

  const formatLabel = id => FORMATS.find(f => f.id === id)?.label ?? id;

  return (
    <div>
      <div className="binders-toolbar">
        <p className="section-intro" style={{ margin: 0 }}>
          Build and validate Commander, Standard, or Modern decks. Format rules are checked automatically.
        </p>
        <CreateDeckForm onCreate={createDeck} />
      </div>

      {decks.length === 0 && (
        <div className="empty-state"><p>No decks yet — create one above to start building.</p></div>
      )}

      <div className="binders-grid">
        {decks.map(d => {
          const errors    = validateDeck(d);
          const main      = d.cards.filter(c => !c.isSideboard);
          const mainTotal = main.reduce((s, c) => s + c.quantity, 0);
          const target    = FORMATS.find(f => f.id === d.format)?.target ?? 60;
          const isValid   = errors.length === 0 && mainTotal > 0;
          return (
            <div key={d.id} className="binder-card" style={{ '--bc': isValid ? '#4ac97a' : '#c9a84c' }}>
              <div className="binder-card-spine" />
              <div className="binder-card-body">
                <div className="binder-card-name">{d.name}</div>
                <div className="binder-card-stats">
                  <span className="deck-format-badge">{formatLabel(d.format)}</span>
                  <span>{mainTotal}/{target}</span>
                  {errors.length > 0 && <span className="deck-warn-badge">{errors.length} issue{errors.length > 1 ? 's' : ''}</span>}
                </div>
              </div>
              <div className="binder-card-actions">
                <button className="btn-secondary-sm" onClick={() => setOpenDeck(d.id)}>Open</button>
                <button className="btn-danger-sm"    onClick={() => deleteDeck(d.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
