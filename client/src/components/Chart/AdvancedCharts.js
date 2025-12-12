import React, { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    LineElement,
    BarElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const AdvancedCharts = ({ forecast }) => {
    const [activeChart, setActiveChart] = useState('temperature');

    if (!forecast || forecast.length === 0) return null;

    
    const labels = forecast.map((item) => {
        const date = new Date(item.dt_txt);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', weekday: 'short' });
    });

    const temperatures = forecast.map((item) => item.main.temp);
    const humidity = forecast.map((item) => item.main.humidity);
    const windSpeed = forecast.map((item) => item.wind.speed);
    const rainPop = forecast.map((item) => (item.pop * 100));
    const pressure = forecast.map((item) => item.main.pressure);

    // Calculate farming suitability score (simplified)
    const farmingSuitability = forecast.map((item) => {
        const temp = item.main.temp;
        const humidity = item.main.humidity;
        const rain = item.pop * 100;

        // Optimal farming conditions: 20-30°C, 40-70% humidity, <30% rain probability
        let score = 100;
        if (temp < 20 || temp > 30) score -= 20;
        if (humidity < 40 || humidity > 70) score -= 15;
        if (rain > 30) score -= 25;
        return Math.max(0, score);
    });

    const chartConfigs = {
        temperature: {
            title: "🌡️ Temperature & Humidity Trends",
            data: {
                labels,
                datasets: [
                    {
                        label: "Temperature (°C)",
                        data: temperatures,
                        borderColor: "#ff6b35",
                        backgroundColor: "rgba(255, 107, 53, 0.1)",
                        tension: 0.4,
                        yAxisID: 'yTemp',
                        pointBackgroundColor: "#ff6b35",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                    {
                        label: "Humidity (%)",
                        data: humidity,
                        borderColor: "#4a90e2",
                        backgroundColor: "rgba(74, 144, 226, 0.1)",
                        tension: 0.4,
                        yAxisID: 'yHumidity',
                        pointBackgroundColor: "#4a90e2",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    title: {
                        display: true,
                        text: '🌡️ Temperature & Humidity Trends',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    }
                },
                scales: {
                    yTemp: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Temperature (°C)', font: { weight: 'bold' } },
                        grid: { drawOnChartArea: true },
                    },
                    yHumidity: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Humidity (%)', font: { weight: 'bold' } },
                        grid: { drawOnChartArea: false },
                        min: 0,
                        max: 100,
                    },
                },
            }
        },

        wind: {
            title: "💨 Wind Speed & Pressure Analysis",
            data: {
                labels,
                datasets: [
                    {
                        label: "Wind Speed (m/s)",
                        data: windSpeed,
                        borderColor: "#9c88ff",
                        backgroundColor: "rgba(156, 136, 255, 0.1)",
                        tension: 0.4,
                        pointBackgroundColor: "#9c88ff",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                    {
                        label: "Atmospheric Pressure (hPa)",
                        data: pressure,
                        borderColor: "#26de81",
                        backgroundColor: "rgba(38, 222, 129, 0.1)",
                        tension: 0.4,
                        yAxisID: 'yPressure',
                        pointBackgroundColor: "#26de81",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    title: {
                        display: true,
                        text: '💨 Wind Speed & Pressure Analysis',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Wind Speed (m/s)', font: { weight: 'bold' } },
                        grid: { drawOnChartArea: true },
                    },
                    yPressure: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Pressure (hPa)', font: { weight: 'bold' } },
                        grid: { drawOnChartArea: false },
                    },
                },
            }
        },

        farming: {
            title: "🚜 Farming Suitability Score",
            data: {
                labels,
                datasets: [
                    {
                        label: "Farming Suitability (%)",
                        data: farmingSuitability,
                        backgroundColor: farmingSuitability.map(score => {
                            if (score >= 80) return '#26de81';
                            if (score >= 60) return '#fed330';
                            if (score >= 40) return '#fd9644';
                            return '#fc5c65';
                        }),
                        borderColor: '#fff',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    title: {
                        display: true,
                        text: '🚜 Farming Suitability Score',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Suitability Score (%)', font: { weight: 'bold' } },
                        grid: { drawOnChartArea: true },
                    },
                },
            }
        },

        precipitation: {
            title: "🌧️ Precipitation Analysis",
            data: {
                labels: ['Low (<20%)', 'Moderate (20-50%)', 'High (50-80%)', 'Very High (>80%)'],
                datasets: [
                    {
                        label: 'Rain Probability Distribution',
                        data: [
                            rainPop.filter(p => p < 20).length,
                            rainPop.filter(p => p >= 20 && p < 50).length,
                            rainPop.filter(p => p >= 50 && p < 80).length,
                            rainPop.filter(p => p >= 80).length,
                        ],
                        backgroundColor: [
                            '#4a90e2',
                            '#fed330',
                            '#fd9644',
                            '#fc5c65',
                        ],
                        borderColor: '#fff',
                        borderWidth: 3,
                        hoverBorderWidth: 5,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    title: {
                        display: true,
                        text: '🌧️ Precipitation Analysis',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    }
                },
            }
        }
    };

    const chartTabs = [
        { id: 'temperature', label: '🌡️ Temp & Humidity', icon: '🌡️' },
        { id: 'wind', label: '💨 Wind & Pressure', icon: '💨' },
        { id: 'farming', label: '🚜 Farming Score', icon: '🚜' },
        { id: 'precipitation', label: '🌧️ Rain Analysis', icon: '🌧️' },
    ];

    return (
        <div className="advanced-charts-container">
            <div className="charts-header">
                <h3>📊 Advanced Weather Analytics</h3>
                <p>Detailed insights for optimal farming decisions</p>
            </div>

            <div className="chart-tabs">
                {chartTabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`chart-tab ${activeChart === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveChart(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="chart-display">
                {activeChart === 'precipitation' ? (
                    <Doughnut
                        data={chartConfigs[activeChart].data}
                        options={chartConfigs[activeChart].options}
                    />
                ) : activeChart === 'farming' ? (
                    <Bar
                        data={chartConfigs[activeChart].data}
                        options={chartConfigs[activeChart].options}
                    />
                ) : (
                    <Line
                        data={chartConfigs[activeChart].data}
                        options={chartConfigs[activeChart].options}
                    />
                )}
            </div>

            <div className="chart-insights">
                <div className="insight-card">
                    <h4>🌱 Current Conditions</h4>
                    <div className="insight-metrics">
                        <div className="metric">
                            <span className="metric-label">Avg Temperature:</span>
                            <span className="metric-value">{(temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)}°C</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Avg Humidity:</span>
                            <span className="metric-value">{(humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(0)}%</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Max Wind Speed:</span>
                            <span className="metric-value">{Math.max(...windSpeed).toFixed(1)} m/s</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Farming Score:</span>
                            <span className="metric-value">{(farmingSuitability.reduce((a, b) => a + b, 0) / farmingSuitability.length).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedCharts;
