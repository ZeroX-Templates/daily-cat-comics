# Daily Doodle Cat - Replit Development Guide

## Overview

This is a full-stack web application that generates AI-powered daily cat comic strips. The app creates a new 4-panel comic strip each day featuring a cat in funny situations, using Google's Gemini AI for both story generation and image creation. The application is built with a React frontend and Express backend, featuring a modern design with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state management
- **Routing**: Currently single-page application (SPA)

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Build Process**: esbuild for production bundling

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### Comic Generation System
- **Story Generation**: Uses Gemini AI with structured JSON schema to create 4-panel comic stories
- **Image Generation**: Generates cartoon-style images for each panel using Gemini's image generation
- **Daily Rotation**: Deterministic daily prompts based on Eastern Time zone
- **Prompt System**: 30+ predefined cat scenarios that rotate daily

### UI Components
- **Modern Design**: Clean, responsive design with Inter and Kalam fonts
- **Component Library**: Comprehensive shadcn/ui component set including:
  - Cards, dialogs, and modals
  - Form components (inputs, buttons, selects)
  - Navigation and layout components
  - Toast notifications and loading states
- **Icon System**: Custom cat-themed SVG icons
- **Responsive Layout**: Mobile-first design with Tailwind breakpoints

### Error Handling
- **Graceful Degradation**: Friendly error messages with cat-themed copy
- **Loading States**: Animated loading indicators with cat icons
- **Retry Logic**: User-friendly error recovery options

## Data Flow

1. **Daily Comic Generation**:
   - App determines current day in Eastern Time
   - Selects corresponding prompt from predefined array
   - Calls Gemini API to generate comic story structure
   - Generates images for each of the 4 panels
   - Displays complete comic strip to user

2. **User Interface Flow**:
   - Single-page app loads with loading state
   - Comic generation happens on initial load
   - Error states show user-friendly messages
   - Success state displays the full comic strip

3. **Data Schema**:
   - Comics have title and 4 panels
   - Each panel has image URL and caption
   - Database schema includes user management (prepared for future features)

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI service for both text and image generation
- **API Integration**: Structured prompts with JSON schema validation
- **Rate Limiting**: Handled through proper API key management

### Development Tools
- **Vite Plugins**: Runtime error overlay, cartographer for Replit integration
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting (configured in shadcn/ui setup)

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migration and management tools
- **Environment Variables**: Secure API key and database URL management

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Database Setup**: `npm run db:push` for schema deployment

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild creates single bundled Node.js file
- **Static Serving**: Express serves built frontend in production
- **Process**: `npm run build` followed by `npm start`

### Environment Configuration
- **API Keys**: Gemini API key via environment variables
- **Database**: PostgreSQL connection string
- **Session Security**: Configured for production deployment
- **CORS**: Properly configured for cross-origin requests

The application is designed to be deployed on platforms like Replit, Vercel, or similar hosting services with support for both static frontend serving and Node.js backend execution.