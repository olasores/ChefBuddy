
import { formatRecipesAsContext, loadRecipeCorpus, retrieveRecipesForQuery } from '@/lib/rag/recipes';

describe('RAG recipe helpers', () => {
	it('ranks the lentil soup recipe highest for lentil-centric queries', async () => {
		const results = await retrieveRecipesForQuery('lentils, carrots, celery, garlic', 3);

		expect(results.length).toBeGreaterThan(0);
		expect(results[0].id).toBe('hearty-lentil-soup');
		expect(results[0].ragScore).toBeGreaterThan(0);
	});

	it('returns deterministic fallbacks with zero scores when no query tokens provided', async () => {
		const results = await retrieveRecipesForQuery('', 2);
		expect(results).toHaveLength(2);
		expect(results.every((recipe) => recipe.ragScore === 0)).toBe(true);
	});

	it('formats reference context with titles, cuisines, and ingredients', async () => {
		const corpus = await loadRecipeCorpus();
		const snippet = formatRecipesAsContext(corpus.slice(0, 1));

		expect(snippet).toContain('Reference #1');
		expect(snippet).toContain(corpus[0].title);
		expect(snippet).toContain('Cuisine:');
		expect(snippet).toContain('Key ingredients:');
	});
});
