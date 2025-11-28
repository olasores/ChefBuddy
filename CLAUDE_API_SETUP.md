# Claude API Integration - Setup Guide

## Prerequisites
- Anthropic API key (already in `.env.local`)
- Node.js 16+

## Installation

All dependencies have been installed. The new packages added are:
- `@anthropic-ai/sdk` - For Claude API calls
- `express` - Backend server
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `concurrently` - Run multiple processes

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:all
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Option 2: Run Separately
Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:api
```

### Option 3 Run FrontEnd and Backend 
npm run dev:all

## How It Works

1. User enters ingredients in the Chatbot page
2. Click "Submit" or press Ctrl+Enter
3. The request is sent to `http://localhost:3001/api/generate-recipes`
4. Claude API generates creative recipes based on the ingredients
5. Recipes are displayed below the input area

## API Endpoint

**POST** `/api/generate-recipes`

Request body:
```json
{
  "ingredients": "chicken, tomatoes, garlic"
}
```

Response:
```json
{
  "recipes": "Generated recipe suggestions..."
}
```

## Features

✅ Real-time recipe generation using Claude 3.5 Sonnet
✅ Loading state with spinner
✅ Error handling
✅ Keyboard shortcut: Ctrl+Enter to submit
✅ Back button to dashboard
✅ Responsive design

## Troubleshooting

**API Connection Error:**
- Make sure both `npm run dev:api` and `npm run dev` are running
- Check that port 3001 is not in use
- Verify `.env.local` has the correct `ANTHROPIC_API_KEY`

**"Method not allowed" error:**
- Make sure you're sending a POST request, not GET

**API Key error:**
- Verify `ANTHROPIC_API_KEY` is set in `.env.local`
