import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather || !weather.list || weather.list.length === 0) return null;

  const current = weather.list[0];
  const cityName = weather.city.name;
  const temp = Math.round(current.main.temp);
  const description = current.weather[0].description;

  // Enhanced icon map for farmer-friendly look
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Rain': return '🌧️';
      case 'Clouds': return '☁️';
      case 'Clear': return '☀️';
      case 'Drizzle': return '🌦️';
      case 'Snow': return '🌨️';
      case 'Thunderstorm': return '⛈️';
      default: return '🌤️';
    }
  };

  // Calculate UV Index (simplified based on temperature and cloud cover)
  const calculateUVIndex = () => {
    const temp = current.main.temp;
    const clouds = current.clouds?.all || 0;
    const uvIndex = Math.max(1, Math.min(11, (temp / 30) * (1 - clouds / 100) * 10));
    return Math.round(uvIndex);
  };

  // Estimate soil moisture based on humidity and rain probability
  const getSoilMoisture = () => {
    const humidity = current.main.humidity;
    const rainProb = current.pop * 100;

    if (humidity > 80 && rainProb > 50) return 'High';
    if (humidity > 60 && rainProb > 30) return 'Moist';
    if (humidity > 40) return 'Moderate';
    return 'Dry';
  };

  const uvIndex = calculateUVIndex();
  const soilMoisture = getSoilMoisture();

  return (
    <div className="card-box weather-card" style={{ width: "380px", flexShrink: 0 }}>

      {/* Enhanced Header */}
      <div className="weather-header">
        <h3>🌤️ Weather in {cityName}</h3>
      </div>

      {/* Main Weather Display */}
      <div className="weather-main">
        <div className="weather-icon-large">
          {getWeatherIcon(current.weather[0].main)}
        </div>
        <div className="weather-temp-large">
          {temp}°C
        </div>
      </div>

      {/* Farmer Metrics Grid */}
      <div className="farmer-metrics">
        <div className="metric-item">
          <div className="metric-icon">☀️</div>
          <div className="metric-content">
            <div className="metric-label">UV Index</div>
            <div className="metric-value">{uvIndex}/11</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">💧</div>
          <div className="metric-content">
            <div className="metric-label">Soil Moisture</div>
            <div className="metric-value">{soilMoisture}</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">💨</div>
          <div className="metric-content">
            <div className="metric-label">Wind Speed</div>
            <div className="metric-value">{current.wind.speed.toFixed(1)} m/s</div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">🌧️</div>
          <div className="metric-content">
            <div className="metric-label">Rain Chance</div>
            <div className="metric-value">{(current.pop * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Extended Weather Details */}
      <div className="weather-details-extended">
        <div className="detail-row">
          <span>Condition:</span>
          <span>{description}</span>
        </div>
        <div className="detail-row">
          <span>Humidity:</span>
          <span>{current.main.humidity}%</span>
        </div>
        <div className="detail-row">
          <span>Feels Like:</span>
          <span>{Math.round(current.main.feels_like)}°C</span>
        </div>
        <div className="detail-row">
          <span>Pressure:</span>
          <span>{current.main.pressure} hPa</span>
        </div>
      </div>

      {/* Footer */}
      <div className="weather-footer">
        <small>Next 3 hours forecast</small>
      </div>
    </div>
  );
};

export default WeatherCard;