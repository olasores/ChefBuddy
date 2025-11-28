import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.trim().length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    // Call Claude API to generate recipes
    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful chef assistant. Given the following ingredients, suggest 2-3 creative recipes that can be made with them. For each recipe, provide the name, a brief description, and main steps.

Ingredients: ${ingredients}

Please format your response clearly with recipe names as headings and steps as a numbered list.`,
        },
      ],
    });

    // Extract the text response from Claude
    const recipes = message.content[0].type === 'text' ? message.content[0].text : '';

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ 
      error: 'Failed to generate recipes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
