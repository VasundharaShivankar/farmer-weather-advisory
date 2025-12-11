const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  location: { type: String, required: true },
  resultSnapshot: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SearchHistory", searchSchema);
