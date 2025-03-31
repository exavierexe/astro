// Type declarations for ephemeris module
declare module 'ephemeris' {
  interface PlanetPosition {
    apparentLongitudeDd: number;
    apparentLongitude: string;
    geocentricDistanceAu: number;
    aberration: number;
    precessionJ2000: number;
    nutation: number;
    apparentDiameter: number;
    angularRadius: number;
  }

  interface EphemerisDate {
    gregorianUniversal: Date;
    gregorianLocalMeridian: Date;
    universalDateString: string;
    julianDay: number;
    julianCentury: number;
    julianTerrestrial: number;
    unix: number;
  }

  interface EphemerisInput {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    longitude: number;
    latitude: number;
    height: number;
  }

  interface EphemerisOptions {
    isInterpolated: boolean;
  }

  interface EphemerisResult {
    date: EphemerisDate;
    observed: {
      sun?: PlanetPosition;
      moon?: PlanetPosition;
      mercury?: PlanetPosition;
      venus?: PlanetPosition;
      mars?: PlanetPosition;
      jupiter?: PlanetPosition;
      saturn?: PlanetPosition;
      uranus?: PlanetPosition;
      neptune?: PlanetPosition;
      pluto?: PlanetPosition;
      chiron?: PlanetPosition;
      [key: string]: PlanetPosition | undefined;
    };
    $input: EphemerisInput;
    options: EphemerisOptions;
  }

  function getAllPlanets(
    date: Date,
    longitude: number,
    latitude: number,
    height?: number,
    options?: any
  ): EphemerisResult;

  function getPlanet(
    planet: string,
    date: Date,
    longitude: number,
    latitude: number,
    height?: number,
    options?: any
  ): EphemerisResult;

  function defaultPositions(
    date: Date,
    longitude: number,
    latitude: number,
    height?: number,
    options?: any
  ): EphemerisResult;

  export { getAllPlanets, getPlanet, defaultPositions };
}

// Declare global ephemeris module for client-side use
interface Window {
  ephemeris?: {
    getAllPlanets: typeof import('ephemeris').getAllPlanets;
    getPlanet: typeof import('ephemeris').getPlanet;
    defaultPositions: typeof import('ephemeris').defaultPositions;
  };
  __ephemerisInitialized?: boolean;
}

// For Node.js global
declare namespace NodeJS {
  interface Global {
    ephemeris?: {
      getAllPlanets: typeof import('ephemeris').getAllPlanets;
      getPlanet: typeof import('ephemeris').getPlanet;
      defaultPositions: typeof import('ephemeris').defaultPositions;
    };
  }
}