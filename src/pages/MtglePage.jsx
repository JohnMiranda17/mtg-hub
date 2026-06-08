import Mtgle from '../components/Mtgle';

export default function MtglePage() {
  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#e07b39' }}>
        <h1>🎮 MTGLE</h1>
        <p>A new Magic card puzzle every day. Guess the card from hints — you get 6 tries.</p>
      </div>
      <Mtgle />
    </div>
  );
}
