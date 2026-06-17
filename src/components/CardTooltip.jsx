import { useState } from 'react';
import { createPortal } from 'react-dom';

const imageCache = new Map();
const TOOLTIP_W = 224;

export default function CardTooltip({ name, children }) {
  const [state, setState] = useState({ visible: false, x: 0, y: 0, imgUrl: null, loading: false });

  async function handleMouseEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = rect.right + 12;
    const y = Math.max(8, Math.min(rect.top - 8, window.innerHeight - 330));
    if (x + TOOLTIP_W > window.innerWidth - 8) x = rect.left - TOOLTIP_W - 12;

    const cached = imageCache.has(name);
    setState({ visible: true, x, y, imgUrl: cached ? imageCache.get(name) : null, loading: !cached });

    if (!cached) {
      try {
        const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`);
        const data = await res.json();
        const img = data.image_uris?.normal
          ?? data.card_faces?.[0]?.image_uris?.normal
          ?? null;
        imageCache.set(name, img);
        setState(s => s.visible ? { ...s, imgUrl: img, loading: false } : s);
      } catch {
        imageCache.set(name, null);
        setState(s => ({ ...s, loading: false }));
      }
    }
  }

  function handleMouseLeave() {
    setState(s => ({ ...s, visible: false }));
  }

  return (
    <>
      <span
        className="card-tooltip-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children ?? name}
      </span>
      {state.visible && createPortal(
        <div
          className="card-tooltip-portal"
          style={{ left: state.x, top: state.y }}
          aria-hidden="true"
        >
          {state.loading && <div className="card-tooltip-loading">Loading…</div>}
          {state.imgUrl && (
            <img src={state.imgUrl} alt={name} className="card-tooltip-img" />
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
