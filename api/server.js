#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Routes
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.trim().length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    // Call Claude API to generate recipes
    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
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
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Chef Buddy API server is running on http://localhost:${port}`);
  console.log(`📝 API endpoint: POST http://localhost:${port}/api/generate-recipes`);
});
