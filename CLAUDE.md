# CLAUDE.md - Agentic Coding Assistant Guidelines

## Build Commands
- `npm run dev` - Run development server
- `npm run build` - Generate Prisma client and build Next.js app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style Guidelines
- **TypeScript**: Strict mode enabled, ES2017 target
- **Formatting**: 2 spaces, no semicolons, single quotes, 100 char width
- **Imports**: Group by: 1) External libs 2) Components 3) Utils/hooks
- **Components**: Follow React functional component patterns with proper typing
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error Handling**: Try/catch blocks for async operations, proper error typing
- **File Structure**: Pages in app/*, components in components/ui/*
- **CSS**: Use Tailwind classes, composition with clsx/cva when needed
- **State Management**: Use React hooks for local state
- **Prisma**: Use lib/prisma.ts for database operations

## Project Architecture
- Next.js 14 App Router with page.tsx/layout.tsx pattern
- Clerk for authentication
- Tailwind for styling
- Prisma for database