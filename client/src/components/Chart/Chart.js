
import React from "react";
import { Line } from "react-chartjs-2";
import { 
    Chart as ChartJS, 
    LineElement, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend 
} from "chart.js";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Chart = ({ forecast }) => {
    if (!forecast || forecast.length === 0) return null;

   
    const labels = forecast.map((item) => {
        const date = new Date(item.dt_txt);
     
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', weekday: 'short' });
    });
    
    const temperatures = forecast.map((item) => item.main.temp);

    const rainPop = forecast.map((item) => (item.pop * 100).toFixed(0)); 

    const data = {
        labels,
        datasets: [
            {
                label: "Temperature (°C)",
                data: temperatures,
                borderColor: "#ef5350", 
                backgroundColor: "rgba(239, 83, 80, 0.1)",
                tension: 0.4,
                yAxisID: 'yTemp',
            },
            {
                label: "Rain Probability (POP %)",
                data: rainPop,
                borderColor: "#42a5f5",
                backgroundColor: "rgba(66, 165, 245, 0.1)",
                tension: 0.4,
                yAxisID: 'yPop',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Temperature and Rain Probability Trend' }
        },
        scales: {
            yTemp: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Temperature (°C)' },
                grid: { drawOnChartArea: true },
            },
            yPop: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Rain Probability (%)' },
                grid: { drawOnChartArea: false }, // Prevent overlap with left axis grid
                min: 0,
                max: 100,
            },
        },
    };

    return (
        <div style={{ width: "800px", margin: "20px" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default Chart;