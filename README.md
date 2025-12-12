# Farmer Weather Advisory Tool

A comprehensive web application designed to provide farmers with real-time weather information and actionable advisories to optimize farming practices and protect crops.

## Features

### Core Functionality:
- **Location-Based Weather Search**: Enter any city name to get current and forecasted weather data
- **Intelligent Farmer Advisories**: Recommendations based on weather conditions including:
  - Irrigation scheduling
  - Pesticide application timing
  - Crop protection measures
  - Harvest planning
- **Interactive Weather Charts**: Visual representation of temperature, humidity, wind speed and precipitation
- **Search History**: Track and quickly access previously searched locations
- **Responsive Design**: Optimized for desktop and mobile devices

### Advanced Features
- **Real-time Weather Data**: Integration with OpenWeatherMap API for accurate, up-to-date information
- **PDF Export**: Generate and download advisory reports as PDF documents
- **Dashboard Overview**: Quick stats and farming insights at a glance
- **Weather Cards**: Detailed current weather conditions with farming-relevant metrics
- **Advanced Charts**: Multi-day forecast visualization with farming suitability scores

## How It Works:

### Weather Data Flow
1. **User Input**: Farmer enters a location (city name)
2. **API Integration**: Application queries OpenWeatherMap API for weather data
3. **Data Processing**: Backend processes weather data and applies farming-specific rules
4. **Advisory Generation**: Intelligent algorithms generate personalized farming recommendations
5. **Visualization**: Results displayed through interactive charts and cards
6. **History Tracking**: Search history stored locally for quick access

### Advisory Rules Engine
The application uses sophisticated rules to generate advisories:
- **Rain Risk Assessment**: High probability rain (>60%) triggers irrigation and spraying warnings
- **Heat Stress Monitoring**: Temperatures >35°C recommend increased irrigation
- **Wind Drift Prevention**: Wind speeds >15 km/h advise against pesticide application
- **Humidity Control**: High humidity (>80%) flags fungal disease risks
- **Optimal Spraying Windows**: Identifies safe periods for pesticide application

## Technologies Used:

- **Frontend**: React 18, React Router, Chart.js, Axios, CSS3
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **External APIs**: OpenWeatherMap API, jsPDF

## Prerequisites:

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB database
- OpenWeatherMap API key

## Installation

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
OPENWEATHER_API=your_openweather_api_key_here
MONGODB_URI=mongodb://localhost:27017/farmer-weather
PORT=5000
```

### Frontend Setup
```bash
cd client
npm install
```

### Database Setup
Ensure MongoDB is running locally or update the connection string in `.env`.

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server will run on http://localhost:5000

### Start Frontend Application
```bash
cd client
npm start
```
Application will open at http://localhost:3000

## 📖 Usage Guide

### Getting Started
1. Open the application in your browser
2. Enter a city name in the search bar (e.g., "London", "Mumbai", "New York")
3. Click the search button or press Enter
4. View weather information, advisories, and charts

### Understanding Advisories
- **High Rain Risk**: Avoid irrigation and pesticide spraying
- **Heat Stress**: Increase irrigation frequency for heat-sensitive crops
- **Wind Drift**: Do not spray pesticides due to drift risk
- **Fungal Risk**: Monitor crops for fungal infections
- **Safe Spraying Window**: Optimal conditions for pesticide application

### Exporting Reports
- Click the "Download PDF" button in the Advisory Box
- PDF will include current weather conditions and all advisories
- Save or print for record-keeping

### Search History
- Previously searched locations are saved locally
- Click on any location in the history sidebar to quickly search again
- Clear history using the "Clear History" button

**Made with ❤️ for farmers worldwide**
