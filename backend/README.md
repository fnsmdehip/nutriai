# Nutri AI Backend API

This is the backend API service for Nutri AI, a nutrition tracking application with AI-powered food recognition capabilities.

## Features

- AI food recognition using multi-tiered Google Gemini models
- Optimized image processing with caching
- Scientific reference database
- Nutrition plan calculation with personalized macros
- Health score calculation

## Prerequisites

- Node.js 18.x or higher
- Redis (optional, for production caching)

## Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file with the following content:

```
PORT=3001
GOOGLE_AI_API_KEY=your_google_api_key
NODE_ENV=development
REDIS_URL=redis://localhost:6379 # Optional for development
```

## Running the Server

For development with hot reload:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- `GET /api/v1/health` - Check API health status

### Food Recognition

- `POST /api/v1/recognize-food` - Recognize food in an image
  - Request body: `{ "image": "base64_encoded_image_data" }`
  - Response: `{ "foods": [...], "processingTime": 1.5, "modelUsed": "Gemini 2.5 Pro" }`

### Nutrition Plan

- `POST /api/v1/create-plan` - Create a personalized nutrition plan
  - Request body: User metrics (weight, height, gender, goal, etc.)
  - Response: Detailed nutrition plan with macros and health score

### Scientific Sources

- `GET /api/v1/scientific-sources` - Get all scientific sources used in the app
- `GET /api/v1/scientific-sources?id=bmr` - Get a specific scientific source by ID

## Model Fallback System

The API implements a tiered model approach for food recognition:

1. Tries Gemini 2.5 Pro Experimental first (most accurate)
2. Falls back to Gemini 2.0 Flash if first model fails
3. Falls back to Gemini 2.0 Flash-Lite if needed
4. Falls back to Gemini 1.5 Flash-8B as last resort

## Caching

The system uses:

- Redis for caching in production
- In-memory cache for development
- Automatic cache expiration after 24 hours
- Image hash-based cache keys for efficient retrieval

## Environment Variables

| Variable          | Description                          | Default                |
| ----------------- | ------------------------------------ | ---------------------- |
| PORT              | Server port                          | 3001                   |
| GOOGLE_AI_API_KEY | Google AI API key for Gemini models  | None (required)        |
| NODE_ENV          | Environment (development/production) | development            |
| REDIS_URL         | Redis connection URL                 | redis://localhost:6379 |

## License

Proprietary - All rights reserved.
