// src/components/CityAQIDetailsMap.js
import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FlyToLocation = ({ lat, lon }) => {
  const map = useMap();
  if (lat && lon) {
    map.setView([lat, lon], 11);
  }
  return null;
};

const CityAQIDetailsMap = () => {
  const [city, setCity] = useState('');
  const [aqiData, setAqiData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/summary?city=${encodeURIComponent(city)}`);
      setAqiData(response.data);
      setLocation({ lat: response.data.coordinates.latitude, lon: response.data.coordinates.longitude });
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Server error—please try again.');
      setAqiData(null);
      setLocation(null);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '16px' }}>Search</button>
      </form>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {location && (
          <Marker position={[location.lat, location.lon]}>
            <Popup>
              {aqiData ? (
                <div>
                  <strong>City:</strong> {aqiData.city}<br />
                  <strong>Country:</strong> {aqiData.country}<br />
                  <strong>Coordinates:</strong> {aqiData.coordinates.latitude}, {aqiData.coordinates.longitude}<br />
                  <strong>Parameter:</strong> {aqiData.parameter}<br />
                  <strong>AQI:</strong> {aqiData.aqi}<br />
                  <strong>Last Updated:</strong> {aqiData.lastUpdated}<br />
                  <strong>Source:</strong> Sushaanth Reddy Donthi Project
                </div>
              ) : (
                'Loading...'
              )}
            </Popup>
          </Marker>
        )}
        {location && <FlyToLocation lat={location.lat} lon={location.lon} />}
      </MapContainer>
      {error && (
        <div style={{ position: 'absolute', top: 70, left: 10, backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CityAQIDetailsMap;
