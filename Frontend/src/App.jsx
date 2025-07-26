import React, { useState, useCallback } from "react";
import { LoadScript } from "@react-google-maps/api";
import MapComponent from "./components/MapComponent";
import SearchBox from "./components/SearchBox";
import axios from "axios";

const libraries = ["places"];

const App = () => {
  const [coordinates, setCoordinates] = useState({ lat: 12.9716, lng: 77.5946 }); // Default to Bangalore
  const [aqiData, setAqiData] = useState(null);

  const fetchAQIData = async (lat, lng) => {
    try {
      const res = await axios.get(`http://localhost:8000/summary?lat=${lat}&lon=${lng}`);
      setAqiData(res.data);
      setCoordinates({ lat, lng });
    } catch (error) {
      console.error("Failed to fetch AQI data:", error);
      setAqiData(null);
    }
  };

  const handlePlaceSelected = useCallback(({ lat, lng }) => {
    fetchAQIData(lat, lng);
  }, []);

  const handleMapClick = (lat, lng) => {
    fetchAQIData(lat, lng);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div style={{ width: "100vw", height: "100vh" }}>
        <SearchBox onPlaceSelected={handlePlaceSelected} />
        <MapComponent
          coordinates={coordinates}
          onMapClick={handleMapClick}
          aqiData={aqiData}
        />
      </div>
    </LoadScript>
  );
};

export default App;
