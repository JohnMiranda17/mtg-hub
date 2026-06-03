import { useState } from "react";
import { cardTypes, supertypes } from "../../data/cardTypes";

export default function CardTypesGuide() {
  const [open, setOpen] = useState(null);

  return (
    <div className="section-content">
      <p className="section-intro">
        Every card in Magic belongs to one or more card types. The type line
        appears below the card's artwork and tells you exactly what kind of card
        it is and how it works.
      </p>

      <h3 className="subsection-title">Card Types</h3>
      <div className="card-types-grid">
        {cardTypes.map((ct) => {
          const isOpen = open === ct.name;
          return (
            <div
              key={ct.name}
              className={`type-card ${isOpen ? "type-open" : ""}`}
              style={{ "--type-color": ct.color }}
              onClick={() => setOpen(isOpen ? null : ct.name)}
            >
              <div className="type-header">
                <span className="type-icon">{ct.icon}</span>
                <span className="type-name">{ct.name}</span>
                <span className="type-toggle">{isOpen ? "▲" : "▼"}</span>
              </div>
              {isOpen && (
                <div className="type-details">
                  <p className="type-description">{ct.description}</p>
                  <div className="type-meta">
                    <div className="type-meta-row">
                      <strong>When you can play it:</strong> {ct.speed}
                    </div>
                    {ct.subtypes.length > 0 && (
                      <div className="type-meta-row">
                        <strong>Common subtypes:</strong>{" "}
                        {ct.subtypes.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h3 className="subsection-title" style={{ marginTop: "2rem" }}>
        Supertypes
      </h3>
      <p className="section-intro" style={{ marginBottom: "1rem" }}>
        Supertypes appear before the card type on the type line (e.g., "Legendary
        Creature" or "Basic Land"). They add rules on top of the card type.
      </p>
      <div className="supertypes-list">
        {supertypes.map((st) => (
          <div key={st.name} className="supertype-card">
            <strong className="supertype-name">{st.name}</strong>
            <p>{st.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
