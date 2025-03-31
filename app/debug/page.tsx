'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [testParams, setTestParams] = useState({
    birthDate: '1995-10-08',
    birthTime: '19:56',
    birthPlace: 'Miami, FL, USA'
  });
  
  // Get the current URL for the API endpoint
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL('/api/debug-birth-chart', window.location.origin);
      setApiEndpoint(url.toString());
    }
  }, []);
  
  const runEphemerisTest = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      // Call the debug API
      const response = await fetch('/api/ephemeris-test');
      const data = await response.json();
      
      setResult({
        type: 'ephemeris-test',
        data
      });
    } catch (error) {
      setResult({
        type: 'error',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };
  
  const runBirthChartTest = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      // Call the debug-birth-chart API
      const response = await fetch('/api/debug-birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testParams)
      });
      
      const data = await response.json();
      
      setResult({
        type: 'birth-chart-test',
        data
      });
    } catch (error) {
      setResult({
        type: 'error',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Ephemeris Diagnostics</h1>
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Ephemeris Module Test</h2>
          <p className="mb-4">Tests if the ephemeris module can be loaded and used.</p>
          <Button 
            onClick={runEphemerisTest} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Running...' : 'Run Test'}
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Birth Chart Calculation Test</h2>
          <p className="mb-4">Tests if a birth chart can be calculated with detailed diagnostics.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input 
                id="birthDate" 
                type="date" 
                value={testParams.birthDate} 
                onChange={(e) => setTestParams({...testParams, birthDate: e.target.value})} 
              />
            </div>
            
            <div>
              <Label htmlFor="birthTime">Birth Time</Label>
              <Input 
                id="birthTime" 
                type="time" 
                value={testParams.birthTime} 
                onChange={(e) => setTestParams({...testParams, birthTime: e.target.value})} 
              />
            </div>
            
            <div>
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input 
                id="birthPlace" 
                type="text" 
                value={testParams.birthPlace} 
                onChange={(e) => setTestParams({...testParams, birthPlace: e.target.value})} 
              />
            </div>
          </div>
          
          <Button 
            onClick={runBirthChartTest} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Running...' : 'Run Test'}
          </Button>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">API Endpoint: {apiEndpoint}</p>
          </div>
        </Card>
        
        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>
            
            {result.type === 'error' ? (
              <div className="bg-red-900/20 p-4 rounded-md">
                <h3 className="text-red-400 font-bold mb-2">Error</h3>
                <pre className="text-sm whitespace-pre-wrap">{result.error}</pre>
              </div>
            ) : (
              <div>
                <h3 className="font-bold mb-2">
                  {result.type === 'ephemeris-test' ? 'Ephemeris Test Results' : 'Birth Chart Test Results'}
                </h3>
                
                <div className="bg-gray-900 p-4 rounded-md overflow-auto max-h-[500px]">
                  <pre className="text-sm">{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}