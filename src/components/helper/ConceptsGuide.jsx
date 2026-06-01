import { useState } from "react";
import {
  manaConcepts,
  gameZones,
  stackAndPriority,
  combatRules,
  deckBuilding,
} from "../../data/concepts";

function RuleBlock({ rule, description }) {
  return (
    <div className="rule-block">
      <strong className="rule-title">{rule}</strong>
      <p>{description}</p>
    </div>
  );
}

export default function ConceptsGuide({ activeTab }) {
  const [openColor, setOpenColor] = useState(null);
  const [openZone, setOpenZone] = useState(null);

  if (activeTab === "mana") {
    return (
      <div className="section-content">
        <p className="section-intro">
          Mana is the fuel for all your spells. There are five colors of mana
          plus colorless, each with its own land, identity, and strengths.
        </p>
        <div className="mana-grid">
          {manaConcepts.map((m) => {
            const isOpen = openColor === m.symbol;
            return (
              <div
                key={m.symbol}
                className={`mana-card ${isOpen ? "mana-open" : ""}`}
                style={{ "--mana-color": m.color }}
                onClick={() => setOpenColor(isOpen ? null : m.symbol)}
              >
                <div className="mana-header">
                  <span className="mana-icon">{m.icon}</span>
                  <div className="mana-title-group">
                    <span className="mana-name">{m.name}</span>
                    <span className="mana-symbol">{`{${m.symbol}}`}</span>
                    <span className="mana-land">{m.land}</span>
                  </div>
                  <span className="mana-toggle">{isOpen ? "▲" : "▼"}</span>
                </div>
                <p className="mana-theme">{m.theme}</p>
                {isOpen && (
                  <div className="mana-details">
                    <p>{m.description}</p>
                    <div className="mana-stats">
                      <div>
                        <strong>Strengths:</strong>
                        <ul>
                          {m.strengths.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Weaknesses:</strong>
                        <ul>
                          {m.weaknesses.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="mana-flavor">
                      <em>{m.flavor}</em>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === "zones") {
    return (
      <div className="section-content">
        <p className="section-intro">
          Magic has several game zones where cards can exist. Understanding
          where cards can go and how they interact is fundamental.
        </p>
        <div className="zones-list">
          {gameZones.map((z) => {
            const isOpen = openZone === z.name;
            return (
              <div
                key={z.name}
                className={`zone-card ${isOpen ? "zone-open" : ""}`}
                onClick={() => setOpenZone(isOpen ? null : z.name)}
              >
                <div className="zone-header">
                  <span className="zone-icon">{z.icon}</span>
                  <span className="zone-name">{z.name}</span>
                  <span className="zone-toggle">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="zone-details">
                    <p>{z.description}</p>
                    <div className="keyword-tip">
                      <span className="tip-label">💡 Tip</span>
                      <span>{z.tip}</span>
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

  if (activeTab === "stack") {
    return (
      <div className="section-content">
        <p className="section-intro">{stackAndPriority.intro}</p>
        <div className="rules-list">
          {stackAndPriority.rules.map((r) => (
            <RuleBlock key={r.rule} rule={r.rule} description={r.description} />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "combat") {
    return (
      <div className="section-content">
        <p className="section-intro">
          Combat is where battles are won and lost. Here's a deep dive into how
          combat works beyond the basics.
        </p>
        <div className="rules-list">
          {combatRules.rules.map((r) => (
            <RuleBlock key={r.rule} rule={r.rule} description={r.description} />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "deckbuilding") {
    return (
      <div className="section-content">
        <p className="section-intro">
          Building your first deck can feel overwhelming. Here are the core
          principles every new player should understand.
        </p>
        <div className="rules-list">
          {deckBuilding.rules.map((r) => (
            <RuleBlock key={r.rule} rule={r.rule} description={r.description} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
