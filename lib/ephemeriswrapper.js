// Simple wrapper for ephemeris to avoid TypeScript issues and handle both client and server environments
let ephemerisModule;

// Try to safely load the module - this should work in server environments
try {
  ephemerisModule = require('ephemeris');
} catch (error) {
  // Provide stub implementation for client-side rendering
  console.log('Using stub implementation for ephemeris (likely client-side)');
  ephemerisModule = {
    getAllPlanets: () => ({ 
      date: { 
        julianTerrestrial: 0,
        julianDay: 0 
      }, 
      observed: {} 
    }),
    getPlanet: () => ({ 
      date: {
        julianTerrestrial: 0,
        julianDay: 0
      }, 
      observed: {} 
    }),
    defaultPositions: () => ({ 
      date: {
        julianTerrestrial: 0,
        julianDay: 0
      }, 
      observed: {} 
    })
  };
}

// Export a standardized interface
module.exports = {
  getAllPlanets: function() {
    // Check if we have the real module or need to use global stub
    if (typeof ephemerisModule.getAllPlanets === 'function') {
      return ephemerisModule.getAllPlanets.apply(null, arguments);
    } else if (typeof global !== 'undefined' && global.ephemeris) {
      return global.ephemeris.getAllPlanets.apply(null, arguments);
    }
    // Fallback to stub
    return { 
      date: { 
        julianTerrestrial: 0,
        julianDay: 0 
      }, 
      observed: {} 
    };
  },
  getPlanet: function() {
    // Check if we have the real module or need to use global stub
    if (typeof ephemerisModule.getPlanet === 'function') {
      return ephemerisModule.getPlanet.apply(null, arguments);
    } else if (typeof global !== 'undefined' && global.ephemeris) {
      return global.ephemeris.getPlanet.apply(null, arguments);
    }
    // Fallback to stub
    return { 
      date: { 
        julianTerrestrial: 0,
        julianDay: 0 
      }, 
      observed: {} 
    };
  },
  defaultPositions: function() {
    // Check if we have the real module or need to use global stub
    if (typeof ephemerisModule.defaultPositions === 'function') {
      return ephemerisModule.defaultPositions.apply(null, arguments);
    } else if (typeof global !== 'undefined' && global.ephemeris) {
      return global.ephemeris.defaultPositions.apply(null, arguments);
    }
    // Fallback to stub
    return { 
      date: { 
        julianTerrestrial: 0,
        julianDay: 0 
      }, 
      observed: {} 
    };
  }
};