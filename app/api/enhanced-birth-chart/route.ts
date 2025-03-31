import { NextResponse } from 'next/server';
import { calculateBirthChartWithDiagnostics } from '../../../actions-enhanced';

// Ensure this isn't statically optimized
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Give plenty of time for the calculation

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, birthPlace } = body;
    
    if (!birthDate || !birthTime || !birthPlace) {
      return NextResponse.json({
        error: 'Missing required parameters: birthDate, birthTime, birthPlace'
      }, { status: 400 });
    }
    
    // Call our enhanced birth chart calculator
    const result = await calculateBirthChartWithDiagnostics({
      birthDate,
      birthTime,
      birthPlace
    });
    
    // If there was an error, return it
    if (result.error) {
      return NextResponse.json({
        error: result.error,
        // Only include diagnostics in non-production environments
        ...(process.env.NODE_ENV !== 'production' 
          ? { diagnostics: result.diagnostics } 
          : { diagnosticPath: '/debug' })
      }, { status: 400 });
    }
    
    // Otherwise return the chart data
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in enhanced-birth-chart API:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}