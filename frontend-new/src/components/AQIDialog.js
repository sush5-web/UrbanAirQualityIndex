import React from 'react';

function AQIDialog({ city, data }) {
  const index = data.indexes?.[0];

  return (
    <div>
      <h3>{city}</h3>
      <p><strong>AQI:</strong> {index?.aqi}</p>
      <p><strong>Category:</strong> {index?.category}</p>
      <p><strong>Dominant Pollutant:</strong> {index?.dominantPollutant}</p>
    </div>
  );
}

export default AQIDialog;
