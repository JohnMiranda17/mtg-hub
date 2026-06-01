// Parses Moxfield / MTG Arena / MTGO text format and Moxfield CSV exports.
// Both return: [{ qty, name, setCode, collNum, foil, condition, sideboard }]

export function parseTextImport(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const results = [];
  let inSideboard = false;

  for (const line of lines) {
    // Section headers
    if (/^Sideboard[:\s]*$/i.test(line)) { inSideboard = true; continue; }
    if (/^(Deck|Commander|Companion)[:\s]/i.test(line)) { inSideboard = false; continue; }
    // Comments
    if (/^\/\//.test(line)) continue;

    let cleaned = line;
    let isSideboard = inSideboard;

    // Inline SB: prefix
    if (/^SB:\s*/i.test(line)) {
      cleaned = line.replace(/^SB:\s*/i, '');
      isSideboard = true;
    }

    // Detect foil before stripping flags
    const foil = /\*F\*/i.test(cleaned);
    cleaned = cleaned.replace(/\*[FA]\*/gi, '').replace(/\s+/g, ' ').trim();

    // qty [x] name [(SET)] [collNum]
    const m = cleaned.match(/^(\d+)x?\s+(.+?)(?:\s+\(([A-Za-z0-9]+)\))?(?:\s+(\d+[a-z]?))?$/i);
    if (!m) continue;

    results.push({
      qty:       parseInt(m[1], 10),
      name:      m[2].trim(),
      setCode:   m[3]?.toLowerCase() ?? null,
      collNum:   m[4] ?? null,
      foil,
      condition: 'NM',
      sideboard: isSideboard,
    });
  }
  return results;
}

export function parseCsvImport(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map(h => h.trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = splitCsvLine(lines[i]);
    const obj  = Object.fromEntries(headers.map((h, idx) => [h, (cols[idx] ?? '').trim()]));

    const qty  = parseInt(obj.Count ?? obj.Quantity ?? obj.Qty ?? '1', 10);
    const name = obj.Name ?? obj['Card Name'] ?? '';
    if (!name || isNaN(qty) || qty < 1) continue;

    results.push({
      qty,
      name,
      setCode:   (obj.Edition ?? obj.Set ?? '').toLowerCase() || null,
      collNum:   null,
      foil:      /^foil$/i.test(obj.Foil ?? ''),
      condition: normalizeCondition(obj.Condition ?? ''),
      sideboard: false,
    });
  }
  return results;
}

function splitCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(cur); cur = ''; continue; }
    cur += ch;
  }
  result.push(cur);
  return result;
}

export function normalizeCondition(raw = '') {
  const map = {
    'nm': 'NM', 'near mint': 'NM', 'mint': 'NM',
    'lp': 'LP', 'lightly played': 'LP', 'excellent': 'LP', 'sp': 'LP',
    'mp': 'MP', 'moderately played': 'MP', 'good': 'MP', 'played': 'MP',
    'hp': 'HP', 'heavily played': 'HP',
    'dmg': 'DMG', 'damaged': 'DMG', 'poor': 'DMG',
  };
  return map[raw.toLowerCase().trim()] ?? 'NM';
}
