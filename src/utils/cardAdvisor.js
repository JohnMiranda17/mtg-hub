export function analyzeCard(card) {
  const reasons = [];
  const oracle = (card.oracle_text ?? '').toLowerCase();
  const kws = (card.keywords ?? []).map(k => k.toLowerCase());
  const type = (card.type_line ?? '').toLowerCase();
  const cmc = card.cmc ?? 0;

  if (type.includes('instant')) {
    reasons.push({ icon: '⚡', title: 'Instant Speed', desc: "Playable on opponent's turn or in response to spells — keeps opponents guessing and maximizes flexibility." });
  } else if (kws.includes('flash')) {
    reasons.push({ icon: '⚡', title: 'Flash', desc: "Surprise play on opponent's turn — acts like an instant while being a permanent." });
  }

  if (kws.includes('flying')) {
    reasons.push({ icon: '🦅', title: 'Flying', desc: 'Evades ground creatures — reliably connects for damage or combat trigger payoffs.' });
  }
  if (kws.includes('menace')) {
    reasons.push({ icon: '👁️', title: 'Menace', desc: 'Requires two blockers — often goes unblocked in multiplayer and two-player games.' });
  }
  if (kws.includes('trample')) {
    reasons.push({ icon: '🐘', title: 'Trample', desc: 'Excess damage bleeds through blockers to the player — great for closing out games.' });
  }
  if (oracle.includes("can't be blocked")) {
    reasons.push({ icon: '👻', title: 'Unblockable', desc: 'Guaranteed combat damage — ideal for triggered "deals combat damage to a player" abilities.' });
  }
  if (kws.includes('haste')) {
    reasons.push({ icon: '🚀', title: 'Haste', desc: 'Attacks immediately the turn it enters — applies pressure without giving opponents a turn to prepare.' });
  }
  if (kws.includes('hexproof') || kws.includes('shroud')) {
    reasons.push({ icon: '🛡️', title: 'Hexproof', desc: "Cannot be targeted by opponent's spells — dodges most removal and bounces." });
  }
  if (kws.some(k => k.startsWith('ward'))) {
    reasons.push({ icon: '🛡️', title: 'Ward', desc: 'Opponents pay an extra cost to target it — significantly slows down removal.' });
  }
  if (kws.includes('indestructible')) {
    reasons.push({ icon: '💎', title: 'Indestructible', desc: "Can't be destroyed by damage or \"destroy\" effects — extremely resistant to removal." });
  }
  if (oracle.includes('draw') && (oracle.includes('a card') || oracle.includes('cards'))) {
    reasons.push({ icon: '📚', title: 'Card Draw', desc: 'Replaces itself or draws more — card advantage is one of the most powerful effects in the game.' });
  }
  if (kws.includes('lifelink')) {
    reasons.push({ icon: '❤️', title: 'Lifelink', desc: 'Gains life equal to damage dealt — extends survival and synergizes with lifegain payoffs.' });
  }
  if (
    (oracle.includes('add {') && oracle.includes('mana')) ||
    (oracle.includes('search your library') && oracle.includes('land') && oracle.includes('put it'))
  ) {
    reasons.push({ icon: '🌿', title: 'Mana Ramp', desc: 'Accelerates your mana — lets you cast bigger spells ahead of schedule.' });
  }
  if (oracle.includes('destroy target') || oracle.includes('exile target')) {
    reasons.push({ icon: '🎯', title: 'Removal', desc: 'Answers threats permanently — essential interaction in any deck.' });
  }
  if (oracle.includes('create') && oracle.includes('token')) {
    reasons.push({ icon: '🐝', title: 'Token Maker', desc: 'Multiple bodies from one card — great for go-wide strategies and sacrifice synergies.' });
  }
  if (kws.some(k => ['flashback', 'escape', 'unearth', 'disturb', 'retrace', 'jump-start'].includes(k))) {
    reasons.push({ icon: '⚰️', title: 'Graveyard Value', desc: 'Usable from the graveyard — resilient and hard to permanently answer.' });
  }
  if (oracle.includes('+1/+1 counter')) {
    reasons.push({ icon: '⬆️', title: 'Counter Synergy', desc: 'Grows over time with +1/+1 counters — synergizes with proliferate and counter-matters effects.' });
  }
  if (type.includes('creature') && card.power) {
    const pow = parseInt(card.power);
    if (!isNaN(pow) && pow >= 5) {
      reasons.push({ icon: '💪', title: `${card.power}/${card.toughness} Threat`, desc: 'A serious board presence that demands an immediate answer or will end the game quickly.' });
    }
  }
  if (type.includes('creature') && cmc <= 2 && reasons.length < 3) {
    reasons.push({ icon: '💨', title: `${cmc || 1}-Mana Efficiency`, desc: `Comes down on turn ${cmc || 1} — shapes the board early and stays on curve.` });
  }

  return reasons.slice(0, 5);
}

export function getSynergyTags(card) {
  const oracle = (card.oracle_text ?? '').toLowerCase();
  const kws = (card.keywords ?? []).map(k => k.toLowerCase());
  const tags = [];

  if (oracle.includes('sacrifice')) tags.push('Sacrifice matters');
  if (oracle.includes('graveyard') || kws.some(k => ['flashback', 'escape', 'unearth', 'delve', 'disturb', 'retrace', 'jump-start'].includes(k))) {
    tags.push('Graveyard strategies');
  }
  if (oracle.includes('enters the battlefield') || oracle.includes('when this enters')) {
    tags.push('ETB effects');
  }
  if (oracle.includes('token')) tags.push('Token strategies');
  if (oracle.includes('+1/+1 counter')) tags.push('+1/+1 Counters');
  if (oracle.includes('draw') && oracle.includes('card')) tags.push('Spellslinger / Looting');
  if (kws.includes('flying')) tags.push('Flying tribal');
  if (oracle.includes('landfall') || (oracle.includes('whenever') && oracle.includes('land') && oracle.includes('enters'))) {
    tags.push('Landfall');
  }
  if (card.type_line?.includes('Legendary') || oracle.includes('legendary')) tags.push('Legendary matters');
  if (oracle.includes('whenever you gain life') || oracle.includes('each time you gain life')) tags.push('Lifegain matters');

  return tags;
}
