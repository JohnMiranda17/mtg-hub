import { useState, useEffect } from 'react';
import { getPrintings, getCardImage, formatPrice } from '../utils/scryfall';

function computeTooltipStyle(rect) {
  const W  = 230;
  const H  = 360;
  const vpw = window.innerWidth;
  const vph = window.innerHeight;

  let left = rect.right + 12;
  if (left + W > vpw - 8) left = rect.left - W - 12;
  if (left < 8) left = 8;

  let top = rect.top;
  if (top + H > vph - 8) top = vph - H - 8;
  if (top < 8) top = 8;

  return { position: 'fixed', left, top, zIndex: 600, pointerEvents: 'none' };
}

export default function PrintingPicker({ card, selectedId, onSelect }) {
  const [printings, setPrintings] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [hovered, setHovered]     = useState(null); // { printing, rect }

  useEffect(() => {
    if (!card?.prints_search_uri) return;
    let cancelled = false;
    setLoading(true);
    setPrintings([]);
    setHovered(null);
    getPrintings(card)
      .then(data => { if (!cancelled) setPrintings(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [card?.prints_search_uri]);

  function handleMouseEnter(e, printing) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHovered({ printing, rect });
  }

  if (!card) return null;

  const tooltip = hovered ? (() => {
    const p   = hovered.printing;
    const img = getCardImage(p, 'normal');
    return (
      <div className="printing-tooltip" style={computeTooltipStyle(hovered.rect)}>
        {img && <img src={img} alt={p.name} className="printing-tooltip-img" />}
        <div className="printing-tooltip-meta">
          <span className="printing-tooltip-set">{p.set_name}</span>
          <span className="printing-tooltip-num">
            #{p.collector_number} · {p.set?.toUpperCase()}
            {p.lang && p.lang !== 'en' ? ` · ${p.lang.toUpperCase()}` : ''}
          </span>
          {p.prices?.usd     && <span className="printing-tooltip-price">Normal: {formatPrice(p.prices.usd)}</span>}
          {p.prices?.usd_foil && <span className="printing-tooltip-foil">Foil: {formatPrice(p.prices.usd_foil)}</span>}
          {!p.prices?.usd && !p.prices?.usd_foil && <span className="printing-tooltip-no-price">No price data</span>}
        </div>
      </div>
    );
  })() : null;

  return (
    <div className="printings-wrap">
      <p className="printings-label">
        {loading
          ? 'Loading printings…'
          : `${printings.length} printing${printings.length !== 1 ? 's' : ''} — hover to preview, click to select`}
      </p>

      {!loading && printings.length > 0 && (
        <div className="printings-grid">
          {printings.map(p => {
            const img      = getCardImage(p, 'small');
            const price    = p.prices?.usd;
            const selected = p.id === selectedId;
            return (
              <div
                key={p.id}
                className={`printing-thumb${selected ? ' printing-selected' : ''}`}
                onClick={() => onSelect(p)}
                onMouseEnter={e => handleMouseEnter(e, p)}
                onMouseLeave={() => setHovered(null)}
                title={`${p.set_name} #${p.collector_number}`}
              >
                <div className="printing-thumb-img-wrap">
                  {img
                    ? <img src={img} alt={p.set_name} className="printing-thumb-img" loading="lazy" />
                    : <div className="printing-thumb-no-img">{p.set?.toUpperCase()}</div>
                  }
                </div>
                <div className="printing-thumb-footer">
                  <span className="printing-thumb-set">{p.set?.toUpperCase()}</span>
                  <span className="printing-thumb-price">{price ? `$${parseFloat(price).toFixed(2)}` : '—'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tooltip}
    </div>
  );
}
