# ChefBuddy

Next.js + Tailwind application that lets users generate personalized recipes with Supabase-authenticated accounts and an Anthropic-powered chatbot.

## Getting started

```bash
npm install
```

Create a `.env.local` file with the following values (the Supabase keys must stay prefixed with `NEXT_PUBLIC_` because the client uses them):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-key
ANTHROPIC_MODEL=claude-3-haiku-20240307 # optional override
```

## Available scripts

- `npm run dev` – start the Next.js dev server (includes the serverless API route)
- `npm run build` – create an optimized production build for Vercel
- `npm run start` – run the production build locally
- `npm run lint` – lint the project with the Next + ESLint config
- `npm run typecheck` – run `tsc --noEmit`

Deploy to Vercel (or any platform that supports Next.js) after the build succeeds.
