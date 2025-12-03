import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-3-haiku-20240307';

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

type AnthropicTextBlock = {
  type: 'text';
  text: string;
};

const extractTextContent = (content: unknown): string => {
  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .filter((block): block is AnthropicTextBlock =>
      Boolean(block && typeof block === 'object' && 'type' in block && block.type === 'text' && typeof block.text === 'string')
    )
    .map((block) => block.text)
    .join('\n')
    .trim();
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter((entry) => entry.length > 0);
};

const normalizeRecipes = (rawText: string | undefined): GeneratedRecipe[] => {
  if (!rawText) {
    return [];
  }

  const sanitized = rawText
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();

  const ensureRecipeShape = (recipe: Partial<GeneratedRecipe>): GeneratedRecipe => ({
    title: recipe.title?.trim() || 'Chef Buddy Recipe',
    description: recipe.description?.trim() || 'Enjoy this custom recipe idea from Chef Buddy.',
    ingredients: toStringArray(recipe.ingredients),
    steps: toStringArray(recipe.steps),
  });

  try {
    const parsed = JSON.parse(sanitized);
    if (Array.isArray(parsed)) {
      return parsed.map(ensureRecipeShape);
    }
    if (parsed && typeof parsed === 'object') {
      const maybeRecipes = (parsed as { recipes?: unknown }).recipes;
      if (Array.isArray(maybeRecipes)) {
        return maybeRecipes.map(ensureRecipeShape);
      }
    }
  } catch (error) {
    console.warn('Failed to parse structured recipes, falling back to plain text', error);
  }

  return [
    {
      title: 'Chef Buddy Ideas',
      description: sanitized,
      ingredients: [],
      steps: [],
    },
  ];
};

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
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a helpful chef assistant. Given the following ingredients, respond ONLY with valid JSON in the shape {"recipes":[{"title":"string","description":"string","ingredients":["string"],"steps":["string"]}]}. Avoid markdown code fences. Include at least 2 distinct, creative recipe ideas and keep descriptions friendly but short.\n\nIngredients: ${ingredients}`,
        },
      ],
    });

    const rawText = extractTextContent(message.content);
    const recipes = normalizeRecipes(rawText);
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
