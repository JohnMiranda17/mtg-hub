import Anthropic from 'npm:@anthropic-ai/sdk';
import { corsHeaders } from '../_shared/cors.ts';

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

const SYSTEM = `You are analyzing Magic: The Gathering board photos. Extract all visible cards and output structured board state text in exactly this format — no extra explanation, just the formatted text:

MY BATTLEFIELD
- [Card Name] (tapped/untapped/attacking)

OPP BATTLEFIELD
- [Card Name] (tapped/untapped/attacking)

MY HAND
- [Card Name]

STACK
1. [Spell] targeting [Target]

MANA: [letters e.g. WWUR, omit if not visible]

Rules:
- Only include cards you can confidently identify by name
- Sideways cards are tapped, cards aimed at the opponent are attacking
- Omit MY HAND / STACK sections if not visible or empty
- Do not guess — skip any card you cannot clearly read`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { myImage, myMediaType, oppImage, oppMediaType } = await req.json();

    if (!myImage && !oppImage) {
      return new Response(JSON.stringify({ error: 'No images provided.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const content: Anthropic.MessageParam['content'] = [];

    if (myImage) {
      content.push({ type: 'text', text: 'MY SIDE OF THE BOARD:' });
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: (myMediaType ?? 'image/jpeg') as ImageMediaType, data: myImage },
      });
    }
    if (oppImage) {
      content.push({ type: 'text', text: "OPPONENT'S SIDE OF THE BOARD:" });
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: (oppMediaType ?? 'image/jpeg') as ImageMediaType, data: oppImage },
      });
    }

    content.push({ type: 'text', text: 'Output the structured board state text now:' });

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: 'user', content }],
    });

    const boardText = (msg.content.find(c => c.type === 'text') as Anthropic.TextBlock | undefined)?.text ?? '';

    return new Response(JSON.stringify({ boardText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
