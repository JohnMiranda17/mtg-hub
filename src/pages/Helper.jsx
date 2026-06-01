import { useState, useMemo } from 'react';
import SearchBar from '../components/helper/SearchBar';
import KeywordCard from '../components/helper/KeywordCard';
import TurnGuide from '../components/helper/TurnGuide';
import CardTypesGuide from '../components/helper/CardTypesGuide';
import ConceptsGuide from '../components/helper/ConceptsGuide';
import { keywords } from '../data/keywords';

const TABS = [
  { id: 'search',       label: '🔍 Keywords'      },
  { id: 'turns',        label: '⏱ Turn Order'     },
  { id: 'cardtypes',    label: '🃏 Card Types'     },
  { id: 'mana',         label: '🎨 Mana Colors'    },
  { id: 'zones',        label: '🗺 Zones'          },
  { id: 'stack',        label: '📦 The Stack'      },
  { id: 'combat',       label: '⚔️ Combat'         },
  { id: 'deckbuilding', label: '🏗 Deck Building'  },
];

const CATEGORIES = [
  'All','Evasion','Combat Bonuses','Protection','Speed & Timing',
  'Activated Abilities','Triggered Abilities','Creature Roles',
  'Alternative Costs','Tokens & Counters','Mechanics','Keyword Actions',
];

function normalize(s) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, ''); }

export default function Helper() {
  const [tab, setTab]           = useState('search');
  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = normalize(query);
    return keywords.filter(kw => {
      const matchCat = category === 'All' || kw.category === category;
      if (!q) return matchCat;
      return matchCat && (
        normalize(kw.name).includes(q) ||
        normalize(kw.description).includes(q) ||
        normalize(kw.reminder).includes(q) ||
        normalize(kw.category).includes(q) ||
        normalize(kw.type).includes(q) ||
        (kw.tip && normalize(kw.tip).includes(q))
      );
    });
  }, [query, category]);

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#c9a84c' }}>
        <h1>🔍 Rules Reference</h1>
        <p>Keywords, abilities, card types, turn structure, and more.</p>
      </div>

      <nav className="sub-tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`sub-tab${tab === t.id ? ' sub-tab-active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </nav>

      {tab === 'search' && (
        <>
          <SearchBar value={query} onChange={setQuery} resultCount={filtered.length} />
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button key={cat}
                className={`cat-btn${category === cat ? ' cat-active' : ''}`}
                onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
          {filtered.length === 0
            ? <div className="empty-state"><p>No results — try a different term.</p></div>
            : <div className="keywords-list">{filtered.map(kw => <KeywordCard key={kw.name} keyword={kw} />)}</div>
          }
        </>
      )}

      {tab === 'turns'        && <TurnGuide />}
      {tab === 'cardtypes'    && <CardTypesGuide />}
      {(tab === 'mana' || tab === 'zones' || tab === 'stack' || tab === 'combat' || tab === 'deckbuilding') &&
        <ConceptsGuide activeTab={tab} />}
    </div>
  );
}
