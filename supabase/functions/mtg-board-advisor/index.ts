import Anthropic from 'npm:@anthropic-ai/sdk';
import { corsHeaders } from '../_shared/cors.ts';

const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

const SYSTEM = `You are an expert Magic: The Gathering player and judge. You analyze board states and give clear, actionable strategic advice.

The board state uses these sections:
- MY BATTLEFIELD / OPP BATTLEFIELD: permanents in play, with status (tapped/untapped/attacking)
- MY HAND: cards the user holds
- STACK: spells/abilities on the stack (bottom to top)
- MANA: mana currently available
- ACTIONS THIS TURN: what has already happened this turn

When analyzing:
1. Use search_card to look up oracle text for cards whose exact wording matters for interactions
2. Identify all instant-speed responses available (instants, flash permanents, activated abilities)
3. Flag dangerous interactions, hidden synergies, or common mistakes
4. Give a concrete recommended line of play with clear reasoning
5. Note any relevant timing constraints or state-based actions

Format your response with clear sections. Be specific — reference card names directly.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_card',
    description: "Look up a card's exact oracle text, type line, mana cost, power/toughness, and keywords from Scryfall.",
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Card name to look up' },
      },
      required: ['name'],
    },
  },
];

async function callTool(name: string, input: Record<string, string>): Promise<unknown> {
  if (name === 'search_card') {
    try {
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
        power: card.power ?? null,
        toughness: card.toughness ?? null,
      };
    } catch {
      return { error: 'Lookup failed' };
    }
  }
  return { error: 'Unknown tool' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { boardText, priority } = await req.json() as { boardText: string; priority: string };

    const priorityLabel =
      priority === 'me' ? 'You (the user) currently have priority.' : 'Your opponent currently has priority.';

    const userContent = `${priorityLabel}\n\nPlease analyze this board state and give me strategic advice:\n\n${boardText}`;

    const agentMessages: Anthropic.MessageParam[] = [{ role: 'user', content: userContent }];
    const MAX_TURNS = 8;

    for (let i = 0; i < MAX_TURNS; i++) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: SYSTEM,
        tools: TOOLS,
        messages: agentMessages,
      });

      if (response.stop_reason === 'end_turn') {
        const text = (response.content.find((b) => b.type === 'text') as Anthropic.TextBlock | undefined)?.text ?? '';
        return new Response(JSON.stringify({ advice: text }), {
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

    return new Response(JSON.stringify({ advice: 'Analysis could not be completed. Please try again.' }), {
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
