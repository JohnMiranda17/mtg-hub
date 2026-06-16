import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SPOTLIGHTS, dailySpotlightIndex } from '../data/spotlights';

export default function Spotlight() {
  const [idx, setIdx] = useState(dailySpotlightIndex());
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(false);

  const spot = SPOTLIGHTS[idx];

  useEffect(() => {
    let cancelled = false;
    setCards(null);
    setLoading(true);

    fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(spot.query)}&page=1`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setCards((data.data ?? []).slice(0, 6));
      })
      .catch(() => { if (!cancelled) setCards([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [idx]);

  function prev() { setIdx(i => (i - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length); }
  function next() { setIdx(i => (i + 1) % SPOTLIGHTS.length); }

  return (
    <div className="hub-spotlight">
      <div className="spotlight-header">
        <div className="spotlight-title-group">
          <span className="spotlight-icon">{spot.icon}</span>
          <div>
            <div className="spotlight-eyebrow">New Player Spotlight</div>
            <div className="spotlight-title">{spot.title}</div>
          </div>
        </div>
        <div className="spotlight-nav">
          <button className="spotlight-nav-btn" onClick={prev} title="Previous spotlight">‹</button>
          <span className="spotlight-nav-count">{idx + 1} / {SPOTLIGHTS.length}</span>
          <button className="spotlight-nav-btn" onClick={next} title="Next spotlight">›</button>
        </div>
      </div>

      <p className="spotlight-desc">{spot.desc}</p>

      {loading && <p className="spotlight-loading">Loading examples…</p>}

      {cards && cards.length > 0 && (
        <div className="spotlight-cards">
          {cards.map(card => {
            const img = card.image_uris?.small ?? card.card_faces?.[0]?.image_uris?.small ?? null;
            return (
              <Link
                key={card.id}
                to="/prices"
                state={{ cardName: card.name }}
                className="spotlight-card"
                style={{ '--spot-color': spot.color }}
                title={`${card.name} — click to see price & details`}
              >
                {img
                  ? <img src={img} alt={card.name} className="spotlight-card-img" loading="lazy" />
                  : <div className="spotlight-card-placeholder">{card.name}</div>
                }
                <div className="spotlight-card-name">{card.name}</div>
              </Link>
            );
          })}
        </div>
      )}

      {cards && cards.length === 0 && !loading && (
        <p className="spotlight-empty">No example cards found — try another spotlight.</p>
      )}

      <div className="spotlight-tip">
        <span className="spotlight-tip-label">New player tip:</span> {spot.tip}
      </div>
    </div>
  );
}
