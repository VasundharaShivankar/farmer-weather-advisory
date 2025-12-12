require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI; 

app.use(cors()); 
app.use(express.json()); 

app.use('/api', weatherRoutes); 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB successfully connected.');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });