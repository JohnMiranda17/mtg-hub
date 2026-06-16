import { useState } from 'react';
import { SPOTLIGHTS, dailySpotlightIndex } from '../../data/spotlights';

// Returns expired spotlights ordered most-recently-expired first.
// Today's spotlight is still live on the Hub, so it is excluded.
export function expiredSpotlights(todayIdx = dailySpotlightIndex()) {
  const n = SPOTLIGHTS.length;
  return Array.from({ length: n - 1 }, (_, i) => ({
    spot: SPOTLIGHTS[(todayIdx - (i + 1) + n) % n],
    daysAgo: i + 1,
  }));
}

export default function SpotlightArchive() {
  const todayIdx = dailySpotlightIndex();
  const entries  = expiredSpotlights(todayIdx);
  const [open, setOpen] = useState(0); // open the most-recent entry by default

  return (
    <div className="spotlight-archive">
      <div className="spotlight-archive-intro">
        <p>
          Past New Player Spotlights — today's is still live on the Hub.
          Each topic rotates daily; check back to collect the full set of notes.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="sa-empty">No expired spotlights yet — come back tomorrow!</p>
      ) : (
        <div className="spotlight-archive-list">
          {entries.map(({ spot, daysAgo }, i) => {
            const isOpen = i === open;
            const label  = daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

            return (
              <div
                key={spot.title}
                className={`spotlight-archive-entry${isOpen ? ' sa-open' : ''}`}
                style={{ '--sa-color': spot.color }}
              >
                <button
                  className="spotlight-archive-row"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="sa-icon">{spot.icon}</span>
                  <span className="sa-title">{spot.title}</span>
                  <span className="sa-badge">{label}</span>
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
      )}
    </div>
  );
}
