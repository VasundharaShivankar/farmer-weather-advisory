// client/src/pages/Home.js

import React, { useState } from "react";
import axios from "axios";
// Imports checked against a standard MERN file structure:
import SearchBar from "../../components/SearchBar/SearchBar";
import WeatherCard from "../../components/WeatherCard/WeatherCard";
import AdvisoryBox from "../../components/AdvisoryBox/AdvisoryBox";
import Chart from "../../components/Chart/Chart";
// 🚨 POTENTIAL FIX: Adjust path to SearchHistory based on folder structure (assuming views/ or pages/ is where it lives)
import SearchHistory from "../../views/SearchHistory/SearchHistory"; // ⬅️ Changed path depth

function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [advisory, setAdvisory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  const fetchWeather = async (loc) => { 
    const searchLocation = loc || location; 
    if (!searchLocation.trim()) return;

    setIsLoading(true);
    try {
        const res = await axios.post("http://localhost:5000/api/weather", {
          location: searchLocation,
        });

        setWeather(res.data.data);
        setAdvisory(res.data.advisory);

        // Save to local storage for search history 
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(searchLocation)) {
          history.unshift(searchLocation);
          localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching data. Check your backend and server logs.");
        setWeather(null); // Clear weather on error
        setAdvisory([]);
    } finally {
        setIsLoading(false);
    }
  };
    
  const handleHistoryClick = (histLocation) => {
    setLocation(histLocation);
    fetchWeather(histLocation);
  };

  return (
    // Replaced inline style with "home-container" class
    <div className="home-container"> 
      {/* Keeping inline style here for consistency with the new H1 color from CSS */}
      <h1 style={{ color: "#2E7D32", marginBottom: "30px" }}>Farmer Weather Advisory Tool</h1> 

      {/* Replaced inline style with "content-wrapper" class for main flex layout */}
      <div className="content-wrapper">
          
          {/* Replaced inline style with "main-column" class */}
          <div className="main-column"> 
              <SearchBar
                location={location}
                setLocation={setLocation}
                fetchWeather={() => fetchWeather(location)}
                isLoading={isLoading}
              />
          
              {/* Replaced inline style with "results-row" class for cards layout */}
              <div className="results-row">
                  <WeatherCard weather={weather} />
                  <AdvisoryBox advisory={advisory} />
              </div>

              {/* Chart (Renders only if weather data is present) */}
              {weather && (
                // Used the "card-box" utility class and kept inline style for size control
                <div className="card-box" style={{ width: '100%', maxWidth: '800px', margin: '20px 0' }}> 
                    <Chart forecast={weather.list.slice(0, 10)} />
                </div>
              )}
          </div>

          {/* SearchHistory component */}
          <SearchHistory onHistoryClick={handleHistoryClick} />
      </div>
    </div>
  );
}

export default Home;