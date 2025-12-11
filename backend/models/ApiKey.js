const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  service: { type: String, required: true, unique: true },
  key: { type: String, required: true }
});

module.exports = mongoose.model("ApiKey", apiKeySchema);
