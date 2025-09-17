# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

PDX Meteor Tracker is a Next.js 15 application that displays Near Earth Objects (NEOs) and meteors approaching Earth using NASA's Open Data Portal. The app features real-time tracking, hazard detection, and astronomy imagery.

## Development Commands

### Core Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Common Tasks
```bash
# Install dependencies
npm ci

# Format code with Prettier
npx prettier --write .

# Check TypeScript types
npx tsc --noEmit
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4
- **API Client**: Axios for NASA API integration
- **Date Handling**: date-fns for date formatting and manipulation
- **Deployment**: Render.com with automatic deployments

### Project Structure
- `app/` - Next.js App Router pages and layout
- `components/` - React components (MeteorCard, MeteorList, LoadingSpinner)
- `lib/` - API services and utilities (nasaApi.ts)
- `types/` - TypeScript type definitions
- `public/` - Static assets

### Key Components

**NASAApiService (`lib/nasaApi.ts`)**
- Centralized NASA API client with axios
- Handles NEO Feed, APOD, and asteroid data
- Transforms raw NASA data into simplified MeteorEvent format
- Includes error handling and timeout configuration

**Data Flow**
1. Page component fetches data using `nasaApi.getUpcomingMeteors()`
2. Raw NASA NEO data is transformed via `transformToMeteorEvents()`
3. MeteorList component handles filtering and sorting
4. MeteorCard components display individual meteor information

### API Integration
- **Primary**: NASA Near Earth Object Web Service (NeoWs)
- **Secondary**: NASA Astronomy Picture of the Day (APOD)
- **Rate Limits**: Uses DEMO_KEY by default (30 requests/hour, 50 requests/day)
- **Error Handling**: Graceful fallbacks for API failures

### Environment Variables
- `NEXT_PUBLIC_NASA_API_KEY`: NASA API key (optional, defaults to DEMO_KEY)
- Set in `.env.local` for development
- Configure in Render dashboard for production

### Deployment Configuration
- **Platform**: Render.com
- **Build**: `npm ci && npm run build`
- **Start**: `npm start`
- **Auto-deploy**: Enabled on main branch pushes
- **Configuration**: See `render.yaml`

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./`
- Target: ES2017
- Incremental compilation enabled

## Development Notes

### NASA API Considerations
- DEMO_KEY has strict rate limits - get a free API key from https://api.nasa.gov/
- API responses are cached client-side during component lifecycle
- APOD failures don't break the main meteor display

### Component Patterns
- Client components use 'use client' directive
- Error boundaries handle API failures gracefully
- Loading states provide user feedback
- Responsive design with Tailwind CSS grid system

### Date Handling
- All dates use `date-fns` for consistency
- NASA API expects 'yyyy-MM-dd' format
- Display dates are formatted for user readability

### Performance Considerations
- Turbopack enabled for faster development builds
- API calls are batched using Promise.all
- Incremental TypeScript compilation
- Component-level loading states prevent blocking UI