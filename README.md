# AI Gift Advisor

AI Gift Advisor is a full-stack web application that provides personalized gift suggestions using AI. Users can describe the person or occasion, and the app generates gift ideas using the OpenAI GPT-5 model.

## Features

- AI-powered gift suggestions
- Simple and clean user interface
- Full-stack setup: **Vite + React** frontend and **Node.js + Express** backend
- Secure environment variables for API keys and model configuration

## Tech Stack

**Backend:**

- Node.js
- Express
- OpenAI API
- Streaming responses

**Frontend:**

- React
- Vite
- Marked (Markdown Rendering)
- DOMPurify

## Setup

1. Clone the repository
2. Create a `.env` file in the backend folder with your OpenAI API key:

```env
AI_URL=https://api.openai.com/v1

AI_MODEL=gpt-5-nano
AI_KEY=your_openai_api_key
PORT=5000
```

3. Install dependencies:

- Backend: `npm install` in `/backend`
- Frontend: `npm install` in `/frontend`

4. Run backend: `node server.js` (in `/backend`)
5. Run frontend: `npm run dev` (in `/frontend`)
6. Open frontend URL in your browser and start getting gift suggestions!

## License

MIT
