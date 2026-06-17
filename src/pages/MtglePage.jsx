import { useState } from 'react';
import { Link } from 'react-router-dom';
import Mtgle from '../components/Mtgle';
import NoHintMtgle from '../components/NoHintMtgle';

const MODES = [
  { id: 'daily',   label: '🎮 Daily'    },
  { id: 'no-hint', label: '🧠 No-Hint'  },
];

export default function MtglePage() {
  const [mode, setMode] = useState('daily');

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#e07b39' }}>
        <div className="page-header-row">
          <div>
            <h1>🎮 MTGLE</h1>
            <p>A new Magic card puzzle every day — two ways to play. Daily mode gives hints with 7 tries; No-Hint mode compares card attributes across 10 guesses.</p>
          </div>
          <Link to="/custom-mtgle" className="mtgle-custom-link">⚙️ Custom Game</Link>
        </div>
      </div>

      <nav className="sub-tab-bar">
        {MODES.map(m => (
          <button
            key={m.id}
            className={`sub-tab${mode === m.id ? ' sub-tab-active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>

      {mode === 'daily'   && <Mtgle />}
      {mode === 'no-hint' && <NoHintMtgle />}
    </div>
  );
}
