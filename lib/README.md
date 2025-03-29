# Astrological Library

This directory contains several library modules used throughout the application:

## ephemeris.ts

The main module for astronomical calculations, which has been deprecated and replaced by the more robust swiss-ephemeris.ts module.

## swiss-ephemeris.ts

A module that interfaces with the Swiss Ephemeris library for precise astrological calculations. Key features:

- Calculates birth charts with planetary positions and house cusps
- Works in both development and serverless environments
- Falls back to simplified calculations when the Swiss Ephemeris executable is not available
- Handles timezone adjustments
- Calculates aspects between planets
- Provides detailed information about zodiac signs and planets

## utils.ts

A collection of utility functions for working with dates, zodiac signs, and formatting astrological data.

## prisma.ts

A singleton instance of the Prisma client for database access.

## Installation

The Swiss Ephemeris library is included in the `/swisseph-master` directory. For deployment to serverless environments, a minimal set of files is copied to `/public/ephemeris` using the script at `/scripts/prepare-ephemeris.js`.

To prepare the ephemeris files for deployment:

```bash
node scripts/prepare-ephemeris.js
```

## Usage Examples

```typescript
import { calculateBirthChart } from './swiss-ephemeris';

async function generateChart() {
  const birthDate = new Date('1990-01-01T12:00:00Z');
  const birthLat = 40.7128; // New York latitude
  const birthLng = -74.0060; // New York longitude
  const houseSystem = 'P'; // Placidus house system
  
  const chart = await calculateBirthChart(birthDate, birthLat, birthLng, houseSystem);
  
  console.log('Sun position:', chart.planets.sun);
  console.log('Ascendant:', chart.ascendant);
  console.log('Houses:', chart.houses);
  console.log('Aspects:', chart.aspects);
}
```

## License

The Swiss Ephemeris is licensed under the AGPL. Commercial licenses are available from Astrodienst AG.