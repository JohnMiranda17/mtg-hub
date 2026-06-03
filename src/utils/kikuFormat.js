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
  if (data.format !== KIKU_MAGIC) throw new Error('Not a .kiku game file.');
  return {
    name:      data.name      ?? 'MTG Game',
    boardText: data.boardText ?? '',
    priority:  data.priority  ?? 'me',
    createdAt: data.createdAt ?? null,
    version:   data.version   ?? 1,
  };
}
