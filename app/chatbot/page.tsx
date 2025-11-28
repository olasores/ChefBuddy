"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function ChatbotPage() {
  const router = useRouter();
  const [input, setInput] = React.useState('');
  const [recipes, setRecipes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes('');

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
      setRecipes(data.recipes);
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

              {recipes && (
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Recipe Suggestions:</h2>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{recipes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
