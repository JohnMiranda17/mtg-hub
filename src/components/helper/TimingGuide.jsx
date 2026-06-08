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
  const [openSpeed, setOpenSpeed]   = useState(null);
  const [openWindow, setOpenWindow] = useState(null);

  return (
    <div className="section-content">
      <p className="section-intro">
        Knowing <em>when</em> you can play your cards is one of the most important skills in Magic. This guide explains timing windows, who holds priority, and the best moments to interact.
      </p>

      {/* Quick reference */}
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
