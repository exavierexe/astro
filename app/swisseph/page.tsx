'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { querySwissEph } from '@/actions'

export default function SwissEphPage() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [result, setResult] = useState<{ output: string; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await querySwissEph({
        date,
        time
      })
      setResult(response)
    } catch (error) {
      setResult({ output: '', error: 'Failed to execute query. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Swiss Ephemeris Query Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
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
                <p className="text-xs text-gray-500 mt-1">Format: 19:56 (24-hour format)</p>
              </div>
              
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Run Query'}
              </Button>
            </div>
          </form>
        </Card>
        
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