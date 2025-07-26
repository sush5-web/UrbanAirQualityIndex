import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CesiumMap from './CesiumMap';

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [coords, setCoords] = useState(null);

  const fetchAQIData = useCallback(async (selectedCity) => {
    if (!selectedCity) return;

    try {
      const response = await axios.get(`http://localhost:8000/summary?city=${selectedCity}`);
      setData(response.data);

      const geocodeRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: selectedCity,
          key: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
        },
      });

      const location = geocodeRes.data.results[0]?.geometry?.location;
      if (location) {
        setCoords({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error('Failed to fetch AQI or coordinates:', error);
      setData(null);
      setCoords(null);
    }
  }, []);

  const handlePlaceChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
    fetchAQIData(selectedCity);
  };

  useEffect(() => {
    fetchAQIData('Denton');
  }, [fetchAQIData]);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#a8e05f';
    if (aqi <= 100) return '#fdd74b';
    if (aqi <= 150) return '#fe9b57';
    if (aqi <= 200) return '#fe6a69';
    if (aqi <= 300) return '#a97abc';
    return '#a87383';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Urban Air Quality Index</h1>
      <input
        type="text"
        value={city}
        placeholder="Enter a city"
        onChange={handlePlaceChange}
        style={{ padding: '6px', marginBottom: '10px' }}
      />

      {data && (
        <div
          style={{
            backgroundColor: getAQIColor(data.indexes[0]?.aqi || 0),
            padding: '20px',
            marginTop: '10px',
            borderRadius: '6px',
            width: '300px',
          }}
        >
          <h2>{data.city}</h2>
          <p><strong>Location:</strong> {data.location}</p>
          <p><strong>AQI:</strong> {data.indexes[0]?.aqi}</p>
          <p><strong>Category:</strong> {data.indexes[0]?.category}</p>
          <p><strong>Dominant Pollutant:</strong> {data.indexes[0]?.dominantPollutant}</p>
          <p><strong>Source:</strong> {data.source}</p>
        </div>
      )}

      {coords && <CesiumMap coordinates={coords} />}
    </div>
  );
}

export default App;
