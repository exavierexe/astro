import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date to a readable string
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

// Format a time to a readable string
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

// Get the current date and time in format DD.MM.YYYY
export function getCurrentDateFormatted(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  
  return `${day}.${month}.${year}`;
}

// Get the current time formatted as HH:MM
export function getCurrentTimeFormatted(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Calculate age given a birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Format a date as a display string with time
 */
export function formatDisplayDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

/**
 * Get zodiac sign from a date
 */
export function getZodiacSign(birthdate: Date): string {
  const day = birthdate.getDate()
  const month = birthdate.getMonth() + 1 // JavaScript months are 0-based
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'Aries'
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'Taurus'
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'Gemini'
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'Cancer'
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'Leo'
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'Virgo'
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'Libra'
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'Scorpio'
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'Sagittarius'
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'Capricorn'
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'Aquarius'
  } else {
    return 'Pisces'
  }
}

/**
 * Get zodiac symbol from sign name
 */
export function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓'
  }
  
  return symbols[sign] || ''
}

/**
 * Get element for a zodiac sign
 */
export function getZodiacElement(sign: string): string {
  const elements: Record<string, string> = {
    'Aries': 'Fire',
    'Leo': 'Fire',
    'Sagittarius': 'Fire',
    'Taurus': 'Earth',
    'Virgo': 'Earth',
    'Capricorn': 'Earth',
    'Gemini': 'Air',
    'Libra': 'Air',
    'Aquarius': 'Air',
    'Cancer': 'Water',
    'Scorpio': 'Water',
    'Pisces': 'Water'
  }
  
  return elements[sign] || ''
}

/**
 * Get modality (cardinal, fixed, mutable) for a zodiac sign
 */
export function getZodiacModality(sign: string): string {
  const modalities: Record<string, string> = {
    'Aries': 'Cardinal',
    'Cancer': 'Cardinal',
    'Libra': 'Cardinal',
    'Capricorn': 'Cardinal',
    'Taurus': 'Fixed',
    'Leo': 'Fixed',
    'Scorpio': 'Fixed',
    'Aquarius': 'Fixed',
    'Gemini': 'Mutable',
    'Virgo': 'Mutable',
    'Sagittarius': 'Mutable',
    'Pisces': 'Mutable'
  }
  
  return modalities[sign] || ''
}

/**
 * Format a coordinate (latitude/longitude) with the correct cardinal direction
 */
export function formatCoordinate(coordinate: number, isLatitude: boolean): string {
  const abs = Math.abs(coordinate)
  const degrees = Math.floor(abs)
  const minutes = Math.floor((abs - degrees) * 60)
  const seconds = Math.floor(((abs - degrees) * 60 - minutes) * 60)
  
  const direction = isLatitude 
    ? coordinate >= 0 ? 'N' : 'S'
    : coordinate >= 0 ? 'E' : 'W'
    
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`
}

/**
 * Check if an environment is serverless (useful for adapting calculations)
 */
export function isServerlessEnvironment(): boolean {
  return process.env.VERCEL === '1' || 
         process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
         process.env.NEXT_RUNTIME === 'nodejs'
}

/**
 * Helper to consistently format astrological angles
 */
export function formatAstrologicalAngle(degrees: number): string {
  // Normalize to 0-360 range
  degrees = degrees % 360
  if (degrees < 0) degrees += 360
  
  // Calculate zodiac sign
  const signIndex = Math.floor(degrees / 30)
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  
  const signName = zodiacSigns[signIndex]
  const degreeInSign = Math.floor(degrees % 30)
  const minuteValue = Math.floor((degrees % 30 - degreeInSign) * 60)
  
  return `${signName} ${degreeInSign}° ${minuteValue}'`
}

/**
 * Get planetary meaning/interpretation for a specific planet in a sign
 */
export function getPlanetaryMeaning(planet: string, sign: string): string {
  // This is a simplified interpretation system - real astrology is much more nuanced
  const basicMeanings: Record<string, Record<string, string>> = {
    "Sun": {
      "Aries": "Strong will, leadership, pioneering spirit",
      "Taurus": "Steady determination, practicality, enjoyment of life",
      "Gemini": "Adaptable, curious, intellectual expression",
      "Cancer": "Emotional sensitivity, nurturing, protective nature",
      "Leo": "Creative expression, pride, generosity",
      "Virgo": "Analytical, precise, service-oriented",
      "Libra": "Diplomatic, balanced, relationship-focused",
      "Scorpio": "Intense, passionate, transformative",
      "Sagittarius": "Philosophical, adventurous, optimistic",
      "Capricorn": "Ambitious, disciplined, responsible",
      "Aquarius": "Innovative, humanitarian, independent",
      "Pisces": "Compassionate, intuitive, spiritually inclined"
    },
    "Moon": {
      "Aries": "Emotionally impulsive, needs independence",
      "Taurus": "Emotional security through stability",
      "Gemini": "Emotionally adaptable, needs mental stimulation",
      "Cancer": "Deep emotions, nurturing instincts",
      "Leo": "Proud emotions, needs admiration",
      "Virgo": "Analytical feelings, attention to detail",
      "Libra": "Seeks emotional harmony, dislikes conflict",
      "Scorpio": "Intense emotional depth, transformative feelings",
      "Sagittarius": "Emotionally free-spirited, optimistic",
      "Capricorn": "Emotionally reserved, seeks achievement",
      "Aquarius": "Emotionally detached, humanitarian",
      "Pisces": "Highly sensitive, compassionate emotions"
    },
    "Mercury": {
      "Aries": "Quick-thinking, direct communication",
      "Taurus": "Methodical thinking, practical ideas",
      "Gemini": "Curious mind, versatile communication",
      "Cancer": "Intuitive thinking, emotionally aware",
      "Leo": "Creative mind, confident expression",
      "Virgo": "Analytical thinking, attention to detail",
      "Libra": "Diplomatic communication, fair-minded",
      "Scorpio": "Investigative thinking, psychological insight",
      "Sagittarius": "Broad-minded, philosophical outlook",
      "Capricorn": "Practical thinking, organizational skills",
      "Aquarius": "Innovative ideas, original thinking",
      "Pisces": "Imaginative mind, intuitive understanding"
    }
  }
  
  // Default message if specific interpretation isn't available
  if (!basicMeanings[planet] || !basicMeanings[planet][sign]) {
    return `${planet} in ${sign} represents a blending of their energies and qualities.`
  }
  
  return basicMeanings[planet][sign]
}

/**
 * Get interpretation for an astrological aspect
 */
export function getAspectInterpretation(aspect: string, planet1: string, planet2: string): string {
  const aspectMeanings: Record<string, string> = {
    "Conjunction": "a powerful merger of energies that amplifies their combined effect",
    "Opposition": "a dynamic tension that creates awareness through polarity",
    "Trine": "a harmonious flow of energy that brings ease and natural talent",
    "Square": "a challenging dynamic that motivates growth through tension",
    "Sextile": "an opportunity for creative cooperation between planetary energies"
  }
  
  const interpretation = aspectMeanings[aspect] || "an interaction of planetary energies"
  
  return `The ${aspect} between ${planet1} and ${planet2} creates ${interpretation}.`
}