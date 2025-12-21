const mongoose = require("mongoose");

/**
 * @fileoverview 
 */

const searchSchema = new mongoose.Schema({
  
  location: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  resultSnapshot: { 
    type: Object 
  },
 
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


module.exports = mongoose.model("SearchHistory", searchSchema);