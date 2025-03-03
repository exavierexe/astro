# CLAUDE.md - Agentic Coding Assistant Guidelines

## Build Commands
- `npm run dev` - Run development server (uses turbopack)
- `npm run build` - Generate Prisma client and build Next.js app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `prisma generate` - Generate Prisma client after schema changes
- `prisma migrate dev` - Apply schema changes to local development database

## Code Style Guidelines
- **TypeScript**: Strict mode enabled, ES2017 target, explicit typing
- **Formatting**: 2 spaces, no semicolons, single quotes, 100 char width
- **Imports**: Order: 1) React/external 2) Components 3) Utils/types 4) Styles
- **Components**: Use React.forwardRef for base UI, named functions for complex
- **Naming**: PascalCase for components/types, camelCase for functions/variables
- **Error Handling**: Try/catch with specific error returns (success/error pattern)
- **File Structure**: App router in app/*, components in components/ui/*
- **CSS**: Tailwind with class-variance-authority (cva) for variants
- **State Management**: React hooks for local state, server actions for mutations
- **Server Actions**: "use server" actions in actions.ts with typed parameters

## Project Data Models
- Users: Profile and basic info with relationships to charts/readings
- BirthChart: Astrological chart data with planet positions and aspects
- TarotReading: Card spreads with interpretations and user questions

## Project Architecture
- Next.js App Router with page.tsx/layout.tsx pattern
- Clerk for authentication
- Tailwind for styling with shadcn/ui components
- Prisma with PostgreSQL database
- Swiss Ephemeris for astrological calculations