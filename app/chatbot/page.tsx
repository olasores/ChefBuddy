"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkCheck, BookmarkPlus, Info, Loader } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

type ReferenceRecipe = {
  id: string;
  title: string;
  cuisine?: string;
  mealType?: string[];
  tags?: string[];
  ingredients: string[];
  instructions: string[];
  notes?: string;
  ragScore?: number;
};

type GeneratedRecipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  inspiredBy?: string;
};

const normalizeString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

const normalizeList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter((entry) => entry.length > 0)
    : [];

const buildRecipes = (payload: unknown): GeneratedRecipe[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((recipe, index) => {
    const fallbackTitle = `Chef Buddy Recipe ${index + 1}`;
    const base = (recipe ?? {}) as Partial<GeneratedRecipe>;

    return {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `recipe-${Date.now()}-${index}`,
      title: normalizeString(base.title, fallbackTitle),
      description: normalizeString(base.description, 'Enjoy this custom recipe!'),
      ingredients: normalizeList(base.ingredients),
      steps: normalizeList(base.steps),
      inspiredBy: base.inspiredBy ? base.inspiredBy.trim() : undefined,
    };
  });
};

export default function ChatbotPage() {
  const router = useRouter();
  const [input, setInput] = React.useState('');
  const [recipes, setRecipes] = React.useState<GeneratedRecipe[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [saveFeedback, setSaveFeedback] = React.useState('');
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [savingReferenceId, setSavingReferenceId] = React.useState<string | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = React.useState<string[]>([]);
  const [savedReferenceIds, setSavedReferenceIds] = React.useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [lastGeneratedIngredients, setLastGeneratedIngredients] = React.useState('');
  const [referenceRecipes, setReferenceRecipes] = React.useState<ReferenceRecipe[]>([]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id ?? null);
    };

    void fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);
    setReferenceRecipes([]);
    setSaveFeedback('');

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: input }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to generate recipes';

        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } else {
          errorMessage = `Server error (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      const parsedRecipes = buildRecipes(data.recipes);
      const references = Array.isArray(data.referenceRecipes) ? (data.referenceRecipes as ReferenceRecipe[]) : [];
      setReferenceRecipes(references);

      if (!parsedRecipes.length) {
        throw new Error('No recipes returned. Please try again.');
      }

      setRecipes(parsedRecipes);
      setSavedRecipeIds([]);
      setSavedReferenceIds([]);
      setLastGeneratedIngredients(input.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const handleSaveRecipe = async (recipe: GeneratedRecipe) => {
    if (!currentUserId) {
      setError('Please log in to save recipes to your dashboard.');
      return;
    }

    setSavingId(recipe.id);
    setError('');
    setSaveFeedback('');

    try {
      const { error: insertError } = await supabase.from('saved_recipes').insert({
        user_id: currentUserId,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        source_ingredients: lastGeneratedIngredients || input.trim(),
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSavedRecipeIds((prev) => Array.from(new Set([...prev, recipe.id])));
      setSaveFeedback('Recipe saved to your dashboard!');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to save recipe right now.';
      setError(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveReferenceRecipe = async (reference: ReferenceRecipe) => {
    if (!currentUserId) {
      setError('Please log in to save recipes to your dashboard.');
      return;
    }

    setSavingReferenceId(reference.id);
    setError('');
    setSaveFeedback('');

    try {
      const { error: insertError } = await supabase.from('saved_recipes').insert({
        user_id: currentUserId,
        title: reference.title,
        description: reference.notes?.trim() || 'Saved from Chef Buddy pantry match.',
        ingredients: reference.ingredients ?? [],
        steps: reference.instructions ?? [],
        source_ingredients: lastGeneratedIngredients || input.trim(),
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSavedReferenceIds((prev) => Array.from(new Set([...prev, reference.id])));
      setSaveFeedback('Pantry recipe saved to your dashboard!');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to save pantry recipe right now.';
      setError(message);
    } finally {
      setSavingReferenceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-3xl w-full px-6 mx-auto">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mb-6 text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center justify-center">
            <div className="max-w-3xl w-full">
              <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                  Create Personal
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500"> Recipes</span>
                </h1>
              </div>

              <div className="mx-auto mt-6 bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl max-w-2xl">
                <div className="text-sm text-gray-600 mb-3 text-left">Type your ingredients here:</div>
                <div className="bg-white p-4 rounded-lg text-gray-700 border-2 border-orange-200">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. chicken, tomatoes, garlic"
                    className="w-full h-32 resize-none p-3 rounded-md border outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                {saveFeedback && <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">{saveFeedback}</div>}

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {loading ? 'Generating...' : 'Submit'}
                  </button>
                </div>
              </div>

              {referenceRecipes.length > 0 && (
                <div className="mt-10 max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-orange-600">
                    <span className="h-px w-8 bg-orange-300" />
                    Pantry Matches
                  </div>
                  <div className="space-y-4">
                    {referenceRecipes.map((reference) => {
                      const referenceSaved = savedReferenceIds.includes(reference.id);

                      return (
                        <div
                          key={reference.id}
                          className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-white rounded-2xl border border-orange-200 p-6 shadow-xl"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-white/80">
                                <Info className="w-4 h-4" /> Reference Recipe
                              </p>
                              <h3 className="text-2xl font-semibold mt-2">{reference.title}</h3>
                              <p className="text-sm text-white/80 mt-1">
                                {reference.cuisine ?? 'Any cuisine'} · {(reference.mealType ?? []).join(', ') || 'Flexible meal'}
                              </p>
                              {reference.tags?.length ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {reference.tags.map((tag) => (
                                    <span key={`${reference.id}-tag-${tag}`} className="text-[0.65rem] uppercase tracking-wide text-white bg-white/20 px-2 py-1 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-2 items-start sm:items-end">
                              {typeof reference.ragScore === 'number' && (
                                <span className="text-xs font-semibold text-orange-700 bg-white/90 rounded-full px-3 py-1">
                                  Match score {reference.ragScore.toFixed(2)}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSaveReferenceRecipe(reference)}
                                disabled={referenceSaved || savingReferenceId === reference.id}
                                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-white/80 text-orange-700 bg-white hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {referenceSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                                {referenceSaved ? 'Saved' : savingReferenceId === reference.id ? 'Saving...' : 'Save Pantry Recipe'}
                              </button>
                            </div>
                          </div>

                          <div className="mt-6 grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold text-white">Ingredients from library</h4>
                              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-white/90">
                                {reference.ingredients.map((ingredient, index) => (
                                  <li key={`${reference.id}-ref-ingredient-${index}`}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-white">Instructions from library</h4>
                              <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-white/90">
                                {reference.instructions.map((instruction, index) => (
                                  <li key={`${reference.id}-ref-step-${index}`}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          {reference.notes && (
                            <p className="mt-4 text-xs text-white/80">Note: {reference.notes}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {recipes.length > 0 && (
                <div className="mt-8 space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-slate-500">
                    <span className="h-px w-8 bg-slate-300" />
                    Anthropic Output
                  </div>
                  {!currentUserId && (
                    <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm">
                      Sign in to save your favorite recipes and view them later on the dashboard.
                    </div>
                  )}
                  {recipes.map((recipe) => {
                    const isSaved = savedRecipeIds.includes(recipe.id);

                    return (
                      <div key={recipe.id} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-orange-500">Anthropic Suggestion</p>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-2">{recipe.title}</h3>
                            <p className="text-gray-600 mt-1">{recipe.description}</p>
                            {recipe.inspiredBy && (
                              <p className="mt-2 text-xs text-gray-500 font-mono">
                                inspiredBy: <span className="text-orange-600">{recipe.inspiredBy}</span>
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSaveRecipe(recipe)}
                            disabled={isSaved || savingId === recipe.id}
                            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <BookmarkPlus className="w-4 h-4" />
                            )}
                            {isSaved ? 'Saved' : savingId === recipe.id ? 'Saving...' : 'Save to Dashboard'}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-6 sm:grid-cols-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Ingredients</h4>
                            {recipe.ingredients.length > 0 ? (
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {recipe.ingredients.map((ingredient, index) => (
                                  <li key={`${recipe.id}-ingredient-${index}`}>{ingredient}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No ingredient details provided.</p>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Steps</h4>
                            {recipe.steps.length > 0 ? (
                              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                                {recipe.steps.map((step, index) => (
                                  <li key={`${recipe.id}-step-${index}`}>{step}</li>
                                ))}
                              </ol>
                            ) : (
                              <p className="text-sm text-gray-500">No instructions available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
