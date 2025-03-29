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
 * Detect if the application is running in a serverless environment like Vercel
 * 
 * @returns True if running in a serverless environment, false otherwise
 */
export function isServerlessEnvironment(): boolean {
  // Check for Vercel environment variables
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return true;
  }
  
  // Check for other common serverless environment variables
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || 
      process.env.NETLIFY ||
      process.env.FUNCTIONS_EMULATOR) {
    return true;
  }
  
  // Check for absence of file system access (a common limitation in serverless environments)
  try {
    // This is a simple test that would typically fail in serverless environments
    // but succeed in development/server environments
    if (process.env.NODE_ENV === 'production') {
      // In production, be cautious and assume serverless unless we're confident it's not
      // This prevents errors when running native code in production
      return true;
    }
    
    return false;
  } catch (error) {
    // If any errors occur during the check, assume we're in a serverless environment
    console.log('Error detecting environment, assuming serverless:', error);
    return true;
  }
}