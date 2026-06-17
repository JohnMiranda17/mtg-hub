import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SPOTLIGHTS, dailySpotlightIndex } from '../data/spotlights';

const imgCache = new Map();

function SpotlightCardImage({ name, color }) {
  const [imgUrl, setImgUrl] = useState(imgCache.get(name) ?? null);
  const [loading, setLoading] = useState(!imgCache.has(name));

  useEffect(() => {
    if (imgCache.has(name)) return;
    let cancelled = false;
    fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(data => {
        const url = data.image_uris?.normal
          ?? data.card_faces?.[0]?.image_uris?.normal
          ?? null;
        imgCache.set(name, url);
        if (!cancelled) { setImgUrl(url); setLoading(false); }
      })
      .catch(() => {
        imgCache.set(name, null);
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [name]);

  return (
    <Link
      to="/prices"
      state={{ cardName: name }}
      className="spotlight-card-img-wrap"
      style={{ '--spot-color': color }}
      title={name}
    >
      {loading && <div className="spotlight-card-img-placeholder"><span className="spotlight-card-img-name">{name}</span></div>}
      {!loading && imgUrl && (
        <img src={imgUrl} alt={name} className="spotlight-card-img" />
      )}
      {!loading && !imgUrl && (
        <div className="spotlight-card-img-placeholder spotlight-card-img-fallback">
          <span className="spotlight-card-img-name">{name}</span>
        </div>
      )}
    </Link>
  );
}

export default function Spotlight() {
  const spot = SPOTLIGHTS[dailySpotlightIndex()];

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
      </div>

      <p className="spotlight-desc">{spot.desc}</p>

      <div className="spotlight-cards-grid">
        {spot.cards.map(name => (
          <SpotlightCardImage key={name} name={name} color={spot.color} />
        ))}
      </div>

      <div className="spotlight-tip">
        <span className="spotlight-tip-label">New player tip:</span> {spot.tip}
      </div>
    </div>
  );
}
