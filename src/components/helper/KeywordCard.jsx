import { useState } from "react";

const CATEGORY_COLORS = {
  "Evasion": "#3a6b8a",
  "Combat Bonuses": "#7a3a3a",
  "Protection": "#3a6a3a",
  "Speed & Timing": "#7a6a3a",
  "Activated Abilities": "#6a3a7a",
  "Triggered Abilities": "#3a6a6a",
  "Creature Roles": "#6a5a3a",
  "Alternative Costs": "#7a5a3a",
  "Tokens & Counters": "#4a5a6a",
  "Mechanics": "#5a4a6a",
  "Keyword Actions": "#4a6a5a",
};

export default function KeywordCard({ keyword }) {
  const [expanded, setExpanded] = useState(false);
  const accentColor = CATEGORY_COLORS[keyword.category] || "#555";

  return (
    <div
      className="keyword-card"
      style={{ "--accent": accentColor }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="keyword-header">
        <div className="keyword-title-row">
          <span className="keyword-name">{keyword.name}</span>
          <div className="keyword-badges">
            <span className="badge badge-category">{keyword.category}</span>
            <span className="badge badge-type">{keyword.type}</span>
          </div>
        </div>
        <span className="keyword-toggle">{expanded ? "▲" : "▼"}</span>
      </div>

      <p className="keyword-reminder">
        <em>"{keyword.reminder}"</em>
      </p>

      {expanded && (
        <div className="keyword-details">
          <p className="keyword-description">{keyword.description}</p>
        </div>
      )}
    </div>
  );
}
