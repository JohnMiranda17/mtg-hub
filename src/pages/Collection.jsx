import { useState } from 'react';
import { useCollection } from '../hooks/useCollection';
import { getCardByName, formatPrice, getCardImage } from '../utils/scryfall';
import CardSearchInput from '../components/CardSearchInput';

const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'addedAt', label: 'Date Added' },
  { value: 'price', label: 'Price' },
  { value: 'quantity', label: 'Quantity' },
];

function AddCardForm({ onAdd }) {
  const [name, setName]           = useState('');
  const [quantity, setQuantity]   = useState(1);
  const [condition, setCondition] = useState('NM');
  const [foil, setFoil]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleAdd() {
    if (!name.trim()) return;
    setLoading(true); setError('');
    try {
      const card = await getCardByName(name);
      onAdd({
        name: card.name,
        scryfallId: card.id,
        setCode: card.set,
        setName: card.set_name,
        typeLine: card.type_line,
        manaCost: card.mana_cost ?? '',
        imageUri: getCardImage(card, 'small'),
        price: card.prices?.usd ? parseFloat(card.prices.usd) : null,
        priceFoil: card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null,
        quantity,
        condition,
        foil,
      });
      setName(''); setQuantity(1); setCondition('NM'); setFoil(false);
    } catch {
      setError(`Card "${name}" not found on Scryfall.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-card-form">
      <h3>Add Card</h3>
      <div className="add-card-row">
        <CardSearchInput value={name} onChange={setName} onSelect={setName} placeholder="Card name…" />
        <input type="number" className="qty-input" min={1} max={99} value={quantity}
          onChange={e => setQuantity(Number(e.target.value))} />
        <select className="cond-select" value={condition} onChange={e => setCondition(e.target.value)}>
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <label className="foil-label">
          <input type="checkbox" checked={foil} onChange={e => setFoil(e.target.checked)} /> Foil
        </label>
        <button className="btn-primary" onClick={handleAdd} disabled={loading || !name.trim()}>
          {loading ? '…' : '+ Add'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function CollectionRow({ card, onUpdate, onRemove }) {
  const price = card.foil ? (card.priceFoil ?? card.price) : card.price;
  return (
    <tr className="coll-row">
      <td className="coll-img-cell">
        {card.imageUri && <img src={card.imageUri} alt={card.name} className="coll-card-img" />}
      </td>
      <td>
        <div className="coll-card-name">{card.name}</div>
        <div className="coll-card-meta">{card.setName} · {card.typeLine}</div>
      </td>
      <td>
        <input type="number" className="qty-input-inline" min={1} max={99} value={card.quantity}
          onChange={e => onUpdate(card.id, { quantity: Number(e.target.value) })} />
      </td>
      <td>
        <select className="cond-select-inline" value={card.condition}
          onChange={e => onUpdate(card.id, { condition: e.target.value })}>
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
      </td>
      <td><span className={`foil-badge${card.foil ? ' foil-yes' : ''}`}>{card.foil ? '✨ Foil' : 'Regular'}</span></td>
      <td className="coll-price">{formatPrice(price)}</td>
      <td className="coll-total">{formatPrice(price != null ? price * card.quantity : null)}</td>
      <td><button className="btn-danger-sm" onClick={() => onRemove(card.id)}>✕</button></td>
    </tr>
  );
}

export default function Collection() {
  const { cards, addCard, updateCard, removeCard, totalCards, totalValue } = useCollection();
  const [sort, setSort]     = useState('addedAt');
  const [filter, setFilter] = useState('');

  const sorted = [...cards]
    .filter(c => !filter || c.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name')     return a.name.localeCompare(b.name);
      if (sort === 'price')    return (b.price ?? 0) - (a.price ?? 0);
      if (sort === 'quantity') return b.quantity - a.quantity;
      return b.addedAt - a.addedAt;
    });

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#4a8fc9' }}>
        <h1>📦 Collection Tracker</h1>
        <p>Track your physical cards. Prices pulled live from Scryfall.</p>
      </div>

      <div className="coll-stats">
        <div className="stat-pill">{totalCards.toLocaleString()} cards</div>
        <div className="stat-pill">{cards.length} unique</div>
        <div className="stat-pill">Est. value: {formatPrice(totalValue)}</div>
      </div>

      <AddCardForm onAdd={addCard} />

      {cards.length > 0 && (
        <>
          <div className="coll-controls">
            <input className="filter-input" placeholder="Filter by name…"
              value={filter} onChange={e => setFilter(e.target.value)} />
            <div className="sort-row">
              Sort:
              {SORT_OPTIONS.map(o => (
                <button key={o.value} className={`sort-btn${sort === o.value ? ' sort-active' : ''}`}
                  onClick={() => setSort(o.value)}>{o.label}</button>
              ))}
            </div>
          </div>

          <div className="coll-table-wrap">
            <table className="coll-table">
              <thead>
                <tr>
                  <th></th><th>Card</th><th>Qty</th><th>Cond.</th>
                  <th>Type</th><th>Price</th><th>Total</th><th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(card => (
                  <CollectionRow key={card.id} card={card} onUpdate={updateCard} onRemove={removeCard} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {cards.length === 0 && (
        <div className="empty-state">
          <p>No cards yet — add your first card above.</p>
        </div>
      )}
    </div>
  );
}
