const express = require('express');
const router = express.Router();
const axios = require('axios');
const SearchHistory = require('../models/SearchHistory'); 
const API_KEY = process.env.OPENWEATHER_API;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';


const generateAdvisory = (weatherData) => {
    const advisories = [];
    const current = weatherData.list[0];

    if (!current) return ["No weather data available to generate advisories."];

    const temp = current.main.temp;
    const pop = current.pop * 100; 
    const windSpeed = current.wind.speed * 3.6; 
    const humidity = current.main.humidity;
    
  
    if (pop > 60) {
        advisories.push("HIGH RISK: Avoid irrigation and pesticide spraying today due to heavy rain forecast.");
    }
    
    
    if (temp > 35) {
        advisories.push("ACTION: High heat warning. Increase irrigation frequency for heat-sensitive crops.");
    }

   
    if (windSpeed > 15) {
        advisories.push("CAUTION: Wind Speed is high. Do not spray pesticides due to drift risk.");
    }

   
    if (humidity > 80) {
        advisories.push("MONITOR: High humidity detected. Possible fungal infection risk; monitor your crop closely.");
    }
    
    
    if (windSpeed < 10 && pop < 20) {
        advisories.push("GOOD WINDOW: Excellent conditions for applying foliar treatments.");
    }

    return advisories;
};



router.post('/weather', async (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ message: 'Location is required.' });
    }

    try {
        
        const weatherResponse = await axios.get(BASE_URL, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric' 
            }
        });

        const weatherData = weatherResponse.data;
        
      
        const advisory = generateAdvisory(weatherData);

        
        const currentData = weatherData.list[0];
        const newSearch = new SearchHistory({
            location: weatherData.city.name, 
            resultSnapshot: {
                temp: currentData.main.temp,
                description: currentData.weather[0].description,
                icon: currentData.weather[0].icon
            }
        });

        await newSearch.save(); 
        
       
        return res.json({ 
            data: weatherData, 
            advisory: advisory 
        });

    } catch (error) {
        
        console.error('Weather API Error:', error.response ? error.response.data : error.message);

        
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



router.get('/history', async (req, res) => {
    try {
        const history = await SearchHistory.find({})
            .sort({ createdAt: -1 }) 
            .limit(5) 
            .select('location createdAt resultSnapshot'); 

        return res.json(history);
    } catch (error) {
        console.error('History Retrieval Error:', error.message);
        return res.status(500).json({ message: 'Failed to retrieve search history.' });
    }
});

module.exports = router;