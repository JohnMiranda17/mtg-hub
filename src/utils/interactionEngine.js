import { RESTRICTION_CARDS, SPLIT_SECOND_NOTE } from '../data/restrictionCards';

/**
 * Given a parsed board state and an array of Scryfall card objects (looked up
 * by name), returns a structured analysis of what instant-speed actions are
 * available and what restrictions are in play.
 */
export function analyzeInteractions(boardState, cardData, priority = 'me') {
  const {
    myBattlefield,
    oppBattlefield,
    myHand,
    stack,
    actionsThisTurn,
  } = boardState;

  const allBattlefield = [...myBattlefield, ...oppBattlefield];
  const allCardNames = allBattlefield.map(p => p.name.toLowerCase());

  // ── Detect restrictions ────────────────────────────────────────────────
  const activeRestrictions = RESTRICTION_CARDS.filter(r =>
    allCardNames.includes(r.name.toLowerCase())
  );

  // Check for split second on the stack
  const splitSecondOnStack = stack.some(entry => {
    const cd = findCardData(cardData, entry.spell);
    return cd?.keywords?.map(k => k.toLowerCase()).includes('split second') ||
           cd?.oracle_text?.toLowerCase().includes('split second');
  });

  // ── Categorize what the active player can do at instant speed ──────────
  const canCast = [];
  const activatableAbilities = [];
  const warnings = [];
  const notes = [];

  if (splitSecondOnStack) {
    warnings.push({ type: 'split_second', message: SPLIT_SECOND_NOTE });
    return { canCast: [], activatableAbilities: [], restrictions: activeRestrictions, warnings, notes, splitSecondOnStack: true };
  }

  // Spells in hand
  for (const cardName of myHand) {
    const cd = findCardData(cardData, cardName);
    if (!cd) {
      notes.push(`Could not look up "${cardName}" — add it to see its instant-speed eligibility.`);
      continue;
    }

    const types = (cd.type_line ?? '').toLowerCase();
    const keywords = (cd.keywords ?? []).map(k => k.toLowerCase());
    const isInstant = types.includes('instant');
    const hasFlash = keywords.includes('flash');

    if (isInstant || hasFlash) {
      const restricted = getRestriction(cd, activeRestrictions, actionsThisTurn, priority);
      canCast.push({
        name: cd.name,
        type: isInstant ? 'Instant' : 'Flash permanent',
        manaCost: cd.mana_cost ?? '',
        oracleText: cd.oracle_text ?? '',
        restriction: restricted,
      });
    }
  }

  // Activated abilities of MY permanents
  for (const permanent of myBattlefield) {
    const cd = findCardData(cardData, permanent.name);
    if (!cd) continue;

    const abilities = extractActivatedAbilities(cd.oracle_text ?? '');
    for (const ability of abilities) {
      const isTapAbility = ability.cost.includes('{T}') || ability.cost.includes('[T]');
      if (isTapAbility && permanent.tapped) continue; // already tapped

      const artifactRestricted = activeRestrictions.find(r => r.effect === 'no_artifact_abilities');
      if (artifactRestricted && (cd.type_line ?? '').toLowerCase().includes('artifact')) {
        activatableAbilities.push({
          source: cd.name,
          cost: ability.cost,
          effect: ability.effect,
          blocked: true,
          blockedBy: artifactRestricted.name,
        });
        continue;
      }

      activatableAbilities.push({
        source: cd.name,
        cost: ability.cost,
        effect: ability.effect,
        blocked: false,
        blockedBy: null,
      });
    }
  }

  // ── Restriction summaries ─────────────────────────────────────────────
  for (const r of activeRestrictions) {
    notes.push(`⚠️ ${r.name} is on the battlefield: ${r.description}`);
  }

  // Helpful stack context notes
  for (const entry of stack) {
    const target = entry.target;
    if (!target) continue;

    const myCard = myBattlefield.find(p => p.name.toLowerCase() === target.toLowerCase());
    if (myCard) {
      const saveOptions = canCast.filter(c =>
        (c.oracleText.toLowerCase().includes('hexproof') ||
         c.oracleText.toLowerCase().includes('protection') ||
         c.oracleText.toLowerCase().includes('indestructible') ||
         c.oracleText.toLowerCase().includes('+') ||
         c.oracleText.toLowerCase().includes('counter target'))
      );
      if (saveOptions.length) {
        notes.push(
          `"${entry.spell}" targets your ${myCard.name}. Possible responses: ${saveOptions.map(c => c.name).join(', ')}`
        );
      }
    }
  }

  return { canCast, activatableAbilities, restrictions: activeRestrictions, warnings, notes, splitSecondOnStack: false };
}

// ── Helpers ───────────────────────────────────────────────────────────────

function findCardData(cardData, name) {
  if (!name) return null;
  return cardData.find(cd => cd.name.toLowerCase() === name.toLowerCase()) ?? null;
}

function getRestriction(card, activeRestrictions, actionsThisTurn, priority) {
  for (const r of activeRestrictions) {
    if (r.effect === 'one_spell_per_turn') {
      const spellsCastThisTurn = actionsThisTurn.filter(a => /^cast /i.test(a)).length;
      if (spellsCastThisTurn >= 1) return `${r.name}: you've already cast a spell this turn`;
    }
    if (r.effect === 'opponents_sorcery_speed' && priority === 'opponent') {
      return `${r.name}: opponents can only act at sorcery speed`;
    }
    if (r.effect === 'one_nonartifact_per_turn') {
      const typeLine = (card.type_line ?? '').toLowerCase();
      const nonArtifactCast = actionsThisTurn.some(a => /^cast /i.test(a));
      if (nonArtifactCast && !typeLine.includes('artifact')) {
        return `${r.name}: already cast a nonartifact spell this turn`;
      }
    }
  }
  return null;
}

/**
 * Extract activated abilities from oracle text.
 * Activated abilities always follow the pattern: [Cost]: [Effect]
 */
function extractActivatedAbilities(oracleText) {
  const abilities = [];
  const lines = oracleText.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < line.length - 1) {
      const cost = line.slice(0, colonIdx).trim();
      const effect = line.slice(colonIdx + 1).trim();
      // Filter out reminder text and type-line artifacts
      if (cost.length < 60 && effect.length > 2 && !cost.startsWith('(')) {
        abilities.push({ cost, effect });
      }
    }
  }
  return abilities;
}
