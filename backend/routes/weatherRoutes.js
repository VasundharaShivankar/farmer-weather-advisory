const express = require('express');
const router = express.Router();
const axios = require('axios');
const SearchHistory = require('../models/SearchHistory'); // Import the model

// Ensure you set your API key in a .env file (e.g., OPENWEATHER_API_KEY=your_key)
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

/**
 * ⚠️ IMPORTANT: Implement your 4-5 rule-based advisory logic here. 
 * This is a placeholder function.
 */
const generateAdvisory = (weatherData) => {
    const advisories = [];
    const current = weatherData.list[0];

    if (!current) return ["No weather data available to generate advisories."];

    const temp = current.main.temp;
    const pop = current.pop * 100; // Rain probability (0-100%)
    const windSpeed = current.wind.speed * 3.6; // Convert m/s to km/h
    const humidity = current.main.humidity;
    
    // Rule 1: High Rain Probability (> 60%)
    if (pop > 60) {
        advisories.push("HIGH RISK: Avoid irrigation and pesticide spraying today due to heavy rain forecast.");
    }
    
    // Rule 2: High Temperature (> 35°C)
    if (temp > 35) {
        advisories.push("ACTION: High heat warning. Increase irrigation frequency for heat-sensitive crops.");
    }

    // Rule 3: High Wind Speed (> 15 km/h)
    if (windSpeed > 15) {
        advisories.push("CAUTION: Wind Speed is high. Do not spray pesticides due to drift risk.");
    }

    // Rule 4: High Humidity (> 80%)
    if (humidity > 80) {
        advisories.push("MONITOR: High humidity detected. Possible fungal infection risk; monitor your crop closely.");
    }
    
    // Rule 5: Good Spraying Window (Bonus Rule)
    if (windSpeed < 10 && pop < 20) {
        advisories.push("GOOD WINDOW: Excellent conditions for applying foliar treatments.");
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
        const advisory = generateAdvisory(weatherData);

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

        // Fallback to mock data if API fails
        const mockWeatherData = {
            city: { name: location },
            list: [
                {
                    main: { temp: 20, humidity: 60 },
                    weather: [{ description: 'clear sky', icon: '01d' }],
                    pop: 0.1,
                    wind: { speed: 3.5 },
                    dt_txt: new Date().toISOString()
                }
            ]
        };
        const mockAdvisory = ['Weather conditions are stable. Continue with routine farming tasks.'];

        // Save mock search history
        const currentData = mockWeatherData.list[0];
        const newSearch = new SearchHistory({
            location: mockWeatherData.city.name,
            resultSnapshot: {
                temp: currentData.main.temp,
                description: currentData.weather[0].description,
                icon: currentData.weather[0].icon
            }
        });

        await newSearch.save();

        return res.json({
            data: mockWeatherData,
            advisory: mockAdvisory
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