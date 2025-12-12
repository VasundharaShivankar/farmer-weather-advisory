const mongoose = require("mongoose");

/**
 * @fileoverview Mongoose model for storing search history records.
 */

const searchSchema = new mongoose.Schema({
  // Stores the location searched by the user (e.g., 'London', 'Mumbai').
  location: { 
    type: String, 
    required: true,
    trim: true 
  },
  // Saves a small snapshot of the weather data (e.g., current temp, description)
  // to avoid re-fetching full details for display in history.
  resultSnapshot: { 
    type: Object 
  },
  // Automatically records when the search was performed.
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create and export the model
module.exports = mongoose.model("SearchHistory", searchSchema);