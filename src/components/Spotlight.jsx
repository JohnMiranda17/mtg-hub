import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SPOTLIGHTS = [
  {
    title: 'Artifact Removal',
    icon: '🔧',
    color: '#4a8fc9',
    desc: 'Dealing with troublesome artifacts is essential in every format — mana rocks, equipment, and combo pieces all need answering.',
    query: '(o:"destroy target artifact" or o:"exile target artifact") r:common order:edhrec',
    tip: 'Every deck should run at least 2–3 artifact answers. Even cheap commons can neutralize a powerful mana rock or equipment.',
  },
  {
    title: 'Enchantment Answers',
    icon: '💫',
    color: '#a06cd5',
    desc: 'Enchantments are harder to remove than creatures. These spells deal with enchantment-based strategies that can take over games.',
    query: '(o:"destroy target enchantment" or o:"exile target enchantment") order:edhrec -t:land',
    tip: 'Enchantment removal is often overlooked by new players — but enchantments like Rhystic Study or Smothering Tithe can win games on their own.',
  },
  {
    title: 'Mono Red Burn',
    icon: '🔥',
    color: '#e06040',
    desc: "Red's signature playstyle: deal direct damage to win fast. These are the backbone of aggressive red decks in every format.",
    query: 'c:r t:instant o:"deals" o:"damage" r:common order:edhrec',
    tip: 'Burn spells are flexible — they target creatures OR players. That versatility is why red is always a top aggressive option.',
  },
  {
    title: 'Card Draw Spells',
    icon: '🃏',
    color: '#4ac9c9',
    desc: "Keeping your hand full is how you win the long game. Learn these and you'll never run out of options.",
    query: 'c:u (t:instant or t:sorcery) o:"draw" r:common order:edhrec',
    tip: 'Card draw is the single most powerful effect category in Magic. More cards = more choices = more winning.',
  },
  {
    title: 'Mana Ramp',
    icon: '🌿',
    color: '#4ac97a',
    desc: 'Green acceleration lets you cast big spells early. Getting ahead on mana is a reliable path to victory in any format.',
    query: 'c:g t:sorcery o:"search your library" o:"land" r:common order:edhrec',
    tip: "A turn-2 ramp spell means you're a mana ahead for the rest of the game — a huge compounding advantage.",
  },
  {
    title: 'Creature Removal',
    icon: '🎯',
    color: '#c94a4a',
    desc: "Deal with the most dangerous threats before they take over the board. Essential in any deck that needs to interact.",
    query: '(o:"destroy target creature" or o:"exile target creature") r:common order:edhrec',
    tip: "You can't ignore your opponent's best creatures forever. Pack removal to handle the threats that would otherwise end the game.",
  },
  {
    title: 'Commander Staples',
    icon: '⭐',
    color: '#c9a84c',
    desc: 'Cards that appear across Commander decks of all kinds. Learning why these are good builds your MTG intuition fast.',
    query: 'is:commander_staple order:edhrec r:rare -t:land',
    tip: 'Staples are worth knowing by heart — recognizing them tells you a lot about what an opponent is planning.',
  },
  {
    title: 'Flying Threats',
    icon: '🦅',
    color: '#6080d0',
    desc: 'Flying is the most common evasion keyword — these creatures are reliable closers and hard to block.',
    query: 'kw:flying r:uncommon t:creature cmc>=3 order:edhrec c:w',
    tip: "If your opponent builds up flyers and you have no answers, you'll take damage every turn. Always pack flying answers.",
  },
];

function weekIndex() {
  return Math.floor(Date.now() / (7 * 24 * 3600 * 1000)) % SPOTLIGHTS.length;
}

export default function Spotlight() {
  const [idx, setIdx] = useState(weekIndex());
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(false);

  const spot = SPOTLIGHTS[idx];

  useEffect(() => {
    let cancelled = false;
    setCards(null);
    setLoading(true);

    fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(spot.query)}&page=1`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setCards((data.data ?? []).slice(0, 6));
      })
      .catch(() => { if (!cancelled) setCards([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [idx]);

  function prev() { setIdx(i => (i - 1 + SPOTLIGHTS.length) % SPOTLIGHTS.length); }
  function next() { setIdx(i => (i + 1) % SPOTLIGHTS.length); }

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
        <div className="spotlight-nav">
          <button className="spotlight-nav-btn" onClick={prev} title="Previous spotlight">‹</button>
          <span className="spotlight-nav-count">{idx + 1} / {SPOTLIGHTS.length}</span>
          <button className="spotlight-nav-btn" onClick={next} title="Next spotlight">›</button>
        </div>
      </div>

      <p className="spotlight-desc">{spot.desc}</p>

      {loading && <p className="spotlight-loading">Loading examples…</p>}

      {cards && cards.length > 0 && (
        <div className="spotlight-cards">
          {cards.map(card => {
            const img = card.image_uris?.small ?? card.card_faces?.[0]?.image_uris?.small ?? null;
            return (
              <Link
                key={card.id}
                to="/prices"
                state={{ cardName: card.name }}
                className="spotlight-card"
                style={{ '--spot-color': spot.color }}
                title={`${card.name} — click to see price & details`}
              >
                {img
                  ? <img src={img} alt={card.name} className="spotlight-card-img" loading="lazy" />
                  : <div className="spotlight-card-placeholder">{card.name}</div>
                }
                <div className="spotlight-card-name">{card.name}</div>
              </Link>
            );
          })}
        </div>
      )}

      {cards && cards.length === 0 && !loading && (
        <p className="spotlight-empty">No example cards found — try another spotlight.</p>
      )}

      <div className="spotlight-tip">
        <span className="spotlight-tip-label">New player tip:</span> {spot.tip}
      </div>
    </div>
  );
}
