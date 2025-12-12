import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather || !weather.list || weather.list.length === 0) return null;

  const current = weather.list[0];
  const cityName = weather.city.name;
  const temp = Math.round(current.main.temp); // Round for cleaner display
  const description = current.weather[0].description;
  
  // Simple icon map for a farmer-friendly look
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Rain': return '🌧️';
      case 'Clouds': return '☁️';
      case 'Clear': return '☀️';
      case 'Drizzle': return '🌦️';
      case 'Snow': return '🌨️';
      default: return '🌡️';
    }
  };

  return (
    // Applied the styled "card-box" class
    <div className="card-box weather-card" style={{ width: "320px", flexShrink: 0 }}>
      
      {/* City Title with Thematic Color */}
      <h3 style={{ color: "#2E7D32", margin: "0 0 15px 0" }}>
        Weather in {cityName}
      </h3>
      
      {/* Temperature and Icon Block */}
      <div className="weather-summary">
          <div className="weather-icon">
            {getWeatherIcon(current.weather[0].main)}
          </div>
          <div className="weather-temp">
            {temp}°C
          </div>
      </div>

      {/* Details Table */}
      <div className="weather-details">
        <p>
          <b>Condition:</b> {description}
        </p>
        <p>
          <b>Humidity:</b> {current.main.humidity}%
        </p>
        <p>
          <b>Rain Prob (POP):</b> {(current.pop * 100).toFixed(0)}%
        </p>
        <p>
          <b>Wind Speed:</b> {current.wind.speed.toFixed(1)} m/s
        </p>
        <p className="weather-metric-small">
          (Next 3 hours)
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;