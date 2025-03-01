"use client";

import { useEffect, useState } from "react";
import { calculateBirthChart, getBirthCharts } from "@/actions";
import { BirthChart, BirthChartForm } from "@/components/ui/birthchart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BirthChartCalculator() {
  const [birthCharts, setBirthCharts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCharts = async () => {
      try {
        const charts = await getBirthCharts();
        setBirthCharts(charts);
      } catch (error) {
        console.error("Error loading birth charts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharts();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const result = await calculateBirthChart(formData);
      if (result.success) {
        // Reload charts
        const charts = await getBirthCharts();
        setBirthCharts(charts);
        setFormVisible(false);
        
        // Redirect to the new chart
        router.push(`/birth-chart/${result.chartId}`);
      } else {
        // Show error message in the form
        setError(result.error || "Error creating birth chart. Please check your input and try again.");
      }
    } catch (error) {
      console.error("Error submitting birth chart:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 grid grid-rows-[auto_1fr_auto] gap-8">
      <header className="text-center">
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">Birth Chart Calculator</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Generate and save personalized astrological birth charts based on exact time, 
          date, and location of birth to gain insights into personality traits and life patterns.
        </p>
        <div className="mt-8">
          <Button 
            size="lg" 
            onClick={() => setFormVisible(!formVisible)}
            className="mx-auto"
          >
            {formVisible ? "Hide Form" : "Create New Birth Chart"}
          </Button>
        </div>
      </header>

      <main className="space-y-10">
        {formVisible && (
          <div className="max-w-md mx-auto my-8">
            <Card>
              <CardHeader>
                <CardTitle>Create Birth Chart</CardTitle>
                <CardDescription>
                  Enter birth details to generate an astrological chart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 mb-4 text-sm bg-red-900 text-white rounded-md">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Chart Name/Title
                    </label>
                    <input
                      id="name"
                      name="name"
                      className="w-full p-2 border rounded-md bg-black text-white placeholder-gray-400"
                      placeholder="e.g. My Birth Chart or John's Chart"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="birthDate" className="text-sm font-medium">
                      Birth Date
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      className="w-full p-2 border rounded-md bg-black text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="birthTime" className="text-sm font-medium">
                      Birth Time (as exact as possible)
                    </label>
                    <input
                      id="birthTime"
                      name="birthTime"
                      type="time"
                      className="w-full p-2 border rounded-md bg-black text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="birthPlace" className="text-sm font-medium">
                      Birth Place
                    </label>
                    <input
                      id="birthPlace"
                      name="birthPlace"
                      className="w-full p-2 border rounded-md bg-black text-white placeholder-gray-400"
                      placeholder="City, State/Province, Country"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter a city name like "Miami" or "Miami, Florida" - try to use major cities for better accuracy
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="houseSystem" className="text-sm font-medium">
                      House System
                    </label>
                    <select
                      id="houseSystem"
                      name="houseSystem"
                      className="w-full p-2 border rounded-md bg-black text-white"
                      defaultValue="P"
                    >
                      <option value="P">Placidus</option>
                      <option value="K">Koch</option>
                      <option value="O">Porphyrius</option>
                      <option value="R">Regiomontanus</option>
                      <option value="C">Campanus</option>
                      <option value="E">Equal</option>
                      <option value="W">Whole Sign</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Placidus is the most commonly used house system in Western astrology
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="w-full p-2 border rounded-md h-24 bg-black text-white placeholder-gray-400"
                      placeholder="Any additional information or questions about this chart..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Calculating..." : "Calculate Birth Chart"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Your Birth Charts</h2>
          
          {isLoading ? (
            <div className="text-center py-12">Loading birth charts...</div>
          ) : birthCharts.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-4">You don't have any birth charts yet.</p>
              {!formVisible && (
                <Button onClick={() => setFormVisible(true)}>
                  Create Your First Chart
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {birthCharts.map((chart) => (
                <Link key={chart.id} href={`/birth-chart/${chart.id}`} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{chart.name}</CardTitle>
                      <CardDescription>
                        {new Date(chart.birthDate).toLocaleDateString()} at {chart.birthTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Sun:</span>
                          <span className="font-medium">{chart.sun || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moon:</span>
                          <span className="font-medium">{chart.moon || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ascendant:</span>
                          <span className="font-medium">{chart.ascendant || 'Unknown'}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">View Chart</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-sm opacity-70 py-4">
        <p>All birth chart calculations are based on precise astronomical data and traditional astrological interpretations.</p>
      </footer>
    </div>
  );
}