import React from "react";


const SearchBar = ({ location, setLocation, fetchWeather, isLoading }) => {
  return (
   
    <div className="search-container">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Enter location (e.g., London, New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="location-input"
          disabled={isLoading} 
        />
        <span className="input-icon">📍</span>
      </div>
      <button
        onClick={fetchWeather}
        className="search-button"
        disabled={isLoading || !location.trim()}
      >
        {}
        {isLoading ? '🔍 Searching...' : '🔍 Search'}
      </button>
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        alt="Farming weather advisory"
        className="farming-weather-image"
      />
    </div>
  );
};

export default SearchBar;