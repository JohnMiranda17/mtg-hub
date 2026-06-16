import { useState } from 'react';
import { SPOTLIGHTS, dailySpotlightIndex } from '../../data/spotlights';

export default function SpotlightArchive() {
  const todayIdx = dailySpotlightIndex();
  const [open, setOpen] = useState(todayIdx);

  return (
    <div className="spotlight-archive">
      <div className="spotlight-archive-intro">
        <p>
          Each spotlight covers a core MTG concept with curated example cards and notes for new players.
          A new spotlight rotates in every day — check back to build up your knowledge over time.
        </p>
      </div>

      <div className="spotlight-archive-list">
        {SPOTLIGHTS.map((spot, i) => {
          const isToday = i === todayIdx;
          const isOpen  = i === open;

          return (
            <div
              key={i}
              className={`spotlight-archive-entry${isToday ? ' sa-today' : ''}${isOpen ? ' sa-open' : ''}`}
              style={{ '--sa-color': spot.color }}
            >
              <button
                className="spotlight-archive-row"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span className="sa-icon">{spot.icon}</span>
                <span className="sa-title">{spot.title}</span>
                {isToday && <span className="sa-badge">Today</span>}
                <span className="sa-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="sa-body">
                  <p className="sa-desc">{spot.desc}</p>

                  <div className="sa-notes">
                    <div className="sa-notes-label">Deep Dive</div>
                    <p>{spot.notes}</p>
                  </div>

                  <div className="sa-tip">
                    <span className="sa-tip-label">New Player Tip:</span> {spot.tip}
                  </div>

                  <a
                    href={`https://scryfall.com/search?q=${encodeURIComponent(spot.query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="sa-browse-link"
                  >
                    Browse example cards on Scryfall ↗
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
