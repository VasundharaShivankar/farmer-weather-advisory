const axios = require("axios");
const ApiKey = require("../models/ApiKey");
const SearchHistory = require("../models/SearchHistory");

// Advisory generation logic
function generateAdvisory(list) {
  const adv = new Set();

  const next6 = list.slice(0, 2);
  const current = list[0];

  const maxRainProb = Math.max(...next6.map(i => (i.pop || 0) * 100));
  if (maxRainProb > 60) {
    adv.add("High rain probability (>60%) — Avoid irrigation & pesticide spraying.");
  }

  const temp = current.main.temp;
  if (temp > 35) adv.add("High temperature (>35°C) — Increase irrigation for heat-sensitive crops.");

  const humidity = current.main.humidity;
  if (humidity > 80) adv.add("High humidity (>80%) — Risk of fungal infection.");

  const windSpeedKmh = current.wind.speed * 3.6;
  if (windSpeedKmh > 15) adv.add("Strong winds (>15 km/h) — Avoid pesticide spraying.");

  if (windSpeedKmh < 10 && maxRainProb < 20) {
    adv.add("Good spraying window: Low wind & no rain expected.");
  }

  return Array.from(adv);
}

exports.getWeatherData = async (req, res) => {
  try {
    const { location } = req.body;

    const keyDoc = await ApiKey.findOne({ service: "openweather" });
console.log("MongoDB returned keyDoc:", keyDoc);

    const apiKey = keyDoc.key;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    const advisory = generateAdvisory(data.list);
    console.log("API KEY FROM DB:", apiKey);

    await SearchHistory.create({
      location,
      resultSnapshot: data.list[0]
    });

    res.json({
      success: true,
      city: data.city,
      advisory,
      forecast: data.list
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching weather" });
  }
};

exports.getLastSearches = async (req, res) => {
  try {
    const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not load history" });
  }
};
