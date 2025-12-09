

/** @jest-environment node */

// Emily add to route.test.ts
import Anthropic from '@anthropic-ai/sdk';
import { POST } from '@/app/api/generate-recipes/route';
import { formatRecipesAsContext, retrieveRecipesForQuery } from '@/lib/rag/recipes';

jest.mock('@anthropic-ai/sdk');
jest.mock('@/lib/rag/recipes');

const mockAnthropicCreate = jest.fn();

(Anthropic as unknown as jest.Mock).mockImplementation(() => ({
	messages: {
		create: mockAnthropicCreate,
	},
}));

const mockReferences = [
	{
		id: 'hearty-lentil-soup',
		title: 'Hearty Lentil Soup',
		ingredients: ['lentils', 'carrots'],
		instructions: ['step one', 'step two'],
		ragScore: 0.99,
	},
];

describe('generate-recipes API route', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockAnthropicCreate.mockReset();
		(retrieveRecipesForQuery as jest.Mock).mockResolvedValue(mockReferences);
		(formatRecipesAsContext as jest.Mock).mockReturnValue('Reference context');
		process.env.ANTHROPIC_API_KEY = 'test-key';
		process.env.ANTHROPIC_MODEL = 'claude-test';
	});

	it('rejects empty ingredient submissions with a 400 status', async () => {
		const request = new Request('http://localhost/api/generate-recipes', {
			method: 'POST',
			body: JSON.stringify({ ingredients: '   ' }),
		});

		const response = await POST(request);
		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({ error: 'Ingredients are required' });
	});

	it('returns normalized recipes and reference metadata on success', async () => {
		mockAnthropicCreate.mockResolvedValue({
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						recipes: [
							{
								title: 'Lentil Remix',
								description: 'Grounded idea',
								ingredients: ['lentils', 'garlic'],
								steps: ['Cook lentils', 'Serve'],
								inspiredBy: 'hearty-lentil-soup',
							},
						],
					}),
				},
			],
		});

		const request = new Request('http://localhost/api/generate-recipes', {
			method: 'POST',
			body: JSON.stringify({ ingredients: 'lentils, garlic' }),
		});

		const response = await POST(request);
		expect(response.status).toBe(200);

		const payload = await response.json();
		expect(payload.referenceRecipes).toEqual(mockReferences);
		expect(payload.recipes).toHaveLength(1);
		expect(payload.recipes[0]).toMatchObject({
			title: 'Lentil Remix',
			inspiredBy: 'hearty-lentil-soup',
			ingredients: ['lentils', 'garlic'],
			steps: ['Cook lentils', 'Serve'],
		});

		expect(retrieveRecipesForQuery).toHaveBeenCalledWith('lentils, garlic', 3);
		expect(formatRecipesAsContext).toHaveBeenCalledWith(mockReferences);
		expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
	});
});
