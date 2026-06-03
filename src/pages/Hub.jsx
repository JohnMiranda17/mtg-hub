import { Link } from 'react-router-dom';

const TOOLS = [
  {
    to: '/helper',
    icon: '🃏',
    name: 'MTG Helper',
    description: 'Rules reference and AI rules Q&A — keywords, turn structure, combat, zones, and more.',
    color: '#c9a84c',
  },
  {
    to: '/collection',
    icon: '📦',
    name: 'Collection Tracker',
    description: 'Track your physical card collection. Add cards with condition, foil status, and quantity. See your total collection value.',
    color: '#4a8fc9',
  },
  {
    to: '/prices',
    icon: '💰',
    name: 'Price Tracker',
    description: 'Search any card and see live market prices from Scryfall. Build a watchlist of cards you\'re buying or selling.',
    color: '#4ac97a',
  },
  {
    to: '/board-state',
    icon: '⚔️',
    name: 'Board State Analyzer',
    description: 'Analyze a Magic game board state. Describe the battlefield, hand, graveyard, and stack — get interaction and combat analysis.',
    color: '#9a4ac9',
  },
];

export default function Hub() {
  return (
    <div className="hub-page">
      <div className="hub-hero">
        <h1 className="hub-headline">MTG Hub</h1>
        <p className="hub-sub">Your all-in-one Magic: The Gathering toolkit</p>
      </div>
      <div className="hub-grid">
        {TOOLS.map(t => (
          <Link key={t.to} to={t.to} className="hub-card" style={{ '--tool-color': t.color }}>
            <span className="hub-card-icon">{t.icon}</span>
            <h2 className="hub-card-name">{t.name}</h2>
            <p className="hub-card-desc">{t.description}</p>
            <span className="hub-card-cta">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
