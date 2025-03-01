"use server";
import { neon } from "@neondatabase/serverless";
import prisma from "./lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateBirthChart as calculateEphemerisChart, geocodeLocation } from './lib/ephemeris';

//export function getData() {
//    const sql = neon(process.env.DATABASE_URL);
 //   const data = await sql`...`;
   // return data;
//}

export const addUser = async (formData: FormData) => {
    const uname = formData.get("uname") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const birthday = formData.get("birthday") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const questions = formData.get("questions") as string;
    const rtype = formData.get("rtype") as string;
    const price = formData.get("price") as string;
    
    await prisma.user.create({
      data: {
        uname: uname as string,
        phone: phone as string,
        email: email as string,
        birthday: birthday as string,
        time: time as string,
        location: location as string,
        questions: questions as string,
        rtype: rtype as string,
        price: price as string
      },
    });
  };

export const calculateBirthChart = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const birthDate = formData.get("birthDate") as string;
    const birthTime = formData.get("birthTime") as string;
    const birthPlace = formData.get("birthPlace") as string;
    const userId = formData.get("userId") as string;
    const notes = formData.get("notes") as string;
    const houseSystem = formData.get("houseSystem") as string || 'P'; // Default to Placidus

    console.log('Processing birth chart calculation:', {
      name,
      birthDate,
      birthTime,
      birthPlace,
      houseSystem
    });

    // Parse the birth date and time into a single Date object
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    // Get geocoded coordinates for the birth place
    const { latitude, longitude, formattedAddress } = await geocodeLocation(birthPlace);
    console.log('Geocoded location:', { latitude, longitude, formattedAddress });

    // Check if location was found (both latitude and longitude are 0 for not found)
    if (latitude === 0 && longitude === 0) {
      return { 
        success: false, 
        error: formattedAddress // This will be the error message from geocodeLocation
      };
    }

    // Calculate the birth chart using our ephemeris functions
    const chartData = await calculateEphemerisChart(dateObj, latitude, longitude, houseSystem);
    console.log('Chart calculation completed');
    
    // Helper function to safely get planet info
    const getPlanetInfo = (planetName: string) => {
      const planets = chartData.planets || {};
      const planet = planets[planetName];
      
      if (planet && typeof planet === 'object' && 'name' in planet && 'degree' in planet) {
        return `${planet.name} ${planet.degree}°`;
      }
      
      return 'Unknown';
    };
    
    // Format the planet positions for storage, with safeguards
    const planetPositions = {
      ascendant: chartData.ascendant && chartData.ascendant.name ? 
        `${chartData.ascendant.name} ${chartData.ascendant.degree}°` : 'Unknown',
      sun: getPlanetInfo('sun'),
      moon: getPlanetInfo('moon'),
      mercury: getPlanetInfo('mercury'),
      venus: getPlanetInfo('venus'),
      mars: getPlanetInfo('mars'),
      jupiter: getPlanetInfo('jupiter'),
      saturn: getPlanetInfo('saturn'),
      uranus: getPlanetInfo('uranus'),
      neptune: getPlanetInfo('neptune'),
      pluto: getPlanetInfo('pluto'),
    };
    
    // Save the birth chart to the database
    const birthChart = await prisma.birthChart.create({
      data: {
        name,
        birthDate: dateObj,
        birthTime,
        birthPlace: formattedAddress || birthPlace,
        notes,
        userId: userId ? parseInt(userId) : undefined,
        // Planet positions
        ...planetPositions,
        // House and aspect data
        houses: chartData.houses || {},
        aspects: chartData.aspects || []
      }
    });

    console.log('Birth chart saved to database with ID:', birthChart.id);
    revalidatePath('/birth-chart');
    return { success: true, chartId: birthChart.id, chartData };
  } catch (error) {
    console.error("Error calculating birth chart:", error);
    return { 
      success: false, 
      error: "Failed to create birth chart. Please check your birth information and try again." 
    };
  }
};

export const getBirthCharts = async (userId?: number) => {
  try {
    const where = userId ? { userId } : {};
    const birthCharts = await prisma.birthChart.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return birthCharts;
  } catch (error) {
    console.error("Error fetching birth charts:", error);
    return [];
  }
};

export const getBirthChartById = async (chartId: number) => {
  try {
    const birthChart = await prisma.birthChart.findUnique({
      where: { id: chartId }
    });
    return birthChart;
  } catch (error) {
    console.error("Error fetching birth chart:", error);
    return null;
  }
};

export const deleteBirthChart = async (chartId: number) => {
  try {
    await prisma.birthChart.delete({
      where: { id: chartId }
    });
    revalidatePath('/birth-chart');
    return { success: true };
  } catch (error) {
    console.error("Error deleting birth chart:", error);
    return { success: false, error: "Failed to delete birth chart." };
  }
};

// Tarot Reading Actions



// Save a tarot reading
export const saveTarotReading = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const spreadType = formData.get("spreadType") as string;
    const cards = formData.get("cards") as string;
    const question = formData.get("question") as string;
    const notes = formData.get("notes") as string;
    const userId = formData.get("userId") as string;
    
    if (!name || !spreadType || !cards) {
      return {
        success: false,
        error: "Missing required fields for tarot reading."
      };
    }
    
    // Parse the cards JSON data
    let parsedCards;
    try {
      parsedCards = JSON.parse(cards);
    } catch (e) {
      return {
        success: false,
        error: "Invalid card data format."
      };
    }
    
    // Create the tarot reading in the database
    const reading = await prisma.tarotReading.create({
      data: {
        name,
        spreadType,
        cards: parsedCards,
        question: question || null,
        notes: notes || null,
        userId: userId ? parseInt(userId) : null,
      }
    });
    
    revalidatePath('/divination');
    return { success: true, readingId: reading.id };
  } catch (error) {
    console.error("Error saving tarot reading:", error);
    return { 
      success: false, 
      error: "Failed to save tarot reading. Please try again."
    };
  }
};

// Get all tarot readings
export const getTarotReadings = async (userId?: number) => {
  try {
    const where = userId ? { userId } : {};
    const readings = await prisma.tarotReading.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return readings;
  } catch (error) {
    console.error("Error fetching tarot readings:", error);
    return [];
  }
};

// Get a specific tarot reading by ID
export const getTarotReadingById = async (readingId: number) => {
  try {
    const reading = await prisma.tarotReading.findUnique({
      where: { id: readingId }
    });
    return reading;
  } catch (error) {
    console.error("Error fetching tarot reading:", error);
    return null;
  }
};

// Delete a tarot reading
export const deleteTarotReading = async (readingId: number) => {
  try {
    await prisma.tarotReading.delete({
      where: { id: readingId }
    });
    revalidatePath('/divination');
    return { success: true };
  } catch (error) {
    console.error("Error deleting tarot reading:", error);
    return { success: false, error: "Failed to delete tarot reading." };
  }
};

export const updateBirthChart = async (chartId: number, formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const birthDate = formData.get("birthDate") as string;
    const birthTime = formData.get("birthTime") as string;
    const birthPlace = formData.get("birthPlace") as string;
    const notes = formData.get("notes") as string;
    
    // Parse the birth date and time into a single Date object
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    // Geocode the location 
    const { latitude, longitude, formattedAddress } = await geocodeLocation(birthPlace);
    
    // Check if location was found
    if (latitude === 0 && longitude === 0) {
      return { 
        success: false, 
        error: formattedAddress // This will be the error message from geocodeLocation
      };
    }

    // Recalculate the birth chart
    const chartData = await calculateEphemerisChart(dateObj, latitude, longitude);
    
    // Helper function to safely get planet info
    const getPlanetInfo = (planetName: string) => {
      const planets = chartData.planets || {};
      const planet = planets[planetName];
      
      if (planet && typeof planet === 'object' && 'name' in planet && 'degree' in planet) {
        return `${planet.name} ${planet.degree}°`;
      }
      
      return 'Unknown';
    };
    
    // Format the planet positions for storage
    const planetPositions = {
      ascendant: chartData.ascendant && chartData.ascendant.name ? 
        `${chartData.ascendant.name} ${chartData.ascendant.degree}°` : 'Unknown',
      sun: getPlanetInfo('sun'),
      moon: getPlanetInfo('moon'),
      mercury: getPlanetInfo('mercury'),
      venus: getPlanetInfo('venus'),
      mars: getPlanetInfo('mars'),
      jupiter: getPlanetInfo('jupiter'),
      saturn: getPlanetInfo('saturn'),
      uranus: getPlanetInfo('uranus'),
      neptune: getPlanetInfo('neptune'),
      pluto: getPlanetInfo('pluto'),
    };
    
    // Update the birth chart in the database
    const updatedChart = await prisma.birthChart.update({
      where: { id: chartId },
      data: {
        name,
        birthDate: dateObj,
        birthTime,
        birthPlace: formattedAddress || birthPlace,
        notes,
        ...planetPositions,
        houses: chartData.houses || {},
        aspects: chartData.aspects || []
      }
    });
    
    revalidatePath('/birth-chart');
    revalidatePath(`/birth-chart/${chartId}`);
    return { success: true, chartId: updatedChart.id };
  } catch (error) {
    console.error("Error updating birth chart:", error);
    return { 
      success: false, 
      error: "Failed to update birth chart. Please check your information and try again." 
    };
  }
};