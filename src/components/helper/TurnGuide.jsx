import { useState } from "react";
import { turnStructure } from "../../data/turnStructure";

export default function TurnGuide() {
  const [openStep, setOpenStep] = useState(null);

  return (
    <div className="section-content">
      <p className="section-intro">
        Every Magic turn follows the same sequence. Click on any step to learn
        more about it.
      </p>
      <div className="turn-phases">
        {turnStructure.map((phase) => (
          <div key={phase.phase} className="phase-block">
            <h3 className="phase-title">
              <span className="phase-number">{phase.order}</span>
              {phase.phase}
            </h3>
            <div className="steps-list">
              {phase.steps.map((step) => {
                const key = `${phase.phase}:${step.name}`;
                const isOpen = openStep === key;
                return (
                  <div
                    key={step.name}
                    className={`step-card ${isOpen ? "step-open" : ""}`}
                    onClick={() => setOpenStep(isOpen ? null : key)}
                  >
                    <div className="step-header">
                      <span className="step-icon">{step.icon}</span>
                      <span className="step-name">{step.name}</span>
                      <span className="step-toggle">{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div className="step-details">
                        <p>{step.description}</p>
                        {step.tip && (
                          <div className="keyword-tip">
                            <span className="tip-label">💡 Tip</span>
                            <span>{step.tip}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
