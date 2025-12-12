import React, { useState, useEffect } from "react";

const Dashboard = ({ weather, advisory }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!weather || !weather.list || weather.list.length === 0) {
        return (
            <div className="dashboard-welcome">
                <div className="welcome-content">
                    <div className="welcome-icon">🌱</div>
                    <h2>Welcome to Farmer Weather Advisory</h2>
                    <p>Search for a location to get detailed weather insights and farming recommendations.</p>
                    <div className="welcome-features">
                        <div className="feature-item">
                            <span className="feature-icon">🌡️</span>
                            <span>Temperature & Humidity Analysis</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🌧️</span>
                            <span>Rain Probability Forecasting</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🚜</span>
                            <span>Farming Suitability Scores</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <span>Advanced Analytics Dashboard</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const current = weather.list[0];
    const cityName = weather.city.name;
    const temp = Math.round(current.main.temp);
    const humidity = current.main.humidity;
    const windSpeed = current.wind.speed;
    const rainProb = (current.pop * 100).toFixed(0);

    // Calculate farming metrics
    const farmingSuitability = calculateFarmingSuitability(temp, humidity, rainProb);
    const soilMoisture = getSoilMoisture(humidity, rainProb);
    const uvIndex = calculateUVIndex(temp, current.clouds?.all || 0);

    function calculateFarmingSuitability(temp, humidity, rainProb) {
        let score = 100;
        if (temp < 20 || temp > 30) score -= 20;
        if (humidity < 40 || humidity > 70) score -= 15;
        if (rainProb > 30) score -= 25;
        return Math.max(0, score);
    }

    function getSoilMoisture(humidity, rainProb) {
        if (humidity > 80 && rainProb > 50) return 'High';
        if (humidity > 60 && rainProb > 30) return 'Moist';
        if (humidity > 40) return 'Moderate';
        return 'Dry';
    }

    function calculateUVIndex(temp, clouds) {
        const uvIndex = Math.max(1, Math.min(11, (temp / 30) * (1 - clouds / 100) * 10));
        return Math.round(uvIndex);
    }

    const quickStats = [
        {
            icon: '🌡️',
            label: 'Temperature',
            value: `${temp}°C`,
            status: temp >= 20 && temp <= 30 ? 'optimal' : 'warning'
        },
        {
            icon: '💧',
            label: 'Soil Moisture',
            value: soilMoisture,
            status: soilMoisture === 'High' || soilMoisture === 'Moist' ? 'good' : 'warning'
        },
        {
            icon: '☀️',
            label: 'UV Index',
            value: uvIndex,
            status: uvIndex <= 7 ? 'safe' : 'warning'
        },
        {
            icon: '🌧️',
            label: 'Rain Chance',
            value: `${rainProb}%`,
            status: rainProb <= 30 ? 'good' : 'warning'
        }
    ];

    const farmingTips = [
        {
            condition: temp >= 20 && temp <= 30,
            tip: "🌱 Optimal temperature for most crops. Continue regular farming activities.",
            type: "positive"
        },
        {
            condition: humidity >= 40 && humidity <= 70,
            tip: "💧 Good humidity levels. Monitor soil moisture regularly.",
            type: "positive"
        },
        {
            condition: rainProb > 50,
            tip: "🌧️ High chance of rain. Prepare for wet conditions and possible delays.",
            type: "warning"
        },
        {
            condition: windSpeed > 5,
            tip: "💨 Strong winds detected. Secure loose equipment and protect young plants.",
            type: "warning"
        }
    ].filter(tip => tip.condition);

    return (
        <div className="dashboard-container">
            {/* Header with location and time */}
            <div className="dashboard-header">
                <div className="location-info">
                    <h2>📍 {cityName}</h2>
                    <div className="current-time">
                        {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                    </div>
                </div>
                <div className="farming-score">
                    <div className="score-circle" data-score={farmingSuitability}>
                        <span className="score-value">{farmingSuitability}%</span>
                        <span className="score-label">Farming Score</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="quick-stats">
                {quickStats.map((stat, index) => (
                    <div key={index} className={`stat-card ${stat.status}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Farming Tips */}
            {farmingTips.length > 0 && (
                <div className="farming-tips">
                    <h3>🚜 Today's Farming Tips</h3>
                    <div className="tips-list">
                        {farmingTips.map((tip, index) => (
                            <div key={index} className={`tip-item ${tip.type}`}>
                                <span className="tip-text">{tip.tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Weather Alerts */}
            {advisory && advisory.length > 0 && (
                <div className="weather-alerts">
                    <h3>⚠️ Weather Alerts</h3>
                    <div className="alerts-list">
                        {advisory.slice(0, 3).map((alert, index) => (
                            <div key={index} className="alert-item">
                                <span className="alert-icon">
                                    {alert.toLowerCase().includes("avoid") || alert.toLowerCase().includes("monitor") ? '🚨' : 'ℹ️'}
                                </span>
                                <span className="alert-text">{alert}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
