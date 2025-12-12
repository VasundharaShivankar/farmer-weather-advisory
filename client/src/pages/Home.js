import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import AdvisoryBox from "../components/AdvisoryBox";
import Chart from "../components/Chart";

function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [advisory, setAdvisory] = useState([]);

  const fetchWeather = async () => {
    if (!location.trim()) return;

    const res = await axios.post("http://localhost:5000/api/weather", {
      location
    });

    setWeather(res.data.data);
    setAdvisory(res.data.advisory);

    // Save to local storage for search history
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(location)) {
      history.unshift(location);
      localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Farmer Weather Advisory Tool</h1>

      <SearchBar
        location={location}
        setLocation={setLocation}
        fetchWeather={fetchWeather}
      />

      <WeatherCard weather={weather} />
      <AdvisoryBox advisory={advisory} />

      {weather && (
        <Chart forecast={weather.list.slice(0, 10)} />
      )}
    </div>
  );
}

export default Home;
