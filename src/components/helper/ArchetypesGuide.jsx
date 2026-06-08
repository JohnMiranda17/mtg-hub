import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ARCHETYPES } from '../../data/archetypes';

export default function ArchetypesGuide() {
  const [active, setActive] = useState(ARCHETYPES[0].id);
  const arch = ARCHETYPES.find(a => a.id === active);

  return (
    <div className="archetypes-wrap">
      {/* Selector tabs */}
      <div className="archetype-selector">
        {ARCHETYPES.map(a => (
          <button
            key={a.id}
            className={`archetype-btn${active === a.id ? ' archetype-btn-active' : ''}`}
            style={{ '--arch-color': a.color }}
            onClick={() => setActive(a.id)}
          >
            <span className="archetype-btn-icon">{a.icon}</span>
            <span>{a.name}</span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      {arch && (
        <div className="archetype-detail" style={{ '--arch-color': arch.color }}>
          <div className="archetype-detail-header">
            <span className="archetype-detail-icon">{arch.icon}</span>
            <div>
              <h2 className="archetype-detail-name">{arch.name}</h2>
              <p className="archetype-detail-tagline">"{arch.tagline}"</p>
            </div>
          </div>

          <p className="archetype-description">{arch.description}</p>

          <div className="archetype-columns">
            <div>
              <h3 className="archetype-section-title">How to Play</h3>
              <p className="archetype-playstyle">{arch.playstyle}</p>

              <h3 className="archetype-section-title" style={{ marginTop: '1rem' }}>Formats</h3>
              <p className="archetype-formats">{arch.formats}</p>
            </div>

            <div>
              <h3 className="archetype-section-title">Strengths</h3>
              <ul className="archetype-list archetype-strengths">
                {arch.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <h3 className="archetype-section-title" style={{ marginTop: '1rem' }}>Weaknesses</h3>
              <ul className="archetype-list archetype-weaknesses">
                {arch.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>

          <div className="archetype-cards-section">
            <div className="archetype-card-group">
              <h3 className="archetype-section-title">Iconic Cards</h3>
              <div className="archetype-card-pills">
                {arch.exampleCards.map(name => (
                  <Link
                    key={name}
                    to="/prices"
                    state={{ cardName: name }}
                    className="archetype-card-pill"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="archetype-card-group">
              <h3 className="archetype-section-title">Example Commanders</h3>
              <div className="archetype-card-pills">
                {arch.exampleCommanders.map(name => (
                  <Link
                    key={name}
                    to="/prices"
                    state={{ cardName: name }}
                    className="archetype-card-pill archetype-commander-pill"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
