# Daily Doodle Cat

A React-based daily cat comic strip generator using Google Gemini AI with doodle-style interface and automatic daily theme rotation.

## Features

- 🐱 Daily AI-generated cat comic strips
- 🎨 Hand-drawn doodle art style
- ⏰ Automatic daily rotation at midnight ET
- 📱 Responsive design with modern UI
- 🔒 Secure API key handling on the backend

## Deployment on Render

### Option 1: Using render.yaml (Recommended)
1. Commit the `render.yaml` file to your repository
2. Connect your GitHub repository to Render
3. Render will automatically use the configuration from `render.yaml`
4. Add environment variable: `GEMINI_API_KEY` with your API key

### Option 2: Manual Configuration
If the automatic deployment fails:

1. Connect your GitHub repository to Render
2. Select "Web Service"
3. **IMPORTANT**: Set "Root Directory" to `.` (dot) or leave it blank
4. Use these settings:
   - **Build Command**: 
     ```bash
     echo "Build starting in: $(pwd)" && ls -la && npm ci && npm run build
     ```
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Node Version**: 20

### Option 3: Docker Deployment
1. Select "Web Service" and choose "Deploy from Dockerfile"
2. Render will use the included `Dockerfile`
3. Add environment variable: `GEMINI_API_KEY`

### Troubleshooting Render Issues
If you get "ENOENT: no such file or directory, open '/opt/render/project/src/package.json'":

1. **Check Root Directory**: Make sure it's set to `.` or blank in Render settings
2. **Verify Repository**: Ensure `package.json` is in the root of your repository
3. **Manual Override**: Use the verbose build command shown in Option 2

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