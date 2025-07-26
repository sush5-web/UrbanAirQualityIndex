// src/components/AQICard.js
import React from 'react';
import './AQICard.css';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#90ee90';         // Good
  if (aqi <= 100) return '#fdfd96';        // Moderate
  if (aqi <= 150) return '#ffb347';        // Unhealthy for sensitive
  return '#ff6961';                        // Unhealthy and worse
};

const AQICard = ({ data }) => {
  const index = data.indexes?.[0];

  return (
    <div className="aqi-card" style={{ backgroundColor: getAQIColor(index.aqi), padding: '20px', borderRadius: '10px' }}>
      <h2>{data.city}</h2>
      <p><strong>Location:</strong> {data.location}</p>
      <p><strong>AQI:</strong> {index.aqi}</p>
      <p><strong>Category:</strong> {index.category}</p>
      <p><strong>Dominant Pollutant:</strong> {index.dominantPollutant}</p>
      <p><strong>Source:</strong> {data.source}</p>
    </div>
  );
};

export default AQICard;
