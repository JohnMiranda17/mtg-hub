import { useState } from 'react';
import { useBinders } from '../../hooks/useBinders';
import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';

const BINDER_COLORS = [
  '#4a8fc9','#4ac97a','#c9a84c','#c94a4a','#9a4ac9','#4ac9c9','#c94a9a',
];

function CreateBinderForm({ onCreate }) {
  const [name, setName]   = useState('');
  const [color, setColor] = useState(BINDER_COLORS[0]);
  const [open, setOpen]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color });
    setName(''); setColor(BINDER_COLORS[0]); setOpen(false);
  }

  if (!open) return (
    <button className="btn-primary binder-create-btn" onClick={() => setOpen(true)}>
      + New Binder
    </button>
  );

  return (
    <form className="binder-create-form" onSubmit={handleSubmit}>
      <input
        className="filter-input"
        placeholder="Binder name…"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
      />
      <div className="binder-color-row">
        {BINDER_COLORS.map(c => (
          <button
            key={c} type="button"
            className={`binder-color-swatch${color === c ? ' selected' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!name.trim()}>Create</button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

function AddToBinderModal({ binders, card, onClose, onAdd }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty]           = useState(1);

  function handleAdd() {
    if (!selected) return;
    onAdd(selected, { scryfallId: card.scryfallId, cardName: card.name, imageUri: card.imageUri, quantity: qty });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Add "{card.name}" to binder</h2>
        {binders.length === 0 && <p className="insights-empty">No binders yet — create one first.</p>}
        <div className="binder-pick-list">
          {binders.map(b => (
            <div
              key={b.id}
              className={`binder-pick-item${selected === b.id ? ' selected' : ''}`}
              style={{ '--bc': b.color }}
              onClick={() => setSelected(b.id)}
            >
              <span className="binder-pick-dot" />
              <span>{b.name}</span>
              <span className="binder-pick-count">{b.cards.length} types</span>
            </div>
          ))}
        </div>
        {selected && (
          <div className="binder-qty-row">
            <label>Quantity:</label>
            <input type="number" className="qty-input" min={1} max={card.quantity}
              value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
        )}
        <div className="form-actions">
          <button className="btn-primary" onClick={handleAdd} disabled={!selected}>Add</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function BinderDetail({ binder, onBack, onRemoveCard }) {
  return (
    <div>
      <div className="binder-detail-header">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <h2 className="binder-detail-title" style={{ color: binder.color }}>{binder.name}</h2>
        <span className="binder-detail-count">{binder.cards.reduce((s, c) => s + c.quantity, 0)} cards</span>
      </div>
      {binder.cards.length === 0 && (
        <p className="insights-empty">No cards in this binder yet. Go to the Cards tab and add cards here.</p>
      )}
      <div className="binder-card-grid">
        {binder.cards.map(c => (
          <div key={c.scryfallId} className="binder-card-thumb">
            {c.imageUri
              ? <img src={c.imageUri} alt={c.cardName} className="binder-thumb-img" />
              : <div className="binder-thumb-placeholder">{c.cardName}</div>
            }
            <div className="binder-thumb-info">
              <span className="binder-thumb-name">{c.cardName}</span>
              <span className="binder-thumb-qty">×{c.quantity}</span>
            </div>
            <button className="binder-thumb-remove" onClick={() => onRemoveCard(binder.id, c.scryfallId)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BindersTab() {
  const { binders, loading, createBinder, deleteBinder, addCardToBinder, removeCardFromBinder } = useBinders();
  const { cards } = useCollection();
  const [openBinder, setOpenBinder] = useState(null);
  const [addingFor, setAddingFor]   = useState(null); // collection card being added to a binder

  if (loading) return <p className="insights-loading">Loading binders…</p>;

  const detail = openBinder ? binders.find(b => b.id === openBinder) : null;

  if (detail) {
    return <BinderDetail binder={detail} onBack={() => setOpenBinder(null)} onRemoveCard={removeCardFromBinder} />;
  }

  return (
    <div>
      <div className="binders-toolbar">
        <p className="section-intro" style={{ margin: 0 }}>
          Organize your collection into physical binders. A card can appear in multiple binders.
        </p>
        <CreateBinderForm onCreate={createBinder} />
      </div>

      {binders.length === 0 && (
        <div className="empty-state"><p>No binders yet — create one above to get started.</p></div>
      )}

      <div className="binders-grid">
        {binders.map(b => (
          <div key={b.id} className="binder-card" style={{ '--bc': b.color }}>
            <div className="binder-card-spine" />
            <div className="binder-card-body">
              <div className="binder-card-name">{b.name}</div>
              <div className="binder-card-stats">
                <span>{b.cards.reduce((s, c) => s + c.quantity, 0)} cards</span>
                <span>{b.cards.length} types</span>
              </div>
            </div>
            <div className="binder-card-actions">
              <button className="btn-secondary-sm" onClick={() => setOpenBinder(b.id)}>Open</button>
              <button className="btn-danger-sm"    onClick={() => deleteBinder(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick-add: add a collection card to a binder */}
      {cards.length > 0 && binders.length > 0 && (
        <div className="binder-quick-add-section">
          <h3 className="subsection-title">Add from Collection</h3>
          <div className="binder-coll-list">
            {cards.map(c => (
              <div key={c.id} className="binder-coll-row">
                {c.imageUri && <img src={c.imageUri} alt={c.name} className="binder-coll-img" />}
                <span className="binder-coll-name">{c.name}</span>
                <span className="binder-coll-qty">×{c.quantity}</span>
                <button className="btn-secondary-sm" onClick={() => setAddingFor(c)}>+ Binder</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {addingFor && (
        <AddToBinderModal
          binders={binders}
          card={addingFor}
          onClose={() => setAddingFor(null)}
          onAdd={(binderId, cardData) => addCardToBinder(binderId, cardData)}
        />
      )}
    </div>
  );
}
