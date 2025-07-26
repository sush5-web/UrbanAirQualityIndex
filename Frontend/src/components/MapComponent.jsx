import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// AQI color logic for marker and border
const getAQIColor = (aqi) => {
  if (aqi <= 50) return { color: "green", border: "#00e400" };
  if (aqi <= 100) return { color: "yellow", border: "#ffff00" };
  if (aqi <= 150) return { color: "orange", border: "#ff7e00" };
  if (aqi <= 200) return { color: "red", border: "#ff0000" };
  if (aqi <= 300) return { color: "purple", border: "#8f3f97" };
  return { color: "maroon", border: "#7e0023" };
};

const getPinUrl = (aqi) => {
  const color = getAQIColor(aqi).color;
  return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
};

const MapComponent = ({ coordinates, onMapClick, aqiData }) => {
  const handleClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onMapClick(lat, lng);
  };

  const aqiColor = aqiData ? getAQIColor(aqiData.aqi) : { border: "gray" };

  return (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={10}
        onClick={handleClick}
      >
        {aqiData && (
          <Marker
            position={coordinates}
            icon={{ url: getPinUrl(aqiData.aqi) }}
          />
        )}
      </GoogleMap>

      {aqiData && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            background: "rgba(255, 255, 255, 0.75)",
            padding: "20px",
            borderRadius: "8px",
            border: `4px solid ${aqiColor.border}`,
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            zIndex: 10,
            minWidth: "280px",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Urban Air Quality Index
          </h3>
          <p><strong>City:</strong> {aqiData.city}</p>
          <p><strong>Country:</strong> {aqiData.country}</p>
          <p><strong>Latitude:</strong> {aqiData.latitude?.toFixed(4)}</p>
          <p><strong>Longitude:</strong> {aqiData.longitude?.toFixed(4)}</p>
          <p><strong>AQI:</strong> {aqiData.aqi}</p>
          <p><strong>Category:</strong> {aqiData.category}</p>
          <p><strong>Dominant Pollutant:</strong> {aqiData.dominant_pollutant || "N/A"}</p>
          <p><strong>Source:</strong> Google Air Quality API</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
