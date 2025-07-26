import React from 'react';
import { Bar } from 'react-chartjs-2';

function AQIChart({ aqiData }) {
  const pollutants = aqiData.pollutants || [];
  const labels = pollutants.map(p => p.code);
  const values = pollutants.map(p => p.concentration?.value || 0);

  const data = {
    labels,
    datasets: [{
      label: 'Concentration (µg/m³)',
      data: values,
      backgroundColor: 'rgba(75,192,192,0.6)'
    }]
  };

  return (
    <div>
      <h4>Pollutant Levels</h4>
      <Bar data={data} />
    </div>
  );
}

export default AQIChart;
