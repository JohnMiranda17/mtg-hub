import { useState } from 'react';
import { useCollection } from '../hooks/useCollection';
import { getCardByName, getCardBySetNumber, formatPrice, getCardImage } from '../utils/scryfall';
import { parseTextImport, parseCsvImport } from '../utils/importParser';
import CardSearchInput from '../components/CardSearchInput';
import PrintingPicker from '../components/PrintingPicker';

const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'];
const SORT_OPTIONS = [
  { value: 'name',     label: 'Name' },
  { value: 'addedAt',  label: 'Date Added' },
  { value: 'price',    label: 'Price' },
  { value: 'quantity', label: 'Quantity' },
];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildCardEntry(card, overrides) {
  return {
    name:       card.name,
    scryfallId: card.id,
    setCode:    card.set,
    setName:    card.set_name,
    typeLine:   card.type_line,
    manaCost:   card.mana_cost ?? '',
    imageUri:   getCardImage(card, 'small'),
    price:      card.prices?.usd      ? parseFloat(card.prices.usd)      : null,
    priceFoil:  card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null,
    ...overrides,
  };
}

/* ── Add-one-card form ─────────────────────────────────────────────────── */
function AddCardForm({ onAdd }) {
  const [name, setName]                         = useState('');
  const [initialCard, setInitialCard]           = useState(null);
  const [selectedPrinting, setSelectedPrinting] = useState(null);
  const [fetchingCard, setFetchingCard]         = useState(false);
  const [quantity, setQuantity]                 = useState(1);
  const [condition, setCondition]               = useState('NM');
  const [foil, setFoil]                         = useState(false);
  const [adding, setAdding]                     = useState(false);
  const [error, setError]                       = useState('');

  async function handleSelect(selectedName) {
    setName(selectedName);
    setInitialCard(null);
    setSelectedPrinting(null);
    setError('');
    setFetchingCard(true);
    try {
      const card = await getCardByName(selectedName);
      setInitialCard(card);
      setSelectedPrinting(card);
    } catch {
      setError(`"${selectedName}" not found on Scryfall.`);
    } finally {
      setFetchingCard(false);
    }
  }

  function handleNameChange(n) {
    setName(n);
    if (!n) { setInitialCard(null); setSelectedPrinting(null); }
  }

  function handleAdd() {
    if (!selectedPrinting) return;
    setAdding(true);
    onAdd(buildCardEntry(selectedPrinting, { quantity, condition, foil }));
    setName(''); setInitialCard(null); setSelectedPrinting(null);
    setQuantity(1); setCondition('NM'); setFoil(false);
    setAdding(false);
  }

  return (
    <div className="add-card-form">
      <h3>Add Card</h3>
      <div className="add-card-row">
        <CardSearchInput value={name} onChange={handleNameChange} onSelect={handleSelect}
          placeholder="Card name…" />
        <input type="number" className="qty-input" min={1} max={99} value={quantity}
          onChange={e => setQuantity(Number(e.target.value))} />
        <select className="cond-select" value={condition}
          onChange={e => setCondition(e.target.value)}>
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <label className="foil-label">
          <input type="checkbox" checked={foil} onChange={e => setFoil(e.target.checked)} /> Foil
        </label>
        <button className="btn-primary" onClick={handleAdd}
          disabled={adding || !selectedPrinting}>
          {adding ? '…' : '+ Add'}
        </button>
      </div>

      {fetchingCard && <p className="printings-loading">Looking up card…</p>}

      {initialCard && (
        <PrintingPicker
          card={initialCard}
          selectedId={selectedPrinting?.id}
          onSelect={setSelectedPrinting}
        />
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

/* ── Table row ─────────────────────────────────────────────────────────── */
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

/* ── Import modal ──────────────────────────────────────────────────────── */
function ImportModal({ onClose, onImportCards }) {
  const [tab, setTab]           = useState('text');
  const [rawText, setRawText]   = useState('');
  const [parsed, setParsed]     = useState(null);
  const [step, setStep]         = useState('input');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [failed, setFailed]     = useState([]);
  const [addedCount, setAddedCount] = useState(0);

  function switchTab(t) { setTab(t); setRawText(''); setParsed(null); }

  function handleParse() {
    const entries = tab === 'text' ? parseTextImport(rawText) : parseCsvImport(rawText);
    setParsed(entries);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => { setRawText(evt.target.result); setParsed(null); };
    reader.readAsText(file);
  }

  async function handleImport() {
    setStep('importing');
    setProgress({ done: 0, total: parsed.length });
    const collected   = [];
    const failedList  = [];
    const lookupCache = new Map();

    for (const entry of parsed) {
      try {
        const cacheKey = `${entry.name}||${entry.setCode}||${entry.collNum}`;
        let card = lookupCache.get(cacheKey);
        if (!card) {
          card = entry.setCode && entry.collNum
            ? await getCardBySetNumber(entry.setCode, entry.collNum)
            : await getCardByName(entry.name);
          lookupCache.set(cacheKey, card);
          await delay(150);
        }
        collected.push(buildCardEntry(card, {
          quantity:  entry.qty,
          condition: entry.condition,
          foil:      entry.foil,
        }));
      } catch {
        failedList.push(`${entry.qty}× ${entry.name}${entry.setCode ? ` (${entry.setCode.toUpperCase()})` : ''}`);
      }
      setProgress(p => ({ ...p, done: p.done + 1 }));
    }

    onImportCards(collected);
    setAddedCount(collected.reduce((s, c) => s + c.quantity, 0));
    setFailed(failedList);
    setStep('done');
  }

  function onOverlayClick(e) {
    if (e.target === e.currentTarget && step !== 'importing') onClose();
  }

  return (
    <div className="modal-overlay" onClick={onOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Import Cards</span>
          {step !== 'importing' && <button className="modal-close" onClick={onClose}>✕</button>}
        </div>

        {step === 'input' && (
          <>
            <div className="modal-tabs">
              <button className={`modal-tab${tab === 'text' ? ' modal-tab-active' : ''}`}
                onClick={() => switchTab('text')}>Paste Text</button>
              <button className={`modal-tab${tab === 'csv' ? ' modal-tab-active' : ''}`}
                onClick={() => switchTab('csv')}>CSV File</button>
            </div>
            <div className="modal-body">
              {tab === 'text' && (
                <>
                  <p className="import-hint">Supports Moxfield, MTG Arena, MTGO, Archidekt, and any standard format.</p>
                  <pre className="import-format-example">{`4 Lightning Bolt (M11) 115\n2 Counterspell (TSB) 2\n1 Black Lotus *F*\nSB: 2 Tormod's Crypt`}</pre>
                  <textarea className="import-textarea" value={rawText}
                    onChange={e => { setRawText(e.target.value); setParsed(null); }}
                    placeholder={"4 Lightning Bolt (M11) 115\n2 Counterspell\n4 Forest"}
                    rows={10} spellCheck={false} />
                </>
              )}
              {tab === 'csv' && (
                <>
                  <p className="import-hint">Upload a Moxfield CSV export. Required columns: <code>Count, Name, Edition, Condition, Language, Foil</code></p>
                  <label className="import-file-label">
                    <input type="file" accept=".csv,.txt" className="import-file-input" onChange={handleFile} />
                    Choose CSV file
                  </label>
                  {rawText && <p className="import-file-loaded">✓ File loaded — {rawText.split('\n').filter(l => l.trim()).length} lines</p>}
                </>
              )}
              {parsed !== null && (
                <div className="import-preview">
                  <p className="import-preview-header">
                    {parsed.length === 0 ? 'No cards recognized — check the format.' : `${parsed.length} entr${parsed.length === 1 ? 'y' : 'ies'} parsed`}
                  </p>
                  {parsed.length > 0 && (
                    <div className="import-preview-scroll">
                      <table className="import-preview-table">
                        <thead><tr><th>Qty</th><th>Name</th><th>Set / #</th><th>Foil</th><th>Cond.</th><th>SB?</th></tr></thead>
                        <tbody>
                          {parsed.slice(0, 25).map((e, i) => (
                            <tr key={i} className={e.sideboard ? 'import-row-sb' : ''}>
                              <td>{e.qty}</td><td>{e.name}</td>
                              <td>{e.setCode ? `${e.setCode.toUpperCase()}${e.collNum ? ` #${e.collNum}` : ''}` : '—'}</td>
                              <td>{e.foil ? '✨' : ''}</td><td>{e.condition}</td>
                              <td>{e.sideboard ? 'SB' : ''}</td>
                            </tr>
                          ))}
                          {parsed.length > 25 && (
                            <tr><td colSpan={6} className="import-preview-more">…and {parsed.length - 25} more</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              {parsed === null && <button className="btn-primary" onClick={handleParse} disabled={!rawText.trim()}>Preview Import</button>}
              {parsed !== null && parsed.length > 0 && <button className="btn-primary" onClick={handleImport}>Import {parsed.length} card{parsed.length !== 1 ? 's' : ''}</button>}
              {parsed !== null && parsed.length === 0 && <button className="btn-secondary" onClick={() => setParsed(null)}>Try again</button>}
            </div>
          </>
        )}

        {step === 'importing' && (
          <div className="modal-body import-importing">
            <p className="import-progress-text">Fetching card data from Scryfall…</p>
            <p className="import-progress-count">{progress.done} / {progress.total}</p>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} />
            </div>
            <p className="import-rate-note">Rate-limited to ~7 cards/sec to respect Scryfall's API guidelines.</p>
          </div>
        )}

        {step === 'done' && (
          <div className="modal-body import-done">
            <p className="import-done-icon">✓</p>
            <p className="import-done-title">Import complete</p>
            <p className="import-done-count">Added <strong>{addedCount}</strong> card{addedCount !== 1 ? 's' : ''} to your collection{failed.length > 0 ? ` (${failed.length} not found)` : ''}</p>
            {failed.length > 0 && (
              <div className="import-failed">
                <p className="import-failed-title">Could not find on Scryfall:</p>
                <ul className="import-failed-list">{failed.map((n, i) => <li key={i}>{n}</li>)}</ul>
                <p className="import-failed-hint">Check spelling or try without the set code.</p>
              </div>
            )}
            <div className="modal-footer"><button className="btn-primary" onClick={onClose}>Done</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Collection page ───────────────────────────────────────────────────── */
export default function Collection() {
  const { cards, addCard, updateCard, removeCard, importCards, totalCards, totalValue } = useCollection();
  const [sort, setSort]             = useState('addedAt');
  const [filter, setFilter]         = useState('');
  const [showImport, setShowImport] = useState(false);

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
        <div className="page-header-row">
          <div>
            <h1>📦 Collection Tracker</h1>
            <p>Track your physical cards. Prices pulled live from Scryfall.</p>
          </div>
          <button className="btn-secondary import-trigger" onClick={() => setShowImport(true)}>
            ⬆ Import List
          </button>
        </div>
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
                <button key={o.value}
                  className={`sort-btn${sort === o.value ? ' sort-active' : ''}`}
                  onClick={() => setSort(o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="coll-table-wrap">
            <table className="coll-table">
              <thead>
                <tr><th></th><th>Card</th><th>Qty</th><th>Cond.</th><th>Type</th><th>Price</th><th>Total</th><th></th></tr>
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
        <div className="empty-state"><p>No cards yet — add a card above or import a list.</p></div>
      )}

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImportCards={importCards} />
      )}
    </div>
  );
}
