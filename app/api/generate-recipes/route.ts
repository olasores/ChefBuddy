import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-3-haiku-20240307';

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY missing in environment');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

    console.log(`🔮 Using Anthropic model: ${model}`);

    const message = await client.messages.create({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful chef assistant. Given the following ingredients, suggest 2-3 creative recipes that can be made with them. For each recipe, provide the name, a brief description, and main steps.\n\nIngredients: ${ingredients}\n\nPlease format your response clearly with recipe names as headings and steps as a numbered list.`,
        },
      ],
    });

    const recipes = message.content?.[0]?.type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate recipes', details: errorMessage },
      { status: 500 }
    );
  }
}
