const express = require('express');
const router = express.Router();
const axios = require('axios');
const SearchHistory = require('../models/SearchHistory'); // Import the model

// Ensure you set your API key in a .env file (e.g., OPENWEATHER_API_KEY=your_key)
const API_KEY = process.env.OPENWEATHER_API; // ⬅️ FIX: Use OPENWEATHER_API
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

/**
 * Generates rule-based farmer advisories by analyzing the 5-day forecast data.
 * The logic checks for risks over the next 12 hours (4 forecast blocks).
 * Uses 5 rules, fulfilling the assignment requirement.
 */
const generateAdvisory = (weatherData) => {
    const advisories = [];
    const forecastList = weatherData.list;
    
    if (!forecastList || forecastList.length === 0) {
        return ["No 5-day forecast data available to generate advisories."];
    }

    // Look at the next 4 blocks (current + next 9 hours = 12 hours total) for risk assessment
    const next12Hours = forecastList.slice(0, 4); 

    // --- Rule 1: High Rain Risk (> 60% POP in next 12 hours) ---
    // Rule: Rain Probability > 60% -> Avoid irrigation and pesticide spraying today.
    const highRainRisk = next12Hours.some(item => item.pop > 0.6); // POP is 0 to 1
    if (highRainRisk) {
        advisories.push("HIGH RISK: Avoid irrigation and pesticide spraying due to high rain probability expected within the next 12 hours.");
    }

    // --- Rule 2: Heat Stress (> 35°C in next 12 hours) ---
    // Rule: High Temperature (>35°C) -> Increase irrigation frequency for heat-sensitive crops.
    const highTemp = next12Hours.some(item => item.main.temp > 35);
    if (highTemp) {
        advisories.push("ACTION: High heat warning. Increase irrigation frequency for heat-sensitive crops (Temperature > 35°C expected).");
    }

    // --- Rule 3: Pesticide Drift (Wind Speed > 15 km/h in next 12 hours) ---
    // Rule: Wind Speed > 15 km/h -> Do not spray pesticides due to drift risk.
    // Convert m/s (OpenWeatherMap) to km/h: 1 m/s ≈ 3.6 km/h
    const highWind = next12Hours.some(item => (item.wind.speed * 3.6) > 15);
    if (highWind) {
        advisories.push("CAUTION: Wind Speed is high (> 15 km/h expected). Do not spray pesticides due to drift risk.");
    }

    // --- Rule 4: Fungal Risk (> 80% Humidity in next 12 hours) ---
    // Rule: High Humidity (> 80%) -> Possible fungal infection; monitor your crop.
    const highHumidity = next12Hours.some(item => item.main.humidity > 80);
    if (highHumidity) {
        advisories.push("MONITOR: High humidity detected (> 80% expected). Possible fungal infection risk; monitor your crop closely.");
    }

    // --- Rule 5: Good Spraying Window (Safe Wind and No Rain in next 6-9 hours) ---
    // Rule: If wind < 10 km/h and no rain expected in next 6 hours.
    const next6to9Hours = forecastList.slice(0, 3); // Check next 3 blocks for safety
    const safeWind = next6to9Hours.every(item => (item.wind.speed * 3.6) < 10);
    const zeroRain = next6to9Hours.every(item => item.pop < 0.2); // Using < 20% POP as 'no rain'

    // Only advise safe spraying if no HIGH RAIN or HIGH WIND warnings were issued.
    if (!highRainRisk && !highWind && safeWind && zeroRain) {
        advisories.push("GOOD WINDOW: Excellent conditions for applying foliar treatments (Low wind and negligible rain risk in the next 6-9 hours).");
    }

    // Default Advisory if no risks were found
    if (advisories.length === 0) {
        advisories.push("Weather conditions are currently stable. Continue with routine farming tasks.");
    }

    return advisories;
};


/**
 * POST /api/weather
 * Fetches weather, processes advisories, and saves history.
 */
router.post('/weather', async (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ message: 'Location is required.' });
    }

    try {
        // Fetch weather data from OpenWeatherMap
        const weatherResponse = await axios.get(BASE_URL, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric' // For temperature in Celsius
            }
        });

        const weatherData = weatherResponse.data;
        
        // Generate farmer-friendly advisories
        const advisory = generateAdvisory(weatherData); // <-- This now uses the full forecast list

        // Save search history to MongoDB (Optional Feature)
        const currentData = weatherData.list[0];
        const newSearch = new SearchHistory({
            location: weatherData.city.name, // Use the city name from the API response for consistency
            resultSnapshot: {
                temp: currentData.main.temp,
                description: currentData.weather[0].description,
                icon: currentData.weather[0].icon
            }
        });

        await newSearch.save(); 
        
        // Respond to the frontend
        return res.json({ 
            data: weatherData, 
            advisory: advisory 
        });

    } catch (error) {
        // Handle API errors (e.g., city not found)
        console.error('Weather API Error:', error.response ? error.response.data : error.message);
        return res.status(error.response ? error.response.status : 500).json({ 
            message: `Failed to fetch weather data for ${location}. Please check the location name.` 
        });
    }
});


/**
 * GET /api/history
 * Fetches the last 5 search history items from MongoDB. (Optional Feature)
 */
router.get('/history', async (req, res) => {
    try {
        const history = await SearchHistory.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(5) // Limit to the last 5
            .select('location createdAt resultSnapshot'); 

        return res.json(history);
    } catch (error) {
        console.error('History Retrieval Error:', error.message);
        return res.status(500).json({ message: 'Failed to retrieve search history.' });
    }
});

module.exports = router;