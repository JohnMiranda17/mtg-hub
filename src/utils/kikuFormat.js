export const KIKU_MAGIC   = 'kiku-mtg';
export const KIKU_VERSION = 1;

export function buildKiku({ name, boardText, priority }) {
  return {
    format:    KIKU_MAGIC,
    version:   KIKU_VERSION,
    name:      name || 'MTG Game',
    createdAt: new Date().toISOString(),
    priority:  priority ?? 'me',
    boardText: boardText ?? '',
  };
}

export function kikuFilename(name) {
  const slug = (name || 'MTG-Game').trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '');
  const date = new Date().toISOString().slice(0, 10);
  return `kiku-${slug}-${date}.kiku`;
}

export function downloadKiku(data) {
  const filename = kikuFilename(data.name);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseKiku(file) {
  const text = await file.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('File is not valid JSON.'); }

  // Native mtg-hub board state format
  if (data.format === KIKU_MAGIC) {
    return {
      name:      data.name      ?? 'MTG Game',
      boardText: data.boardText ?? '',
      priority:  data.priority  ?? 'me',
      createdAt: data.createdAt ?? null,
      version:   data.version   ?? 1,
    };
  }

  // External card game tracker format (lobbyName, roomId, visitors, cards)
  if (data.lobbyName != null && data.cards != null) {
    return {
      name:      data.lobbyName ?? 'MTG Game',
      boardText: convertExternalKiku(data),
      priority:  'me',
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : null,
      version:   1,
    };
  }

  throw new Error('Not a recognised .kiku file format.');
}

function convertExternalKiku(data) {
  const myId = data.hostId ?? Object.keys(data.visitors ?? {})[0];
  const myPlayer = data.visitors?.[myId];
  const cards = Object.values(data.cards ?? {});

  const myBoard   = cards.filter(c => c.zone === 'battlefield' && c.controller === myId && !c.isToken);
  const oppBoard  = cards.filter(c => c.zone === 'battlefield' && c.controller !== myId && !c.isToken);
  const hand      = cards.filter(c => c.zone === 'hand'      && c.originalOwner === myId);
  const graveyard = cards.filter(c => c.zone === 'graveyard' && c.originalOwner === myId);
  const exile     = cards.filter(c => c.zone === 'exile'     && c.originalOwner === myId);

  const lines = [];

  if (myBoard.length > 0) {
    lines.push('MY BATTLEFIELD');
    myBoard.forEach(c => lines.push(`  - ${c.name} (${c.tapped ? 'tapped' : 'untapped'})`));
    lines.push('');
  }

  if (oppBoard.length > 0) {
    lines.push('OPP BATTLEFIELD');
    oppBoard.forEach(c => lines.push(`  - ${c.name} (${c.tapped ? 'tapped' : 'untapped'})`));
    lines.push('');
  }

  if (hand.length > 0) {
    lines.push('MY HAND');
    hand.forEach(c => lines.push(`  - ${c.name}`));
    lines.push('');
  }

  if (graveyard.length > 0) {
    lines.push('MY GRAVEYARD');
    graveyard.forEach(c => lines.push(`  - ${c.name}`));
    lines.push('');
  }

  if (exile.length > 0) {
    lines.push('EXILE');
    exile.forEach(c => lines.push(`  - ${c.name}`));
    lines.push('');
  }

  const myLife = myPlayer?.life;
  if (myLife != null) lines.push(`ACTIONS THIS TURN\n  - Life total: ${myLife}`);

  return lines.join('\n').trim();
}
