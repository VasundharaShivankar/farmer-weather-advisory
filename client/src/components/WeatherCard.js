import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const current = weather.list[0];

  return (
    <div style={{
      padding: "20px",
      margin: "20px",
      background: "#eef2f3",
      borderRadius: "10px",
      width: "300px"
    }}>
      <h3>Weather Details</h3>
      <p><b>Temperature:</b> {current.main.temp}°C</p>
      <p><b>Humidity:</b> {current.main.humidity}%</p>
      <p><b>Rain Probability:</b> {(current.pop * 100).toFixed(0)}%</p>
      <p><b>Wind Speed:</b> {current.wind.speed} km/h</p>
    </div>
  );
};

export default WeatherCard;
