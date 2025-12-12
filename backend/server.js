require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes'); // Import the routes

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI; // ⬅️ FIX: Use MONGODB_URI

// --- Middleware ---
app.use(cors()); // Enable CORS for frontend connection
app.use(express.json()); // Body parser for application/json

// --- Routes ---
// All requests to /api go to weatherRoutes
app.use('/api', weatherRoutes); 

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB successfully connected.');
        
        // Start server only after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });