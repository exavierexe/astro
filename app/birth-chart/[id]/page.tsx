"use client";

import { useEffect, useState } from "react";
import { getBirthChartById, deleteBirthChart, updateBirthChart } from "@/actions";
import { BirthChartFull } from "@/components/ui/birthchart";
import { ZodiacWheel } from "@/components/ui/zodiacwheel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function BirthChartDetail() {
  const [birthChart, setBirthChart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const chartId = params?.id as string;

  useEffect(() => {
    const loadChart = async () => {
      try {
        if (!chartId) {
          setError("No chart ID provided");
          setIsLoading(false);
          return;
        }

        const chart = await getBirthChartById(parseInt(chartId));
        
        if (!chart) {
          setError("Chart not found");
        } else {
          setBirthChart(chart);
        }
      } catch (error) {
        console.error("Error loading birth chart:", error);
        setError("Error loading birth chart");
      } finally {
        setIsLoading(false);
      }
    };

    loadChart();
  }, [chartId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading birth chart...</p>
      </div>
    );
  }

  if (error || !birthChart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-red-500">{error || "Chart not found"}</h1>
        <Link href="/birth-chart">
          <Button>Back to Birth Charts</Button>
        </Link>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setFormError(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const result = await updateBirthChart(parseInt(chartId), formData);
      if (result.success) {
        // Reload the chart and close the edit form
        const chart = await getBirthChartById(parseInt(chartId));
        setBirthChart(chart);
        setIsEditing(false);
      } else {
        setFormError(result.error || "Error updating birth chart. Please check your input and try again.");
      }
    } catch (error) {
      console.error("Error submitting birth chart update:", error);
      setFormError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const result = await deleteBirthChart(parseInt(chartId));
      if (result.success) {
        router.push('/birth-chart');
      } else {
        setFormError(result.error || "Error deleting birth chart. Please try again.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting birth chart:", error);
      setFormError("An unexpected error occurred. Please try again later.");
      setIsDeleting(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date for the edit form
  const formatDateForInput = (date: string | Date) => {
    const d = new Date(date);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/birth-chart">
            <Button variant="outline">← Back to Charts</Button>
          </Link>
          {!isEditing && (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)} variant="outline">Edit Chart</Button>
              <Button onClick={() => setIsDeleting(true)} variant="destructive">Delete</Button>
            </div>
          )}
        </div>
        
        {isDeleting && (
          <div className="bg-gray-800 p-6 mb-8 rounded-lg border border-red-500">
            <h2 className="text-xl font-bold mb-4">Delete Birth Chart</h2>
            <p className="mb-4">Are you sure you want to delete this birth chart? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <Button onClick={() => setIsDeleting(false)} variant="outline" disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="destructive" disabled={isProcessing}>
                {isProcessing ? "Deleting..." : "Delete Chart"}
              </Button>
            </div>
          </div>
        )}
        
        {isEditing ? (
          <div className="bg-gray-900 p-6 mb-8 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Birth Chart</h2>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              {formError && (
                <div className="p-3 mb-4 text-sm bg-red-900 text-white rounded-md">
                  <strong>Error:</strong> {formError}
                </div>
              )}
            
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Chart Name/Title</label>
                <input
                  id="name"
                  name="name"
                  className="w-full p-2 border rounded-md bg-black text-white"
                  defaultValue={birthChart.name}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-sm font-medium">Birth Date</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className="w-full p-2 border rounded-md bg-black text-white"
                  defaultValue={formatDateForInput(birthChart.birthDate)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="birthTime" className="text-sm font-medium">Birth Time</label>
                <input
                  id="birthTime"
                  name="birthTime"
                  type="time"
                  className="w-full p-2 border rounded-md bg-black text-white"
                  defaultValue={birthChart.birthTime}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="birthPlace" className="text-sm font-medium">Birth Place</label>
                <input
                  id="birthPlace"
                  name="birthPlace"
                  className="w-full p-2 border rounded-md bg-black text-white"
                  defaultValue={birthChart.birthPlace}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter a city name like "Miami" or "Miami, Florida" - try to use major cities for better accuracy
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="w-full p-2 border rounded-md h-24 bg-black text-white"
                  defaultValue={birthChart.notes || ''}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                >
                  {isProcessing ? "Updating..." : "Update Birth Chart"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <BirthChartFull chart={birthChart} />
        )}
        
        <div className="mt-12 text-center">
          <p className="text-sm mb-4">
            This birth chart calculation uses precise astronomical calculations based on 
            the exact time and location of birth to determine planetary positions.
          </p>
          <Link href="/birth-chart">
            <Button>Create Another Chart</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}