import Anthropic from 'npm:@anthropic-ai/sdk';
import { corsHeaders } from '../_shared/cors.ts';

const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

const SYSTEM = `You are an expert Magic: The Gathering rules advisor with deep knowledge of the Comprehensive Rules (CR).

When answering:
- Use search_card to look up a card's exact oracle text when its wording matters for a ruling
- Cite relevant Comprehensive Rules sections when helpful (e.g. "CR 702.2 defines First Strike")
- Walk through complex interactions step by step, especially with the stack, layers, or replacement effects
- Be precise about timing: priority windows, triggered vs activated abilities, state-based actions
- Note when a ruling depends on format (Standard vs Commander vs Legacy) if relevant
- Keep answers clear and practical for players of all experience levels`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_card',
    description: "Look up a Magic: The Gathering card by name to get its exact oracle text, mana cost, type line, and keywords. Use this whenever a card's precise wording affects a ruling.",
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Card name — fuzzy matching is supported' },
      },
      required: ['name'],
    },
  },
  {
    name: 'search_cards_query',
    description: 'Search Scryfall for cards matching specific criteria. Useful for finding examples of a keyword or mechanic.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: "Scryfall search syntax (e.g. 'keyword:deathtouch t:creature cmc<=2')" },
      },
      required: ['query'],
    },
  },
];

async function callTool(name: string, input: Record<string, string>): Promise<unknown> {
  try {
    if (name === 'search_card') {
      const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(input.name)}`);
      if (!res.ok) return { error: `Card not found: "${input.name}"` };
      const card = await res.json();
      return {
        name: card.name,
        mana_cost: card.mana_cost ?? null,
        type_line: card.type_line,
        oracle_text:
          card.oracle_text ??
          (card.card_faces as Array<{ oracle_text: string }>)
            ?.map((f) => f.oracle_text)
            .join('\n---\n') ??
          null,
        keywords: card.keywords ?? [],
      };
    }

    if (name === 'search_cards_query') {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(input.query)}&order=name`,
      );
      if (!res.ok) return { error: 'No cards found for that query' };
      const data = await res.json();
      return (data.data as Array<{ name: string; type_line: string; oracle_text?: string }>)
        .slice(0, 6)
        .map((c) => ({ name: c.name, type_line: c.type_line, oracle_text: c.oracle_text ?? null }));
    }
  } catch {
    return { error: 'Tool call failed' };
  }
  return { error: 'Unknown tool' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as { messages: Anthropic.MessageParam[] };

    const agentMessages: Anthropic.MessageParam[] = [...messages];
    const MAX_TURNS = 8;

    for (let i = 0; i < MAX_TURNS; i++) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM,
        tools: TOOLS,
        messages: agentMessages,
      });

      if (response.stop_reason === 'end_turn') {
        const text = (response.content.find((b) => b.type === 'text') as Anthropic.TextBlock | undefined)?.text ?? '';
        return new Response(JSON.stringify({ reply: text }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const toolUses = response.content.filter((b) => b.type === 'tool_use') as Anthropic.ToolUseBlock[];
      if (toolUses.length === 0) break;

      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUses.map(async (tc) => ({
          type: 'tool_result' as const,
          tool_use_id: tc.id,
          content: JSON.stringify(await callTool(tc.name, tc.input as Record<string, string>)),
        })),
      );

      agentMessages.push({ role: 'assistant', content: response.content });
      agentMessages.push({ role: 'user', content: toolResults });
    }

    return new Response(JSON.stringify({ reply: 'Analysis could not be completed. Please try again.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
