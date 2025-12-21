

import React, { useState } from "react";
import axios from "axios";
import "./Home.css"

import SearchBar from "../../components/SearchBar/SearchBar";
import Dashboard from "../../components/Dashboard/Dashboard";
import WeatherCard from "../../components/WeatherCard/WeatherCard";
import AdvisoryBox from "../../components/AdvisoryBox/AdvisoryBox";
import AdvancedCharts from "../../components/Chart/AdvancedCharts";
import "../../components/Chart/AdvancedCharts.css";
import "../../components/Dashboard/Dashboard.css";

import SearchHistory from "../../views/SearchHistory/SearchHistory"; 
import farmImage from './farm.jpg';
import farmWeatherImage from './farm_weather_image.jpg';

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
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(searchLocation)) {
          history.unshift(searchLocation);
          localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching data. Check your backend and server logs.");
        setWeather(null); 
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
   
    <div className="home-container">
      {/* Keeping inline style here for consistency with the new H1 color from CSS */}
      <h1 style={{ color: "#2E7D32", marginBottom: "30px" }}>🌱 Farmer Weather Advisory Tool</h1>

      {/* Dashboard - Shows quick stats and farming insights */}
      <Dashboard weather={weather} advisory={advisory} />

      {}
      <div className="content-wrapper">

          {}
          <div className="main-column">
              <SearchBar
                location={location}
                setLocation={setLocation}
                fetchWeather={() => fetchWeather(location)}
                isLoading={isLoading}
              />

              {}
              <div className="results-row">
                  <WeatherCard weather={weather} />
                  <AdvisoryBox advisory={advisory} />
              </div>

              {}
              {weather && (
                <AdvancedCharts forecast={weather.list.slice(0, 10)} />
              )}
          </div>

          {}
          <SearchHistory onHistoryClick={handleHistoryClick} />
      </div>

    
    <div className="info-section">

  {/* Section 1 */}
  <div className="info-row left-image">
    <img src={farmImage} alt="Farming" className="info-image" />
    <div className="info-text">
      <h2>Farming Practices and Weather Impact</h2>
      <p>
        Weather plays one of the most crucial roles in successful farming.
        Temperature, humidity, rainfall, and wind conditions directly influence every
        agricultural decision—from seed selection to harvesting time.
      </p>
      <p>
        By understanding and tracking weather patterns, farmers can plan their
        sowing schedule, irrigation cycles, fertilizer application, and pest control
        activities more effectively. This helps minimize risks caused by drought,
        excessive rainfall, extreme heat waves, or unexpected storms—ultimately
        improving crop quality and yield.
      </p>
    </div>
  </div>

  {/* Section 2 */}
  <div className="info-row right-image">
    <div className="info-text">
      <h2>Weather Advisory for Farmers</h2>
      <p>
        Weather advisories offer timely and actionable insights that help farmers take
        preventive and protective measures for their crops. These advisories provide
        essential updates such as rainfall predictions, temperature alerts, wind speed,
        humidity changes, and extreme weather warnings.
      </p>
      <p>
        By following real-time weather advisories, farmers can safeguard their fields,
        optimize farming tasks, reduce losses, and make smart decisions that support
        sustainable farming. This ensures better productivity, cost efficiency, and
        long-term resilience against climate challenges.
      </p>
    </div>
    <img src={farmWeatherImage} alt="Weather" className="info-image" />
  </div>

</div>
    </div>
  );
}

export default Home;
