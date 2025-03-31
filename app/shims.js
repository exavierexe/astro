// Shim file to provide ephemeris module in client-side code
// This file is added to the client bundle via next.config.ts

console.log('[SHIMS] Initializing ephemeris shims');

// Define a global variable to track if we've already initialized
if (typeof window !== 'undefined' && !window.__ephemerisInitialized) {
  window.__ephemerisInitialized = true;
  
  // Create a client-side fallback implementation
  const fallbackEphemeris = {
    // Client-side stubs - these will be replaced if the server calls succeed
    getAllPlanets: (date, longitude, latitude, height) => {
      console.log('[CLIENT-SHIM] getAllPlanets called - using fallback implementation');
      
      // Return a minimal structure that won't cause errors
      return {
        date: {
          julianDay: 2460000,
          julianTerrestrial: 2460000,
          universalDateString: new Date().toLocaleString()
        },
        observed: {
          sun: { apparentLongitudeDd: 0 },
          moon: { apparentLongitudeDd: 30 },
          mercury: { apparentLongitudeDd: 60 },
          venus: { apparentLongitudeDd: 90 },
          mars: { apparentLongitudeDd: 120 },
          jupiter: { apparentLongitudeDd: 150 },
          saturn: { apparentLongitudeDd: 180 },
          uranus: { apparentLongitudeDd: 210 },
          neptune: { apparentLongitudeDd: 240 },
          pluto: { apparentLongitudeDd: 270 },
          chiron: { apparentLongitudeDd: 300 }
        }
      };
    },
    
    getPlanet: (planet, date, longitude, latitude, height) => {
      console.log(`[CLIENT-SHIM] getPlanet called for ${planet} - using fallback implementation`);
      
      // Get all planets and filter to just the requested one
      const allPlanets = fallbackEphemeris.getAllPlanets(date, longitude, latitude, height);
      
      // Filter to just the requested planet
      const filteredObserved = {};
      if (allPlanets.observed[planet]) {
        filteredObserved[planet] = allPlanets.observed[planet];
      }
      
      return {
        ...allPlanets,
        observed: filteredObserved
      };
    },
    
    defaultPositions: (date, longitude, latitude, height) => {
      console.log('[CLIENT-SHIM] defaultPositions called - using fallback implementation');
      return fallbackEphemeris.getAllPlanets(date, longitude, latitude, height);
    }
  };
  
  // Assign to both window and global (if they exist)
  if (typeof window !== 'undefined') {
    console.log('[SHIMS] Setting window.ephemeris');
    window.ephemeris = fallbackEphemeris;
  }
  
  if (typeof global !== 'undefined') {
    console.log('[SHIMS] Setting global.ephemeris');
    global.ephemeris = fallbackEphemeris;
  }
  
  console.log('[SHIMS] Ephemeris shims initialized successfully');
}