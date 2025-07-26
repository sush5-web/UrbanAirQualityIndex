import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl:
    "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], 10);
  return null;
};

function CityAQIMap() {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/summary?city=${encodeURIComponent(city)}`
      );
      setAqiData(response.data);
      setLocation({
        lat: response.data.coordinates.latitude,
        lng: response.data.coordinates.longitude,
      });
    } catch (error) {
      console.error("Error fetching AQI data", error);
      setAqiData(null);
      setLocation(null);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <form onSubmit={handleSubmit} style={{ padding: 10, position: "absolute", top: 10, zIndex: 1000, width: "100%", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{ width: "300px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "10px" }}>
          Search
        </button>
      </form>

      <MapContainer
        center={[20.5937, 78.9629]} // Default center (India)
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {location && <FlyToLocation lat={location.lat} lng={location.lng} />}
        {location && aqiData && (
          <Marker position={[location.lat, location.lng]} icon={customIcon}>
            <Popup>
              <div>
                <h3>{aqiData.location}</h3>
                <p><strong>Country:</strong> {aqiData.country}</p>
                <p><strong>AQI (PM2.5):</strong> {aqiData.aqi}</p>
                <p><strong>Coordinates:</strong> {aqiData.coordinates.latitude}, {aqiData.coordinates.longitude}</p>
                <p><strong>Parameters:</strong> {aqiData.parameters.join(", ")}</p>
                <p><strong>Last Updated:</strong> {aqiData.lastUpdated}</p>
                <p><strong>Source:</strong> Sushaanth Reddy Donthi Project</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default CityAQIMap;
