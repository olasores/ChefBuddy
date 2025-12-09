import { promises as fs } from 'fs';
import path from 'path';

export type RecipeDocument = {
  id: string;
  title: string;
  cuisine?: string;
  mealType?: string[];
  tags?: string[];
  ingredients: string[];
  instructions: string[];
  notes?: string;
  description?: string;
  nutrition?: Record<string, number>;
};

export type RetrievedRecipe = RecipeDocument & {
  ragScore: number;
};

let recipeCache: RecipeDocument[] | null = null;

const dataFilePath = path.join(process.cwd(), 'data', 'recipes.json');

const tokenize = (text: string): string[] => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

const tokenizeArray = (values?: string[]): string[] => {
  if (!values) {
    return [];
  }
  return values.flatMap((value) => tokenize(value));
};

const computeOverlapScore = (sourceTokens: string[], queryTokens: Set<string>, weight: number): number => {
  if (!sourceTokens.length || queryTokens.size === 0) {
    return 0;
  }
  let total = 0;
  for (const token of sourceTokens) {
    if (queryTokens.has(token)) {
      total += weight;
    }
  }
  return total;
};

const computeRecipeScore = (recipe: RecipeDocument, queryTokens: Set<string>, queryText: string): number => {
  let score = 0;
  score += computeOverlapScore(tokenize(recipe.title), queryTokens, 3);
  score += computeOverlapScore(tokenize(recipe.cuisine ?? ''), queryTokens, 2);
  score += computeOverlapScore(tokenizeArray(recipe.mealType), queryTokens, 1.5);
  score += computeOverlapScore(tokenizeArray(recipe.tags), queryTokens, 2);
  score += computeOverlapScore(tokenizeArray(recipe.ingredients), queryTokens, 2.5);
  score += computeOverlapScore(tokenizeArray(recipe.instructions), queryTokens, 1);

  const normalizedNotes = (recipe.notes ?? '').toLowerCase();
  if (normalizedNotes.includes(queryText)) {
    score += 1;
  }

  if (score === 0 && queryText.length > 0) {
    const haystack = [recipe.title, recipe.cuisine, ...(recipe.ingredients ?? []), ...(recipe.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (haystack.includes(queryText)) {
      score = 0.5;
    }
  }

  return Number(score.toFixed(4));
};

export const loadRecipeCorpus = async (): Promise<RecipeDocument[]> => {
  if (recipeCache) {
    return recipeCache;
  }

  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf-8');
    const parsed = JSON.parse(fileContents);
    if (Array.isArray(parsed)) {
      recipeCache = parsed.filter((entry): entry is RecipeDocument => Array.isArray(entry?.ingredients) && Array.isArray(entry?.instructions));
    } else {
      recipeCache = [];
    }
  } catch (error) {
    console.error('Failed to load recipe corpus for RAG:', error);
    recipeCache = [];
  }

  return recipeCache;
};

export const retrieveRecipesForQuery = async (query: string, limit = 3): Promise<RetrievedRecipe[]> => {
  const corpus = await loadRecipeCorpus();
  if (!query.trim()) {
    return corpus.slice(0, limit).map((recipe) => ({ ...recipe, ragScore: 0 }));
  }

  const queryText = query.trim().toLowerCase();
  const queryTokens = new Set(tokenize(queryText));

  const scored = corpus
    .map((recipe) => ({
      recipe,
      ragScore: computeRecipeScore(recipe, queryTokens, queryText),
    }))
    .filter(({ ragScore }) => ragScore > 0)
    .sort((a, b) => b.ragScore - a.ragScore);

  if (!scored.length) {
    return corpus.slice(0, limit).map((recipe) => ({ ...recipe, ragScore: 0 }));
  }

  return scored.slice(0, limit).map(({ recipe, ragScore }) => ({ ...recipe, ragScore }));
};

export const formatRecipesAsContext = (recipes: RecipeDocument[]): string => {
  if (!recipes.length) {
    return 'No reference recipes available.';
  }

  return recipes
    .map((recipe, index) => {
      const keyIngredients = recipe.ingredients.slice(0, 6).join(', ');
      const summarySteps = recipe.instructions.slice(0, 2).join(' ');
      return `Reference #${index + 1}: ${recipe.title}\nCuisine: ${recipe.cuisine ?? 'N/A'} | Meal type: ${(recipe.mealType ?? []).join(', ') || 'Any'}\nKey ingredients: ${keyIngredients}\nSummary: ${summarySteps}${recipe.notes ? `\nNotes: ${recipe.notes}` : ''}`;
    })
    .join('\n\n');
};