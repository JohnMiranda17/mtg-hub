# MTG Hub — Developer & Extension Guide

Fan-made Magic: The Gathering toolkit. Single React + Vite app deployed to GitHub Pages at
`https://JohnMiranda17.github.io/mtg-hub/`.

---

## Current Tools

### Rules Reference (`/helper`)
Migrated from the standalone `mtg-helper` app. Covers:
- **105+ keywords** across 11 categories (evasion, combat, protection, speed, activated/triggered abilities, creature roles, alternative costs, tokens/counters, mechanics, keyword actions)
- **Turn structure** — 5 phases, 10 steps with descriptions and tips
- **Card types** — 8 permanent/non-permanent types + 4 supertypes
- **Concepts** — 5 mana colors, 8 game zones, stack & priority rules, combat rules, deck-building basics

All data lives in `src/data/` as plain JS arrays — no external API calls. Add new keywords by appending to the relevant array in `src/data/keywords.js`.

### Collection Tracker (`/collection`)
- Add cards one at a time via Scryfall autocomplete (fuzzy name match)
- Tracks: quantity, condition (NM/LP/MP/HP/DMG), foil flag, Scryfall ID, set, price at time of add
- Persisted to `localStorage` under key `mtg-hub:collection`
- Sort by name, date added, price, or quantity; filter by name
- Shows estimated collection value (sum of stored prices × quantity)

**Current limitation:** Cards are added one at a time. There is no bulk import or file import of any kind yet. See [Adding Import Support](#adding-import-support) below.

### Price Tracker (`/prices`)
- Search any card by name → fetches live prices from Scryfall (USD normal, USD foil, EUR normal, EUR foil)
- Includes TCGPlayer buy link and Scryfall card page link
- Watchlist persisted to `localStorage` under key `mtg-hub:watchlist`
- Watchlist rows have a one-click "Refresh" button to re-fetch the latest price

**Current limitation:** Prices are stored once when added. There is no automatic refresh or price history tracking.

### Board State Analyzer (`/board`)
- Accepts free-text board state description
- Looks up every named card on Scryfall (parallel, best-effort — unknown cards are skipped)
- Detects: Split Second on stack, 15 hard-coded restriction cards (Teferi, Grand Abolisher, Rule of Law, Drannith Magistrate, Arcane Laboratory, etc.), instant-speed castable spells from hand, activated abilities parseable from oracle text
- Shows active restrictions, available actions, blocked actions, and context notes
- "Who has priority" toggle affects which restrictions apply

**Current limitation:** Image input is not yet implemented. Text input only. See [Future: Image Input](#future-image-input).

---

## Architecture

```
src/
  App.jsx              — BrowserRouter wrapper with basename for GitHub Pages
  App.css              — All styles (single file, CSS custom properties)
  index.css            — 3-line reset only
  main.jsx             — ReactDOM.createRoot entry point

  components/
    Nav.jsx            — Sticky nav with NavLink routing
    CardSearchInput.jsx — Reusable Scryfall autocomplete (debounced, dropdown)
    helper/            — Rules Reference sub-components (SearchBar, KeywordCard,
                         TurnGuide, CardTypesGuide, ConceptsGuide)

  pages/
    Hub.jsx            — Landing page with tool cards
    Helper.jsx         — 8-tab wrapper around helper sub-components
    Collection.jsx     — Collection tracker page
    Prices.jsx         — Price tracker page
    BoardState.jsx     — Board state analyzer page

  data/
    keywords.js        — 105+ keyword entries [{name, category, type, reminder, description, tip}]
    turnStructure.js   — Turn phases and steps
    cardTypes.js       — Card types and supertypes
    concepts.js        — Mana colors, zones, stack rules, combat rules, deck building
    restrictionCards.js — 15 restriction card definitions for board analyzer

  hooks/
    useCollection.js   — localStorage CRUD for collection (key: mtg-hub:collection)
    usePriceWatchlist.js — localStorage CRUD for watchlist (key: mtg-hub:watchlist)

  utils/
    scryfall.js        — Scryfall API wrapper (autocomplete, named lookup, ID lookup,
                         search, price formatter, image URL helper). In-memory cache.
    boardParser.js     — Parses free-text board state into structured object
    interactionEngine.js — Analyzes parsed board + Scryfall card data → interaction report
```

---

## Scryfall API Reference

All card data comes from the [Scryfall API](https://scryfall.com/docs/api) (free, no API key needed).

Key endpoints used:

| Endpoint | Purpose |
|---|---|
| `GET /cards/autocomplete?q=<name>` | Returns up to 20 name suggestions |
| `GET /cards/named?fuzzy=<name>` | Fuzzy card lookup by name |
| `GET /cards/<id>` | Exact card by Scryfall UUID |
| `GET /cards/<set>/<collector_number>` | Exact card by set code + collector number |
| `GET /cards/search?q=<query>` | Full Scryfall search syntax |

Rate limit: Scryfall asks for max 10 req/sec. The in-memory cache in `scryfall.js` deduplicates repeat lookups within a session. For bulk imports, add a delay between batches.

---

## Adding Import Support

**Currently:** The collection tracker has no import feature. Cards are added one at a time.

### Formats to support

#### 1. Moxfield / Universal Text Format

The most common decklist and collection format across MTG tools:

```
1 Lightning Bolt (M11) 115
2 Counterspell (TSB) 2
4 Forest
```

Pattern: `<qty> <card name> (<SET>) <collector number>`  
The set code + collector number are optional. Without them, Scryfall defaults to the most recent printing.

Foil variant (bulk mode adds a `*F*` flag):
```
1 Lightning Bolt (M11) *F* 115
```

Sideboard separator options:
```
// simple blank line before SB lines
SB: 1 Engineered Explosives (TSR) 123

// or section header
Sideboard:
1 Engineered Explosives (TSR) 123
```

#### 2. Moxfield CSV

Moxfield's collection CSV format (header names are case-sensitive and required):

```csv
Count,Name,Edition,Condition,Language,Foil,Tag
1,Lightning Bolt,M11,NM,English,,
2,Counterspell,TSB,SP,English,foil,
1,Sol Ring,pfdn,MP,English,etched,
```

| Column | Values |
|---|---|
| Count | Integer |
| Name | Card name (must match Scryfall) |
| Edition | Set code (e.g. `M11`, `TSB`, `LCI`) |
| Condition | `NM`, `LP`, `MP`, `HP` or full text equivalents |
| Language | `English`, `Japanese`, `Korean`, etc. |
| Foil | `foil`, `etched`, or empty |
| Tag | Free text, currently unused |

#### 3. MTG Arena Format

Used by MTG Arena and many other tools:

```
4 Lightning Bolt (M11) 115
2 Island (ZEN) 230

// or just names and quantities:
4 Lightning Bolt
2 Island
```

Arena format optionally appends `(SET) COLLECTOR_NUMBER` — identical to Moxfield's text format.

#### 4. MTGO / Simple Format

Minimal format supported by most tools:

```
4 Lightning Bolt
2 Counterspell
10 Forest
```

### How to implement text import

1. Add an "Import" button to the Collection page that opens a textarea modal
2. Parse the pasted text with a function like:

```js
function parseTextImport(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const results = [];

  for (const line of lines) {
    // Skip headers and comments
    if (/^(Sideboard|SB:|\/\/|#)/.test(line)) continue;

    // Match: qty name (SET) *F*? collector_number?
    const m = line.match(
      /^(\d+)x?\s+(.+?)(?:\s+\(([A-Za-z0-9]+)\))?(?:\s+\*F\*)?(?:\s+(\d+))?$/
    );
    if (!m) continue;

    results.push({
      qty:       parseInt(m[1], 10),
      name:      m[2].trim(),
      setCode:   m[3] || null,
      collNum:   m[4] || null,
      foil:      /\*F\*/.test(line),
    });
  }
  return results;
}
```

3. For each parsed entry, fetch from Scryfall:
   - If `setCode` + `collNum` present: `GET /cards/<setCode>/<collNum>` (exact printing)
   - Otherwise: `GET /cards/named?fuzzy=<name>` (best match)
4. Batch requests with a small delay (e.g., 10 cards per second) to respect Scryfall's rate limit
5. Add successfully looked-up cards to the collection via `useCollection`'s `addCard`

### How to implement CSV import

```js
function parseCsvImport(csvText) {
  const [headerLine, ...rows] = csvText.trim().split('\n');
  const headers = headerLine.split(',').map(h => h.trim());

  return rows.map(row => {
    const cols = row.split(',').map(c => c.trim());
    const obj  = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? '']));
    return {
      qty:       parseInt(obj.Count, 10) || 1,
      name:      obj.Name,
      setCode:   obj.Edition || null,
      condition: normCondition(obj.Condition),
      language:  obj.Language || 'English',
      foil:      obj.Foil === 'foil',
      etched:    obj.Foil === 'etched',
    };
  });
}

function normCondition(raw = '') {
  const map = { 'NM': 'NM', 'near mint': 'NM', 'LP': 'LP', 'lightly played': 'LP',
                'SP': 'LP', 'MP': 'MP', 'played': 'MP', 'HP': 'HP',
                'heavily played': 'HP', 'DMG': 'DMG' };
  return map[raw.toLowerCase()] ?? 'NM';
}
```

### Specific printing lookup on Scryfall

When a set code + collector number are known, use the exact endpoint:

```
GET https://api.scryfall.com/cards/m11/115
```

This returns the exact Revised-era printing of Lightning Bolt from M11, not the most recent reprint. This is how you preserve print-specific data (art, set symbol, frame era) that collectors care about.

The `getCardById` function in `src/utils/scryfall.js` already handles ID-based lookup. Add a `getCardBySetNumber(set, number)` function:

```js
export async function getCardBySetNumber(set, number) {
  return sfetch(`${BASE}/cards/${set.toLowerCase()}/${number}`);
}
```

---

## How to Extend Each Tool

### Add a keyword to Rules Reference

Open `src/data/keywords.js` and append to the relevant category array:

```js
{
  name: 'Horsemanship',
  category: 'Evasion',
  type: 'Keyword Ability',
  reminder: 'This creature can only be blocked by creatures with horsemanship.',
  description: 'A Portal-era evasion ability analogous to flying. ...',
  tip: 'Portal sets only — rarely appears in Modern-legal formats.',
}
```

### Add a restriction card to the Board Analyzer

Open `src/data/restrictionCards.js` and add to the exported array:

```js
{
  name: 'Overwhelming Splendor',
  effect: 'opponents_sorcery_speed',
  description: 'Opponents can only activate abilities at sorcery speed.',
  affects: 'opponent',
  severity: 'hard',
}
```

Effect types currently recognized by `src/utils/interactionEngine.js`:
- `opponents_sorcery_speed` — opponent can't activate abilities at instant speed
- `opponent_no_spells_your_turn` — opponent can't cast spells on your turn
- `one_spell_per_turn` — each player limited to one spell per turn
- `no_artifact_abilities` — no artifact activated abilities
- `only_one_spell` — only one spell can be cast per turn globally

### Add a new page/tool

1. Create `src/pages/YourTool.jsx`
2. Add a route in `src/App.jsx`:
   ```jsx
   <Route path="/yourtool" element={<YourTool />} />
   ```
3. Add a `NavLink` in `src/components/Nav.jsx`
4. Add a card to the hub grid in `src/pages/Hub.jsx` with a `--tool-color` CSS variable

### Change the color theme for a page

Each page sets `--page-color` on its header element. Tool cards on the hub use `--tool-color`:

| Tool | Color |
|---|---|
| Rules Reference | `#c9a84c` (gold) |
| Collection Tracker | `#4a8fc9` (blue) |
| Price Tracker | `#4ac97a` (green) |
| Board State Analyzer | `#c9604a` (red) |

---

## Future: Image Input for Board Analyzer

The board analyzer is designed so the analysis pipeline (`parseBoardState` → `analyzeInteractions`) is decoupled from how the board state is entered. The text parser in `src/utils/boardParser.js` takes a string; image input would simply produce that same string differently.

Planned approach using the Claude API (Anthropic SDK):

1. User uploads a photo of their board (drag-and-drop or file picker)
2. Send the image to `claude-opus-4-8` with a prompt:
   > "Identify all Magic: The Gathering cards visible in this image. List them by zone: MY BATTLEFIELD, OPP BATTLEFIELD, MY HAND if visible. Use the format: `- Card Name (tapped/untapped/attacking)`. Only list card names you can confidently identify."
3. Claude returns structured text → feed directly into `parseBoardState()`
4. Rest of the pipeline runs unchanged

Requires:
- An Anthropic API key (not included in client-side deployments — needs a small backend or edge function, or the user provides their own key via a settings panel)
- `@anthropic-ai/sdk` npm package
- A settings page to store the API key in `localStorage`

---

## Data Persistence

All data is stored in the browser's `localStorage`. There is no server-side storage or cross-device sync.

| Key | Contents |
|---|---|
| `mtg-hub:collection` | Array of collection card objects |
| `mtg-hub:watchlist` | Array of watchlist card objects |

To migrate to cross-device storage (e.g., Supabase), replace the `localStorage` calls in `src/hooks/useCollection.js` and `src/hooks/usePriceWatchlist.js` with API calls. The hook interfaces (`addCard`, `removeCard`, `updateCard`, etc.) can stay the same — only the storage layer changes.

---

## Deployment

Deployed automatically via GitHub Actions on every push to `main`.
Workflow: `.github/workflows/deploy.yml` (Node 22, `npm ci`, `npm run build`, upload `dist/`).

To deploy manually: `npm run build` → push `dist/` contents to the `gh-pages` branch, or trigger the workflow via GitHub Actions → "Run workflow".

Live URL: `https://JohnMiranda17.github.io/mtg-hub/`
