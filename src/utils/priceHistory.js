const PH_PREFIX  = 'mtg-hub:ph:';
const SYN_PREFIX = 'mtg-hub:syn:';
const MAX_SNAPS  = 90;

/* ── Price snapshots ─────────────────────────────────────────────────────── */
export function recordSnapshot(scryfallId, price, priceFoil) {
  if (!scryfallId || (price == null && priceFoil == null)) return;
  const history = getHistory(scryfallId);
  const today   = new Date().toISOString().slice(0, 10);
  const last    = history[history.length - 1];
  const snap    = { date: today, price: price ?? null, priceFoil: priceFoil ?? null };
  if (last?.date === today) {
    history[history.length - 1] = snap; // overwrite today's entry
  } else {
    history.push(snap);
  }
  localStorage.setItem(PH_PREFIX + scryfallId, JSON.stringify(history.slice(-MAX_SNAPS)));
}

export function getHistory(scryfallId) {
  try { return JSON.parse(localStorage.getItem(PH_PREFIX + scryfallId)) ?? []; }
  catch { return []; }
}

/* ── Synergy links (tracks which "source" card led someone to view this one) */
export function recordSynergyLink(sourceCard, targetScryfallId) {
  if (!sourceCard?.id || !targetScryfallId) return;
  const links = getSynergyLinks(targetScryfallId);
  if (links.some(l => l.scryfallId === sourceCard.id)) return;
  links.push({ name: sourceCard.name, scryfallId: sourceCard.id, linkedAt: Date.now() });
  localStorage.setItem(SYN_PREFIX + targetScryfallId, JSON.stringify(links.slice(-10)));
}

export function getSynergyLinks(scryfallId) {
  try { return JSON.parse(localStorage.getItem(SYN_PREFIX + scryfallId)) ?? []; }
  catch { return []; }
}
