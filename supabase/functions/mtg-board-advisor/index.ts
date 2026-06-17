import Anthropic from 'npm:@anthropic-ai/sdk@^0.30';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { boardText, priority } = await req.json();

    const client = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
    });

    const hasPriority = priority === 'me';
    const prompt = `Analyze this Magic: The Gathering board state and give strategic advice for the player described as "me". ${hasPriority ? 'I currently have priority.' : 'My opponent currently has priority.'}

${boardText}

Give concise, actionable advice:
1. Best immediate play or response available right now
2. Key threats to be aware of
3. Strategic priority for the next 1-2 turns

Be specific about card names and interactions. Keep it under 200 words.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: `You are an expert Magic: The Gathering strategic advisor. Give clear, specific, practical advice. Reference card names directly. Prioritize the most impactful play.`,
      messages: [{ role: 'user', content: prompt }],
    });

    const advice =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
