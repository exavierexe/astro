// Shim file to provide ephemeris module in client-side code
// This is required because the ephemeris module is not directly importable in client components

if (typeof global !== 'undefined' && !global.ephemeris) {
  try {
    // Only try to load ephemeris on the server side
    if (typeof window === 'undefined') {
      const ephemerisModule = require('ephemeris');
      global.ephemeris = ephemerisModule;
    } else {
      global.ephemeris = {
        // Client-side stub for SSR
        getAllPlanets: () => ({ date: {}, observed: {} }),
        getPlanet: () => ({ date: {}, observed: {} }),
        defaultPositions: () => ({ date: {}, observed: {} })
      };
    }
  } catch (e) {
    console.error('Failed to load ephemeris module:', e);
    global.ephemeris = {
      // Fallback stub
      getAllPlanets: () => ({ date: {}, observed: {} }),
      getPlanet: () => ({ date: {}, observed: {} }),
      defaultPositions: () => ({ date: {}, observed: {} })
    };
  }
}