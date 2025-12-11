require("dotenv").config();
const mongoose = require("mongoose");
const ApiKey = require("../models/ApiKey");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const key = process.env.OPENWEATHER_API;

    let existing = await ApiKey.findOne({ service: "openweather" });

    if (existing) {
      existing.key = key;
      await existing.save();
      console.log("Updated API Key");
    } else {
      await ApiKey.create({ service: "openweather", key });
      console.log("Inserted new API Key");
    }

    mongoose.disconnect();
    console.log("Done");
  } catch (err) {
    console.log(err);
  }
}

seed();
