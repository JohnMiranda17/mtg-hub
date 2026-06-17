import { Link } from 'react-router-dom';
import { SPOTLIGHTS, dailySpotlightIndex } from '../data/spotlights';

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

      <div className="spotlight-cards">
        {spot.cards.map(name => (
          <Link
            key={name}
            to="/prices"
            state={{ cardName: name }}
            className="spotlight-card"
            style={{ '--spot-color': spot.color }}
          >
            {name}
          </Link>
        ))}
      </div>

      <div className="spotlight-tip">
        <span className="spotlight-tip-label">New player tip:</span> {spot.tip}
      </div>
    </div>
  );
}
