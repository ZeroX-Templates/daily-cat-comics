# Daily Doodle Cat

A React-based daily cat comic strip generator using Google Gemini AI with doodle-style interface and automatic daily theme rotation.

## Features

- 🐱 Daily AI-generated cat comic strips
- 🎨 Hand-drawn doodle art style
- ⏰ Automatic daily rotation at midnight ET
- 📱 Responsive design with modern UI
- 🔒 Secure API key handling on the backend

## Deployment on Render

### Quick Deploy
1. Connect your GitHub repository to Render
2. Select "Web Service" 
3. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Node Version**: 20

### Environment Variables
Add this environment variable in Render:
- `GEMINI_API_KEY`: Your Google Gemini API key

### Getting a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy and paste it into Render's environment variables

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **AI Services**: Google Gemini (text + image generation)
- **Build Tools**: Vite, esbuild
- **Deployment**: Render-ready configuration

## Architecture

The application uses a backend API to handle all AI generation requests, keeping API keys secure. The frontend makes requests to `/api/daily-comic` which:

1. Determines today's prompt theme
2. Generates a 4-panel comic story using Gemini
3. Creates images for each panel
4. Returns the complete comic data

The daily theme rotates automatically based on Eastern Time, ensuring all users see the same comic each day.