import { Link } from 'react-router-dom';
import Mtgle from '../components/Mtgle';
import Spotlight from '../components/Spotlight';

const TOOLS = [
  {
    to: '/helper',
    icon: '🃏',
    name: 'MTG Helper',
    description: 'Rules reference — keywords, turn structure, card types, concepts, archetypes, and AI rules Q&A.',
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
    description: 'Search any card for live prices, EDHREC synergies, Reddit buzz, and how it fits your commander decks.',
    color: '#4ac97a',
  },
  {
    to: '/combos',
    icon: '💥',
    name: 'Combo Searcher',
    description: 'Find 2 and 3-card combos for any card. Powered by Commander Spellbook.',
    color: '#a06cd5',
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

      <Spotlight />

      <div className="hub-mtgle-section">
        <Mtgle />
      </div>
    </div>
  );
}
