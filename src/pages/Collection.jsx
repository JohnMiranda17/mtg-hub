import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import { getCardByName, getCardById, getCardBySetNumber, formatPrice, getCardImage } from '../utils/scryfall';
import { parseTextImport, parseCsvImport } from '../utils/importParser';
import CardSearchInput from '../components/CardSearchInput';
import CardFilterSearch from '../components/CardFilterSearch';
import PrintingPicker from '../components/PrintingPicker';
import BindersTab from '../components/collection/BindersTab';
import DecksTab from '../components/collection/DecksTab';

const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'];

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

/* ── Sortable th ───────────────────────────────────────────────────────────── */
function SortTh({ col, sort, onSort, children, align }) {
  const active = sort.col === col;
  return (
    <th
      className={`sortable-th${active ? ' sort-th-active' : ''}`}
      style={align ? { textAlign: align } : {}}
      onClick={() => onSort(col)}
    >
      {children}
      {active
        ? <span className="sort-arrow">{sort.dir === 'desc' ? ' ▼' : ' ▲'}</span>
        : <span className="sort-arrow-ghost"> ⇅</span>
      }
    </th>
  );
}

/* ── Add-one-card form ─────────────────────────────────────────────────────── */
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
  const [browseOpen, setBrowseOpen]             = useState(false);

  async function handleSelect(selectedName) {
    setInitialCard(null); setSelectedPrinting(null); setError('');
    setFetchingCard(true);
    try {
      const card = await getCardByName(selectedName);
      setInitialCard(card); setSelectedPrinting(card);
      setName('');
    } catch {
      setError(`"${selectedName}" not found on Scryfall.`);
    } finally { setFetchingCard(false); }
  }

  function handleBrowseSelect(card) {
    setInitialCard(card); setSelectedPrinting(card);
    setError(''); setBrowseOpen(false);
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
    setQuantity(1); setCondition('NM'); setFoil(false); setAdding(false);
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

      <button className="btn-ghost-sm coll-browse-toggle" onClick={() => setBrowseOpen(o => !o)}>
        {browseOpen ? '▲ Hide filter search' : '🔍 Browse by set / color / type'}
      </button>

      {browseOpen && (
        <div className="coll-browse-panel">
          <CardFilterSearch onSelect={handleBrowseSelect} />
        </div>
      )}

      {fetchingCard && <p className="printings-loading">Looking up card…</p>}
      {initialCard && (
        <PrintingPicker card={initialCard} selectedId={selectedPrinting?.id} onSelect={setSelectedPrinting} />
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

/* ── Card image hover tooltip (portaled to body so it escapes the table) ──── */
function CardImageTooltip({ imageUri, rect }) {
  if (!rect) return null;
  const width  = 200;
  const height = Math.round(width * 1.396); // standard card aspect ratio
  const spaceRight = window.innerWidth - rect.right;
  const top  = Math.min(rect.top - 4, window.innerHeight - height - 8);
  const style = spaceRight >= width + 12
    ? { position: 'fixed', top, left: rect.right + 8, width, zIndex: 9999, pointerEvents: 'none' }
    : { position: 'fixed', top, right: window.innerWidth - rect.left + 8, width, zIndex: 9999, pointerEvents: 'none' };

  return createPortal(
    <img src={imageUri} alt="" className="card-img-hover-large" style={style} />,
    document.body
  );
}

/* ── Table row ─────────────────────────────────────────────────────────────── */
function CollectionRow({ card, onUpdate, onRemove, onChangePrinting }) {
  const [hoverRect, setHoverRect] = useState(null);
  const price = card.foil ? (card.priceFoil ?? card.price) : card.price;
  const normalUri = card.imageUri?.replace('/small/', '/normal/');

  return (
    <>
      <tr className="coll-row">
        <td className="coll-img-cell">
          {card.imageUri && (
            <img
              src={card.imageUri}
              alt={card.name}
              className="coll-card-img"
              onMouseEnter={e => setHoverRect(e.currentTarget.getBoundingClientRect())}
              onMouseLeave={() => setHoverRect(null)}
            />
          )}
          <button className="btn-ghost-sm change-print-btn" onClick={() => onChangePrinting(card)}>
            change
          </button>
        </td>
        <td>
          <Link
            to="/prices"
            state={{ cardName: card.name, scryfallId: card.scryfallId }}
            className="coll-card-name-link"
          >
            {card.name}
          </Link>
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
        <td>
          <span className={`foil-badge${card.foil ? ' foil-yes' : ''}`}>
            {card.foil ? '✨ Foil' : 'Regular'}
          </span>
        </td>
        <td>
          <label className="trade-toggle" title={card.forTrade ? 'Listed for trade' : 'Mark for trade'}>
            <input type="checkbox" checked={card.forTrade ?? false}
              onChange={e => onUpdate(card.id, { forTrade: e.target.checked })} />
            <span className={`trade-toggle-label${card.forTrade ? ' trade-active' : ''}`}>
              {card.forTrade ? '🔄 Trade' : 'Trade'}
            </span>
          </label>
        </td>
        <td className="coll-price">{formatPrice(price)}</td>
        <td className="coll-total">{formatPrice(price != null ? price * card.quantity : null)}</td>
        <td><button className="btn-danger-sm" onClick={() => onRemove(card.id)}>✕</button></td>
      </tr>
      {hoverRect && <CardImageTooltip imageUri={normalUri} rect={hoverRect} />}
    </>
  );
}

/* ── Import modal ──────────────────────────────────────────────────────────── */
function ImportModal({ onClose, onImportCards }) {
  const [tab, setTab]           = useState('text');
  const [rawText, setRawText]   = useState('');
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed]     = useState(null);
  const [step, setStep]         = useState('input');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [failed, setFailed]     = useState([]);
  const [addedCount, setAddedCount] = useState(0);
  const [dragging, setDragging] = useState(false);

  function switchTab(t) { setTab(t); setRawText(''); setParsed(null); setFileName(''); }

  function handleParse() {
    const entries = tab === 'text' ? parseTextImport(rawText) : parseCsvImport(rawText);
    setParsed(entries);
  }

  function loadFile(file) {
    if (!file) return;
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    setTab(isCsv ? 'csv' : 'text');
    setFileName(file.name);
    setParsed(null);
    const reader = new FileReader();
    reader.onload = evt => setRawText(evt.target.result);
    reader.readAsText(file);
  }

  function handleFile(e) { loadFile(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault(); setDragging(false);
    loadFile(e.dataTransfer.files[0]);
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
            {/* ── Drag-and-drop zone ── */}
            <div
              className={`import-drop-zone${dragging ? ' import-drop-active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <span className="import-drop-icon">📂</span>
              <span className="import-drop-text">
                {fileName
                  ? <><strong>{fileName}</strong> loaded</>
                  : <>Drop a <strong>.txt</strong> or <strong>.csv</strong> file here, or</>}
              </span>
              <label className="import-file-label import-file-label-sm">
                <input type="file" accept=".txt,.csv,.dec,.cod" className="import-file-input" onChange={handleFile} />
                Browse…
              </label>
            </div>

            <div className="modal-tabs">
              <button className={`modal-tab${tab === 'text' ? ' modal-tab-active' : ''}`}
                onClick={() => switchTab('text')}>Text / Paste</button>
              <button className={`modal-tab${tab === 'csv' ? ' modal-tab-active' : ''}`}
                onClick={() => switchTab('csv')}>CSV</button>
            </div>
            <div className="modal-body">
              {tab === 'text' && (
                <>
                  <p className="import-hint">
                    Paste a deck list <em>or</em> upload a <code>.txt</code> file above. Supports Moxfield, MTG Arena, MTGO, Archidekt, and similar formats.
                  </p>
                  <pre className="import-format-example">{`4 Lightning Bolt (M11) 115\n2 Counterspell (TSB) 2\n1 Black Lotus *F*\nSB: 2 Tormod's Crypt`}</pre>
                  <textarea className="import-textarea" value={rawText}
                    onChange={e => { setRawText(e.target.value); setParsed(null); setFileName(''); }}
                    placeholder={"4 Lightning Bolt (M11) 115\n2 Counterspell\n4 Forest"}
                    rows={8} spellCheck={false} />
                </>
              )}
              {tab === 'csv' && (
                <>
                  <p className="import-hint">
                    Upload a <code>.csv</code> file above, or paste CSV content below. Required columns: <code>Count</code>, <code>Name</code>. Optional: <code>Edition</code>, <code>Condition</code>, <code>Foil</code>.
                  </p>
                  {rawText
                    ? <p className="import-file-loaded">✓ {fileName || 'Content'} — {rawText.split('\n').filter(l => l.trim()).length} lines</p>
                    : <textarea className="import-textarea" value={rawText}
                        onChange={e => { setRawText(e.target.value); setParsed(null); }}
                        placeholder={"Count,Name,Edition,Condition,Foil\n4,Lightning Bolt,m11,NM,"}
                        rows={8} spellCheck={false} />
                  }
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

/* ── Change printing modal ─────────────────────────────────────────────────── */
function ChangePrintingModal({ entry, onClose, onUpdate }) {
  const [initialCard, setInitialCard]           = useState(null);
  const [selectedPrinting, setSelectedPrinting] = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState('');

  useEffect(() => {
    let cancelled = false;
    getCardById(entry.scryfallId)
      .then(card => { if (!cancelled) { setInitialCard(card); setSelectedPrinting(card); } })
      .catch(() =>
        getCardByName(entry.name)
          .then(card => { if (!cancelled) setInitialCard(card); })
          .catch(() => { if (!cancelled) setError('Could not load card data from Scryfall.'); })
      )
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [entry.scryfallId, entry.name]);

  function handleApply() {
    if (!selectedPrinting) return;
    onUpdate(entry.id, {
      scryfallId: selectedPrinting.id,
      setCode:    selectedPrinting.set,
      setName:    selectedPrinting.set_name,
      imageUri:   getCardImage(selectedPrinting, 'small'),
      price:      selectedPrinting.prices?.usd      ? parseFloat(selectedPrinting.prices.usd)      : null,
      priceFoil:  selectedPrinting.prices?.usd_foil ? parseFloat(selectedPrinting.prices.usd_foil) : null,
    });
    onClose();
  }

  const changed = selectedPrinting && selectedPrinting.id !== entry.scryfallId;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-header">
          <span className="modal-title">Change Printing — {entry.name}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading && <p className="printings-loading">Loading printings…</p>}
          {error  && <p className="form-error">{error}</p>}
          {!loading && initialCard && (
            <>
              <p className="import-hint">
                Currently: <strong>{entry.setName}</strong>.
                Hover any printing for a preview, then click to select.
              </p>
              <PrintingPicker
                card={initialCard}
                selectedId={selectedPrinting?.id ?? entry.scryfallId}
                onSelect={setSelectedPrinting}
              />
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleApply} disabled={!changed}>
            {changed
              ? `Switch to ${selectedPrinting.set_name} #${selectedPrinting.collector_number}`
              : 'Select a different printing'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Collection page ───────────────────────────────────────────────────────── */
const COLL_TABS = [
  { id: 'cards',   label: '🗂 Cards'   },
  { id: 'binders', label: '📚 Binders' },
  { id: 'decks',   label: '🃏 Decks'   },
];

export default function Collection() {
  const { cards, addCard, updateCard, removeCard, importCards, totalCards, totalValue } = useCollection();
  const [collTab, setCollTab]         = useState('cards');
  const [sort, setSort]               = useState({ col: 'addedAt', dir: 'desc' });
  const [filter, setFilter]           = useState('');
  const [showImport, setShowImport]   = useState(false);
  const [changingCard, setChangingCard] = useState(null);

  function handleSortCol(col) {
    setSort(prev =>
      prev.col === col
        ? { col, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { col, dir: 'desc' }
    );
  }

  const sorted = [...cards]
    .filter(c => !filter || c.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const d = sort.dir === 'asc' ? 1 : -1;
      switch (sort.col) {
        case 'name':      return d * a.name.localeCompare(b.name);
        case 'quantity':  return d * (a.quantity - b.quantity);
        case 'condition': return d * a.condition.localeCompare(b.condition);
        case 'foil':      return d * ((a.foil ? 1 : 0) - (b.foil ? 1 : 0));
        case 'price':     return d * ((a.price ?? 0) - (b.price ?? 0));
        case 'total':     return d * ((a.price ?? 0) * a.quantity - (b.price ?? 0) * b.quantity);
        default:          return d * (a.addedAt - b.addedAt); // 'addedAt'
      }
    });

  const thProps = col => ({ col, sort, onSort: handleSortCol });

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#4a8fc9' }}>
        <div className="page-header-row">
          <div>
            <h1>📦 Collection Tracker</h1>
            <p>Track your physical cards, organize binders, and build validated decks.</p>
          </div>
          {collTab === 'cards' && (
            <button className="btn-secondary import-trigger" onClick={() => setShowImport(true)}>
              ⬆ Import List
            </button>
          )}
        </div>
      </div>

      <nav className="sub-tab-bar">
        {COLL_TABS.map(t => (
          <button key={t.id} className={`sub-tab${collTab === t.id ? ' sub-tab-active' : ''}`}
            onClick={() => setCollTab(t.id)}>{t.label}</button>
        ))}
      </nav>

      {collTab === 'binders' && <BindersTab />}
      {collTab === 'decks'   && <DecksTab />}

      {collTab === 'cards' && (
        <>
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
              </div>
              <div className="coll-table-wrap">
                <table className="coll-table">
                  <thead>
                    <tr>
                      <th></th>
                      <SortTh {...thProps('name')}>Card</SortTh>
                      <SortTh {...thProps('quantity')} align="center">Qty</SortTh>
                      <SortTh {...thProps('condition')}>Cond.</SortTh>
                      <SortTh {...thProps('foil')}>Type</SortTh>
                      <th>Trade</th>
                      <SortTh {...thProps('price')} align="right">Price</SortTh>
                      <SortTh {...thProps('total')} align="right">Total</SortTh>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(card => (
                      <CollectionRow key={card.id} card={card} onUpdate={updateCard} onRemove={removeCard}
                        onChangePrinting={setChangingCard} />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {cards.length === 0 && (
            <div className="empty-state"><p>No cards yet — add a card above or import a list.</p></div>
          )}
        </>
      )}

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImportCards={importCards} />
      )}

      {changingCard && (
        <ChangePrintingModal
          entry={changingCard}
          onClose={() => setChangingCard(null)}
          onUpdate={updateCard}
        />
      )}
    </div>
  );
}
