/**
 * Parses the MTG Hub board state text format into a structured object.
 *
 * Format:
 *   MY BATTLEFIELD
 *     - Birds of Paradise (untapped)
 *     - Lightning Angel (tapped)
 *   OPP BATTLEFIELD
 *     - Tarmogoyf (attacking)
 *   MY HAND
 *     - Lightning Bolt
 *   MY GRAVEYARD
 *     - Counterspell
 *   STACK (bottom → top)
 *     1. Doom Blade targeting Birds of Paradise
 *   MANA: WWUR
 *   ACTIONS THIS TURN
 *     - Cast Lightning Bolt
 *     - Attacked with Lightning Angel
 */

export function parseBoardState(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const state = {
    myBattlefield: [],
    oppBattlefield: [],
    myHand: [],
    myGraveyard: [],
    stack: [],
    mana: '',
    actionsThisTurn: [],
    parseErrors: [],
  };

  let section = null;

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (upper.startsWith('MY BATTLEFIELD') || upper.startsWith('MY SIDE')) {
      section = 'myBattlefield'; continue;
    }
    if (upper.startsWith('OPP BATTLEFIELD') || upper.startsWith('OPPONENT') || upper.startsWith('OPP SIDE')) {
      section = 'oppBattlefield'; continue;
    }
    if (upper.startsWith('MY HAND') || upper.startsWith('HAND')) {
      section = 'myHand'; continue;
    }
    if (upper.startsWith('MY GRAVEYARD') || upper.startsWith('GRAVEYARD')) {
      section = 'myGraveyard'; continue;
    }
    if (upper.startsWith('STACK')) {
      section = 'stack'; continue;
    }
    if (upper.startsWith('MANA:') || upper.startsWith('MANA AVAILABLE:')) {
      state.mana = line.replace(/^mana[: available]*/i, '').trim().toUpperCase();
      section = null; continue;
    }
    if (upper.startsWith('ACTIONS THIS TURN') || upper.startsWith('TURN ACTIONS')) {
      section = 'actionsThisTurn'; continue;
    }

    if (!section) continue;

    // Strip leading bullet/number markers
    const clean = line.replace(/^[-*•]|\d+\./, '').trim();
    if (!clean) continue;

    if (section === 'stack') {
      state.stack.push(parseStackEntry(clean));
    } else if (section === 'myBattlefield' || section === 'oppBattlefield') {
      state[section].push(parsePermanent(clean));
    } else {
      state[section].push(clean);
    }
  }

  return state;
}

function parsePermanent(text) {
  // "Birds of Paradise (untapped, 0/1)" or "Tarmogoyf (attacking, 4/5)"
  const match = text.match(/^(.+?)\s*\(([^)]*)\)$/);
  const name = match ? match[1].trim() : text;
  const flags = match ? match[2].toLowerCase() : '';
  return {
    name,
    tapped: flags.includes('tapped') && !flags.includes('untapped'),
    untapped: flags.includes('untapped') || !flags.includes('tapped'),
    attacking: flags.includes('attacking'),
    blocking: flags.includes('blocking'),
    raw: text,
  };
}

function parseStackEntry(text) {
  // "Doom Blade targeting Birds of Paradise" or "3. Lightning Bolt targeting opponent"
  const targetMatch = text.match(/^(.+?)\s+targeting\s+(.+)$/i);
  return {
    spell: targetMatch ? targetMatch[1].trim() : text,
    target: targetMatch ? targetMatch[2].trim() : null,
    raw: text,
  };
}
