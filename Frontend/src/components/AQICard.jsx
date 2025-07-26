import React from "react";

const AQICard = ({ data }) => {
  if (!data) return null;

  const {
    city,
    country,
    latitude,
    longitude,
    aqi,
    category,
    dominantPollutant,
    rgbColor,
    source,
  } = data;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        color: "#333",
        width: "300px",
      }}
    >
      <h2>Urban Air Quality Index</h2>
      <p><strong>CITY:</strong> {city}</p>
      <p><strong>COUNTRY:</strong> {country}</p>
      <p><strong>LATITUDE:</strong> {latitude}</p>
      <p><strong>LONGITUDE:</strong> {longitude}</p>
      <p><strong>AQI:</strong> {aqi}</p>
      <p><strong>CATEGORY:</strong> {category}</p>
      <p><strong>DOMINANT POLLUTANT:</strong> {dominantPollutant}</p>
      <p>
        <strong>AQI COLOR (RGB):</strong>{" "}
        ({rgbColor?.red?.toFixed(2)}, {rgbColor?.green?.toFixed(2)}, {rgbColor?.blue?.toFixed(2)})
      </p>
      <p><strong>Source:</strong> {source}</p>
    </div>
  );
};

export default AQICard;
