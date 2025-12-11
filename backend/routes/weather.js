const express = require("express");
const router = express.Router();

const { getWeatherData, getLastSearches } = require("../controllers/weatherController");

router.post("/", getWeatherData);
router.get("/history", getLastSearches);

module.exports = router;
