import React from "react";

const SearchBar = ({ location, setLocation, fetchWeather }) => {
  return (
    <div style={{ margin: "20px" }}>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />
      <button onClick={fetchWeather} style={{ padding: "10px 20px", marginLeft: "10px" }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
