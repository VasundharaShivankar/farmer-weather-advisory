const express = require('express');
const router = express.Router();
const axios = require('axios');
const SearchHistory = require('../models/SearchHistory'); 


const API_KEY = process.env.OPENWEATHER_API; 
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';


 

 
 
const generateAdvisory = (weatherData) => {
    const advisories = [];
    const forecastList = weatherData.list;
    
    if (!forecastList || forecastList.length === 0) {
        return ["No 5-day forecast data available to generate advisories."];
    }

    
    const next12Hours = forecastList.slice(0, 4); 


    const highRainRisk = next12Hours.some(item => item.pop > 0.6); 
    if (highRainRisk) {
        advisories.push("HIGH RISK: Avoid irrigation and pesticide spraying due to high rain probability expected within the next 12 hours.");
    }

    
    const highTemp = next12Hours.some(item => item.main.temp > 35);
    if (highTemp) {
        advisories.push("ACTION: High heat warning. Increase irrigation frequency for heat-sensitive crops (Temperature > 35°C expected).");
    }

   
    const highWind = next12Hours.some(item => (item.wind.speed * 3.6) > 15);
    if (highWind) {
        advisories.push("CAUTION: Wind Speed is high (> 15 km/h expected). Do not spray pesticides due to drift risk.");
    }

    
    const highHumidity = next12Hours.some(item => item.main.humidity > 80);
    if (highHumidity) {
        advisories.push("MONITOR: High humidity detected (> 80% expected). Possible fungal infection risk; monitor your crop closely.");
    }

    
    const next6to9Hours = forecastList.slice(0, 3); 
    const safeWind = next6to9Hours.every(item => (item.wind.speed * 3.6) < 10);
    const zeroRain = next6to9Hours.every(item => item.pop < 0.2); 

    
    if (!highRainRisk && !highWind && safeWind && zeroRain) {
        advisories.push("GOOD WINDOW: Excellent conditions for applying foliar treatments (Low wind and negligible rain risk in the next 6-9 hours).");
    }

    
    if (advisories.length === 0) {
        advisories.push("Weather conditions are currently stable. Continue with routine farming tasks.");
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
        return res.status(error.response ? error.response.status : 500).json({ 
            message: `Failed to fetch weather data for ${location}. Please check the location name.` 
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