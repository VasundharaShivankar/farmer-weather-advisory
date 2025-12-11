import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Chart = ({ forecast }) => {
  if (!forecast) return null;

  const labels = forecast.map((item) => item.dt_txt);
  const temperatures = forecast.map((item) => item.main.temp);

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        borderWidth: 2,
      }
    ]
  };

  return (
    <div style={{ width: "700px", margin: "20px" }}>
      <h3>Temperature Trend</h3>
      <Line data={data} />
    </div>
  );
};

export default Chart;
