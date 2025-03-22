'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { querySwissEph, saveBirthChart, getBirthChartById } from '@/actions'
import { ZodiacWheel, type ChartData, exportChartAsImage } from '@/components/ui/zodiacwheel'
import { SavedBirthCharts } from '@/components/ui/birth-chart-calculator'

// Helper function to parse Swiss Ephemeris output into chart data
function parseSwissEphOutput(output: string): ChartData {
  if (!output) {
    // Return default chart data if no output
    return {
      planets: {
        sun: { name: 'Aries', symbol: '♈', longitude: 15, degree: 15 }
      },
      houses: {} as Record<string, { cusp: number; name: string; symbol: string; degree: number }>,
      ascendant: { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 }
    };
  }
  
  // Define the types with isRetrograde property
  type PlanetData = { 
    name: string; 
    symbol: string; 
    longitude: number; 
    degree: number; 
    isRetrograde?: boolean; 
  };
  
  type HouseData = { 
    cusp: number; 
    name: string; 
    symbol: string; 
    degree: number; 
  };
  
  const planets: Record<string, PlanetData> = {};
  const houses: Record<string, HouseData> = {};
  let ascendant: PlanetData = { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 };
  
  // Zodiac signs and their symbols
  const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  
  // Map planet identifiers in Swiss Ephemeris output to our keys
  const planetMap: Record<string, string> = {
    'Sun': 'sun',
    'Moon': 'moon',
    'Mercury': 'mercury',
    'Venus': 'venus',
    'Mars': 'mars',
    'Jupiter': 'jupiter',
    'Saturn': 'saturn',
    'Uranus': 'uranus',
    'Neptune': 'neptune',
    'Pluto': 'pluto',
    'mean Node': 'meanNode',
    'true Node': 'trueNode',
    'Node': 'meanNode',            // Alternative name
    'mean Lilith': 'meanLilith',
    'osc. Lilith': 'oscLilith',    // Oscillating Lilith
    'Lilith': 'meanLilith',        // Alternative name
    'Chiron': 'chiron',
    'Ceres': 'ceres',
    'Pallas': 'pallas',
    'Juno': 'juno',
    'Vesta': 'vesta',
    'Ascendant': 'ascendant',
    'MC': 'midheaven'             // Midheaven
  };
  
  // Parse the output line by line
  const lines = output.split('\n');
  
  // Debug the raw output
  console.log("Raw Swiss Ephemeris output:", output);
  
  // Extract planet positions
  for (const line of lines) {
    // Skip empty lines or headers
    if (!line.trim() || line.includes('----') || line.includes('Date:') || line.includes('Time:') || line.includes('Location:')) continue;
    
    // Debug each line
    console.log("Processing line:", line);
    
    // Check if the line contains planet data with absolute degrees and motion
    // Format: "Sun              195.2253469   0.9869944   6.9210360"
    for (const [planetName, planetKey] of Object.entries(planetMap)) {
      if (line.startsWith(planetName)) {
        // Extract the absolute degree and motion values
        // Format: "Sun              195.2253469   0.9869944   6.9210360"
        // We need to extract the first number (absolute degree) and second number (motion)
        const pattern = new RegExp(`${planetName}\\s+(\\d+\\.\\d+)\\s+([\\-\\+]?\\d+\\.\\d+)`);
        
        // Alternative pattern if there are more spaces than expected
        const alternativePattern = new RegExp(`${planetName}\\s+([\\d\\.]+)\\s+([\\-\\+]?[\\d\\.]+)`);
        
        let match = line.match(pattern);
        if (!match) {
          match = line.match(alternativePattern);
        }
        
        if (match) {
          console.log(`Found planet ${planetName} with data:`, match);
          
          // Parse the absolute degree (e.g., 195.2253469)
          const absoluteDegree = parseFloat(match[1]);
          
          // Parse the motion value (positive = direct, negative = retrograde)
          const motion = parseFloat(match[2]);
          const isRetrograde = motion < 0;
          
          // Calculate which sign the degree falls in (each sign is 30 degrees)
          const signIndex = Math.floor(absoluteDegree / 30) % 12;
          const sign = ZODIAC_SIGNS[signIndex];
          
          // Calculate degree within that sign
          const degreeInSign = absoluteDegree % 30;
          
          // Add retrograde indicator to the symbol if needed
          const baseSymbol = ZODIAC_SYMBOLS[signIndex];
          const symbol = isRetrograde ? `${baseSymbol}ᴿ` : baseSymbol;
          
          // Store planet data - make sure longitude is properly calculated
          planets[planetKey] = {
            name: sign,
            symbol: symbol,
            // This is the key longitude value that determines position on the wheel
            longitude: absoluteDegree,
            degree: degreeInSign,
            isRetrograde
          };
          
          console.log(`Parsed ${planetName} at ${absoluteDegree}° (${degreeInSign}° ${sign}), retrograde: ${isRetrograde}`);
          
          // If this is the Ascendant, store it separately
          if (planetName === 'Ascendant') {
            ascendant = planets[planetKey];
          }
        } else {
          console.log(`Could not match pattern for ${planetName} in line: ${line}`);
        }
      }
    }
    
    // Check for house cusps data in absolute degree format
    // Example formats: 
    // "house  1: 175.6389"
    // Line might also contain "house1: 175.6389" or variations
    const houseAbsoluteMatch = line.match(/house\s*(\d+):\s*(\d+\.\d+)/);
    
    // Alternative pattern for just house number and degree
    const houseSimpleMatch = line.match(/house\s*(\d+)\s+(\d+\.\d+)/);
    
    // Example old format 1: "house  1: 15 Lib  5'"
    // Example old format 2: "house  1: 15 Libra  5' 0.0""
    const houseTraditionalMatch = line.match(/house\s+(\d+):\s+(\d+)\s+(\w+)\s+(\d+)'(\s+(\d+\.\d+)")?/);
    
    if (houseAbsoluteMatch || houseSimpleMatch) {
      // Parse house with absolute degree
      const match = houseAbsoluteMatch || houseSimpleMatch;
      const houseNumber = parseInt(match![1]);
      const absoluteDegree = parseFloat(match![2]);
      
      // Calculate which sign the degree falls in
      const signIndex = Math.floor(absoluteDegree / 30) % 12;
      const sign = ZODIAC_SIGNS[signIndex];
      
      // Calculate degree within that sign
      const degreeInSign = absoluteDegree % 30;
      
      // Store house data - making sure cusp is the absolute degree
      houses[`house${houseNumber}`] = {
        cusp: absoluteDegree,
        name: sign,
        symbol: ZODIAC_SYMBOLS[signIndex],
        degree: degreeInSign
      };
      
      console.log(`Parsed house ${houseNumber} cusp at ${absoluteDegree}° (${degreeInSign}° ${sign})`);
      
      // If this is house 1, use it as the ascendant
      if (houseNumber === 1) {
        ascendant = {
          name: sign,
          symbol: ZODIAC_SYMBOLS[signIndex],
          longitude: absoluteDegree,
          degree: degreeInSign
        };
      }
    } else if (houseTraditionalMatch) {
      // Parse house with traditional format
      const houseNumber = parseInt(houseTraditionalMatch[1]);
      const degrees = parseInt(houseTraditionalMatch[2]);
      
      // Handle abbreviated sign names
      let sign = houseTraditionalMatch[3];
      if (sign.length <= 3) {
        // Map abbreviations to full names
        const abbrevMap: Record<string, string> = {
          'Ari': 'Aries', 'Tau': 'Taurus', 'Gem': 'Gemini', 'Can': 'Cancer',
          'Leo': 'Leo', 'Vir': 'Virgo', 'Lib': 'Libra', 'Sco': 'Scorpio',
          'Sag': 'Sagittarius', 'Cap': 'Capricorn', 'Aqu': 'Aquarius', 'Pis': 'Pisces'
        };
        sign = abbrevMap[sign] || sign;
      }
      
      const minutes = parseInt(houseTraditionalMatch[4]);
      // If seconds are available use them (captured in group 6), otherwise default to 0
      const seconds = houseTraditionalMatch[6] ? parseFloat(houseTraditionalMatch[6]) : 0;
      
      // Get the sign index
      const signIndex = ZODIAC_SIGNS.indexOf(sign);
      if (signIndex !== -1) {
        // Calculate decimal degrees within the sign including seconds
        const degreeInSign = degrees + (minutes / 60) + (seconds / 3600);
        
        // Calculate total cusp
        const cusp = signIndex * 30 + degreeInSign;
        
        // Store house data
        houses[`house${houseNumber}`] = {
          name: sign,
          symbol: ZODIAC_SYMBOLS[signIndex],
          cusp: cusp,
          degree: degreeInSign
        };
        
        // If this is house 1, use it for the ascendant
        if (houseNumber === 1) {
          ascendant = {
            name: sign,
            symbol: ZODIAC_SYMBOLS[signIndex],
            longitude: cusp,
            degree: degreeInSign
          };
        }
      }
    }
  }
  
  // If no planets were found, create some dummy planets for testing
  if (Object.keys(planets).length === 0) {
    console.log("No planets found in the output, creating dummy data for testing");
    
    // Create dummy planets for testing - real values should come from the Swiss Ephemeris output
    planets.sun = { name: 'Aries', symbol: '♈', longitude: 15, degree: 15 };
    planets.moon = { name: 'Taurus', symbol: '♉', longitude: 45, degree: 15 };
    planets.mercury = { name: 'Gemini', symbol: '♊', longitude: 75, degree: 15 };
    planets.venus = { name: 'Cancer', symbol: '♋', longitude: 105, degree: 15 };
    planets.mars = { name: 'Leo', symbol: '♌', longitude: 135, degree: 15 };
    planets.jupiter = { name: 'Virgo', symbol: '♍', longitude: 165, degree: 15 };
    planets.saturn = { name: 'Libra', symbol: '♎', longitude: 195, degree: 15 };
    
    // Use sun for ascendant if not found
    ascendant = planets.sun;
  }
  
  // Create default houses if none were found
  if (Object.keys(houses).length === 0) {
    for (let i = 1; i <= 12; i++) {
      const houseBaseAngle = (i - 1) * 30;
      const houseLongitude = (ascendant.longitude + houseBaseAngle) % 360;
      const signIndex = Math.floor(houseLongitude / 30);
      const degree = houseLongitude % 30;
      
      houses[`house${i}`] = {
        cusp: houseLongitude,
        name: ZODIAC_SIGNS[signIndex],
        symbol: ZODIAC_SYMBOLS[signIndex],
        degree
      };
    }
  }
  
  // Return the chart data
  return {
    planets,
    houses,
    ascendant
  };
}

// Define constants here for reuse
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function SwissEphPage() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [result, setResult] = useState<{ output: string; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [showChart, setShowChart] = useState(false)
  const [savingChart, setSavingChart] = useState(false)
  const [saveResult, setSaveResult] = useState<{ success: boolean; error?: string; chartId?: number } | null>(null)
  const [selectedChartId, setSelectedChartId] = useState<number | null>(null)
  const [loadingStoredChart, setLoadingStoredChart] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setChartData(null)
    setShowChart(false)

    try {
      const response = await querySwissEph({
        date,
        time,
        location
      })
      setResult(response)
      
      // Parse the result to generate chart data
      if (response.output) {
        try {
          const parsed = parseSwissEphOutput(response.output)
          // Add date, time, and location to the chart data
          parsed.date = date
          parsed.time = time
          parsed.location = location
          parsed.title = `Birth Chart - ${date}`
          console.log("Parsed chart data:", parsed)
          setChartData(parsed)
        } catch (error) {
          console.error("Failed to parse chart data:", error)
          // Create a minimal chart data object with default planets
          const defaultChart: ChartData = {
            planets: {
              sun: { name: 'Aries', symbol: '♈', longitude: 15, degree: 15, isRetrograde: false },
              moon: { name: 'Taurus', symbol: '♉', longitude: 45, degree: 15, isRetrograde: false },
              mercury: { name: 'Gemini', symbol: '♊ᴿ', longitude: 75, degree: 15, isRetrograde: true } // Mercury retrograde as example
            },
            houses: {} as Record<string, { cusp: number; name: string; symbol: string; degree: number }>,
            ascendant: { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 },
            date: date || "Example Date",
            time: time || "Example Time",
            location: location || "Example Location",
            title: `Birth Chart - ${date || "Example"}`
          }
          
          // Fill in default houses
          for (let i = 1; i <= 12; i++) {
            const angle = (i - 1) * 30
            const signIndex = Math.floor(angle / 30) % 12
            const houseKey = `house${i}` as keyof typeof defaultChart.houses
            defaultChart.houses[houseKey] = {
              cusp: angle,
              name: ZODIAC_SIGNS[signIndex],
              symbol: ZODIAC_SYMBOLS[signIndex],
              degree: 0
            }
          }
          
          setChartData(defaultChart)
        }
      }
    } catch (error) {
      setResult({ output: '', error: 'Failed to execute query. Please try again.' })
    } finally {
      setLoading(false)
    }
  }
  
  const handleShowChart = () => {
    setShowChart(true)
    setSaveResult(null)
  }
  
  // Handler for saving the chart
  const handleSaveChart = async (updatedChartData: ChartData) => {
    try {
      setSavingChart(true)
      setSaveResult(null)
      
      // Call the saveBirthChart server action
      const result = await saveBirthChart(updatedChartData)
      
      // Update state with the result
      setSaveResult(result)
      
      // Update the chart data with the saved title
      if (result.success && updatedChartData.title) {
        setChartData(prevData => {
          if (!prevData) return null;
          return {
            ...prevData,
            title: updatedChartData.title,
            id: result.chartId
          };
        });
      }
    } catch (error) {
      console.error("Error saving chart:", error);
      setSaveResult({
        success: false,
        error: "An unexpected error occurred while saving the chart."
      });
    } finally {
      setSavingChart(false)
    }
  }
  
  // Handler for updating the chart title
  const handleTitleChange = (title: string) => {
    setChartData(prevData => {
      if (!prevData) return null;
      return {
        ...prevData,
        title
      };
    });
  }
  
  // Handler for selecting a saved chart
  const handleSelectChart = async (chartId: number) => {
    try {
      setLoadingStoredChart(true);
      setSelectedChartId(chartId);
      
      // Fetch the saved chart from the database
      const savedChart = await getBirthChartById(chartId);
      
      if (!savedChart) {
        console.error('Chart not found');
        return;
      }
      
      // Convert the stored chart to our ChartData format
      // This is a simplified conversion - you'd need to map the database schema to ChartData
      const convertedChart: ChartData = {
        title: savedChart.name,
        date: new Date(savedChart.birthDate).toLocaleDateString(),
        time: savedChart.birthTime,
        location: savedChart.birthPlace,
        planets: {}, // We'd need to parse the planet positions from strings
        houses: savedChart.houses as any || {},
        aspects: savedChart.aspects as any || [],
        ascendant: { name: 'Unknown', symbol: '', longitude: 0, degree: 0 },
        id: savedChart.id,
      };
      
      // Set chart data and show the chart
      setChartData(convertedChart);
      setShowChart(true);
      
    } catch (error) {
      console.error('Error loading saved chart:', error);
    } finally {
      setLoadingStoredChart(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Birth Chart Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Calculate New Chart</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date (DD.MM.YYYY)</Label>
                  <Input 
                    id="date" 
                    placeholder="08.10.1995"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: 08.10.1995 (Day.Month.Year)</p>
                </div>
                
                <div>
                  <Label htmlFor="time">Time (HH:MM)</Label>
                  <Input 
                    id="time" 
                    placeholder="19:56"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: 19:56 (24-hour format, local time for the location)</p>
                </div>
                
                <div>
                  <Label htmlFor="location">Birth Location</Label>
                  <Input 
                    id="location" 
                    placeholder="New York, NY, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter city name, optionally with state/country (e.g., "New York, NY" or "Paris, France")</p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Calculate Birth Chart'}
                </Button>
              </div>
            </form>
          </Card>
          
          {/* Saved Charts Section */}
          <div className="mt-8">
            <SavedBirthCharts onSelectChart={handleSelectChart} />
          </div>
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {result ? (
            <>
              {result.error && (
                <div className="bg-red-900/50 border border-red-600 rounded-md p-3 mb-4">
                  <p className="text-red-200 font-medium">{result.error}</p>
                  <p className="text-gray-300 text-xs mt-2">
                    This could be due to missing libraries or configuration issues with the Swiss Ephemeris.
                  </p>
                </div>
              )}
              
              <div className="bg-black p-4 rounded-md border border-gray-700 h-[500px] overflow-auto">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {result.output.split('\n').map((line, index) => {
                    // Display headers in cyan
                    if (line.includes('----') || line.startsWith('Date:') || line.startsWith('Time:') || line.startsWith('Location:')) {
                      return <div key={index} className="text-cyan-400 font-bold">{line}</div>;
                    }
                    // Display planet data in green
                    else if (line.match(/^(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Chiron|Node|Apogee)/)) {
                      return <div key={index} className="text-green-400">{line}</div>;
                    }
                    // Display errors in red
                    else if (line.toLowerCase().includes('error') || line.toLowerCase().includes('illegal')) {
                      return <div key={index} className="text-red-400">{line}</div>;
                    }
                    // Regular output
                    return <div key={index} className="text-gray-300">{line}</div>;
                  })}
                </pre>
              </div>
              
              {/* Always show button for testing */}
              {result.output && !showChart && (
                <div className="mt-4">
                  <Button 
                    onClick={handleShowChart}
                    className="w-full bg-indigo-700 hover:bg-indigo-600"
                  >
                    Generate Natal Chart
                  </Button>
                </div>
              )}
              
              {showChart && (
                <div className="mt-6 rounded-lg overflow-hidden">
                  <h2 className="text-xl font-semibold mb-2">Natal Chart</h2>
                  
                  {saveResult && (
                    <div className={`mb-4 p-3 rounded ${saveResult.success ? 'bg-green-900/50 border border-green-600' : 'bg-red-900/50 border border-red-600'}`}>
                      {saveResult.success ? (
                        <p className="text-green-200">Chart saved successfully! Chart ID: {saveResult.chartId}</p>
                      ) : (
                        <p className="text-red-200">{saveResult.error || "Failed to save chart."}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <ZodiacWheel 
                      chartData={chartData || {
                        planets: {
                          sun: { name: 'Aries', symbol: '♈', longitude: 15, degree: 15, isRetrograde: false },
                          moon: { name: 'Taurus', symbol: '♉', longitude: 45, degree: 15, isRetrograde: false },
                          mercury: { name: 'Gemini', symbol: '♊ᴿ', longitude: 75, degree: 15, isRetrograde: true }
                        },
                        houses: {
                          house1: { cusp: 0, name: 'Aries', symbol: '♈', degree: 0 },
                          house2: { cusp: 30, name: 'Taurus', symbol: '♉', degree: 0 },
                          house3: { cusp: 60, name: 'Gemini', symbol: '♊', degree: 0 },
                          house4: { cusp: 90, name: 'Cancer', symbol: '♋', degree: 0 },
                          house5: { cusp: 120, name: 'Leo', symbol: '♌', degree: 0 },
                          house6: { cusp: 150, name: 'Virgo', symbol: '♍', degree: 0 },
                          house7: { cusp: 180, name: 'Libra', symbol: '♎', degree: 0 },
                          house8: { cusp: 210, name: 'Scorpio', symbol: '♏', degree: 0 },
                          house9: { cusp: 240, name: 'Sagittarius', symbol: '♐', degree: 0 },
                          house10: { cusp: 270, name: 'Capricorn', symbol: '♑', degree: 0 },
                          house11: { cusp: 300, name: 'Aquarius', symbol: '♒', degree: 0 },
                          house12: { cusp: 330, name: 'Pisces', symbol: '♓', degree: 0 }
                        } as Record<string, { cusp: number; name: string; symbol: string; degree: number }>,
                        ascendant: { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 },
                        date: date,
                        time: time,
                        location: location,
                        title: `Birth Chart - ${date}`,
                      } as ChartData} 
                      width={600} 
                      height={600}
                      onSaveChart={handleSaveChart}
                      onTitleChange={handleTitleChange}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500 italic">
              Results will appear here after you run a query.
            </div>
          )}
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Common Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-bold">-p[planets]</h3>
            <p className="text-sm">Specify planets: 0=Sun through 9=Pluto, D=nodes, A=mean node, t=true node, j=lilith</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold">-fPlsj</h3>
            <p className="text-sm">Format output with planet name, longitude in signs</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold">-head</h3>
            <p className="text-sm">Include headers in output</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold">-house[long],[lat],[system]</h3>
            <p className="text-sm">Calculate house cusps (P=Placidus, K=Koch, O=Porphyrius, R=Regiomontanus, etc.)</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold">-eswe</h3>
            <p className="text-sm">Use Swiss Ephemeris</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold">-b[date]</h3>
            <p className="text-sm">Birth date (automatically added)</p>
          </Card>
        </div>
      </div>
    </div>
  )
}