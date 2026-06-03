# AI Agents in MTG Hub

Two AI-powered features were added to the app: a **Rules AI chatbot** and a **Board State AI Advisor**. Both use Claude (Sonnet 4.6) with tool use, routed through Supabase Edge Functions so your Anthropic API key is never exposed to the browser.

---

## What was built

| Feature | Route | Description |
|---|---|---|
| Rules AI | `/ai-rules` | Conversational chatbot for rules questions. Maintains chat history in-session. |
| Board State Advisor | `/board` (section) | One-shot strategic analysis of a board state, integrated below the existing rule-check. |

---

## Architecture

```
Browser (React)
    │
    │  supabase.functions.invoke(...)
    ▼
Supabase Edge Function  ←──── ANTHROPIC_API_KEY (secret, server-side)
    │
    │  client.messages.create(...)  ←── tools: [search_card, ...]
    ▼
Claude API (Sonnet 4.6)
    │
    │  stop_reason: "tool_use"  →  edge function calls Scryfall
    │  stop_reason: "end_turn"  →  return text to browser
    ▼
Response rendered in React
```

**Why Edge Functions?** The Anthropic API key must never be in frontend code — it would be visible in browser devtools and your bundle. Edge Functions run server-side in Supabase's infrastructure, receive your Supabase anon key (already public), and proxy calls to Claude securely.

---

## How the agent loop works

Claude doesn't call tools directly — you run a loop that passes tool results back in:

```
1. Send messages → Claude
2. Claude responds with stop_reason: "tool_use"  →  contains tool_use blocks
3. Execute the tools (Scryfall fetch)
4. Append assistant message + tool_result blocks → send back to Claude
5. Claude responds with stop_reason: "end_turn"  →  return the text
   (or loop repeats if Claude calls more tools, up to MAX_TURNS = 8)
```

This loop lives entirely inside the Edge Function. The frontend just sends a request and waits for the final text response.

---

## File structure

```
mtg-hub/
├── supabase/
│   └── functions/
│       ├── _shared/
│       │   └── cors.ts                  # Shared CORS headers
│       ├── mtg-rules-qa/
│       │   └── index.ts                 # Rules Q&A agent
│       └── mtg-board-advisor/
│           └── index.ts                 # Board state advisor agent
├── src/
│   └── pages/
│       ├── RulesChat.jsx                # Chat UI (new page)
│       └── BoardState.jsx               # Updated: AI Advisor section added
└── AI_AGENTS.md                         # This file
```

---

## Tools available to each agent

### mtg-rules-qa

| Tool | What it does |
|---|---|
| `search_card` | Fetches a card's oracle text, type, mana cost, and keywords by name (fuzzy match) |
| `search_cards_query` | Searches Scryfall by query syntax (e.g. `keyword:deathtouch t:creature`) |

### mtg-board-advisor

| Tool | What it does |
|---|---|
| `search_card` | Fetches full card data including power/toughness for battlefield context |

---

## Setup: deploying the Edge Functions

You need the [Supabase CLI](https://supabase.com/docs/guides/cli) installed.

```bash
# 1. Log in
supabase login

# 2. Link to your project (run from mtg-hub/)
supabase link --project-ref <your-project-ref>

# 3. Set your Anthropic API key as a secret
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# 4. Deploy both functions
supabase functions deploy mtg-rules-qa
supabase functions deploy mtg-board-advisor
```

Your project ref is in your Supabase dashboard URL: `https://supabase.com/dashboard/project/<ref>`.

---

## Extending the agents

**Add more tools** — Append to the `TOOLS` array in the edge function and add the corresponding handler to `callTool()`:

```typescript
{
  name: 'check_format_legality',
  description: 'Check if a card is legal in a given format',
  input_schema: {
    type: 'object',
    properties: {
      card_name: { type: 'string' },
      format: { type: 'string', description: 'e.g. standard, commander, legacy' },
    },
    required: ['card_name', 'format'],
  },
}
```

**Upgrade the model** — Change `model: 'claude-sonnet-4-6'` to `'claude-opus-4-8'` in either function for stronger reasoning on complex interactions. Opus is ~5x slower and more expensive per call.

**Persist chat history** — The Rules Q&A function is stateless; each call receives the full message history from the frontend. To persist conversations, save the `messages` array to a Supabase table after each turn and reload it on page mount.

---

## How the board state input format maps to the agent

The advisor receives the raw board state text (the same format the user types into the textarea) plus a `priority` string. Claude reads the section headers (`MY BATTLEFIELD`, `OPP BATTLEFIELD`, etc.) natively — no parsing needed on the backend. The agent decides which cards to look up based on what's in the text.

The existing rule-based `interactionEngine.js` still runs independently for the fast, structured analysis. The AI advisor is additive — it runs only when the user clicks **Get AI Advice**.
