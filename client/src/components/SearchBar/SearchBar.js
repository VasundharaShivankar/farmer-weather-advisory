import React from "react";

// Added 'isLoading' prop for better user experience
const SearchBar = ({ location, setLocation, fetchWeather, isLoading }) => {
  return (
    // 1. Replaced inline style with the "search-container" class
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        // 2. Removed inline style; CSS handles padding, width, and border
        disabled={isLoading} // Disable while loading
      />
      <button 
        onClick={fetchWeather} 
        // 3. Removed inline style
        disabled={isLoading || !location.trim()} // Disable if loading or input is empty
      >
        {/* Added text change for feedback */}
        {isLoading ? 'Loading...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchBar;