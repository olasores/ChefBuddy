"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, ChefHat, Loader2, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

const formatTimestamp = (value: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

type SavedRecipe = Database['public']['Tables']['saved_recipes']['Row'];

type ViewState = 'loading-user' | 'loading-recipes' | 'ready';

export default function SavedRecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = React.useState<SavedRecipe[]>([]);
  const [viewState, setViewState] = React.useState<ViewState>('loading-user');
  const [error, setError] = React.useState('');
  const [userId, setUserId] = React.useState<string | null>(null);

  const loadRecipes = React.useCallback(
    async (id: string) => {
      setViewState('loading-recipes');
      setError('');

      const { data, error: recipesError } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (recipesError) {
        console.error('Error fetching saved recipes:', recipesError);
        setError(recipesError.message);
        setRecipes([]);
      } else {
        setRecipes(data ?? []);
      }

      setViewState('ready');
    },
    []
  );

  React.useEffect(() => {
    const fetchUser = async () => {
      setViewState('loading-user');
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data?.user) {
        router.push('/login');
        return;
      }

      setUserId(data.user.id);
      await loadRecipes(data.user.id);
    };

    void fetchUser();
  }, [router, loadRecipes]);

  const isLoading = viewState === 'loading-user' || viewState === 'loading-recipes';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm uppercase tracking-wide text-orange-500 font-semibold">
              <Bookmark className="w-4 h-4" />
              Saved Recipes
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">Your bookmarked dishes</h1>
            <p className="text-gray-600 mt-2">Revisit anything you loved from the chatbot.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-full hover:bg-orange-50"
            >
              ← Back to Dashboard
            </button>
            <button
              type="button"
              onClick={() => router.push('/chatbot')}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-full hover:shadow-lg flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              Generate New Recipe
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border-t-4 border-amber-400">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Collection</h2>
              <p className="text-sm text-gray-500">{recipes.length} saved recipe{recipes.length === 1 ? '' : 's'}</p>
            </div>
            <button
              type="button"
              onClick={() => userId && loadRecipes(userId)}
              disabled={!userId || isLoading}
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 px-4 py-2 rounded-full border border-orange-200 hover:bg-orange-50 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 rounded-2xl bg-orange-50 text-center text-orange-700 animate-pulse">
              Loading your saved dishes...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
          ) : recipes.length === 0 ? (
            <div className="p-6 bg-amber-50 rounded-2xl text-amber-800 text-sm">
              You haven&rsquo;t saved any recipes yet. Generate something delicious and tap “Save to Dashboard” to track it here.
            </div>
          ) : (
            <div className="space-y-5">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-orange-500">
                        Saved on {formatTimestamp(recipe.created_at) || 'Unknown date'}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                    </div>
                    {recipe.source_ingredients && (
                      <span className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                        Ingredients used: {recipe.source_ingredients}
                      </span>
                    )}
                  </div>

                  {recipe.description && <p className="mt-3 text-gray-700 text-sm">{recipe.description}</p>}

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Ingredients</p>
                      {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {recipe.ingredients.map((item, index) => (
                            <li key={`${recipe.id}-ingredient-${index}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No ingredients listed.</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Steps</p>
                      {recipe.steps && recipe.steps.length > 0 ? (
                        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                          {recipe.steps.map((step, index) => (
                            <li key={`${recipe.id}-step-${index}`}>{step}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-gray-500">No instructions saved.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
