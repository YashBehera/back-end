# AI Fitness Coach App

## Overview

An AI-powered fitness assistant application that generates personalized workout and diet plans using OpenAI's GPT models. The app features a React-based frontend with TypeScript, Express backend, and integrates AI-generated photorealistic images for exercises and meals. Users complete an onboarding flow to provide their fitness profile, then receive customized 7-day workout routines and meal plans tailored to their goals, fitness level, and preferences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (routes: `/`, `/onboarding`, `/dashboard`)
- Client-side rendering (CSR) with no server-side rendering

**State Management:**
- TanStack React Query (v5) for server state management and caching
- Local storage for persisting user profile data between sessions
- React hooks (useState, useEffect) for component-level state
- Form state managed via React Hook Form with Zod validation

**UI Component System:**
- Shadcn/ui components (Radix UI primitives) with Tailwind CSS
- "New York" style preset with custom color system using CSS variables
- Design system inspired by Nike Training Club (energetic), MyFitnessPal (clarity), and Linear (clean interfaces)
- Responsive design with mobile-first approach
- Theme support (light/dark mode) via ThemeProvider context

**Styling Approach:**
- Tailwind CSS for utility-first styling
- Custom spacing primitives (2, 4, 6, 8, 12, 16, 20, 24)
- Typography system: Outfit for headings, Inter for body text
- Hover and active elevation effects via custom CSS classes

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server created via Node's `http` module
- Custom request logging middleware for API endpoints
- JSON body parsing with raw body preservation for webhooks

**API Design:**
- RESTful API structure under `/api` prefix
- Key endpoints:
  - `POST /api/profile` - Create user profile
  - `POST /api/generate-workout` - Generate AI workout plan
  - `POST /api/generate-diet` - Generate AI diet plan
  - `POST /api/generate-image` - Generate exercise/meal images
  - `GET /api/workout-plan/:profileId` - Fetch workout plan
  - `GET /api/diet-plan/:profileId` - Fetch diet plan

**Development Server:**
- Vite middleware integration for HMR in development
- Replit-specific plugins for error overlay and dev banner
- Static file serving for production builds

### Data Storage

**Storage Strategy:**
- In-memory storage implementation (`MemStorage` class) as default
- Interface-based design (`IStorage`) allowing easy swap to database
- UUID-based primary keys using `crypto.randomUUID()`
- Structured data models:
  - `UserProfile` - User demographics and fitness preferences
  - `WorkoutPlan` - AI-generated workout routines (stored as JSONB)
  - `DietPlan` - AI-generated meal plans (stored as JSONB)
  - `GeneratedImage` - Cached AI-generated images

**Database Schema (Drizzle ORM):**
- PostgreSQL dialect configured via Drizzle Kit
- Schema defined in `shared/schema.ts` using `drizzle-orm/pg-core`
- Tables use JSONB columns for flexible AI-generated content storage
- Migrations output to `./migrations` directory
- Environment variable `DATABASE_URL` required for connection

**Validation:**
- Zod schemas generated from Drizzle schemas via `drizzle-zod`
- Request validation on API endpoints
- Type-safe schema inference for TypeScript

### External Dependencies

**AI Services:**
- OpenAI API integration (GPT-5 model as of August 7, 2025)
- Text generation for workout and diet plans via chat completions
- Image generation for exercise and meal visualizations (DALL-E)
- API key required via `OPENAI_API_KEY` environment variable

**Database:**
- Neon Database serverless PostgreSQL (`@neondatabase/serverless`)
- Connection pooling optimized for serverless environments
- Requires `DATABASE_URL` environment variable

**UI Component Libraries:**
- Radix UI primitives for accessible components (accordion, dialog, select, etc.)
- Embla Carousel for image carousels
- Lucide React for icon system
- cmdk for command palette component

**Form Handling:**
- React Hook Form for form state management
- `@hookform/resolvers` for Zod schema integration
- Date-fns for date manipulation

**Development Tools:**
- Replit-specific plugins (vite-plugin-cartographer, vite-plugin-dev-banner)
- TSX for TypeScript execution in development
- ESBuild for production server bundling

**Type System:**
- Shared types between client and server via `shared/` directory
- Path aliases: `@/` for client, `@shared/` for shared code, `@assets/` for attached assets
- Strict TypeScript configuration with ESNext module resolution