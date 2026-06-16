import { Link } from 'react-router-dom';
import Mtgle from '../components/Mtgle';

export default function MtglePage() {
  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#e07b39' }}>
        <div className="page-header-row">
          <div>
            <h1>🎮 MTGLE</h1>
            <p>A new Magic card puzzle every day. Guess the card from hints — you get 7 tries.</p>
          </div>
          <Link to="/custom-mtgle" className="mtgle-custom-link">⚙️ Custom Game</Link>
        </div>
      </div>
      <Mtgle />
    </div>
  );
}
