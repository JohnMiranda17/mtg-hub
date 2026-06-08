import { useState } from 'react';

const SPEED_RULES = [
  {
    speed: 'Instant Speed',
    icon: '⚡',
    color: '#4a8fc9',
    summary: 'Any time you have priority',
    when: [
      'During your main phase (before or after combat)',
      "During your opponent's turn at any point",
      'In response to any spell or ability on the stack',
      'During any step of combat (declare attackers, declare blockers, before damage)',
      "At the end of any player's turn (their 'end step')",
    ],
    includes: 'Instant spells • Activated abilities (unless restricted) • Triggered abilities',
    tip: "If your card's type is \"Instant\", you can play it anytime. Activated abilities (written as \"Cost: Effect\") are also instant speed unless they say \"only as a sorcery\".",
  },
  {
    speed: 'Sorcery Speed',
    icon: '🐌',
    color: '#c9a84c',
    summary: 'Main phase only, stack empty',
    when: [
      'Only during YOUR turn',
      'Only during your main phase (pre-combat or post-combat)',
      'Only when the stack is EMPTY — nothing is waiting to resolve',
    ],
    includes: 'Sorcery spells • Creature / artifact / enchantment / planeswalker spells • Most planeswalker activations',
    tip: 'You cannot cast a sorcery in response to anything. If your opponent casts a spell, the window to cast a sorcery closes until that resolves.',
  },
  {
    speed: 'Land Plays',
    icon: '🏔️',
    color: '#4ac97a',
    summary: 'Main phase, once per turn',
    when: [
      'Only during YOUR turn',
      'Only during your main phase',
      'Only when the stack is empty',
      'Only ONCE per turn — your one land drop',
    ],
    includes: 'All land cards (basic and non-basic)',
    tip: 'Playing a land is a special action — it does NOT use the stack and cannot be responded to. But the timing restriction is the same as sorceries.',
  },
];

const ABILITY_TYPES = [
  {
    name: 'Activated Abilities',
    icon: '🔘',
    color: '#7b68c9',
    summary: 'Cost: Effect — instant speed by default',
    rules: [
      'Written as "Cost: Effect" (e.g., "{2}: Draw a card" or "Tap: Add {G}")',
      'Can be activated any time you have priority — instant speed by default',
      'If they say "Activate only as a sorcery," they follow sorcery-speed rules',
      'Loyalty abilities on planeswalkers are activated, but are sorcery speed and once per turn per planeswalker',
      'Mana abilities (tap for mana) resolve immediately without going on the stack',
    ],
    tip: 'You can activate an ability any number of times per turn as long as you can pay the cost. There is no "once per turn" limit unless the card says so.',
  },
  {
    name: 'Triggered Abilities',
    icon: '🔔',
    color: '#c9684a',
    summary: '"When / Whenever / At" — go on the stack',
    rules: [
      'Start with "When...", "Whenever...", or "At the beginning of..."',
      'When the condition is met, the ability waits for the current action to finish, then goes on the stack',
      'Once on the stack, all players can respond to it with instants and abilities',
      '"Dies" triggers are triggered abilities — they trigger after the creature is in the graveyard',
      '"When this enters the battlefield" (ETB) triggers go on the stack after the permanent resolves',
    ],
    tip: '"Whenever you cast a spell" triggers when the spell is put on the stack — before it resolves. You get the trigger even if the spell is later countered.',
  },
  {
    name: 'Static Abilities',
    icon: '🔷',
    color: '#4ac9a0',
    summary: 'Always active — never go on the stack',
    rules: [
      'Continuously apply their effect while the permanent is on the battlefield',
      'Examples: Flying, Hexproof, "Creatures you control get +1/+1"',
      'You cannot respond to a static ability — it is not an event',
      'If the permanent leaves the battlefield, the static effect immediately stops',
      'Conflicting static effects are resolved using the "layers" system (applied in a fixed order)',
    ],
    tip: "Static abilities are always on. You can't \"save\" or \"use\" them — they just work automatically as long as the card is in play.",
  },
  {
    name: 'Mana Abilities',
    icon: '💎',
    color: '#c9b84a',
    summary: 'Special: resolve immediately, bypass the stack',
    rules: [
      'An activated or triggered ability that could produce mana and does not target',
      'Resolves IMMEDIATELY — does not go on the stack and cannot be responded to',
      'Examples: tapping a Forest, Sol Ring, Llanowar Elves',
      'This is why you can tap a land to pay for a spell in the middle of casting it',
      '"Add {G} when a creature enters" is also a mana ability — still resolves immediately',
    ],
    tip: "Mana abilities are the only abilities that bypass the stack entirely. This is intentional — Magic would be unplayable if opponents could respond to you tapping a land.",
  },
];

const DEATH_EFFECTS = [
  {
    title: 'When a Creature Dies',
    icon: '💀',
    highlight: true,
    summary: 'Goes to graveyard — triggers "dies" abilities',
    body: [
      'A creature "dies" when it moves from the battlefield to the graveyard via lethal damage, a destroy effect, or sacrifice.',
      '"When [this] dies" triggered abilities go on the stack after the creature is already in the graveyard.',
      'Once the trigger is on the stack, players can respond to it with instants and abilities.',
      'You cannot respond to the death itself — only to what caused it (the removal spell) before it resolves, or to the trigger after.',
    ],
    tip: 'To stop a "dies" trigger, you must exile the creature before it goes to the graveyard. Replacing destroy with exile (e.g., Path to Exile) skips the graveyard entirely — no dies trigger.',
    example: "Your creature is hit by Lightning Bolt and dies. \"When this dies, draw a card\" goes on the stack — your opponent can counter that trigger, but can't undo the death.",
  },
  {
    title: 'Destroy vs. Exile',
    icon: '✨',
    highlight: true,
    summary: 'Exile skips the graveyard — no "dies" trigger',
    body: [
      '"Destroy" sends a creature to the graveyard → fires "when this dies" and graveyard-matters effects.',
      '"Exile" removes the permanent from the game entirely — it never visits the graveyard.',
      'Exiled creatures do NOT trigger "when this dies" abilities.',
      'Exiled creatures cannot be retrieved by graveyard recursion (Reanimate, Unearth, etc.).',
      'Indestructible creatures cannot be destroyed but CAN be exiled, sacrificed, or killed by -X/-X.',
    ],
    tip: 'If your opponent has a creature with a powerful "dies" trigger, reach for exile. "Swords to Plowshares," "Path to Exile," and "Generous Gift" all bypass dies triggers.',
    example: '"My creature has \'when this dies, return it to hand.\' You destroy it." → triggers, returns to hand. "You exile it instead." → no trigger, it\'s just gone.',
  },
  {
    title: 'Sacrifice Effects',
    icon: '🔱',
    highlight: false,
    summary: 'Ignores indestructible — still triggers "dies"',
    body: [
      'Sacrifice moves a permanent from battlefield to graveyard regardless of indestructible or protection.',
      'Indestructible does NOT prevent sacrifice — the creature still goes to the graveyard.',
      'Sacrifice DOES trigger "when this dies" abilities just like destroy does.',
      '"Sacrifice a creature" effects (like Merciless Executioner) cannot be countered by making the creature indestructible.',
      'Forced sacrifice bypasses hexproof and protection — those only stop targeting.',
    ],
    tip: "Indestructible only prevents being destroyed by damage and destroy effects. Sacrifice, exile, and -X/-X that drops toughness to 0 all still kill an indestructible creature.",
    example: '"Your opponent\'s commander is indestructible. You cast \'each opponent sacrifices a creature.\' They must sacrifice it — indestructible doesn\'t apply to sacrifice."',
  },
  {
    title: 'Leave-the-Battlefield Triggers',
    icon: '🚪',
    highlight: false,
    summary: '"When leaves" fires for any zone change',
    body: [
      '"When [this] leaves the battlefield" triggers for any zone change: graveyard, exile, hand, or back to library.',
      '"When [this] dies" only triggers when the destination is specifically the graveyard.',
      'Bounce (return to hand) fires "leaves the battlefield" but NOT "dies."',
      'Flickering (exile then immediately return) fires "leaves the battlefield" and "enters the battlefield," but NOT "dies."',
      'Auras attached to a permanent go to the graveyard when it leaves. Equipment stays on the battlefield unattached.',
    ],
    tip: '"Flicker" effects exile a permanent and return it — this re-triggers ETB abilities and can remove negative auras or counters. But it does NOT trigger dies effects.',
    example: '"Your creature is flickered. Any \'when this dies\' triggers? No — it went to exile briefly, not the graveyard. But its \'enters the battlefield\' trigger fires when it comes back."',
  },
  {
    title: 'Last Known Information',
    icon: '📋',
    highlight: false,
    summary: 'Abilities check the card as it was when it left',
    body: [
      'When a triggered ability references a permanent that has already left the battlefield, it uses that permanent\'s last known characteristics.',
      'Example: "When this creature dies, if its power was 4 or greater, draw a card." The power is checked as it was on the battlefield.',
      'Counters and auras on the creature at the time of death count toward last known information.',
      'For permanents still on the battlefield, always use current information — last known info only applies to things that have already left.',
    ],
    tip: 'You can pump a creature right before it dies and the boosted stats count for any "last known information" checks on its death trigger.',
    example: '"3/3 creature with \'when this dies, if power ≥ 4, draw a card.\' Opponent pumps it to 5/5 in response to your removal. It dies as a 5/5 — last known power is 5, so they draw."',
  },
];

const PRIORITY_STEPS = [
  {
    num: '1',
    title: 'Active player gets priority first',
    desc: "The player whose turn it is always gets the first chance to cast spells or activate abilities after each phase or step begins.",
  },
  {
    num: '2',
    title: 'After any action, priority passes',
    desc: "After any player casts a spell or activates an ability, priority passes around the table so others can respond.",
  },
  {
    num: '3',
    title: 'All players pass → top of stack resolves',
    desc: "If every player passes priority in a row without doing anything, the top spell or ability on the stack resolves. Then priority passes again.",
  },
  {
    num: '4',
    title: 'Empty stack + all pass → phase advances',
    desc: "If the stack is empty and all players pass priority, the turn moves to the next phase or step.",
  },
];

const WINDOWS = [
  {
    phase: "End of opponent's turn",
    icon: '⭐',
    who: 'You',
    highlight: true,
    note: "The most powerful window: play an instant, opponent can't stop you, and the effect carries into your untap step.",
    example: 'Flash in a creature, draw a card, or pump a creature — full effect, no counterplay until your next action.',
  },
  {
    phase: 'In response to a spell',
    icon: '⚡',
    who: 'Both players',
    highlight: true,
    note: 'Any time a spell is cast, all players get priority before it resolves. React with instants or abilities.',
    example: "Opponent targets your creature → respond with a hexproof spell → their removal spell can't target it → fizzles.",
  },
  {
    phase: 'After blockers are declared',
    icon: '🛡️',
    who: 'Both players',
    highlight: true,
    note: 'All blockers are assigned but damage has not happened yet. Best window for pump spells and removal.',
    example: 'Giant Growth your attacker so it survives the blocker. Or kill a blocker before damage deals.',
  },
  {
    phase: 'After attackers are declared',
    icon: '⚔️',
    who: 'Both players',
    highlight: false,
    note: "Attackers are committed but blockers haven't been assigned. Tap creatures, activate abilities.",
    example: "Tap down a potential blocker so it can't block. Or activate a planeswalker ability in response.",
  },
  {
    phase: "Opponent's upkeep",
    icon: '☀️',
    who: 'Both players',
    highlight: false,
    note: 'Before the opponent draws. Useful for abilities that care about the beginning of a turn.',
    example: 'Activate a "tap: effect" ability before your opponent untaps, or respond to an upkeep trigger.',
  },
  {
    phase: 'End of your own turn',
    icon: '🌙',
    who: 'Opponent',
    highlight: false,
    note: 'Your opponent gets one last chance before your turn fully ends. Watch for flash threats and end-step abilities.',
    example: "Opponent flashes in a blocker or plays an instant to deny your next turn's attack.",
  },
];

export default function TimingGuide() {
  const [openSpeed,   setOpenSpeed]   = useState(null);
  const [openAbility, setOpenAbility] = useState(null);
  const [openDeath,   setOpenDeath]   = useState(null);
  const [openWindow,  setOpenWindow]  = useState(null);

  return (
    <div className="section-content">
      <p className="section-intro">
        Knowing <em>when</em> you can play your cards is one of the most important skills in Magic. This guide explains timing windows, ability types, death effects, and who holds priority.
      </p>

      {/* Speed Quick Reference */}
      <h3 className="subsection-title">Timing Quick Reference</h3>
      <div className="timing-speed-list">
        {SPEED_RULES.map(r => {
          const isOpen = openSpeed === r.speed;
          return (
            <div
              key={r.speed}
              className={`timing-speed-card${isOpen ? ' timing-speed-open' : ''}`}
              style={{ '--speed-color': r.color }}
              onClick={() => setOpenSpeed(isOpen ? null : r.speed)}
            >
              <div className="timing-speed-header">
                <span className="timing-speed-icon">{r.icon}</span>
                <div className="timing-speed-title-group">
                  <span className="timing-speed-name">{r.speed}</span>
                  <span className="timing-speed-summary">{r.summary}</span>
                </div>
                <span className="timing-speed-toggle">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="timing-speed-body">
                  <p className="timing-speed-when-label">Allowed when:</p>
                  <ul className="timing-when-list">
                    {r.when.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                  <p className="timing-speed-includes"><strong>Includes:</strong> {r.includes}</p>
                  <div className="timing-speed-tip">{r.tip}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ability Types */}
      <h3 className="subsection-title" style={{ marginTop: '1.5rem' }}>Ability Types &amp; Timing</h3>
      <p className="section-intro">Not all abilities work the same way. Click any type to see when and how it can be used.</p>
      <div className="timing-speed-list">
        {ABILITY_TYPES.map(a => {
          const isOpen = openAbility === a.name;
          return (
            <div
              key={a.name}
              className={`timing-speed-card${isOpen ? ' timing-speed-open' : ''}`}
              style={{ '--speed-color': a.color }}
              onClick={() => setOpenAbility(isOpen ? null : a.name)}
            >
              <div className="timing-speed-header">
                <span className="timing-speed-icon">{a.icon}</span>
                <div className="timing-speed-title-group">
                  <span className="timing-speed-name">{a.name}</span>
                  <span className="timing-speed-summary">{a.summary}</span>
                </div>
                <span className="timing-speed-toggle">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="timing-speed-body">
                  <p className="timing-speed-when-label">How they work:</p>
                  <ul className="timing-when-list">
                    {a.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                  </ul>
                  <div className="timing-speed-tip">{a.tip}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Death & Leave-the-Battlefield */}
      <h3 className="subsection-title" style={{ marginTop: '1.5rem' }}>Death &amp; Leave-the-Battlefield Effects</h3>
      <p className="section-intro">Understanding what happens when permanents leave the battlefield is key to playing removal and protection correctly.</p>
      <div className="timing-windows-list">
        {DEATH_EFFECTS.map(d => {
          const isOpen = openDeath === d.title;
          return (
            <div
              key={d.title}
              className={`timing-window-card${d.highlight ? ' timing-window-highlight' : ''}${isOpen ? ' timing-window-open' : ''}`}
              onClick={() => setOpenDeath(isOpen ? null : d.title)}
            >
              <div className="timing-window-header">
                <span className="timing-window-icon">{d.icon}</span>
                <div className="timing-window-title-group">
                  <span className="timing-window-phase">{d.title}</span>
                  {d.highlight && <span className="timing-key-badge">Key Rule</span>}
                </div>
                <span className="timing-window-who">{d.summary}</span>
                <span className="timing-window-toggle">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="timing-window-body">
                  <ul className="timing-when-list" style={{ marginBottom: '0.6rem' }}>
                    {d.body.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                  <div className="timing-speed-tip" style={{ marginBottom: '0.5rem' }}>{d.tip}</div>
                  <div className="timing-window-example">
                    <span className="timing-example-label">Example:</span> {d.example}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Priority */}
      <h3 className="subsection-title" style={{ marginTop: '1.5rem' }}>How Priority Works</h3>
      <div className="timing-priority-box">
        {PRIORITY_STEPS.map(s => (
          <div key={s.num} className="timing-priority-step">
            <div className="timing-priority-num">{s.num}</div>
            <div>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interaction windows */}
      <h3 className="subsection-title" style={{ marginTop: '1.5rem' }}>Key Interaction Windows</h3>
      <p className="section-intro">Click any window to see an example of how to use it.</p>
      <div className="timing-windows-list">
        {WINDOWS.map(w => {
          const isOpen = openWindow === w.phase;
          return (
            <div
              key={w.phase}
              className={`timing-window-card${w.highlight ? ' timing-window-highlight' : ''}${isOpen ? ' timing-window-open' : ''}`}
              onClick={() => setOpenWindow(isOpen ? null : w.phase)}
            >
              <div className="timing-window-header">
                <span className="timing-window-icon">{w.icon}</span>
                <div className="timing-window-title-group">
                  <span className="timing-window-phase">{w.phase}</span>
                  {w.highlight && <span className="timing-key-badge">Key Window</span>}
                </div>
                <span className="timing-window-who">{w.who} can act</span>
                <span className="timing-window-toggle">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="timing-window-body">
                  <p>{w.note}</p>
                  <div className="timing-window-example">
                    <span className="timing-example-label">Example:</span> {w.example}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
